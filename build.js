#!/usr/bin/env node
/* ============================================================
   United Medical Exams — static build step
   ------------------------------------------------------------
   WHY THIS EXISTS
   The nav, CTA banner and footer used to be injected in the
   browser by main.js via fetch(). That meant ~20 internal links
   per page were invisible in the raw HTML — crawlers had to
   render JS to find them, which throttles crawl + link equity.

   This script inlines those components into the static HTML at
   build time. Same markup, same design, zero visual change —
   the links are simply in the HTML now.

   USAGE
     node build.js          # inline components into all pages
     node build.js --check  # verify pages are up to date (CI)

   Components remain the single source of truth in /components.
   Edit those, re-run this, commit the result.
   ============================================================ */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const CHECK_ONLY = process.argv.includes('--check');

/* ------------------------------------------------------------
   ASSET VERSIONING
   /css/* and /js/* are served `immutable, max-age=31536000`, so a
   browser will NOT re-fetch them for a year. Cache-busting therefore
   depends entirely on the ?v= token.

   These used to be hand-bumped per page and had drifted badly
   (main.css was ?v=15 on 15 location pages but ?v=35 on the homepage),
   which meant editing main.css would have served stale CSS to
   returning visitors on the un-bumped pages for up to a year.

   Now the token is the first 8 chars of the file's content hash,
   stamped into every page automatically. Change a file -> every
   reference updates. Never touch these by hand again.
   ------------------------------------------------------------ */
const VERSIONED_ASSETS = ['css/main.css', 'css/nav.css', 'css/locations.css', 'js/nav.js', 'js/main.js', 'js/icons.js', 'js/tracking.js'];

function hashFile(rel) {
  const abs = path.join(ROOT, rel);
  if (!fs.existsSync(abs)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(abs)).digest('hex').slice(0, 8);
}

function stampAssetVersions(html) {
  for (const rel of VERSIONED_ASSETS) {
    const h = hashFile(rel);
    if (!h) continue;
    const base = rel.split('/').pop();            // e.g. main.css
    const dir = rel.split('/')[0];                // css | js
    // Match  href="/css/main.css?v=..."  or  src="js/main.js?v6"  (any/no query)
    const re = new RegExp(`((?:href|src)=")(/?${dir}/${esc(base)})(\\?[^"]*)?(")`, 'g');
    html = html.replace(re, (m, a, p, _q, z) => `${a}${p}?v=${h}${z}`);
  }
  return html;
}

const COMPONENTS = {
  nav: 'components/nav.html',
  cta: 'components/cta-banner.html',
  footer: 'components/footer.html',
};

// Directories excluded from the build (internal/non-public pages)
const EXCLUDE_DIRS = ['components', 'reports', '.git', 'node_modules'];

function readComponent(rel) {
  return fs.readFileSync(path.join(ROOT, rel), 'utf8').trim();
}

function walkHtml(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (EXCLUDE_DIRS.includes(entry.name)) continue;
      walkHtml(full, out);
    } else if (entry.name.endsWith('.html')) {
      out.push(full);
    }
  }
  return out;
}

/** Escape a string for safe use inside a RegExp. */
function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ------------------------------------------------------------
   PER-PAGE CTA OVERRIDES
   These used to live as data-cta-* attributes on the placeholder div.
   That broke on rebuild: once the placeholder is replaced by the
   inlined component the attributes are gone, so the second build
   silently reverted the page to the generic CTA copy.

   They now live here, keyed by page path, so they survive every
   rebuild. To customise a page's CTA, add an entry.
   ------------------------------------------------------------ */
const CTA_OVERRIDES = {
  'blog.html': {
    heading: 'Have Questions About Your Exam?',
    text: 'Our team is here to help guide you through the process.',
    btn1Text: 'Schedule Appointment',
    btn1Href: '/appointments.html',
    btn2Text: 'Contact Us',
    btn2Href: '/contact.html',
  },
};

/**
 * Apply per-page CTA overrides to the banner markup at build time.
 * Replaces only the element's *text*, preserving child markup such as
 * the Lucide <i> icon, and matches the element's real closing tag.
 */
