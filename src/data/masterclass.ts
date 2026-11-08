export type Undertone = 'chaud' | 'froid' | 'neutre' | 'olive';

export interface QuizQuestion {
  q: string;
  options: { label: string; scores: Partial<Record<Undertone, number>> }[];
}

export const UNDERTONE_QUIZ: QuizQuestion[] = [
  {
    q: "À la lumière du jour, de quelle couleur sont les veines à l'intérieur de votre poignet ?",
    options: [
      { label: 'Vertes / olive', scores: { chaud: 2, olive: 1 } },
      { label: 'Bleues / violettes', scores: { froid: 2 } },
      { label: "Un mélange, difficile à dire", scores: { neutre: 2 } },
      { label: 'Vert-bleu avec une peau qui paraît grise-verdâtre', scores: { olive: 2 } },
    ],
  },
  {
    q: 'Quels bijoux illuminent le plus votre visage ?',
    options: [
      { label: 'Or jaune', scores: { chaud: 2 } },
      { label: 'Argent / platine', scores: { froid: 2 } },
      { label: 'Les deux me vont', scores: { neutre: 2 } },
      { label: "L'or rose et le bronze", scores: { olive: 1, chaud: 1 } },
    ],
  },
  {
    q: 'Comment votre peau réagit-elle au soleil ?',
    options: [
      { label: 'Je bronze facilement, je brûle rarement', scores: { chaud: 1, olive: 2 } },
      { label: 'Je rougis et brûle avant de (peut-être) bronzer', scores: { froid: 2 } },
      { label: 'Je brûle un peu puis je bronze', scores: { neutre: 2 } },
      { label: 'Je dore immédiatement', scores: { chaud: 2 } },
    ],
  },
  {
    q: 'À côté de votre visage, quel tissu vous flatte le plus ?',
    options: [
      { label: 'Ivoire / crème', scores: { chaud: 2 } },
      { label: 'Blanc pur', scores: { froid: 2 } },
      { label: 'Les deux, sans différence', scores: { neutre: 2 } },
      { label: 'Kaki, terracotta, moutarde', scores: { olive: 2 } },
    ],
  },
  {
    q: 'Les fonds de teint « neutres » vous font souvent paraître…',
    options: [
      { label: 'Grise ou terne', scores: { chaud: 2 } },
      { label: 'Jaune ou orangée', scores: { froid: 2 } },
      { label: 'Parfaite', scores: { neutre: 2 } },
      { label: 'Trop rose ou trop orange : rien ne va jamais', scores: { olive: 3 } },
    ],
  },
];

export const UNDERTONES: Record<Undertone, {
  title: string; color: string; description: string; codes: string; foundations: string[]; avoid: string; blush: string; lips: string;
}> = {
  chaud: {
    title: 'Sous-ton Chaud',
    color: '#D9A066',
    description: "Votre peau a des reflets dorés, pêche ou jaunes. Les teintes trop roses vous donnent un air « masque ».",
    codes: 'Cherchez les codes W (Warm), Y (Yellow), D (Doré) ou G (Golden).',
    foundations: ["L'Oréal Accord Parfait « D » (Doré)", "Fenty Pro Filt'r « W »", 'Armani Luminous Silk (teintes ,5 et ,75)'],
    avoid: 'Les fonds de teint à sous-ton rosé (R, C, P) qui grisent votre teint.',
    blush: 'Pêche, corail, abricot, terracotta',
    lips: 'Nudes caramel, rouges orangés, briques',
  },
  froid: {
    title: 'Sous-ton Froid',
    color: '#C98B9E',
    description: 'Votre peau a des reflets roses, rouges ou bleutés. Les fonds de teint jaunes vous font paraître malade.',
    codes: 'Cherchez les codes C (Cool), R (Rosé), P (Pink).',
    foundations: ["L'Oréal Accord Parfait « R » (Rosé)", "Fenty Pro Filt'r « C »", 'Dior Forever « CR » (Cool Rosy)'],
    avoid: "Les teintes dorées ou « Golden » qui donnent un effet orangé à la mâchoire.",
    blush: 'Rose poudré, framboise, prune',
    lips: 'Rouges bleutés (Ruby Woo), baies, mauves',
  },
  neutre: {
    title: 'Sous-ton Neutre',
    color: '#C9A88D',
    description: "Un équilibre entre rose et doré. Vous avez de la chance : la plupart des teintes « N » vous iront.",
    codes: 'Cherchez les codes N (Neutral) ou les teintes sans lettre.',
    foundations: ["L'Oréal Accord Parfait « N »", "Fenty Pro Filt'r « N »", 'Dior Forever « N »'],
    avoid: 'Les extrêmes : les teintes très roses comme très jaunes.',
    blush: 'Rose-pêche, vieux rose, mauve doux',
    lips: 'Nudes rosés (Pillow Talk), rouges vrais',
  },
  olive: {
    title: 'Sous-ton Olive',
    color: '#A89A6A',
    description: "Un sous-ton vert-gris, fréquent sur les peaux méditerranéennes, latines, moyen-orientales et sud-asiatiques. Les fonds de teint classiques vous paraissent tous orange ou roses.",
    codes: 'Cherchez les codes O (Olive), NW, ou les gammes à sous-tons verts.',
    foundations: ['Haus Labs Triclone (teintes « Olive »)', 'NARS Light Reflecting (Santa Fe, Syracuse)', 'Fenty « N » + 1 goutte de correcteur jaune'],
    avoid: "Les teintes rosées qui « grisent », et les dorées qui orangent.",
    blush: 'Terracotta, bronze rosé, berry chaud',
    lips: 'Nudes brun-rosé, rouges cerise, prunes chaudes',
  },
};

