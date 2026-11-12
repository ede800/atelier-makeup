/**
 * Analyse des couleurs d'un logo (même origine, donc lisible au canvas) :
 * - edge : couleur de fond du logo si ses bords sont opaques et unis (on en remplit le cadre pour supprimer le liseré blanc) ;
 * - dominant : couleur saturée majoritaire (pour la bordure quand le logo est sur fond transparent ou blanc).
 */
export interface LogoPalette {
  edge?: string;
  dominant?: string;
  /** Logo majoritairement clair (blanc, crème) : à afficher sur fond sombre. */
  light?: boolean;
}

const cache = new Map<string, Promise<LogoPalette>>();
const N = 48;

const hex = (r: number, g: number, b: number) => '#' + [r, g, b].map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { h: 0, s: 0, l };
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  const h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return { h: h * 60, s, l };
}

function analyze(data: Uint8ClampedArray): LogoPalette {
  // Bords : 2 px sur le pourtour
  const edge: number[][] = [];
  for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
    if (x > 1 && x < N - 2 && y > 1 && y < N - 2) continue;
    const i = (y * N + x) * 4;
    edge.push([data[i], data[i + 1], data[i + 2], data[i + 3]]);
  }
  const opaque = edge.filter((p) => p[3] > 220);
  let edgeColor: string | undefined;
  if (opaque.length / edge.length > 0.9) {
    const avg = [0, 1, 2].map((c) => opaque.reduce((s, p) => s + p[c], 0) / opaque.length);
    const spread = Math.max(...[0, 1, 2].map((c) => Math.sqrt(opaque.reduce((s, p) => s + (p[c] - avg[c]) ** 2, 0) / opaque.length)));
    const isWhite = avg.every((v) => v > 240);
    if (spread < 22 && !isWhite) edgeColor = hex(avg[0], avg[1], avg[2]);
  }

  // Couleur dominante : histogramme de teintes sur les pixels opaques et saturés
  const buckets = Array.from({ length: 12 }, () => ({ n: 0, r: 0, g: 0, b: 0 }));
  let total = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    total++;
    const { h, s, l } = rgbToHsl(data[i], data[i + 1], data[i + 2]);
    if (s < 0.28 || l < 0.12 || l > 0.9) continue;
    const bk = buckets[Math.floor(h / 30) % 12];
    bk.n++; bk.r += data[i]; bk.g += data[i + 1]; bk.b += data[i + 2];
  }
  const top = buckets.reduce((a, b) => (b.n > a.n ? b : a));
  const dominant = total && top.n / total > 0.04 ? hex(top.r / top.n, top.g / top.n, top.b / top.n) : undefined;
  let lum = 0, op = 0;
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 200) continue;
    op++;
    lum += (0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2]) / 255;
  }
  // Seuls les logos détourés (fond transparent) peuvent être « clairs » : un JPEG sur fond blanc ne l'est pas.
  const light = op > 0 && op / (N * N) < 0.85 && lum / op > 0.86 && !edgeColor;
  return { edge: edgeColor, dominant: dominant ?? edgeColor, light };
}

export function logoPalette(src: string): Promise<LogoPalette> {
  let p = cache.get(src);
  if (!p) {
    p = new Promise<LogoPalette>((resolve) => {
      const img = new Image();
      img.decoding = 'async';
      img.onload = () => {
        try {
          const c = document.createElement('canvas');
          c.width = c.height = N;
          const ctx = c.getContext('2d', { willReadFrequently: true });
          if (!ctx) return resolve({});
          ctx.drawImage(img, 0, 0, N, N);
          resolve(analyze(ctx.getImageData(0, 0, N, N).data));
        } catch {
          resolve({});
        }
      };
      img.onerror = () => resolve({});
      img.src = src;
    });
    cache.set(src, p);
  }
  return p;
}