function applyCtaOverrides(html, attrs) {
  if (!attrs) return html;
  let out = html;

  // Replace label text while keeping any leading icon element intact.
  const setText = (cls, value) => {
    if (!value) return;
    const re = new RegExp(
      `(<(a|h2|p|span|div)\\b[^>]*class="[^"]*${esc(cls)}[^"]*"[^>]*>)([\\s\\S]*?)(</\\2>)`
    );
    out = out.replace(re, (_m, open, _tag, inner, close) => {
      // keep any child elements (e.g. <i data-lucide>), swap only the text
      const icons = (inner.match(/<i\b[^>]*><\/i>|<i\b[^>]*\/>/g) || []).join('');
      return `${open}${icons ? icons + ' ' : ''}${value}${close}`;
    });
  };

  const setHref = (cls, value) => {
    if (!value) return;
    const re = new RegExp(`(<a\\b[^>]*class="[^"]*${esc(cls)}[^"]*"[^>]*href=")([^"]*)(")`);
    out = out.replace(re, (_m, a, _b, c) => `${a}${value}${c}`);
    // href may precede class in the tag
    const re2 = new RegExp(`(<a\\b[^>]*href=")([^"]*)("[^>]*class="[^"]*${esc(cls)}[^"]*")`);
    out = out.replace(re2, (_m, a, _b, c) => `${a}${value}${c}`);
  };

  setText('cta-banner__heading', attrs.heading);
  setText('cta-banner__text', attrs.text);
  setText('cta-banner__btn1', attrs.btn1Text);
  setText('cta-banner__btn2', attrs.btn2Text);
  setHref('cta-banner__btn1', attrs.btn1Href);
  setHref('cta-banner__btn2', attrs.btn2Href);
  return out;
}

function inject(html, key, componentHtml, pageRel) {
  const startTag = `<!-- BUILD:${key}:start -->`;
  const endTag = `<!-- BUILD:${key}:end -->`;

  let component = componentHtml;
  if (key === 'cta') {
    component = applyCtaOverrides(component, CTA_OVERRIDES[pageRel]);
  }
  // Use a function replacement so `$` sequences in content (e.g. "$599")
  // are never interpreted as replacement patterns.
  const payload = () => `${startTag}\n${component}\n${endTag}`;

  // 1. Already built — replace between markers (idempotent re-run)
  const built = new RegExp(`${esc(startTag)}[\\s\\S]*?${esc(endTag)}`);
  if (built.test(html)) {
    return { html: html.replace(built, payload), changed: true };
  }

  // 2. First build — replace the placeholder div
  const placeholder = new RegExp(`<div id="${key}-placeholder"[^>]*>\\s*</div>`);
  if (!placeholder.test(html)) return { html, changed: false };

  return { html: html.replace(placeholder, payload), changed: true };
}

// ---- run ----
const comps = {
  nav: readComponent(COMPONENTS.nav),
  cta: readComponent(COMPONENTS.cta),
  footer: readComponent(COMPONENTS.footer),
};

const files = walkHtml(ROOT);
let touched = 0;
const stale = [];

for (const file of files) {
  const original = fs.readFileSync(file, 'utf8');
  let html = original;

  const pageRel = path.relative(ROOT, file).split(path.sep).join('/');
  for (const key of ['nav', 'cta', 'footer']) {
    const res = inject(html, key, comps[key], pageRel);
    html = res.html;
  }

  html = stampAssetVersions(html);

  if (html !== original) {
    if (CHECK_ONLY) {
      stale.push(path.relative(ROOT, file));
    } else {
      fs.writeFileSync(file, html, 'utf8');
      touched++;
    }
  }
}

if (CHECK_ONLY) {
  if (stale.length) {
    console.error(`✗ ${stale.length} page(s) out of date — run \`node build.js\`:`);
    stale.forEach((f) => console.error('   ' + f));
    process.exit(1);
  }
  console.log('✓ all pages up to date with /components');
} else {
  console.log(`✓ build complete — ${touched} page(s) updated from /components`);
}
