import { BASE_LABELS, detailsOf, type BaseType } from '../data/product-details';
import type { Product } from '../data/types';
import { brandName } from '../data/brands';

export type Layer = 'primer' | 'base' | 'concealer';
export type Verdict = 'ok' | 'caution' | 'warn';

const LAYER_OF: Record<string, Layer> = {
  'primer-glow': 'primer', 'primer-blur': 'primer', 'primer-grip': 'primer',
  'fdt-mat': 'base', 'fdt-lumineux': 'base', 'skin-tint': 'base',
  concealer: 'concealer',
};

export const LAYER_LABELS: Record<Layer, string> = { primer: 'Base', base: 'Teint', concealer: 'Anti-cernes' };

export interface PairCheck {
  under: Product;
  over: Product;
  underBase: BaseType;
  overBase: BaseType;
  verdict: Verdict;
  message: string;
}

/** Règle « like dissolves like » : couche du dessous → couche du dessus. */
function rule(under: BaseType, over: BaseType): Verdict {
  if (under === over) return 'ok';
  if ((under === 'silicone' || under === 'oil') && over === 'water') return 'warn';
  return 'caution';
}

const name = (p: Product) => `${brandName(p.brand)} ${p.name}`;

export function analyzeLayers(products: Product[]) {
  const layered = products
    .map((p) => ({ p, layer: LAYER_OF[p.category], base: detailsOf(p).baseType }))
    .filter((x): x is { p: Product; layer: Layer; base: BaseType } => !!x.layer && !!x.base && x.base !== 'powder');
  const by = (l: Layer) => layered.filter((x) => x.layer === l);
  const pairs: PairCheck[] = [];
  const check = (u: (typeof layered)[number], o: (typeof layered)[number]) => {
    const verdict = rule(u.base, o.base);
    const ub = BASE_LABELS[u.base].toLowerCase();
    const ob = BASE_LABELS[o.base].toLowerCase();
    const message =
      verdict === 'ok'
        ? `Alchimie parfaite : ${name(u.p)} et ${name(o.p)} partagent une base ${ub} (zéro risque de peluchage).`
        : verdict === 'warn'
          ? `Alerte peluchage : tu mélanges une base ${ub === 'eau' ? "à l'eau" : ub} (${name(u.p)}) sous une formule ${ob === 'eau' ? "à l'eau" : ob} (${name(o.p)}). Laisse sécher 3 minutes entre les couches ou change de base.`
          : `À surveiller : ${name(u.p)} (${ub}) puis ${name(o.p)} (${ob}). C'est compatible si tu laisses sécher la première couche 2 à 3 minutes et que tu tapotes au lieu de frotter.`;
    pairs.push({ under: u.p, over: o.p, underBase: u.base, overBase: o.base, verdict, message });
  };
  for (const u of by('primer')) for (const o of by('base')) check(u, o);
  for (const u of by('base')) for (const o of by('concealer')) check(u, o);
  if (!by('base').length) for (const u of by('primer')) for (const o of by('concealer')) check(u, o);
  const worst: Verdict | null = pairs.some((x) => x.verdict === 'warn') ? 'warn' : pairs.some((x) => x.verdict === 'caution') ? 'caution' : pairs.length ? 'ok' : null;
  return { pairs, worst, layered };
}
