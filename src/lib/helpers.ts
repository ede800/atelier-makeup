import { brandById } from '../data/brands';
import type { PriceLevel, Product, SkinType, Tier } from '../data/types';

export const euro = (n: number) =>
  n.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR', minimumFractionDigits: n % 1 ? 2 : 0, maximumFractionDigits: 2 });

export const SKIN_LABELS: Record<SkinType, string> = {
  grasse: 'Grasse / Mixte',
  seche: 'Sèche / Déshydratée',
  normale: 'Normale',
  sensible: 'Sensible / Rosacée',
  mature: 'Mature',
};

export const LEVEL_LABELS: Record<PriceLevel, { label: string; podium: string; emoji: string }> = {
  budget: { label: 'Petit prix', podium: 'Meilleur Petit Prix', emoji: '🟢' },
  mid: { label: 'Milieu de gamme', podium: 'Meilleur Rapport Qualité/Prix', emoji: '🟡' },
  luxe: { label: 'Luxe', podium: 'Meilleur Luxe Ultime', emoji: '🔴' },
};

export const TIER_META: Record<Tier, { label: string; desc: string; cls: string }> = {
  S: { label: 'S-Tier', desc: 'Les références absolues, sans compromis', cls: 'tier-s' },
  A: { label: 'A-Tier', desc: 'Excellents, à acheter les yeux fermés', cls: 'tier-a' },
  B: { label: 'B-Tier', desc: 'Bons, avec des compromis', cls: 'tier-b' },
  Surcote: { label: 'Surcoté', desc: 'La hype dépasse la formule', cls: 'tier-x' },
};

/** Gamme de prix d'un produit, déduite du positionnement de la marque et du prix réel. */
export function priceLevel(p: Product): PriceLevel {
  const tier = brandById(p.brand)?.tier;
  if (tier === 'luxe') return 'luxe';
  if (tier === 'prestige') return p.price >= 45 ? 'luxe' : 'mid';
  if (tier === 'drugstore') return p.price > 20 ? 'mid' : 'budget';
  return p.price <= 16 ? 'budget' : 'mid';
}

/** Prix au ml / au g quand le format le permet. */
export function unitPrice(p: Product): string | null {
  const m = p.size.match(/^([\d,]+)\s*(ml|g)$/);
  if (!m) return null;
  const qty = parseFloat(m[1].replace(',', '.'));
  if (!qty) return null;
  return `${(p.price / qty).toFixed(2).replace('.', ',')} €/${m[2]}`;
}

export function normalize(s: string) {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}
