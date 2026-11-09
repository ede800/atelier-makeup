export type ZoneKind = 'contour' | 'bronzer' | 'blush' | 'concealer' | 'highlighter';
export type FaceShape = 'ovale' | 'rond' | 'carre' | 'long';

export interface ZoneShape {
  cx: number; cy: number; rx: number; ry: number; rot?: number;
  /** Zone centrale (pas de symétrique). */
  center?: boolean;
}

export const ZONE_META: Record<ZoneKind, { label: string; color: string; pattern: string; desc: string }> = {
  contour: { label: 'Contour (ombre froide)', color: '#7A6253', pattern: 'hatch', desc: 'Teinte grise-taupe qui imite une ombre naturelle.' },
  bronzer: { label: 'Bronzer (chaleur)', color: '#B9763F', pattern: 'dots', desc: 'Teinte chaude, là où le soleil touche le visage.' },
  blush: { label: 'Blush', color: '#E07A86', pattern: 'solid', desc: 'La bonne mine, placée selon l\'effet recherché.' },
  concealer: { label: 'Anti-cernes éclaircissant', color: '#F1D3B3', pattern: 'cross', desc: 'Une demi-teinte plus claire pour relever et éclairer.' },
  highlighter: { label: 'Highlighter', color: '#FFF4D6', pattern: 'shine', desc: 'Lumière sur les points hauts du visage.' },
};

const Z = {
  hollow: { cx: 86, cy: 246, rx: 30, ry: 8, rot: -22 },
  hollowLifted: { cx: 86, cy: 226, rx: 32, ry: 7, rot: -34 },
  temple: { cx: 62, cy: 152, rx: 9, ry: 24, rot: 8 },
  jaw: { cx: 84, cy: 302, rx: 24, ry: 8, rot: 42 },
  jawAngle: { cx: 72, cy: 290, rx: 16, ry: 14, rot: 0 },
  hairline: { cx: 150, cy: 70, rx: 68, ry: 9, center: true },
  foreheadCorner: { cx: 82, cy: 92, rx: 16, ry: 12, rot: -30 },
  underChin: { cx: 150, cy: 346, rx: 36, ry: 6, center: true },
  noseSide: { cx: 140, cy: 216, rx: 3, ry: 24 },
  bronzeTemple: { cx: 64, cy: 148, rx: 12, ry: 26, rot: 8 },
  bronzeCheek: { cx: 76, cy: 214, rx: 20, ry: 11, rot: -15 },
  bronzeJaw: { cx: 86, cy: 286, rx: 20, ry: 9, rot: 35 },
  bronzeForehead: { cx: 150, cy: 86, rx: 58, ry: 11, center: true },
  bronzeNose: { cx: 150, cy: 214, rx: 6, ry: 20, center: true },
  apple: { cx: 106, cy: 238, rx: 19, ry: 14 },
  lifted: { cx: 86, cy: 212, rx: 25, ry: 10, rot: -30 },
  horizontal: { cx: 96, cy: 232, rx: 28, ry: 9 },
  sunburnBand: { cx: 150, cy: 222, rx: 62, ry: 10, center: true },
  appleLow: { cx: 110, cy: 248, rx: 18, ry: 13 },
  underEye: { cx: 116, cy: 205, rx: 14, ry: 5 },
  underEyeLift: { cx: 120, cy: 204, rx: 16, ry: 5, rot: -24 },
  outerCorner: { cx: 86, cy: 188, rx: 6, ry: 5 },
  foreheadCenter: { cx: 150, cy: 118, rx: 11, ry: 20, center: true },
  chinCenter: { cx: 150, cy: 326, rx: 11, ry: 7, center: true },
  cheekbone: { cx: 78, cy: 200, rx: 18, ry: 5, rot: -22 },
  cheekboneFlat: { cx: 84, cy: 206, rx: 22, ry: 5 },
  browBone: { cx: 84, cy: 160, rx: 10, ry: 3.5, rot: -18 },
  noseBridge: { cx: 150, cy: 204, rx: 3, ry: 18, center: true },
  cupid: { cx: 150, cy: 270, rx: 6, ry: 3, center: true },
  appleTop: { cx: 104, cy: 224, rx: 12, ry: 4 },
} satisfies Record<string, ZoneShape>;

export interface FaceMode {
  id: string;
  label: string;
  shape: FaceShape;
  intro: string;
  zones: Partial<Record<ZoneKind, ZoneShape[]>>;
  steps: Partial<Record<ZoneKind, string>>;
}

