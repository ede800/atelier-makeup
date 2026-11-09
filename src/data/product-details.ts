import type { Product } from './types';

export type BaseType = 'silicone' | 'water' | 'oil' | 'powder';

export interface ProductDetails {
  baseType?: BaseType;
  iconicShades?: string;
  /** Allégation « non comédogène / testé sur peaux à tendance acnéique » de la marque. */
  acneSafe?: boolean;
  fragranceFree?: boolean;
  talcFree?: boolean;
  mini?: { price: number; size: string };
}

type Flags = { a?: boolean; f?: boolean; t?: boolean; m?: [number, string] };
const B: Record<string, BaseType> = { s: 'silicone', w: 'water', o: 'oil', p: 'powder' };

/** d(base, teintes iconiques, drapeaux) — base : s silicone, w eau, o huile, p poudre, '' non pertinent. */
function d(base: string, shades?: string, fl: Flags = {}): ProductDetails {
  return {
    baseType: B[base], iconicShades: shades, acneSafe: fl.a, fragranceFree: fl.f, talcFree: fl.t,
    mini: fl.m ? { price: fl.m[0], size: fl.m[1] } : undefined,
  };
}

/*
 * Base de formule : classement INDICATIF d'après le solvant dominant des premiers ingrédients INCI.
 * Badges : uniquement quand l'allégation de la marque est connue ; absent = non communiqué.
 * Formats mini : prix indicatifs des formats voyage vendus en France.
 */
