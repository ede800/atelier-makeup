/** Ingrédients souvent cités comme potentiellement comédogènes ou irritants. Leur effet dépend de la concentration et de la peau. */
export const COMEDOGENIC: { inci: string; where: string; why: string }[] = [
  { inci: 'Isopropyl Myristate / Isopropyl Palmitate', where: 'Fonds de teint, bases, crèmes', why: 'Esters très pénétrants qui peuvent obstruer les pores des peaux à tendance acnéique.' },
  { inci: 'Cocos Nucifera (Coconut) Oil', where: 'Baumes, démaquillants, highlighters crème', why: "Huile riche en acide laurique, régulièrement associée à l'apparition de comédons." },
  { inci: 'Algae Extract / Carrageenan', where: 'Fonds de teint « soin », bases hydratantes', why: 'Certains extraits d\'algues sont réputés comédogènes à forte concentration.' },
  { inci: 'Bismuth Oxychloride', where: 'Poudres minérales, fards nacrés', why: 'Peut irriter et provoquer démangeaisons ou boutons sur peau sensible.' },
  { inci: 'Lanolin / Acetylated Lanolin', where: 'Rouges à lèvres, baumes', why: 'Occlusive, et allergène connu pour certaines peaux.' },
  { inci: 'Laureth-4', where: 'Fonds de teint, mascaras', why: 'Tensioactif classé parmi les plus comédogènes dans les études sur oreille de lapin.' },
  { inci: 'D&C Red (certains colorants rouges)', where: 'Blushs, rouges à lèvres', why: "Certains colorants rouges sont associés à l'« acné cosmétique » sur les joues." },
  { inci: 'Parfum / Fragrance, Linalool, Limonene', where: 'Partout', why: 'Non comédogènes, mais premières causes d\'irritation et d\'allergie de contact.' },
];

/** Durées de vie après ouverture (PAO) recommandées. */
export const PAO_GUIDE: { product: string; months: number; note: string }[] = [
  { product: 'Mascara, eyeliner liquide', months: 3, note: 'Bactéries des yeux : 3 mois maximum, même s\'il n\'est pas sec.' },
  { product: 'Fond de teint liquide, anti-cernes', months: 12, note: 'Jetez dès que l\'odeur ou la texture change.' },
  { product: 'Correcteurs couleur, crèmes', months: 12, note: 'Utilisez une spatule plutôt que les doigts.' },
  { product: 'Gloss, rouges liquides, encres', months: 12, note: 'L\'applicateur revient dans le tube à chaque fois.' },
  { product: 'Rouges à lèvres en stick, crayons', months: 18, note: 'Taillez les crayons régulièrement : la mine propre est neuve.' },
  { product: 'Poudres, blushs, fards poudre', months: 24, note: 'Les poudres anhydres tiennent bien, sauf si on les mouille.' },
  { product: 'Éponges de maquillage', months: 3, note: 'Remplacez-les tous les 3 mois, lavez-les chaque semaine.' },
];

export const PAO_BY_CATEGORY: Record<string, number> = {
  mascara: 3, eyeliner: 6, 'false-lashes': 6,
  'primer-glow': 12, 'primer-blur': 12, 'primer-grip': 12,
  'fdt-mat': 12, 'fdt-lumineux': 12, 'skin-tint': 12, concealer: 12, 'color-corrector': 12,
  'setting-spray': 12, 'eye-primer': 12, 'brow-gel': 6, 'brow-pomade': 12,
  'gloss-oil': 12, 'liquid-lipstick': 12, 'lip-balm-tint': 12,
  lipstick: 24, 'lip-liner': 24, 'brow-pencil': 24,
  powder: 24, bronzer: 24, contour: 12, blush: 24, highlighter: 24, palette: 24, tools: 3,
};
