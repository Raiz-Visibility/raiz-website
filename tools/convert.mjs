// One-shot converter: Claude Design .dc.html prototypes → Astro page partials.
// It keeps every inline style value from the design, and rewrites the prototype-only
// constructs (style-hover / style-before, <x-import>, <image-slot>, file links)
// into plain HTML + generated CSS classes.
//
// The output in src/components/design/ has since been hand-edited for the dynamic
// parts (menus, slider, filters, forms, templates). Re-running this OVERWRITES those
// files — only do it into a scratch folder: `node tools/convert.mjs <outDir>`.
import fs from 'node:fs';
import path from 'node:path';

const SRC = path.resolve('../raiz-design/raiz-visibility-design-system/project');
const OUT = path.resolve(process.argv[2] || 'src/components/design');
const CSS_OUT = path.resolve(process.argv[2] ? path.join(process.argv[2], 'interactions.css') : 'src/styles/interactions.css');

const PAGES = {
  Home: 'Raiz Home Page.dc.html',
  About: 'Raiz About Page.dc.html',
  BlogArchive: 'Raiz Blog Archive.dc.html',
  BlogPost: 'Raiz Blog Post.dc.html',
  Contact: 'Raiz Contact Page.dc.html',
  Service: 'Raiz Service Page Template.dc.html',
};

const ROUTES = {
  'Raiz Home Page.dc.html': '/',
  'Raiz About Page.dc.html': '/about/',
  'Raiz Blog Archive.dc.html': '/blog/',
  'Raiz Blog Post.dc.html': '/blog/',
  'Raiz Contact Page.dc.html': '/contact/',
};

// ── generated interaction classes, deduplicated across all pages ──
const rules = new Map(); // css text → class name
function classFor(kind, decls) {
  const key = kind + '|' + decls;
  if (!rules.has(key)) rules.set(key, `${kind === 'hover' ? 'hv' : 'bf'}-${rules.size + 1}`);
  return rules.get(key);
}
function important(decls) {
  // split on ; outside parentheses
  const out = [];
  let depth = 0, cur = '';
  for (const ch of decls) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (ch === ';' && depth === 0) { out.push(cur); cur = ''; } else cur += ch;
  }
  out.push(cur);
  return out.map(d => d.trim()).filter(Boolean).map(d => d + ' !important').join(';');
}

// Find the end index (exclusive) of the element whose opening tag starts at `start`.
function matchClose(html, start) {
  const tag = /^<([a-zA-Z][\w-]*)/.exec(html.slice(start))[1];
  const re = new RegExp(`<(/?)${tag}(?=[\\s>/])[^>]*>`, 'g');
  re.lastIndex = start;
  let depth = 0, m;
  while ((m = re.exec(html))) {
    if (m[1]) depth--; else if (!m[0].endsWith('/>')) depth++;
    if (depth === 0) return m.index + m[0].length;
  }
  throw new Error('unbalanced <' + tag + '>');
}

