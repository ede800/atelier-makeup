import type { Category, Zone } from './types';

export const ZONES: Zone[] = [
  { id: 'prep', name: 'Préparation & Base', emoji: '✨' },
  { id: 'teint', name: 'Le Teint', emoji: '🌸' },
  { id: 'yeux', name: 'Les Yeux', emoji: '👁️' },
  { id: 'sourcils', name: 'Les Sourcils', emoji: '〰️' },
  { id: 'levres', name: 'Les Lèvres', emoji: '💋' },
  { id: 'outils', name: 'Outils & Pinceaux', emoji: '🖌️' },
];

export const CATEGORIES: Category[] = [
  // ——— PRÉPARATION
  {
    id: 'primer-glow', zone: 'prep', name: 'Bases hydratantes & lumineuses', en: 'Glowy Primers',
    description: "Elles repulpent, hydratent et diffusent la lumière sous le teint. Idéales pour les peaux sèches, ternes ou matures qui veulent un fini « peau de verre ».",
    expertTip: "Appliquez-les uniquement sur le haut des pommettes, l'arête du nez et l'arc de Cupidon si vous avez la zone T grasse : la lumière où il faut, sans faire briller le reste.",
  },
  {
    id: 'primer-blur', zone: 'prep', name: 'Bases flouteuses & matifiantes', en: 'Pore-filling & Mattifying Primers',
    description: "Riches en silicones (dimethicone) et poudres absorbantes, elles comblent les pores dilatés et retardent la brillance.",
    expertTip: "Tapotez, ne frottez pas : un mouvement de tamponnage remplit le pore, un mouvement de va-et-vient le vide. Une noisette suffit pour le nez et le centre des joues.",
  },
  {
    id: 'primer-grip', zone: 'prep', name: 'Bases accrocheuses longue tenue', en: 'Gripping Primers',
    description: "Formules collantes à base de glycérine et de polymères filmogènes qui « agrippent » le fond de teint pour 12 à 16 h de tenue.",
    expertTip: "Attendez 60 secondes que la base devienne collante avant d'appliquer le teint. Compatible avec les fonds de teint à base d'eau ET de silicone, c'est la base la plus polyvalente.",
  },
  // ——— TEINT
  {
    id: 'fdt-mat', zone: 'teint', name: 'Fonds de teint haute couvrance & mats', en: 'Full Coverage & Matte Foundations',
    description: "Pigments concentrés, polymères longue tenue et poudres absorbantes : le choix des peaux grasses, des événements et des photos au flash.",
    expertTip: "Sur peau sèche, mélangez une goutte de sérum à l'acide hyaluronique dans le fond de teint : vous gardez la couvrance sans souligner les zones déshydratées.",
  },
  {
    id: 'fdt-lumineux', zone: 'teint', name: 'Fonds de teint lumineux & naturels', en: 'Luminous & Satin Foundations',
    description: "Fini satiné « seconde peau », couvrance modulable, pigments enrobés qui reflètent la lumière. Les références des peaux normales à sèches et matures.",
    expertTip: "Appliquez au pinceau dense en partant du centre du visage vers l'extérieur : les zones périphériques ont besoin de deux fois moins de produit.",
  },
  {
    id: 'skin-tint', zone: 'teint', name: 'Sérums teintés, BB & CC Crèmes', en: 'Skin Tints & Tinted Moisturizers',
    description: "Le maquillage « no-makeup » : couvrance légère, soin intégré (SPF, niacinamide, centella) et rendu peau nue.",
    expertTip: "Appliquez aux doigts : la chaleur des mains fait fondre la formule dans la peau. Corrigez ensuite uniquement les imperfections au correcteur.",
  },
  {
    id: 'concealer', zone: 'teint', name: 'Correcteurs & Anti-cernes', en: 'Concealers',
    description: "Deux familles : les hydratants pour le contour de l'œil (fini lumineux, ne craquelle pas) et les haute couvrance pour les imperfections (fini mat, tenue béton).",
    expertTip: "Sous l'œil : une teinte plus claire d'un demi-ton, en triangle inversé. Sur un bouton : la teinte EXACTE du teint, au pinceau fin, jamais plus claire (sinon le relief ressort).",
  },
  {
    id: 'color-corrector', zone: 'teint', name: 'Correcteurs de couleur', en: 'Color Correctors',
    description: "La roue chromatique au service du teint : pêche/saumon neutralise les cernes bleutés, orange les cernes très foncés sur peaux mates, vert les rougeurs.",
    expertTip: "Moins, c'est plus : une couche fine, uniquement sur la zone colorée, puis anti-cernes par-dessus en tapotant. Trop de vert donne un teint grisâtre.",
  },
  {
    id: 'powder', zone: 'teint', name: 'Poudres libres & compactes', en: 'Setting Powders',
    description: "Elles fixent les textures crème, floutent le grain de peau et contrôlent la brillance. Avec ou sans talc, translucides ou teintées.",
    expertTip: "Le « baking » (laisser poser une couche épaisse 5 min) est réservé aux peaux grasses et aux soirées. Sur peau mature, une houppette pressée, puis un pinceau duveteux suffisent.",
  },
  {
    id: 'bronzer', zone: 'teint', name: 'Bronzers & Poudres soleil', en: 'Bronzers',
    description: "Pour réchauffer le teint là où le soleil le toucherait naturellement : tempes, pommettes, arête du nez. Teintes chaudes, finis mats ou satinés.",
    expertTip: "Dessinez un « 3 » de chaque côté du visage (tempe → pommette → mâchoire). Une crème sous la poudre = bronzage effet peau, qui tient toute la journée.",
  },
  {
    id: 'contour', zone: 'teint', name: 'Contours & Sculpteurs', en: 'Contour',
    description: "Teintes froides et grisées qui imitent une vraie ombre pour creuser les joues, affiner le nez ou définir la mâchoire.",
    expertTip: "Placez le contour au-dessus du creux de la joue (et non dedans) pour remonter visuellement le visage. Estompez toujours vers le haut.",
  },
  {
    id: 'blush', zone: 'teint', name: 'Blushs', en: 'Blush',
    description: "Liquides, crèmes ou poudres : le produit qui donne vie au teint. Les formules liquides ultra-pigmentées dominent depuis 2022.",
    expertTip: "Superposez une crème puis la même couleur en poudre (« double blush ») : la couleur tient 12 h, même sur peau grasse.",
  },
  {
    id: 'highlighter', zone: 'teint', name: 'Highlighters & Enlumineurs', en: 'Highlighters',
    description: "Liquides à mélanger au fond de teint, poudres à reflets ou baumes effet mouillé : la lumière sur les points hauts du visage.",
    expertTip: "Évitez les paillettes visibles sur peau texturée ou mature : préférez des baumes ou des liquides perlés, qui reflètent la lumière sans souligner le relief.",
  },
  {
    id: 'setting-spray', zone: 'teint', name: 'Sprays fixateurs', en: 'Fixing & Setting Sprays',
    description: "Deux familles : les « fixing » (type Fix+) qui fusionnent les poudres pour un rendu peau, et les « setting » à polymères qui verrouillent le maquillage 16 h.",
    expertTip: "Vaporisez en « X » puis en « T », à 25 cm du visage. Astuce pro : un voile de spray AVANT la poudre, puis un après = la technique du sandwich qui tient toute la nuit.",
  },
  // ——— YEUX
  {
    id: 'eye-primer', zone: 'yeux', name: 'Bases à paupières', en: 'Eyeshadow Primers',
    description: "Elles unifient la paupière, intensifient les fards et empêchent l'accumulation dans le pli. Indispensables sur paupières grasses ou tombantes.",
    expertTip: "Une base teintée (type Paint Pot) peut remplacer un fard de transition pour les maquillages de jour express.",
  },
  {
    id: 'palette', zone: 'yeux', name: 'Palettes & Fards (poudre, crème, liquide)', en: 'Eyeshadow Palettes & Cream Shadows',
    description: "Nudes/neutres, chauds, froids ou éditoriaux multichromes. Une bonne formule se juge au « blendabilité », pas à la pigmentation au doigt.",
    expertTip: "Travaillez du plus clair au plus foncé, avec un pinceau propre pour chaque famille de couleurs. Les fards à reflets se posent au doigt, légèrement humidifié.",
  },
  {
    id: 'eyeliner', zone: 'yeux', name: 'Eyeliners & Khôls', en: 'Eyeliners',
    description: "Feutres liquides waterproof pour le trait graphique, gels en pot pour la précision, crayons khôl crémeux pour la muqueuse.",
    expertTip: "Tracez l'aile en partant de l'extérieur vers l'intérieur, les yeux ouverts, en suivant la ligne de la paupière inférieure prolongée.",
  },
  {
    id: 'mascara', zone: 'yeux', name: 'Mascaras', en: 'Mascaras',
    description: "Volume extrême, longueur & séparation, courbure… et les « tubing » qui gainent chaque cil d'un polymère et s'enlèvent à l'eau tiède sans couler.",
    expertTip: "Zigzaguez à la racine puis tirez droit vers les pointes. Peaux grasses ou paupières tombantes : un tubing est la seule garantie anti-« yeux de panda ».",
  },
  {
    id: 'false-lashes', zone: 'yeux', name: 'Faux-cils & Colles', en: 'False Lashes & Glue',
    description: "Bandes naturelles, demi-cils pour l'œil de biche, colles transparentes ou noires. La colle compte autant que les cils.",
    expertTip: "Recoupez la bande depuis l'extérieur, appliquez la colle, attendez 30 secondes qu'elle devienne collante. Les demi-cils posés au coin externe sont les plus indétectables.",
  },
  // ——— SOURCILS
  {
    id: 'brow-pencil', zone: 'sourcils', name: 'Crayons ultra-fins & Feutres poil-à-poil', en: 'Micro Brow Pencils & Pens',
    description: "Mines de 1 à 1,5 mm et feutres à pointe fendue pour dessiner des poils réalistes, un à un, là où il en manque.",
    expertTip: "Choisissez une teinte plus claire d'un ton que vos racines de cheveux (blondes : un ton plus foncé). Traits courts, dans le sens de la pousse, jamais de contour plein.",
  },
  {
    id: 'brow-pomade', zone: 'sourcils', name: 'Pommades à sourcils', en: 'Brow Pomades',
    description: "Pigments cireux ultra-concentrés, waterproof, pour des sourcils définis et sculptés « Instagram brows » ou pour combler les zones clairsemées.",
    expertTip: "Prélevez très peu, essuyez l'excédent sur le dos de la main. Ne travaillez jamais le début du sourcil : estompez-le avec un goupillon propre.",
    podiumNote: "Pas de podium luxe : aucune maison de couture n'a fait mieux que le Dipbrow d'Anastasia Beverly Hills, qui reste la référence absolue.",
  },
  {
    id: 'brow-gel', zone: 'sourcils', name: 'Gels fixateurs & teintés', en: 'Clear & Tinted Brow Gels',
    description: "Gels transparents effet « Brow Lamination » qui brossent et figent les poils vers le haut, et gels teintés qui colorent et densifient.",
    expertTip: "Pour l'effet laminé, brossez vers le haut puis pressez les poils à plat avec le dos du goupillon pendant 10 secondes.",
    podiumNote: "Ici, le drugstore bat clairement le luxe : aucun gel sourcils de luxe ne justifie sa différence de prix.",
  },
  // ——— LÈVRES
  {
    id: 'lip-liner', zone: 'levres', name: 'Crayons à lèvres', en: 'Lip Liners',
    description: "Ils définissent, redessinent et empêchent le rouge de filer. Un crayon nude « universel » est l'outil le plus rentable d'une trousse.",
    expertTip: "Pour un overline discret, ne dépassez que l'arc de Cupidon et le centre de la lèvre inférieure. Remplissez toute la lèvre de crayon : la base fait tenir le rouge.",
  },
  {
    id: 'lipstick', zone: 'levres', name: 'Rouges à lèvres (mats velours & satinés)', en: 'Bullet Lipsticks',
    description: "Le raisin classique : mats velours pour la tenue, satinés et baumes pour le confort et la brillance.",
    expertTip: "Pour une tenue de 8 h : couche, mouchoir posé sur la bouche, voile de poudre translucide à travers, seconde couche.",
  },
  {
    id: 'liquid-lipstick', zone: 'levres', name: 'Rouges à lèvres liquides sans transfert', en: 'Transfer-proof Liquid Lipsticks',
    description: "Formules filmogènes qui sèchent sur la lèvre : zéro transfert sur les verres et les masques, tenue 12 à 16 h.",
    expertTip: "Hydratez au baume 10 min avant, puis épongez parfaitement. Pour démaquiller : une huile démaquillante, jamais de frottement à sec.",
  },
  {
    id: 'gloss-oil', zone: 'levres', name: 'Gloss & Huiles à lèvres', en: 'Glosses & Lip Oils',
    description: "Brillance miroir, effet repulpant et soin : les huiles à lèvres (lip oils) ont remplacé les gloss collants des années 2000.",
    expertTip: "Posez le gloss uniquement au centre des lèvres par-dessus un crayon : effet bouche pulpeuse 3D garanti.",
  },
  {
    id: 'lip-balm-tint', zone: 'levres', name: 'Baumes teintés & Encres à lèvres', en: 'Tinted Balms & Lip Tints',
    description: "Les encres coréennes (lip tints) qui teintent la lèvre pour la journée, et les baumes colorés qui soignent.",
    expertTip: "Effet « gradient lips » coréen : déposez l'encre à l'intérieur des lèvres et estompez vers l'extérieur au doigt.",
  },
  // ——— OUTILS
  {
    id: 'tools', zone: 'outils', name: 'Éponges & Pinceaux essentiels', en: 'Sponges & Brushes',
    description: "Éponges humides pour un teint seconde peau, pinceaux denses pour la couvrance, duveteux pour les poudres, estompeurs pour les yeux.",
    expertTip: "Lavez éponges et pinceaux de teint une fois par semaine au savon doux : un outil sale fait boulocher le fond de teint et provoque des imperfections.",
  },
];

export const categoryById = (id: string) => CATEGORIES.find((c) => c.id === id);
