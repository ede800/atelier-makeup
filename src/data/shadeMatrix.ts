import type { Undertone } from './masterclass';

/*
 * Convertisseur de teintes inter-marques.
 * Correspondances INDICATIVES établies à partir des nuanciers publics des marques (profondeur + sous-ton).
 * Les gammes évoluent et les teintes oxydent différemment selon les peaux : toujours tester sur la mâchoire, en lumière du jour.
 */

export interface Archetype {
  id: string;
  label: string;
  depth: number; // 1 = très clair … 7 = très foncé
  undertone: Undertone;
  swatch: string;
  description: string;
}

export const DEPTHS: { value: number; label: string }[] = [
  { value: 1, label: 'Très clair / Porcelaine' },
  { value: 2, label: 'Clair' },
  { value: 3, label: 'Clair-moyen' },
  { value: 4, label: 'Moyen' },
  { value: 5, label: 'Mat / Hâlé' },
  { value: 6, label: 'Foncé' },
  { value: 7, label: 'Très foncé' },
];

export const ARCHETYPES: Archetype[] = [
  { id: 'a1', label: 'Porcelaine · Froid/Rosé', depth: 1, undertone: 'froid', swatch: '#F3D9CF', description: 'Peau très claire qui rougit facilement, reflets roses.' },
  { id: 'a2', label: 'Très clair · Neutre', depth: 1, undertone: 'neutre', swatch: '#F1D6C1', description: 'Peau très claire, ni rose ni jaune.' },
  { id: 'a3', label: 'Clair · Chaud/Doré', depth: 2, undertone: 'chaud', swatch: '#EDCCA8', description: 'Peau claire aux reflets pêche ou dorés.' },
  { id: 'a4', label: 'Clair · Olive', depth: 2, undertone: 'olive', swatch: '#DEC3A0', description: 'Peau claire au fond verdâtre, que les teintes roses grisent.' },
  { id: 'a5', label: 'Clair-moyen · Rosé', depth: 3, undertone: 'froid', swatch: '#E3BBA3', description: 'Peau beige rosé, rougeurs fréquentes sur les joues.' },
  { id: 'a6', label: 'Moyen · Neutre', depth: 3, undertone: 'neutre', swatch: '#D9AE8A', description: 'Beige équilibré, bronze facilement.' },
  { id: 'a7', label: 'Moyen · Doré', depth: 4, undertone: 'chaud', swatch: '#CFA073', description: 'Beige doré, typique des peaux méditerranéennes et latines.' },
  { id: 'a8', label: 'Moyen · Olive', depth: 4, undertone: 'olive', swatch: '#BF9D70', description: 'Beige olive, les fonds de teint paraissent souvent orange.' },
  { id: 'a9', label: 'Mat · Chaud', depth: 5, undertone: 'chaud', swatch: '#A87650', description: 'Peau mate caramel aux reflets dorés.' },
  { id: 'a10', label: 'Mat · Neutre', depth: 5, undertone: 'neutre', swatch: '#9C6E4F', description: 'Peau mate équilibrée, ni rouge ni jaune.' },
  { id: 'a11', label: 'Foncé · Neutre/Rouge', depth: 6, undertone: 'neutre', swatch: '#6E4632', description: 'Peau foncée aux reflets rouges ou neutres.' },
  { id: 'a12', label: 'Très foncé · Riche Doré', depth: 7, undertone: 'chaud', swatch: '#4A2E21', description: 'Peau très foncée et riche, reflets dorés ou cuivrés.' },
];

export type ShadeKind = 'Fond de teint' | 'Anti-cernes' | 'Poudre' | 'Teint léger';

export interface ShadeLine {
  id: string;
  brand: string;
  name: string;
  kind: ShadeKind;
  productId?: string;
  /** Une teinte par archétype (même ordre que ARCHETYPES) ; null = pas de teinte adaptée dans la gamme. */
  shades: (string | null)[];
}