function transform(html) {
  // prototype event bindings
  html = html.replace(/\s(onMouseEnter|onMouseLeave|onClick|onKeyDown|onSubmit)="\{\{[^}]*\}\}"/g, '');

  // style-hover / style-before → classes
  html = html.replace(/<([a-zA-Z][\w-]*)((?:[^>"]|"[^"]*")*)>/g, (all, tag, attrs) => {
    if (!/\sstyle-(hover|before)=/.test(attrs)) return all;
    const classes = [];
    attrs = attrs.replace(/\sstyle-(hover|before)="([^"]*)"/g, (_, kind, decls) => {
      classes.push(classFor(kind, kind === 'hover' ? important(decls) : decls));
      return '';
    });
    if (/\sclass="/.test(attrs)) attrs = attrs.replace(/\sclass="([^"]*)"/, (_, c) => ` class="${c} ${classes.join(' ')}"`);
    else attrs += ` class="${classes.join(' ')}"`;
    return `<${tag}${attrs}>`;
  });

  // <x-import component-from-global-scope="rz-orb-button" …>label</x-import>
  html = html.replace(/<x-import component-from-global-scope="rz-orb-button"([^>]*)>([\s\S]*?)<\/x-import>/g, (_, attrs, label) => {
    const keep = [];
    for (const m of attrs.matchAll(/\s(href|height|padding|full|style)="([^"]*)"/g)) {
      if (m[1] === 'full') keep.push('full');
      else if (m[1] === 'href') keep.push(`href={u("${m[2]}")}`);
      else keep.push(`${m[1]}="${m[2]}"`);
    }
    return `<rz-orb-button ${keep.join(' ')}>${label}</rz-orb-button>`;
  });

  // <image-slot …></image-slot> → <ImageSlot … />
  html = html.replace(/<image-slot([^>]*)><\/image-slot>/g, (_, attrs) => {
    const a = Object.fromEntries([...attrs.matchAll(/\s([\w-]+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
    const id = a.id.includes('{{') ? `id={${a.id.replace(/[{}\s]/g, '')}}` : `id="${a.id}"`;
    return `<ImageSlot ${id} shape="${a.shape || 'rounded'}"${a.radius ? ` radius={${a.radius}}` : ''} placeholder="${a.placeholder || ''}" />`;
  });

  // links to other prototype files → site routes; absolute links → base-aware
  html = html.replace(/href="([^"]*\.dc\.html)"/g, (_, f) => `href="${ROUTES[f] || '/'}"`);
  html = html.replace(/<a([^>]*?)\shref="(\/[^"]*)"/g, (_, pre, h) => `<a${pre} href={u("${h}")}`);

  // void elements
  html = html.replace(/<(input|img)([^>]*?)\s*><\/\1>/g, '<$1$2 />');
  html = html.replace(/<(input|img)((?:[^>"]|"[^"]*")*?)(?<!\/)>/g, '<$1$2 />');

  // {{ expr }} in text → {expr}; flag ones left inside attributes
  html = html.replace(/>([^<]*)</g, (all, text) => '>' + text.replace(/\{\{\s*([^}]+?)\s*\}\}/g, '{$1}') + '<');
  return html;
}

function sliceBetween(html, startMarker, endMarker, from = 0) {
  const s = html.indexOf(startMarker, from);
  const e = html.indexOf(endMarker, s);
  if (s < 0 || e < 0) throw new Error(`markers not found: ${startMarker} … ${endMarker}`);
  return [html.slice(s + startMarker.length, e), e];
}

fs.mkdirSync(OUT, { recursive: true });
for (const [name, file] of Object.entries(PAGES)) {
  const src = fs.readFileSync(path.join(SRC, file), 'utf8');
  const dc = src.slice(src.indexOf('<x-dc>'), src.lastIndexOf('</x-dc>'));

  // desktop: after the desktop </header> up to the desktop footer
  const [desktop] = sliceBetween(dc, '</header>', '<!-- FOOTER -->');
  const footerStart = dc.indexOf('<!-- FOOTER -->');
  const footerTag = dc.indexOf('<', footerStart + 15);
  const desktopFooter = dc.slice(footerTag, matchClose(dc, footerTag));

  // mobile: after the mobile header element up to the mobile footer
  const mh = dc.indexOf('<!-- mobile header -->');
  const mhTag = dc.indexOf('<', mh + 22);
  const mhEnd = matchClose(dc, mhTag);
  const mobileHeader = dc.slice(mhTag, mhEnd);
  const mobile = dc.slice(mhEnd, dc.indexOf('<!-- mobile footer -->'));
  const mf = dc.indexOf('<!-- mobile footer -->');
  const mfTag = dc.indexOf('<', mf + 22);
  const mobileFooter = dc.slice(mfTag, matchClose(dc, mfTag));

  const header = dc.slice(dc.indexOf('<header'), dc.indexOf('</header>') + 9);

  const wrap = (body) => `---\nimport ImageSlot from '../ImageSlot.astro';\nconst u = (p: string) => import.meta.env.BASE_URL.replace(/\\/$/, '') + p;\n---\n${transform(body).trim()}\n`;
  fs.writeFileSync(path.join(OUT, `${name}Desktop.astro`), wrap(desktop));
  fs.writeFileSync(path.join(OUT, `${name}Mobile.astro`), wrap(mobile));
  if (name === 'Home') {
    fs.writeFileSync(path.join(OUT, `_HeaderDesktop.astro`), wrap(header));
    fs.writeFileSync(path.join(OUT, `_FooterDesktop.astro`), wrap(desktopFooter));
    fs.writeFileSync(path.join(OUT, `_HeaderMobile.astro`), wrap(mobileHeader));
    fs.writeFileSync(path.join(OUT, `_FooterMobile.astro`), wrap(mobileFooter));
  }
  console.log(`${name}: desktop ${desktop.length}b, mobile ${mobile.length}b`);
}

const css = ['/* GENERATED by tools/convert.mjs — hover and ::before rules from the design\'s style-hover / style-before attributes. */']
  .concat([...rules].map(([key, cls]) => {
    const [kind, decls] = key.split(/\|(.*)/s);
    return kind === 'hover' ? `.${cls}:hover{${decls}}` : `.${cls}::before{${decls}}`;
  })).join('\n') + '\n';
fs.mkdirSync(path.dirname(CSS_OUT), { recursive: true });
fs.writeFileSync(CSS_OUT, css);
console.log(`${rules.size} interaction classes`);
