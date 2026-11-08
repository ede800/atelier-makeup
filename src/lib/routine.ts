import { PRODUCTS, totalScore } from '../data/products';
import type { PriceLevel, Product, SkinType } from '../data/types';
import { priceLevel } from './helpers';

export type BudgetId = 'etudiant' | 'smart' | 'prestige' | 'luxe';
export type FinishId = 'clean' | 'glowy' | 'glam';
type Role = 'invest' | 'neutral' | 'save';

export const BUDGETS: Record<BudgetId, { label: string; target: string; desc: string }> = {
  etudiant: { label: 'Étudiant / Petit Budget', target: '~65 – 90 €', desc: 'Le meilleur du drugstore, uniquement les essentiels.' },
  smart: { label: 'Smart Mix', target: '~150 – 200 €', desc: 'On investit dans le teint, on économise sur le reste.' },
  prestige: { label: 'Prestige', target: '~300 €', desc: 'Luxe sur le teint, prestige partout ailleurs.' },
  luxe: { label: 'Full Luxe', target: '~450 – 550 €+', desc: 'Les icônes de la haute couture, sans compromis.' },
};

export const FINISHES: Record<FinishId, { label: string; desc: string; emoji: string }> = {
  clean: { label: '« Clean Girl » / No-Makeup', desc: 'Peau nue sublimée, joues fraîches, sourcils brossés.', emoji: '🤍' },
  glowy: { label: 'Glowy Lumineux', desc: 'Teint de verre, highlighter, lèvres brillantes.', emoji: '✨' },
  glam: { label: 'Full Glam Longue Tenue', desc: 'Haute couvrance, contour, regard intense, 16 h.', emoji: '💎' },
};

interface Slot { cat: string; role: Role; optional?: boolean; label: string }

const SLOTS: Record<FinishId, Slot[]> = {
  clean: [
    { cat: 'primer-glow', role: 'neutral', optional: true, label: 'Base' },
    { cat: 'skin-tint', role: 'invest', label: 'Teint' },
    { cat: 'concealer', role: 'invest', label: 'Anti-cernes' },
    { cat: 'powder', role: 'neutral', label: 'Poudre (zone T)' },
    { cat: 'blush', role: 'neutral', label: 'Blush' },
    { cat: 'bronzer', role: 'neutral', label: 'Bronzer' },
    { cat: 'brow-gel', role: 'save', label: 'Gel sourcils' },
    { cat: 'mascara', role: 'save', label: 'Mascara' },
    { cat: 'lip-balm-tint', role: 'save', label: 'Lèvres' },
    { cat: 'setting-spray', role: 'neutral', optional: true, label: 'Fixateur' },
  ],
  glowy: [
    { cat: 'primer-glow', role: 'invest', label: 'Base lumineuse' },
    { cat: 'fdt-lumineux', role: 'invest', label: 'Fond de teint' },
    { cat: 'concealer', role: 'invest', label: 'Anti-cernes' },
    { cat: 'blush', role: 'neutral', label: 'Blush' },
    { cat: 'highlighter', role: 'neutral', optional: true, label: 'Highlighter' },
    { cat: 'bronzer', role: 'neutral', label: 'Bronzer' },
    { cat: 'brow-pencil', role: 'save', label: 'Sourcils' },
    { cat: 'mascara', role: 'save', label: 'Mascara' },
    { cat: 'gloss-oil', role: 'save', label: 'Gloss / Huile' },
    { cat: 'setting-spray', role: 'neutral', optional: true, label: 'Fixateur' },
  ],
  glam: [
    { cat: 'primer-grip', role: 'neutral', optional: true, label: 'Base accrocheuse' },
    { cat: 'fdt-mat', role: 'invest', label: 'Fond de teint' },
    { cat: 'concealer', role: 'invest', label: 'Anti-cernes' },
    { cat: 'powder', role: 'invest', label: 'Poudre de baking' },
    { cat: 'contour', role: 'neutral', label: 'Contour' },
    { cat: 'blush', role: 'neutral', label: 'Blush' },
    { cat: 'palette', role: 'neutral', label: 'Palette yeux' },
    { cat: 'mascara', role: 'save', label: 'Mascara' },
    { cat: 'liquid-lipstick', role: 'save', label: 'Rouge sans transfert' },
    { cat: 'setting-spray', role: 'neutral', label: 'Spray fixateur' },
  ],
};

/** Quand aucun produit de la catégorie ne convient à la peau, on bascule vers la catégorie sœur. */
const FALLBACK_CAT: Record<string, string> = {
  'fdt-mat': 'fdt-lumineux',
  'primer-glow': 'primer-grip',
  'primer-grip': 'primer-glow',
};

/** Ajustements par type de peau (base de teint la plus adaptée). */
function adjustCat(cat: string, skin: SkinType): string {
  if (skin === 'grasse' && cat === 'primer-glow') return 'primer-blur';
  if ((skin === 'seche' || skin === 'mature') && cat === 'fdt-mat') return 'fdt-lumineux';
  return cat;
}

