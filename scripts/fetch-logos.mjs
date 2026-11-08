// Télécharge le logo (icône officielle du site) de chaque marque dans public/logos/,
// pour les héberger avec le site : aucun appel à un service tiers chez les visiteurs.
// Usage : node scripts/fetch-logos.mjs
import { readFile, readdir, writeFile, mkdir, rm } from 'node:fs/promises';
import { createHash } from 'node:crypto';

const domains = JSON.parse(await readFile(new URL('../src/data/brand-domains.json', import.meta.url), 'utf8'));
const outDir = new URL('../public/logos/', import.meta.url);
await mkdir(outDir, { recursive: true });
for (const f of await readdir(outDir).catch(() => [])) await rm(new URL(f, outDir));


/** Largeur en pixels d'une image PNG ou JPEG, 0 si format inconnu. */
function imageWidth(buf) {
  if (buf.subarray(1, 4).toString() === 'PNG') return { ext: 'png', width: buf.readUInt32BE(16) };
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      if (marker >= 0xc0 && marker <= 0xc3) return { ext: 'jpg', width: buf.readUInt16BE(i + 7) };
      i += 2 + buf.readUInt16BE(i + 2);
    }
  }
  return { ext: '', width: 0 };
}

const NO_SITE = new Set(['duo', 'ardell', 'peripera']); // pas de domaine officiel fiable : monogramme
const files = {};
const byHash = new Map();
for (const [id, domain] of Object.entries(domains)) {
  if (NO_SITE.has(id)) continue;
  try {
    const res = await fetch(`https://www.google.com/s2/favicons?domain=${domain}&sz=128`);
    const buf = Buffer.from(await res.arrayBuffer());
    const { ext, width } = imageWidth(buf);
    // Le service renvoie un globe générique de 16 px quand il ne trouve rien : on l'ignore.
    if (!res.ok || !ext || width < 32) {
      console.log(`✗ ${id} (${domain}) — ${res.status}, ${ext || '?'} ${width}px`);
      continue;
    }
    const hash = createHash('md5').update(buf).digest('hex');
    byHash.set(hash, [...(byHash.get(hash) ?? []), id]);
    await writeFile(new URL(`${id}.${ext}`, outDir), buf);
    files[id] = `${id}.${ext}`;
  } catch (e) {
    console.log(`✗ ${id} — ${e.message}`);
  }
}
// Une même icône renvoyée pour plusieurs marques est une icône générique de plateforme : monogramme.
for (const ids of byHash.values()) {
  if (ids.length < 2) continue;
  for (const id of ids) {
    console.log(`✗ ${id} — icône générique partagée (${ids.join(', ')})`);
    await rm(new URL(files[id], outDir));
    delete files[id];
  }
}
const sorted = Object.fromEntries(Object.entries(files).sort());
await writeFile(new URL('../src/data/logos.json', import.meta.url), JSON.stringify(sorted, null, 2) + '\n');
console.log(`${Object.keys(files).length}/${Object.keys(domains).length} logos`);
