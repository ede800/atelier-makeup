export type FixId = 'orange' | 'jaune' | 'rose' | 'clair' | 'fonce' | 'olive';

export interface ColorFix {
  id: FixId;
  problem: string;
  fix: string;
  pigment: string;
  pigmentColor: string;
  ratio: string;
  before: string;
  after: string;
  explanation: string;
  products: string[];
  caution?: string;
}

/** Simulateur « Mon fond de teint est… » : le cercle chromatique appliqué au teint. */
export const COLOR_FIXES: ColorFix[] = [
  {
    id: 'orange', problem: 'Trop orange / cuivré (ou il oxyde)', fix: 'Pigment BLEU', pigment: 'Bleu', pigmentColor: '#4A6FA5',
    ratio: '½ goutte de pigment bleu pour 1 pompe de fond de teint (≈ 1:20)', before: '#D8955F', after: '#CFA88A',
    explanation: "Sur le cercle chromatique, le bleu est le complémentaire exact de l'orange. Une demi-goutte neutralise l'excès d'orange et ramène un beige neutre, sans assombrir la teinte.",
    products: ['L.A. Girl Pro Matte Mixing Pigment Blue', 'e.l.f. / NYX correcteur bleu (en petite touche)'],
    caution: "Ajoutez goutte à goutte : trop de bleu grise le teint. Testez toujours sur la mâchoire.",
  },
  {
    id: 'jaune', problem: 'Trop jaune / doré', fix: 'Pigment LAVANDE / VIOLET', pigment: 'Lavande', pigmentColor: '#9B86C4',
    ratio: '1 goutte de lavande pour 2 pompes (≈ 1:15)', before: '#E2BE7E', after: '#DDB9A0',
    explanation: "Le violet est l'opposé du jaune. Il ravive un fond de teint trop chaud et illumine un teint terne ou olivâtre fatigué.",
    products: ['L.A. Girl Pro Matte Mixing Pigment Purple', 'NYX Color Correcting Palette (lavande)'],
  },
  {
    id: 'rose', problem: 'Trop rose / pêche (sur peau olive ou neutre)', fix: 'Correcteur VERT (ou jaune + une pointe de bleu)', pigment: 'Vert', pigmentColor: '#7FA77A',
    ratio: '1 pointe de correcteur vert pour 1 pompe (≈ 1:25)', before: '#E3A99A', after: '#D6B396',
    explanation: "Le vert annule le rose et le rouge directement dans le flacon. Le teint retrouve un beige neutre au lieu de « tirer » sur le rose.",
    products: ['Catrice Allround Concealer Palette (vert)', 'L.A. Girl HD Pro Conceal Green Corrector'],
  },
  {
    id: 'olive', problem: "Pas assez olive (rien ne m'est adapté en magasin)", fix: 'Fond de teint chaud/jaune + pointe de VERT ou de BLEU', pigment: 'Vert-bleu', pigmentColor: '#5E8C84',
    ratio: '1 pointe de vert (ou ¼ goutte de bleu) pour 2 pompes de teinte jaune', before: '#D9AF7E', after: '#C9AE80',
    explanation: "Les sous-tons olive sont rares en magasin. Partir d'une teinte jaune/dorée de la bonne profondeur et y ajouter une pointe de vert ou de bleu recrée un vrai sous-ton olive sur mesure.",
    products: ['L.A. Girl Pro Matte Mixing Pigment Blue', 'L.A. Girl HD Pro Conceal Green Corrector'],
  },
  {
    id: 'clair', problem: 'Trop clair (effet fantôme au flash)', fix: 'Gouttes bronzantes liquides', pigment: 'Bronze', pigmentColor: '#A0643C',
    ratio: '1 goutte de gouttes bronzantes pour 2 pompes', before: '#F0D8C2', after: '#E2BE9C',
    explanation: "Une goutte de bronzant liquide réchauffe et fonce d'un demi-ton sans alourdir la texture.",
    products: ["L'Oréal Lumi Glotion (teinte Medium)", 'e.l.f. Bronzing Drops', 'Drunk Elephant D-Bronzi'],
  },
  {
    id: 'fonce', problem: "Trop foncé (fond de teint d'été en hiver)", fix: 'Pigment BLANC… ou anti-cernes clair doré', pigment: 'Blanc / pêche', pigmentColor: '#F4EDE6',
    ratio: '1 goutte de blanc (peau claire) ou 1 noisette d\'anti-cernes clair doré (peau mate) pour 2 pompes', before: '#B98559', after: '#CC9C72',
    explanation: "Le blanc éclaircit, mais il grise les peaux mates à foncées. Sur peau mate ou foncée, éclaircissez toujours avec un anti-cernes doré ou pêche plutôt qu'avec du blanc pur.",
    products: ['L.A. Girl Pro Matte Mixing Pigment White', 'Un anti-cernes 1 à 2 tons plus clair, même sous-ton'],
    caution: 'Blanc pur réservé aux peaux claires à moyennes.',
  },
];