export const DETAILS: Record<string, ProductDetails> = {
  // Bases
  'embryolisse-lait-creme': d('w', undefined, { m: [8, '30 ml'] }),
  'elf-halo-glow': d('s', 'Fair · Light · Medium · Tan'),
  'loreal-glotion': d('w', '901 Fair Glow · 902 Light Glow · 903 Medium Glow'),
  'toofaced-hangover': d('w', undefined, { m: [20, '20 ml'] }),
  'ct-flawless-filter': d('s', '1 Fair · 2 Light · 4 Medium · 5 Tan', { m: [26, '13 ml'] }),
  'ct-wonderglow': d('s'),
  'maybelline-baby-skin': d('s', 'Transparent'),
  'elf-poreless-putty': d('s', 'Transparent'),
  'rare-pore-diffusing': d('s', 'Transparent', { f: true }),
  'benefit-porefessional': d('s', 'Beige transparent', { m: [16, '7,5 ml'] }),
  'hourglass-veil-mineral': d('s', 'Transparent', { a: true, t: true }),
  'danessa-yummy-skin': d('s', 'Teintes 0 à 8 (transparent teinté)'),
  'elf-power-grip': d('w', 'Transparent'),
  'nyx-plump-right-back': d('w', 'Transparent'),
  'milk-hydro-grip': d('w', 'Transparent', { m: [20, '15 ml'] }),
  'dior-forever-velvet-veil': d('s', 'Transparent'),

  // Fonds de teint
  'loreal-infaillible-32h': d('s', '100 · 130 · 200 · 220 · 260 · 300'),
  'maybelline-superstay-30h': d('s', '03 True Ivory · 21 Nude Beige · 30 Sand · 40 Fawn'),
  'fenty-pro-filtr': d('s', '150 · 185 · 235 · 330 · 420', { m: [16, '9 ml'] }),
  'estee-double-wear': d('s', '1W2 Sand · 2C2 Pale Almond · 3W1 Tawny', { a: true }),
  'dior-forever-matte': d('s', '1N · 2N · 2WO · 3N · 4N'),
  'vichy-dermablend': d('s', '15 Opal · 25 Nude · 35 Sand · 45 Gold', { a: true }),
  'lrp-toleriane-teint': d('s', '10 Ivoire · 11 Beige Clair · 13 Beige Sable', { a: true, f: true }),
  'huda-fauxfilter': d('s', 'Panna Cotta · Latte · Toasted Coconut'),
  'revlon-colorstay': d('s', '110 Ivory · 180 Sand Beige · 220 Natural Beige'),
  'maxfactor-facefinity': d('s', '40 Light Ivory · 55 Beige · 77 Soft Honey'),
  'valentino-very': d('s', 'LN1 · MN2 · MA3'),
  'shiseido-synchro': d('s', '120 Ivory · 230 Alder · 340 Oak'),
  'loreal-accord-parfait': d('s', '1.N Ivoire · 3.N Beige Crème · 5.D Sable Doré'),
  'hauslabs-triclone': d('s', '110 Fair Cool · 250 Light Medium Neutral · 410 Tan Neutral', { f: true }),
  'armani-luminous-silk': d('s', '4 · 5.5 · 6.5', { m: [30, '15 ml'] }),
  'nars-light-reflecting': d('s', 'Deauville · Vallauris · Barcelona'),
  'ct-beautiful-skin': d('w', '3 Neutral · 6 Neutral · 8 Warm'),
  'toofaced-born-this-way': d('s', 'Porcelain · Warm Beige · Golden Beige'),
  'sisley-phyto-teint': d('w', '1+ Ivory · 2 Soft Beige · 3 Natural'),
  'lamer-soft-fluid': d('s', '12 Ecru · 23 Beige · 32 Bisque'),

  // Teints légers
  'maybelline-instant-perfector': d('s', '00 Fair Light · 01 Light · 02 Light Medium'),
  'missha-m-perfect-cover': d('s', '13 Milky Beige · 21 Light Beige · 23 Natural Beige'),
  'erborian-cc-creme': d('s', 'Clair · Doré · Caramel', { m: [17, '15 ml'] }),
  'erborian-bb-creme': d('s', 'Clair · Doré · Caramel', { m: [16, '15 ml'] }),
  'tirtir-mask-fit-red': d('s', '17C Porcelain · 21N Ivory · 23N Sand · 27N Camel'),
  'typology-teint-serum': d('w', '1W · 3N · 6C', { f: true }),
  'clio-kill-cover': d('s', '02 Lingerie · 03 Linen · 04 Ginger'),
  'chanel-eau-de-teint': d('w', 'Light · Medium Light · Medium'),
  'ilia-skin-tint': d('w', 'ST3 Paloma · ST6 Bom Jardim · ST9 Diaz', { a: true, f: true, t: true }),
  'glossier-perfecting-tint': d('w', 'G3 · G6 · G9'),
  'hera-black-cushion': d('s', '17C1 Petal Vanilla · 21N1 Vanilla · 23N1 Sand'),
  'svr-sebiaclear-teint': d('w', 'Light · Medium', { a: true, f: true }),
  'caudalie-vinocrush': d('w', '1 · 3 · 5', { f: true }),

  // Correcteurs
  'maybelline-instant-anti-age': d('s', '00 Ivory · 01 Light · 02 Nude'),
  'nyx-bare-with-me-concealer': d('w', '02 Fair · 04 Beige · 06 Tan'),
  'nars-radiant-creamy': d('s', 'Vanilla · Custard · Honey · Caramel', { m: [15, '1,4 ml'] }),
  'tarte-shape-tape': d('s', '12S Fair Sand · 20B Light · 29N Light-Medium'),
  'kosas-revealer-concealer': d('s', '3 · 5.5 · 7', { f: true }),
  'dior-forever-skin-correct': d('s', '1N · 2N · 3WO'),
  'ysl-touche-eclat': d('w', '1 Radiant Luminous Pink · 2 Luminous Ivory'),
  'lagirl-pro-conceal': d('s', 'Porcelain · Natural · Fawn · Orange Corrector'),
  'cledepeau-concealer': d('o', 'Ivory · Ocher · Beige'),
  'kryolan-dermacolor': d('o', 'D1 · D4 · D14 · D30'),

  // Correcteurs couleur
  'nyx-color-correcting-palette': d('s', 'Vert · Jaune · Pêche · Lavande'),
  'catrice-allround-palette': d('s', 'Vert · Jaune · Beige'),
  'erborian-cc-red-correct': d('s', 'Teinte unique (vert → beige)'),
  'avene-couvrance-stick': d('o', 'Vert', { a: true, f: true }),
  'bobbi-corrector': d('o', 'Bisque · Light Peach · Dark Peach'),
  'lagirl-mixing-pigment': d('w', 'Blue · Yellow · White · Purple'),
  'lagirl-corrector': d('s', 'Orange · Green · Peach · Yellow'),

  // Poudres
  'rimmel-stay-matte': d('p', '001 Transparent · 006 Warm Beige', { t: false }),
  'elf-halo-glow-powder': d('p', 'Light · Medium · Deep'),
  'nyx-cant-stop-powder': d('p', 'Light · Medium · Deep'),
  'huda-easy-bake': d('p', 'Pound Cake · Cherry Blossom · Banana Bread', { t: false, m: [20, '4 g'] }),
  'laura-mercier-translucent': d('p', 'Translucent · Medium Deep', { t: false, m: [26, '9,3 g'] }),
  'givenchy-prisme-libre': d('p', '1 Mousseline Pastel · 3 Voile Rosé'),
  'hourglass-ambient': d('p', 'Diffused Light · Dim Light · Luminous Light', { t: true, m: [28, '1,3 g'] }),
  'ct-airbrush-powder': d('p', '1 Fair · 2 Medium'),
  'rcma-no-color': d('p', 'Translucide', { t: true }),
  'canmake-marshmallow': d('p', 'MB Matte Beige Ocher · ML Matte Light Ocher'),
  'onesize-blurring-powder': d('p', 'Translucent · Medium · Deep', { m: [16, '3,5 g'] }),

  // Bronzers & contours
  'elf-putty-bronzer': d('', 'Tan Lines · Bronzed and Beautiful'),
  'essence-sun-club': d('p', '01 Natural · 02 Sunny'),
  'bourjois-delice': d('p', '51 Peaux claires · 52 Peaux mates'),
  'benefit-hoola': d('p', 'Hoola Lite · Hoola · Hoola Caramel', { m: [17, '2,5 g'] }),
  'fenty-sun-stalkr': d('p', 'Private Island · Bikini Tan · Mo Money'),
  'guerlain-terracotta': d('p', '00 Light Cool · 01 Light Warm · 03 Medium Warm'),
  'chanel-soleil-tan': d('o', 'Teinte unique (Soleil Tan Bronze Universel)'),
  'physicians-butter-bronzer': d('p', 'Light Bronzer · Bronzer · Deep Bronzer'),
  'nyx-wonder-stick': d('', '02 Universal · 03 Medium · 05 Deep'),
  'judydoll-contour-3d': d('p', '01 Light · 02 Medium'),
  'revolution-fast-base-contour': d('', 'Light · Medium'),
  'fenty-match-stix': d('', 'Amber · Mocha · Truffle'),
  'ct-contour-wand': d('', 'Fair/Medium · Medium/Dark'),
  'westman-face-trace': d('', 'Biscuit · Cacao'),
  'mbm-softsculpt': d('', 'Light · Medium · Medium Dark'),
  'tomford-shade-illuminate': d('', 'Intensity One · Intensity Two'),

  // Blushs
  'elf-camo-blush': d('', 'Rose Water · Suave Mauve · Peach Perfect'),
  'rare-soft-pinch': d('', 'Hope · Happy · Joy · Grateful', { f: true, m: [16, '3,2 ml'] }),
  'glossier-cloud-paint': d('', 'Puff · Dusk · Beam'),
  'tower28-beachplease': d('', 'Magic Hour · Golden Hour · Rush Hour', { a: true, f: true, t: true }),
  'nars-blush-orgasm': d('p', 'Orgasm · Deep Throat · Torrid', { m: [20, '2,5 g'] }),
  'patrickta-double-take': d('', "She's Blushing · She's That Girl · Not Too Much"),
  'dior-rosy-glow': d('p', '001 Pink · 012 Rosewood'),
  'milani-baked-blush': d('p', 'Luminoso · Berry Amore', { t: false }),
  'canmake-cream-cheek': d('', '05 Sweet Apricot · 14 Apple Cream Red'),
  'fwee-pudding-pot': d('', 'Lie · Sheer Rose · Sunset'),
  'mitchell-blursh': d('', 'Sunset Kisses · Grape Escape'),
  'rhode-pocket-blush': d('', 'Freckle · Sleepy Girl · Piggy'),
  'merit-flush-balm': d('', 'Cheeky · Stamina · Postscript'),
  'hermes-silky-blush': d('p', '23 Rose Tan · 49 Rose Pommette'),

  // Highlighters
  'revolution-highlight-reloaded': d('p', 'Just My Type · Golden Lights'),
  'rare-positive-light': d('', 'Enlighten · Mesmerize · Exhilarate', { f: true }),
  'fenty-killawatt': d('p', 'Trophy Wife · Mean Money · Lightning Dust/Fire Crystal'),
  'saie-glowy-super-gel': d('w', 'Starglow · Sunglow'),
  'westman-lit-up': d('o', 'Lit Up · Pearl'),
  'dior-backstage-glow-palette': d('p', '001 Universal · 004 Rose Gold'),
  'glossier-haloscope': d('o', 'Quartz · Topaz'),
  'wetnwild-megaglo': d('p', 'Precious Petals · Blossom Glow'),
  'nuxe-huile-or': d('o', 'Or (paillettes dorées)'),

  // Sprays
  'nyx-matte-setting-spray': d(''),
  'essence-fix-last': d(''),
  'ud-all-nighter': d('', undefined, { m: [17, '30 ml'] }),
  'mac-fix-plus': d('', 'Original · Rose · Magic Radiance', { m: [15, '30 ml'] }),
  'ct-airbrush-spray': d('', undefined, { m: [22, '34 ml'] }),
  'onesize-on-til-dawn': d('', undefined, { m: [18, '30 ml'] }),
  'loreal-3-second-mist': d(''),
  'milani-make-it-last': d(''),
  'kryolan-fixing-spray': d(''),
  'caudalie-eau-beaute': d('', undefined, { m: [14, '30 ml'] }),

  // Yeux
  'essence-stage-base': d('s', 'Transparent'),
  'ud-primer-potion': d('s', 'Original · Eden · Sin', { m: [12, '4 ml'] }),
  'mac-paint-pot': d('s', 'Painterly · Soft Ochre · Groundwork'),
  'toofaced-shadow-insurance': d('s', 'Transparent'),
  'lauramercier-eye-basics': d('s', 'Linen · Wheat'),
  'revolution-reloaded': d('p', 'Iconic 1.0 · Velvet Rose'),
  'colourpop-palette': d('p', 'Going Coconuts · Sweet Talk'),
  'huda-nude-obsessions': d('p', 'Nude Light · Nude Medium · Nude Rich'),
  'abh-soft-glam': d('p', 'Burnt Orange · Sienna · Rustic'),
  'ct-eyes-to-mesmerise': d('', 'Champagne · Bronze Gold · Oyster Pearl'),
  'nd-biba': d('p', 'Biba All Neutral'),
  'patmcgrath-mothership': d('p', 'Mothership I Subliminal · Mothership V Bronze Seduction'),
  'mbm-master-mattes': d('p', 'Master Mattes (Original)'),
  'juvias-nubian': d('p', 'The Nubian · The Nubian 2'),
  'dasique-shadow': d('p', '02 Milk Latte · 16 Cream Cheese'),
  'tomford-quad': d('p', 'Honeymoon · Cocoa Mirage · Body Heat'),
  'suqqu-signature': d('p', '01 Kogareiro · 02 Sakuraki'),
  'lh-infinity-stick': d('', 'Pure · Champagne · Bronze'),
  'nyx-epic-ink': d('', 'Black · Brown'),
  'catrice-kohl-kajal': d('', '010 Check Chic Black · 040 Optic Brown'),
  'bobbi-gel-liner': d('', 'Black Ink · Espresso Ink'),
  'mufe-aqua-resist': d('', '01 Graphite · 15 Burgundy · 05 Forest'),
  'vb-satin-kajal': d('', 'Cocoa · Bronze · Navy'),
  'dior-onstage-liner': d('', '091 Matte Black · 096 Satin Black'),
  'kvd-tattoo-liner': d('', 'Trooper Black · Mad Mad Brown'),
  'heroine-liner': d('', '01 Jet Black · 02 Brown Black'),
  'maybelline-sky-high': d('', 'Very Black · Cosmic Black'),
  'essence-lash-princess': d('', 'Noir'),
  'lancome-lash-idole': d('', '01 Glossy Black', { m: [17, '2,5 ml'] }),
  'clinique-lash-power': d('', '01 Black Onyx', { a: true, f: true }),
  'ysl-lash-clash': d('', '01 Extreme Black'),
  'milk-kush': d('', 'Kush Black'),
  'dior-iconic-overcurl': d('', '090 Black · 694 Brown'),
  'toofaced-better-than-sex': d('', 'Black', { m: [14, '4,8 g'] }),
  'heroine-mascara': d('', '01 Super Black · 02 Brown Black'),
  'sensai-38': d('', '01 Black', { f: true }),
  'maxfactor-2000': d('', 'Black · Black Brown'),
  'yr-volume-vertige': d('', 'Noir'),
  'ardell-wispies': d('', 'Demi Wispies · Wispies 113'),
  'essence-light-feather': d('', '01 Light Up Your Life'),
  'duo-lash-glue': d('', 'Clear · Dark Tone'),
  'huda-classic-lashes': d('', 'Giselle · Samantha'),
  'huda-faux-mink': d('', 'Scarlett · Farah'),

  // Sourcils
  'nyx-micro-brow': d('', 'Taupe · Ash Brown · Espresso'),
  'essence-microprecise': d('', '02 Light Brown · 03 Dark Brown'),
  'benefit-precisely': d('', '2.5 Neutral Blonde · 3.5 Neutral Medium Brown · 4 Warm Deep Brown', { m: [17, '0,04 g'] }),
  'abh-brow-wiz': d('', 'Taupe · Soft Brown · Medium Brown'),
  'benefit-microfilling-pen': d('', 'Light Brown · Medium Brown · Deep Brown'),
  'dior-brow-styler': d('', '01 Blond · 02 Chestnut · 03 Brown'),
  'etude-drawing-brow': d('', '03 Brown · 05 Grey Brown'),
  'refy-brow-pencil': d('', 'Taupe · Mid Brown · Dark Brown'),
  'maybelline-tattoo-brow-pomade': d('', 'Soft Brown · Medium Brown'),
  'revolution-brow-pomade': d('', 'Soft Brown · Dark Brown'),
  'abh-dipbrow': d('', 'Taupe · Soft Brown · Medium Brown · Ebony'),
  'benefit-ka-brow': d('', '3 · 3.5 · 4'),
  'milani-stay-put-brow': d('', 'Soft Brown · Brunette'),
  'nyx-brow-glue': d('', 'Transparent'),
  'essence-make-me-brow': d('', '02 Browny Brows · 04 Ashy Brows'),
  'benefit-gimme-brow': d('', '3 Warm Light Brown · 3.5 Neutral Medium Brown', { m: [17, '1,5 g'] }),
  'abh-brow-freeze': d('', 'Transparent'),
  'glossier-boy-brow': d('', 'Blond · Brown · Black'),
  'chanel-gel-sourcils': d('', 'Transparent · Brun'),
  'refy-brow-sculpt': d('', 'Transparent'),

  // Lèvres
  'nyx-slim-lip-pencil': d('', 'Nude Truffle · Mauve · Espresso · Peekaboo Neutral'),
  'sephora-crayon-levres': d('', '01 Nude Beige · 05 Rose Mauve'),
  'mac-lip-pencil': d('', 'Spice · Whirl · Soar · Stone'),
  'mufe-artist-color-pencil': d('', '604 Anywhere Caffeine · 702 Limitless Taupe'),
  'ct-lip-cheat': d('', 'Pillow Talk · Pillow Talk Medium · Iconic Nude'),
  'mbm-ultra-suede-liner': d('', 'Sandy · Penny · Kim'),
  'loreal-color-riche': d('', '235 Nude · 297 Red Passion'),
  'mac-matte-lipstick': d('', 'Ruby Woo · Velvet Teddy · Mehr', { m: [16, '1,8 g'] }),
  'clinique-black-honey': d('', 'Black Honey', { f: true }),
  'ct-matte-revolution': d('', 'Pillow Talk · Pillow Talk Medium · Walk of No Shame', { m: [19, '1,1 g'] }),
  'lisaeldridge-true-velvet': d('', 'Velvet Ribbon · Velvet Jazz'),
  'ysl-loveshine': d('', '44 Nude Lavallière · 150 Nude Lingerie'),
  'rouge-dior': d('', '999 · 100 Nude Look · 720 Icone'),
  'patmcgrath-mattetrance': d('', 'Elson · Flesh 3'),
  'revlon-super-lustrous': d('', 'Rum Raisin · Toast of New York'),
  'tomford-lip-color': d('', 'Pink Dusk · Cherry Lush · Blush Nude'),
  'prada-monochrome': d('', 'B103 · R01'),
  'valentino-rosso': d('', '203A · 100R'),
  'hermes-rouge': d('', '21 Rose Velours · 64 Rouge Casaque'),
  'maybelline-matte-ink': d('', '65 Seductress · 120 Artist · 20 Pioneer'),
  'maybelline-vinyl-ink': d('', '35 Cheeky · 10 Lippy'),
  'mufe-rouge-artist-matte': d('', '102 Nude Mood · 410 Coral'),
  'huda-liquid-matte': d('', 'Bombshell · Trendsetter'),
  'ysl-tatouage-couture': d('', '216 Nude Emblem · 201 Rouge Tatouage'),
  'maxfactor-lipfinity': d('', '160 Iced · 330 Essential Burgundy'),
  'nabla-dreamy-matte': d('', 'Unconditional · Cherry'),
  'kiko-3d-hydra': d('', '02 Pearly Peach · 05 Pearly Nude'),
  'nyx-fat-oil': d('', 'Missed Call · Newsfeed · Status Update'),
  'fenty-gloss-bomb': d('', 'Fenty Glow · Fu$$y · Hot Chocolit', { f: false, m: [13, '5,5 ml'] }),
  'clarins-lip-comfort-oil': d('o', '01 Honey · 04 Pitaya'),
  'lancome-juicy-tubes': d('', 'Marshmallow Electro · Pink Pong'),
  'dior-lip-glow-oil': d('o', '001 Pink · 012 Rosewood · 020 Mahogany', { f: false }),
  'toofaced-lip-injection': d('', 'Original · Pink Lightning'),
  'romand-juicy-tint': d('', '06 Figfig · 07 Jujube · 25 Bare Grape'),
  'peripera-ink-velvet': d('', '01 Good Brick · 17 Rosy Nude'),
  'glossier-balm-dotcom': d('o', 'Original · Birthday · Cherry'),
  'laneige-lip-sleeping-mask': d('o', 'Berry · Vanilla · Gummy Bear', { m: [12, '8 g'] }),
  'benefit-benetint': d('w', 'Benetint (rouge rosé)'),
  'dior-lip-glow': d('o', '001 Pink · 004 Coral · 012 Rosewood'),
  'rhode-peptide-tint': d('o', 'Toast · Ribbon · Espresso'),
  'summerfridays-lip-butter': d('o', 'Vanilla Beige · Pink Sugar · Iced Coffee'),
  'elf-squeeze-me': d('o', 'Vanilla Frosting · Sweet Cherry'),
  '3ce-velvet-tint': d('', 'Daffodil · Taupe · Best Ever'),
  'amuse-jel-fit': d('', '03 Bonbon · 07 Nudy Mood'),
};

export const detailsOf = (p: Product): ProductDetails => DETAILS[p.id] ?? {};

export const BASE_LABELS: Record<BaseType, string> = {
  silicone: 'Silicone',
  water: 'Eau',
  oil: 'Huile',
  powder: 'Poudre',
};

/** Quantité numérique (ml ou g) du format, si exploitable. */
export function quantity(p: Product): { qty: number; unit: 'ml' | 'g' } | null {
  const m = p.size.match(/^([\d,]+)\s*(ml|g)$/);
  if (!m) return null;
  const qty = parseFloat(m[1].replace(',', '.'));
  return qty ? { qty, unit: m[2] as 'ml' | 'g' } : null;
}

/** Prix réel pour 10 ml / 10 g. */
export function pricePer10(p: Product): { value: number; label: string } | null {
  const q = quantity(p);
  if (!q) return null;
  const value = (p.price / q.qty) * 10;
  return { value, label: `${value.toFixed(2).replace('.', ',')} €/10 ${q.unit}` };
}
