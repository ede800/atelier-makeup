// Télécharge le logo de chaque marque dans public/logos/ pour l'héberger avec le site :
// aucun appel à un service tiers chez les visiteurs.
// Ordre de recherche : icône haute résolution déclarée par le site officiel (apple-touch-icon, icon),
// puis le service d'icônes de Google. Monogramme dans l'application si rien d'exploitable.
// Usage : node scripts/fetch-logos.mjs
import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const domains = JSON.parse(await readFile(new URL('../src/data/brand-domains.json', import.meta.url), 'utf8'));
const outDir = new URL('../public/logos/', import.meta.url);
await mkdir(outDir, { recursive: true });
for (const f of await readdir(outDir).catch(() => [])) await rm(new URL(f, outDir));

/** Domaines de secours pour les marques dont le domaine principal ne donne rien. */
const ALT = {
  romand: ['www.romand.co.kr', 'romand.us', 'en.romand.co.kr', 'romand.jp'],
  laneige: ['www.laneige.com', 'us.laneige.com', 'laneige.co.kr', 'int.laneige.com', 'laneige.ca'],
  peripera: ['www.peripera.co.kr', 'peripera.com', 'peripera.jp', 'peripera.us'],
  fwee: ['fwee.kr', 'fwee.co.kr'],
  dasique: ['dasique.co.kr', 'dasique.com'],
  espoir: ['espoir.co.kr', 'espoir.com'],
  amuse: ['amuse.kr', 'amusemakeup.com'],
  rcma: ['www.rcmamakeup.com', 'rcmamakeup.net'],
  zoeva: ['zoevacosmetics.com', 'zoeva.de'],
  spectrum: ['www.spectrumcollections.com', 'spectrumcollections.co.uk'],
};
const NO_SITE = new Set(['duo']); // pas de site propre : monogramme
// Vérifié dans Chrome : le site officiel ne publie qu'une icône de 16 px (Sensai), une icône .ico (Suqqu)
// ou aucune icône (Clio). Les services d'icônes renvoient alors le logo d'une autre marque ou une image pixelisée.
const NO_LOGO = new Set(['sensai', 'suqqu', 'clio']);

const UA = { 'user-agent': 'Mozilla/5.0 (compatible; AtelierMakeupLogos/1.0)', accept: '*/*' };

async function get(url, ms = 9000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  try {
    const res = await fetch(url, { headers: UA, signal: ctrl.signal, redirect: 'follow' });
    return { res, buf: Buffer.from(await res.arrayBuffer()) };
  } finally {
    clearTimeout(t);
  }
}

/** Format et largeur d'une image PNG / JPEG ; SVG accepté tel quel. */
function inspect(buf) {
  if (buf.subarray(1, 4).toString() === 'PNG') return { ext: 'png', width: buf.readUInt32BE(16) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const m = buf[i + 1];
      if (m >= 0xc0 && m <= 0xc3) return { ext: 'jpg', width: buf.readUInt16BE(i + 7) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  const head = buf.subarray(0, 300).toString().trimStart();
  if (head.startsWith('<svg') || (head.startsWith('<?xml') && head.includes('<svg'))) return { ext: 'svg', width: 512 };
  return { ext: '', width: 0 };
}

/** Icônes déclarées dans la page d'accueil, de la plus grande à la plus petite. */
async function declaredIcons(domain) {
  const { res, buf } = await get(`https://${domain}/`);
  if (!res.ok) return [];
  const html = buf.toString('utf8');
  const out = [];
  for (const tag of html.match(/<link\b[^>]*>/gi) ?? []) {
    const rel = /rel=["']([^"']+)["']/i.exec(tag)?.[1]?.toLowerCase() ?? '';
    if (!/(apple-touch-icon|icon)/.test(rel) || rel.includes('mask')) continue;
    const href = /href=["']([^"']+)["']/i.exec(tag)?.[1];
    if (!href || href.startsWith('data:')) continue;
    const size = Number(/sizes=["'](\d+)/i.exec(tag)?.[1] ?? (rel.includes('apple') ? 180 : 32));
    out.push({ url: new URL(href.replace(/&amp;/g, '&'), res.url).href, size });
  }
  return out.sort((a, b) => b.size - a.size);
}

async function fetchLogo(domain) {
  const candidates = [];
  try { candidates.push(...(await declaredIcons(domain)).map((c) => c.url)); } catch { /* site injoignable */ }
  candidates.push(`https://${domain}/apple-touch-icon.png`, `https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
  let best = null;
  for (const url of [...new Set(candidates)]) {
    try {
      const { res, buf } = await get(url);
      if (!res.ok || buf.length < 100) continue;
      const { ext, width } = inspect(buf);
      if (!ext) continue;
      if (width >= 96) return { buf, ext, width, url };
      if (width >= 32 && (!best || width > best.width)) best = { buf, ext, width, url };
    } catch { /* candidat suivant */ }
  }
  return best;
}

const files = {};
const byHash = new Map();
const missing = [];
for (const [id, domain] of Object.entries(domains)) {
  if (NO_SITE.has(id) || NO_LOGO.has(id)) continue;
  let found = null;
  for (const d of [domain, ...(ALT[id] ?? [])]) {
    found = await fetchLogo(d);
    if (found) break;
  }
  if (!found) { missing.push(id); continue; }
  const hash = createHash('md5').update(found.buf).digest('hex');
  byHash.set(hash, [...(byHash.get(hash) ?? []), id]);
  await writeFile(new URL(`${id}.${found.ext}`, outDir), found.buf);
  files[id] = `${id}.${found.ext}`;
  console.log(`✓ ${id} — ${found.ext} ${found.width}px`);
}
// Une même icône renvoyée pour plusieurs marques est une icône générique de plateforme : monogramme.
for (const ids of byHash.values()) {
  if (ids.length < 2) continue;
  for (const id of ids) {
    console.log(`✗ ${id} — icône générique partagée (${ids.join(', ')})`);
    await rm(new URL(files[id], outDir));
    delete files[id];
    missing.push(id);
  }
}
const sorted = Object.fromEntries(Object.entries(files).sort());
await writeFile(new URL('../src/data/logos.json', import.meta.url), JSON.stringify(sorted, null, 2) + '\n');
console.log(`${Object.keys(files).length}/${Object.keys(domains).length} logos — sans logo : ${missing.join(', ') || 'aucune'}`);