export interface CorrectionTarget {
  issue: string;
  skin: string;
  color: string;
  swatch: string;
  how: string;
}

export const CORRECTION_TARGETS: CorrectionTarget[] = [
  { issue: 'Cernes bleutés / violacés', skin: 'Peaux claires à moyennes', color: 'Saumon / pêche rosé', swatch: '#F2A98F',
    how: "Uniquement dans le creux interne sombre, jamais sur toute la paupière inférieure. Anti-cernes beige ensuite, en tapotant." },
  { issue: 'Cernes marron / hyperpigmentation', skin: 'Peaux mates, méditerranéennes à foncées', color: 'Orange / abricot / rouge brique', swatch: '#E07B39',
    how: "Un anti-cernes beige posé directement sur un cerne foncé devient gris cendré : neutralisez d'abord avec de l'orangé." },
  { issue: 'Boutons rouges, couperose, rosacée, ailes du nez', skin: 'Claires : vert menthe · Moyennes à mates : vert olive / jaune', color: 'Vert', swatch: '#9CC79A',
    how: 'Couche très fine au pinceau, uniquement sur la rougeur. Trop de vert donne un teint grisâtre.' },
  { issue: 'Taches brunes, cicatrices post-acné violacées', skin: 'Toutes peaux', color: 'Jaune banane / pêche', swatch: '#F3D27A',
    how: 'Tapotez au doigt, laissez poser 30 secondes, puis correcteur ou fond de teint.' },
];

export const TEXTURE_HACKS: { title: string; how: string; caution?: string }[] = [
  { title: 'Fond de teint haute couvrance → sérum teinté « Clean Girl »',
    how: "Sur le dos de la main, mélangez 50 % de fond de teint et 50 % d'essence ou de sérum à l'acide hyaluronique (ou de crème hydratante type Embryolisse). Appliquez aux doigts." },
  { title: 'Rouge à lèvres → blush crème assorti (look monochrome)',
    how: "Chauffez un peu de rouge sur le dos de la main avec une goutte de baume ou d'anti-cernes, puis tapotez sur les joues : le rendu est automatiquement harmonieux avec les lèvres." },
  { title: 'Raviver un mascara ou un eyeliner gel sec',
    how: "Ajoutez 2 gouttes de solution saline pour lentilles ou une goutte d'Inglot Duraline, jamais d'eau du robinet (bactéries).",
    caution: "Seulement si le produit a moins de 3 mois (mascara) ou 6 mois (gel). Au-delà, jetez-le : risque d'infection." },
  { title: "Transformer n'importe quel fard en eyeliner waterproof",
    how: "Prélevez un peu de fard poudre avec un pinceau biseauté humidifié de spray fixateur ou d'Inglot Duraline, puis tracez." },
];