const LEVEL_PLAN: Record<BudgetId, Record<Role, PriceLevel>> = {
  etudiant: { invest: 'budget', neutral: 'budget', save: 'budget' },
  smart: { invest: 'mid', neutral: 'budget', save: 'budget' },
  prestige: { invest: 'luxe', neutral: 'mid', save: 'budget' },
  luxe: { invest: 'luxe', neutral: 'luxe', save: 'luxe' },
};

const ORDER: PriceLevel[] = ['budget', 'mid', 'luxe'];

export interface RoutineItem {
  slot: string;
  role: Role;
  product: Product;
  level: PriceLevel;
  compatible: boolean;
  reason: string;
}

function pick(cat: string, level: PriceLevel, skin: SkinType, cheapest: boolean): { product: Product; compatible: boolean } | null {
  const all = PRODUCTS.filter((p) => p.category === cat && p.tier !== 'Surcote');
  const compat = all.filter((p) => p.skin.includes(skin));
  const pool = compat.length ? compat : all;
  if (!pool.length) return null;
  // On cherche la gamme demandée, puis la plus proche (on descend d'abord, pour rester dans le budget)
  const idx = ORDER.indexOf(level);
  const tryOrder = [level, ...ORDER.slice(0, idx).reverse(), ...ORDER.slice(idx + 1)];
  for (const lv of tryOrder) {
    let cands = pool.filter((p) => priceLevel(p) === lv);
    let compatible = compat.length > 0;
    // Petit budget : on préfère rester en drugstore plutôt que monter en gamme pour la compatibilité peau
    if (!cands.length && cheapest) {
      cands = all.filter((p) => priceLevel(p) === lv);
      compatible = false;
    }
    if (!cands.length) continue;
    const sorted = cheapest
      ? [...cands].sort((a, b) => a.price - b.price || totalScore(b) - totalScore(a))
      : [...cands].sort((a, b) => Number(b.podium === lv) - Number(a.podium === lv) || totalScore(b) - totalScore(a));
    return { product: sorted[0], compatible };
  }
  return null;
}

const REASONS: Record<Role, Record<PriceLevel, string>> = {
  invest: {
    budget: "Le drugstore fait très bien le travail ici à ce budget.",
    mid: 'On investit : le teint et le correcteur se voient de près, la formule fait toute la différence.',
    luxe: 'Investissement prioritaire : la texture et la tenue du luxe se voient vraiment sur la peau.',
  },
  neutral: {
    budget: 'Une pépite à petit prix qui rivalise avec le prestige.',
    mid: 'Le bon équilibre qualité/prix.',
    luxe: "Le plaisir du luxe, jusque dans les finitions.",
  },
  save: {
    budget: 'On économise : ici, le drugstore bat (ou égale) le luxe.',
    mid: 'Une valeur sûre.',
    luxe: 'Pour la trousse 100 % couture.',
  },
};

export function buildRoutine(budget: BudgetId, skin: SkinType, finish: FinishId) {
  const plan = LEVEL_PLAN[budget];
  const items: RoutineItem[] = [];
  for (const slot of SLOTS[finish]) {
    if (budget === 'etudiant' && slot.optional) continue;
    const cat = adjustCat(slot.cat, skin);
    const level = plan[slot.role];
    let res = pick(cat, level, skin, budget === 'etudiant');
    if (res && !res.compatible && FALLBACK_CAT[cat]) {
      const alt = pick(FALLBACK_CAT[cat], level, skin, budget === 'etudiant');
      if (alt?.compatible) res = alt;
    }
    if (!res) continue;
    const real = priceLevel(res.product);
    items.push({
      slot: slot.label,
      role: slot.role,
      product: res.product,
      level: real,
      compatible: res.compatible,
      reason: REASONS[slot.role][real],
    });
  }
  const total = items.reduce((s, it) => s + it.product.price, 0);
  return { items, total, advice: adviceFor(budget, finish) };
}

function adviceFor(budget: BudgetId, finish: FinishId): string {
  const teint = finish === 'clean' ? 'le teint (sérum teinté ou CC crème)' : 'le fond de teint et l\'anti-cernes';
  switch (budget) {
    case 'etudiant':
      return `Avec un petit budget, on supprime le superflu : ta crème hydratante fait office de base, et l'Essence Lash Princess ou le Maybelline Sky High battent des mascaras à 35 €. Si tu dois faire un seul écart plus tard, ce sera pour ${teint}.`;
    case 'smart':
      return `Investis ton budget dans ${teint} — c'est ce qui se voit de près et ce qui fait « peau réelle ». Économise sur le mascara, le gel sourcils et les lèvres, où le drugstore égale ou bat le luxe.`;
    case 'prestige':
      return `Le luxe là où la formulation se voit (${teint}${finish === 'glam' ? ', poudre et palette' : ', base'}), le prestige pour la couleur, et le drugstore pour les consommables qu'on rachète tous les 3 mois (mascara, sourcils).`;
    case 'luxe':
      return "Trousse 100 % couture. Note d'experte : même les maquilleurs des défilés gardent un Maybelline Sky High et un NYX Brow Glue dans leur kit — le luxe n'y apporte que le packaging.";
  }
}