export const APPLICATION_STEPS: { step: string; title: string; detail: string; wait?: string }[] = [
  { step: '01', title: 'Soin & SPF', detail: "Sérum, crème hydratante, puis écran solaire. Laissez pénétrer : un soin encore humide fait glisser le teint.", wait: '3 à 5 min' },
  { step: '02', title: 'Base de teint', detail: 'Lumineuse sur les zones sèches, flouteuse sur les pores, accrocheuse partout si vous voulez 12 h de tenue.', wait: '1 min' },
  { step: '03', title: 'Correcteur de couleur', detail: 'Pêche sur les cernes bleutés, vert sur les rougeurs. Couche fine, tapotée.' },
  { step: '04', title: 'Fond de teint', detail: 'Du centre vers l\'extérieur, au pinceau ou à l\'éponge humide. Moins aux contours du visage.' },
  { step: '05', title: 'Anti-cernes', detail: "APRÈS le teint : vous en utiliserez deux fois moins. Triangle sous l'œil, point sur les imperfections." },
  { step: '06', title: 'Produits crème', detail: 'Contour, blush et bronzer crème AVANT toute poudre, sinon ils feront des taches.' },
  { step: '07', title: 'Poudre', detail: 'Uniquement là où vous brillez (zone T) et sous les yeux. Baking éventuel 5 min.' },
  { step: '08', title: 'Produits poudre', detail: 'Bronzer, contour, blush et highlighter poudre, par-dessus la poudre de fixation.' },
  { step: '09', title: 'Sourcils', detail: 'Ils encadrent tout le reste : faites-les avant les yeux pour juger les proportions.' },
  { step: '10', title: 'Yeux', detail: 'Base, fards, eyeliner, mascara. Astuce : faites les yeux avant le teint pour un smoky (retombées).' },
  { step: '11', title: 'Lèvres', detail: 'Baume épongé, crayon, rouge ou gloss.' },
  { step: '12', title: 'Spray fixateur', detail: 'En X puis en T, à 25 cm. Laissez sécher sans toucher.', wait: '2 min' },
];

export const FORMULATION_RULES = {
  intro: "La règle d'or de la chimie cosmétique : « Like dissolves like ». Une base et un fond de teint de natures incompatibles se repoussent, la couche du dessus « roule » sur celle du dessous et forme des petites peluches (pilling).",
  howTo: "Lisez les 3 à 5 premiers ingrédients de la liste INCI : c'est là que se trouve le solvant principal du produit.",
  families: [
    {
      name: 'À base d\'eau (Water-based)',
      inci: 'Aqua/Water en 1er, puis Glycerin, Butylene Glycol, pas de « -cone » ou « -siloxane » dans le top 5',
      examples: ['Milk Hydro Grip Primer', 'e.l.f. Power Grip Primer', 'Erborian CC Crème', 'Ilia Skin Tint'],
    },
    {
      name: 'À base de silicone (Silicone-based)',
      inci: 'Dimethicone, Cyclopentasiloxane, Cyclohexasiloxane, Trisiloxane dans les 3 premiers ingrédients',
      examples: ['Benefit POREfessional', 'Maybelline Baby Skin', 'Estée Lauder Double Wear', 'Armani Luminous Silk'],
    },
    {
      name: 'À base d\'huile (Oil-based)',
      inci: 'Squalane, huiles végétales, Caprylic/Capric Triglyceride dans le top 3',
      examples: ['Embryolisse Lait-Crème', 'Chanel Healthy Glow Bronzing Cream', 'Westman Atelier sticks'],
    },
  ],
  matrix: [
    { base: 'Eau', fdt: 'Eau', ok: 'oui', note: 'Parfait' },
    { base: 'Eau', fdt: 'Silicone', ok: 'oui', note: 'Compatible (laissez sécher la base)' },
    { base: 'Silicone', fdt: 'Silicone', ok: 'oui', note: 'Parfait' },
    { base: 'Silicone', fdt: 'Eau', ok: 'non', note: 'Peluches assurées : le silicone repousse l\'eau' },
    { base: 'Huile', fdt: 'Eau', ok: 'non', note: 'Le teint glisse et se dépose en taches' },
    { base: 'Huile', fdt: 'Silicone', ok: 'moyen', note: 'Possible si la base a bien pénétré (5 min)' },
  ] as { base: string; fdt: string; ok: 'oui' | 'non' | 'moyen'; note: string }[],
};

export const FACE_SHAPES: { name: string; emoji: string; contour: string; blush: string; highlight: string }[] = [
  { name: 'Ovale', emoji: '🥚', contour: 'Léger, sous les pommettes uniquement : votre visage est déjà équilibré.', blush: 'Sur les pommettes, estompé vers les tempes.', highlight: 'Haut des pommettes, arête du nez, arc de Cupidon.' },
  { name: 'Rond', emoji: '🌕', contour: 'En diagonale sous les pommettes et sur les côtés du front pour allonger.', blush: 'Au-dessus de la pommette, tiré vers la tempe (jamais en rond).', highlight: 'Centre du front et menton, en vertical.' },
  { name: 'Carré', emoji: '⬜', contour: 'Sur les angles de la mâchoire et des tempes pour adoucir.', blush: 'Au centre des pommettes, en arrondi.', highlight: 'Centre du front et du menton.' },
  { name: 'Cœur', emoji: '🤍', contour: 'Sur les tempes et le haut du front, très léger sous les pommettes.', blush: 'Un peu plus bas sur les pommettes, vers le centre.', highlight: 'Menton et sous les yeux.' },
  { name: 'Long / Rectangle', emoji: '▯', contour: 'Racine des cheveux et dessous du menton pour raccourcir.', blush: 'À l\'horizontale, sur la pommette.', highlight: 'Pommettes, à l\'horizontale.' },
];