export const SHADE_LINES: ShadeLine[] = [
  { id: 'armani-ls', brand: 'armani', name: 'Luminous Silk', kind: 'Fond de teint', productId: 'armani-luminous-silk',
    shades: ['2', '3', '4', '4.5', '5', '5.5', '6', '6.5', '7', '8', '10', '12'] },
  { id: 'el-dw', brand: 'estee', name: 'Double Wear', kind: 'Fond de teint', productId: 'estee-double-wear',
    shades: ['1C1 Cool Bone', '1N1 Ivory Nude', '1W2 Sand', '2N1 Desert Beige', '2C2 Pale Almond', '3N1 Ivory Beige', '3W1 Tawny', '4N1 Shell Beige', '4W1 Honey Bronze', '5N1 Rich Ginger', '6N1 Mocha', '8N1 Espresso'] },
  { id: 'nars-lrf', brand: 'nars', name: 'Light Reflecting Foundation', kind: 'Fond de teint', productId: 'nars-light-reflecting',
    shades: ['Siberia', 'Oslo', 'Deauville', 'Gobi', 'Patagonia', 'Vallauris', 'Barcelona', 'Santa Fe', 'Macao', 'Benares', 'Zambie', 'Mali'] },
  { id: 'dior-forever', brand: 'dior', name: 'Dior Forever', kind: 'Fond de teint', productId: 'dior-forever-matte',
    shades: ['0CR', '1N', '1W', '2WO', '2CR', '3N', '3W', '4WO', '5W', '5N', '7N', '9N'] },
  { id: 'fenty-pf', brand: 'fenty', name: "Pro Filt'r Soft Matte", kind: 'Fond de teint', productId: 'fenty-pro-filtr',
    shades: ['100', '120', '150', '185', '160', '210', '235', '240', '330', '360', '420', '470'] },
  { id: 'mac-sf', brand: 'mac', name: 'Studio Fix Fluid', kind: 'Fond de teint',
    shades: ['NW10', 'NC15', 'NC20', 'NC25', 'NW20', 'NC30', 'NC35', 'NC37', 'NC42', 'NW43', 'NW50', 'NC55'] },
  { id: 'hauslabs', brand: 'hauslabs', name: 'Triclone Skin Tech', kind: 'Fond de teint', productId: 'hauslabs-triclone',
    shades: ['110 Fair Cool', '120 Fair Neutral', '140 Light Warm', '160 Light Olive', '230 Light Medium Cool', '250 Light Medium Neutral', '290 Medium Warm', '310 Medium Olive', '380 Tan Warm', '410 Tan Neutral', '480 Deep Neutral', '540 Deep Warm'] },
  { id: 'ct-bs', brand: 'ct', name: 'Beautiful Skin Foundation', kind: 'Fond de teint', productId: 'ct-beautiful-skin',
    shades: ['1 Cool', '2 Neutral', '3 Warm', '4 Neutral', '4 Cool', '6 Neutral', '7 Warm', '8 Neutral', '10 Warm', '11 Neutral', '14 Neutral', '16 Warm'] },
  { id: 'fitme', brand: 'maybelline', name: 'Fit Me Matte + Poreless', kind: 'Fond de teint',
    shades: ['110 Porcelain', '112 Natural Ivory', '120 Classic Ivory', '220 Natural Beige', '125 Nude Beige', '230 Natural Buff', '310 Sun Beige', '235 Pure Beige', '330 Toffee', '334 Rich Tan', '355 Coconut', '360 Mocha'] },
  { id: 'accord-parfait', brand: 'loreal', name: 'Accord Parfait', kind: 'Fond de teint', productId: 'loreal-accord-parfait',
    shades: ['1.R', '1.N', '2.D', '3.N', '3.R', '4.N', '5.D', '5.N', '7.D', '8.N', '9.N', '10.N'] },
  { id: 'rare-lt', brand: 'rare', name: 'Liquid Touch Foundation', kind: 'Fond de teint',
    shades: ['110C', '120N', '150W', '170N', '190C', '210N', '250W', '270N', '350W', '370N', '450N', '520W'] },
  { id: 'erborian-cc', brand: 'erborian', name: 'CC Crème Centella', kind: 'Teint léger', productId: 'erborian-cc-creme',
    shades: ['Clair', 'Clair', 'Clair', 'Doré', 'Doré', 'Doré', 'Doré', 'Caramel', 'Caramel', 'Caramel', null, null] },
  { id: 'tirtir', brand: 'tirtir', name: 'Mask Fit Red Cushion', kind: 'Teint léger', productId: 'tirtir-mask-fit-red',
    shades: ['17C', '21N', '21W', '23N', '21C', '25N', '29W', '27N', '33W', '35N', '40N', '45W'] },
  { id: 'nars-rcc', brand: 'nars', name: 'Radiant Creamy Concealer', kind: 'Anti-cernes', productId: 'nars-radiant-creamy',
    shades: ['Chantilly', 'Vanilla', 'Custard', 'Crème Brûlée', 'Honey', 'Biscuit', 'Caramel', 'Ginger', 'Walnut', 'Hazelnut', 'Cacao', 'Café'] },
  { id: 'dior-sc', brand: 'dior', name: 'Dior Forever Skin Correct', kind: 'Anti-cernes', productId: 'dior-forever-skin-correct',
    shades: ['1CR', '1N', '1.5N', '2N', '2CR', '2.5N', '3N', '3WO', '4N', '5N', '7N', '9N'] },
  { id: 'iaa', brand: 'maybelline', name: "Instant Anti-Âge L'Effaceur", kind: 'Anti-cernes', productId: 'maybelline-instant-anti-age',
    shades: ['00 Ivory', '01 Light', '02 Nude', '07 Sand', '08 Buff', '04 Honey', '10 Caramel', '12 Warm Olive', '11 Tan', '13 Cocoa', '14 Deep', '15 Espresso'] },
  { id: 'huda-eb', brand: 'huda', name: 'Easy Bake Loose Powder', kind: 'Poudre', productId: 'huda-easy-bake',
    shades: ['Cherry Blossom', 'Pound Cake', 'Pound Cake', 'Banana Bread', 'Cherry Blossom', 'Pound Cake', 'Banana Bread', 'Banana Bread', 'Banana Bread', 'Coffee Cake', 'Coffee Cake', 'Coffee Cake'] },
  { id: 'lm-powder', brand: 'lauramercier', name: 'Translucent Loose Setting Powder', kind: 'Poudre', productId: 'laura-mercier-translucent',
    shades: ['Translucent', 'Translucent', 'Translucent', 'Translucent', 'Translucent', 'Translucent', 'Translucent', 'Medium Deep', 'Medium Deep', 'Medium Deep', 'Medium Deep', 'Medium Deep'] },
];

/** Archétype le plus proche d'une profondeur et d'un sous-ton. */
export function nearestArchetype(depth: number, undertone: Undertone): Archetype {
  const score = (a: Archetype) => Math.abs(a.depth - depth) * 2 + (a.undertone === undertone ? 0 : undertone === 'neutre' || a.undertone === 'neutre' ? 1 : 1.5);
  return [...ARCHETYPES].sort((a, b) => score(a) - score(b))[0];
}

/** Archétypes possibles pour une teinte connue d'une gamme (plusieurs si la gamme a peu de teintes). */
export function archetypesForShade(lineId: string, shade: string): Archetype[] {
  const line = SHADE_LINES.find((l) => l.id === lineId);
  if (!line) return [];
  return ARCHETYPES.filter((_, i) => line.shades[i] === shade);
}

export function uniqueShades(line: ShadeLine): string[] {
  return [...new Set(line.shades.filter((s): s is string => !!s))];
}