export const FACE_MODES: FaceMode[] = [
  {
    id: 'lift', label: 'Liftant / Sculpté (Fox)', shape: 'ovale',
    intro: "Tout remonte vers les tempes : on étire le visage vers le haut et l'extérieur.",
    zones: { contour: [Z.hollowLifted, Z.temple, Z.jaw], blush: [Z.lifted], concealer: [Z.underEyeLift, Z.outerCorner], highlighter: [Z.cheekbone, Z.browBone, Z.noseBridge] },
    steps: {
      contour: 'Au-dessus du creux de la joue, en diagonale vers le haut de l\'oreille, plus les tempes et le dessous de la mâchoire.',
      blush: 'Haut sur la pommette, tiré vers la tempe : jamais sur le centre de la joue.',
      concealer: 'Triangle incliné vers le coin externe de l\'œil, plus un point au coin externe pour « relever » le regard.',
      highlighter: 'Haut de la pommette, sous la queue du sourcil, arête du nez.',
    },
  },
  {
    id: 'doll', label: 'Repulpant / Rajeunissant (Doll)', shape: 'ovale',
    intro: 'On arrondit et on rapproche les couleurs du centre du visage pour un effet frais et juvénile.',
    zones: { blush: [Z.apple], concealer: [Z.underEye, Z.foreheadCenter, Z.chinCenter], highlighter: [Z.appleTop, Z.cupid, Z.chinCenter] },
    steps: {
      blush: 'Sur le centre des pommettes en souriant, estompé en rond.',
      concealer: 'Sous l\'œil côté interne, centre du front et menton pour éclairer.',
      highlighter: 'Sur le haut de la pomme des joues, l\'arc de Cupidon et le menton.',
    },
  },
  {
    id: 'sunburn', label: 'Sunburn / Retour de plage', shape: 'ovale',
    intro: 'On imite un coup de soleil flatteur : chaleur sur les reliefs et rose qui traverse le nez.',
    zones: { bronzer: [Z.bronzeTemple, Z.bronzeCheek, Z.bronzeJaw, Z.bronzeForehead, Z.bronzeNose], blush: [Z.sunburnBand], highlighter: [Z.cheekbone] },
    steps: {
      bronzer: 'Le « 3 » de chaque côté (tempe, pommette, mâchoire), plus le haut du front et l\'arête du nez.',
      blush: 'Une bande continue d\'une pommette à l\'autre, en passant sur le nez.',
      highlighter: 'Une touche discrète sur le haut des pommettes.',
    },
  },
  {
    id: 'rond', label: 'Correction visage rond', shape: 'rond',
    intro: 'On crée des angles et de la verticalité pour allonger.',
    zones: { contour: [Z.hollow, Z.temple], blush: [Z.lifted], highlighter: [Z.foreheadCenter, Z.chinCenter, Z.noseBridge] },
    steps: {
      contour: 'En diagonale marquée sous la pommette, plus les tempes.',
      blush: 'Au-dessus de la pommette, tiré vers la tempe, jamais en rond.',
      highlighter: 'En vertical : centre du front, arête du nez, menton.',
    },
  },
  {
    id: 'carre', label: 'Correction visage carré', shape: 'carre',
    intro: 'On adoucit les angles de la mâchoire et du front.',
    zones: { contour: [Z.jawAngle, Z.foreheadCorner], blush: [Z.apple], highlighter: [Z.foreheadCenter, Z.chinCenter] },
    steps: {
      contour: 'Sur les angles de la mâchoire et les coins du front, estompé en arrondi.',
      blush: 'Au centre des pommettes, en rond pour adoucir.',
      highlighter: 'Centre du front et du menton pour recentrer la lumière.',
    },
  },
  {
    id: 'long', label: 'Correction visage allongé', shape: 'long',
    intro: 'On raccourcit en assombrissant le haut et le bas, et on élargit à l\'horizontale.',
    zones: { contour: [Z.hairline, Z.underChin], blush: [Z.horizontal], highlighter: [Z.cheekboneFlat] },
    steps: {
      contour: 'Le long de la racine des cheveux et sous le menton.',
      blush: 'À l\'horizontale sur la pommette, vers l\'oreille.',
      highlighter: 'À l\'horizontale sur les pommettes pour élargir.',
    },
  },
];

export type EyeShape = 'amande' | 'rond' | 'tombant';
export type EyeLayer = 'crease' | 'outerV' | 'liner' | 'inner' | 'browbone';

export const EYE_LAYERS: Record<EyeLayer, { label: string; color: string }> = {
  crease: { label: 'Creux de paupière (faux creux)', color: '#8C6A55' },
  outerV: { label: 'V externe (fard foncé)', color: '#5A3E33' },
  liner: { label: 'Trait d\'eyeliner', color: '#1D1A19' },
  inner: { label: 'Point lumineux du coin interne', color: '#E9C58F' },
  browbone: { label: 'Highlighter sous le sourcil', color: '#F3E2C2' },
};

export const EYE_SHAPES: Record<EyeShape, { label: string; intro: string; tips: Record<EyeLayer, string> }> = {
  amande: {
    label: 'Œil en amande',
    intro: "La forme la plus équilibrée : presque toutes les techniques fonctionnent, il s'agit surtout de suivre l'œil.",
    tips: {
      crease: 'Suivez le creux naturel, estompé en essuie-glace.',
      outerV: 'Un V doux au coin externe, qui rejoint le creux.',
      liner: 'Aile classique dans le prolongement de la ligne inférieure, à environ 20-30°.',
      inner: 'Une touche de fard clair au coin interne.',
      browbone: 'Sous la queue du sourcil, très légèrement.',
    },
  },
  rond: {
    label: 'Œil rond',
    intro: "On allonge à l'horizontale pour donner une forme plus étirée.",
    tips: {
      crease: 'Le fard de transition se concentre sur la moitié externe et s\'étire vers l\'extérieur.',
      outerV: 'Un V allongé horizontalement, prolongé sous les cils inférieurs externes.',
      liner: 'Trait fin au coin interne qui s\'épaissit vers l\'extérieur, aile plus horizontale.',
      inner: 'Coin interne très discret, pour ne pas arrondir davantage.',
      browbone: 'Sous la queue du sourcil, en l\'étirant vers la tempe.',
    },
  },
  tombant: {
    label: 'Paupière tombante (hooded)',
    intro: "Le pli naturel est caché sous la paupière : on crée un faux creux AU-DESSUS, les yeux ouverts.",
    tips: {
      crease: 'Faux creux dessiné au-dessus du pli, en regardant droit devant dans le miroir : c\'est lui qui reste visible.',
      outerV: 'V externe relevé vers la queue du sourcil, jamais tombant.',
      liner: "Liner « bat-wing » : tracé les yeux ouverts, avec une encoche qui suit la paupière pour que l'aile reste droite.",
      inner: 'Point lumineux au coin interne pour ouvrir le regard.',
      browbone: 'Lumière sous le sourcil pour soulever visuellement la paupière.',
    },
  },
};
