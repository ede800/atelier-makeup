export type ZoneId = 'prep' | 'teint' | 'yeux' | 'sourcils' | 'levres' | 'outils';
export type SkinType = 'grasse' | 'seche' | 'normale' | 'sensible' | 'mature';
export type Tier = 'S' | 'A' | 'B' | 'Surcote';
export type PriceLevel = 'budget' | 'mid' | 'luxe';
export type MarketTier = 'drugstore' | 'kbeauty' | 'prestige' | 'luxe' | 'dermo';

export interface Scores {
  tenue: number;
  pigment: number;
  confort: number;
  valeur: number;
}

export interface Product {
  id: string;
  category: string;
  brand: string;
  name: string;
  price: number;
  size: string;
  tier: Tier;
  scores: Scores;
  skin: SkinType[];
  finish: string;
  verdict: string;
  podium?: PriceLevel;
}

export interface Zone {
  id: ZoneId;
  name: string;
  emoji: string;
}

export interface Category {
  id: string;
  zone: ZoneId;
  name: string;
  en: string;
  description: string;
  expertTip: string;
  podiumNote?: string;
}

export interface Brand {
  id: string;
  name: string;
  tier: MarketTier;
  country: string;
  priceRange: string;
  specialty: string;
  dna: string;
  legends: [string, string, string];
  flops: string;
  shops: string[];
}

export interface DupeSide {
  name: string;
  brand: string;
  price: number;
  size: string;
  productId?: string;
}

export interface Dupe {
  id: string;
  category: string;
  luxe: DupeSide;
  dupe: DupeSide;
  alt?: string;
  similarity: number;
  verdict: string;
  tradeoffs: string[];
}
