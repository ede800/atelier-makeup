import type { PriceLevel, Product, SkinType, Tier } from './types';
import { PRODUCTS_EXTRA } from './products-extra';

/*
 * Prix indicatifs constatés en France (Sephora, Nocibé, Marionnaud, pharmacies, Monoprix, sites des marques).
 * Scores sur 100 : tenue, pigmentation/fini, confort peau, rapport qualité/prix.
 * Codes peau : g = grasse/mixte, s = sèche, n = normale, x = sensible, m = mature.
 */
const SKIN: Record<string, SkinType> = { g: 'grasse', s: 'seche', n: 'normale', x: 'sensible', m: 'mature' };

function p(
  id: string,
  category: string,
  brand: string,
  name: string,
  price: number,
  size: string,
  tier: Tier,
  sc: [number, number, number, number],
  skin: string,
  finish: string,
  verdict: string,
  podium?: PriceLevel,
): Product {
  return {
    id, category, brand, name, price, size, tier,
    scores: { tenue: sc[0], pigment: sc[1], confort: sc[2], valeur: sc[3] },
    skin: skin.split('').map((c) => SKIN[c]),
    finish, verdict, podium,
  };
}

const BASE_PRODUCTS: Product[] = [
  // ——— BASES LUMINEUSES
  p('embryolisse-lait-creme', 'primer-glow', 'embryolisse', 'Lait-Crème Concentré', 14.9, '75 ml', 'S', [78, 80, 95, 98], 'snxm', 'Rosé lumineux', "La base secrète des backstages depuis 1950 : hydrate, repulpe et fait tenir n'importe quel fond de teint. Imbattable au ml.", 'budget'),
  p('elf-halo-glow', 'primer-glow', 'elf', 'Halo Glow Liquid Filter', 16, '31,5 ml', 'A', [74, 88, 86, 92], 'snm', 'Glow flouté', "Le célèbre dupe du Flawless Filter : seul, en base ou mélangé au teint. 16 teintes."),
  p('loreal-glotion', 'primer-glow', 'loreal', 'Lumi Glotion', 14.5, '40 ml', 'A', [70, 82, 88, 90], 'snm', 'Perlé', "Hydratant enlumineur à la glycérine, plus nacré que le Halo Glow. Superbe sur les peaux sèches."),
  p('toofaced-hangover', 'primer-glow', 'toofaced', 'Hangover Replenishing Face Primer', 36, '40 ml', 'A', [80, 78, 90, 76], 'snxm', 'Rosé frais', "Eau de coco et probiotiques : la base qui réveille une peau fatiguée. Fait tenir le teint 10 h.", 'mid'),
  p('ct-flawless-filter', 'primer-glow', 'ct', 'Hollywood Flawless Filter', 49, '30 ml', 'S', [80, 94, 88, 70], 'snm', 'Glow « filtre photo »', "L'original du genre : flou optique + lumière diffuse, 11 teintes. Le luxe qui a lancé une catégorie.", 'luxe'),
  p('ct-wonderglow', 'primer-glow', 'ct', 'Wonderglow Instant Soft-Focus Primer', 49, '40 ml', 'B', [72, 76, 84, 58], 'snm', 'Nacré doré', "Joli halo doré, mais le Flawless Filter de la même marque fait tout mieux pour le même prix."),

  // ——— BASES FLOUTEUSES
  p('maybelline-baby-skin', 'primer-blur', 'maybelline', 'Baby Skin Instant Pore Eraser', 9.5, '22 ml', 'A', [72, 85, 80, 95], 'gn', 'Mat poudré', "Gel siliconé qui efface les pores en 2 secondes. La version drugstore du POREfessional.", 'budget'),
  p('elf-poreless-putty', 'primer-blur', 'elf', 'Poreless Putty Primer', 11, '21 g', 'B', [70, 78, 76, 84], 'gn', 'Velours', "Texture putty agréable, mais peut boulocher sous les fonds de teint à base d'eau."),
  p('rare-pore-diffusing', 'primer-blur', 'rare', 'Always An Optimist Pore Diffusing Primer', 28, '28 ml', 'S', [82, 88, 88, 82], 'gnx', 'Flou soft-matte', "Le meilleur équilibre floutage/confort : sans silicone lourd, sans parfum, compatible avec tous les teints.", 'mid'),
  p('benefit-porefessional', 'primer-blur', 'benefit', 'The POREfessional Face Primer', 36, '22 ml', 'Surcote', [70, 86, 74, 50], 'gn', 'Mat lissé', "Iconique, mais 36 € pour 22 ml de silicones que Maybelline imite à 95 % pour 9 €."),
  p('hourglass-veil-mineral', 'primer-blur', 'hourglass', 'Veil Mineral Primer SPF 15', 64, '30 ml', 'A', [86, 86, 90, 60], 'gnxm', 'Soie floutée', "Texture soyeuse sans huile, protège et floute avec une élégance rare. Le luxe qui se sent.", 'luxe'),

  // ——— BASES ACCROCHEUSES
  p('elf-power-grip', 'primer-grip', 'elf', 'Power Grip Primer', 11, '24 ml', 'S', [92, 75, 85, 98], 'gsnm', 'Collant invisible', "Le gel accrocheur le plus vendu au monde : niacinamide + acide hyaluronique, tenue spectaculaire.", 'budget'),
  p('nyx-plump-right-back', 'primer-grip', 'nyx', 'Plump Right Back Primer + Serum', 16, '30 ml', 'A', [84, 76, 88, 86], 'snm', 'Repulpé frais', "Sérum-base repulpant à l'acide hyaluronique : un grip plus confortable pour les peaux sèches."),
  p('milk-hydro-grip', 'primer-grip', 'milk', 'Hydro Grip Primer', 38, '45 ml', 'A', [90, 76, 86, 66], 'gsnm', 'Collant hydratant', "Le pionnier des bases grip, vegan et sans silicone. Excellent mais désormais égalé par e.l.f.", 'mid'),
  p('dior-forever-velvet-veil', 'primer-grip', 'dior', 'Dior Forever Velvet Veil', 52, '30 ml', 'A', [90, 82, 88, 58], 'gnm', 'Velours flouté', "Base 24 h qui floute ET accroche : la combinaison parfaite sous Dior Forever Matte.", 'luxe'),

  // ——— FONDS DE TEINT MATS / HAUTE COUVRANCE
  p('loreal-infaillible-32h', 'fdt-mat', 'loreal', 'Infaillible 32H Fresh Wear', 16.9, '30 ml', 'S', [94, 90, 78, 96], 'gn', 'Mat naturel', "Le meilleur fond de teint drugstore d'Europe : tenue béton, SPF 25, 40 teintes. Parfait pour peaux grasses.", 'budget'),
  p('maybelline-superstay-30h', 'fdt-mat', 'maybelline', 'SuperStay 30H Active Wear', 14.9, '30 ml', 'A', [92, 88, 72, 92], 'g', 'Mat', "Couvrance totale et tenue sport, mais peut marquer les ridules et les zones sèches."),
  p('fenty-pro-filtr', 'fdt-mat', 'fenty', "Pro Filt'r Soft Matte Longwear", 38, '32 ml', 'S', [92, 92, 76, 84], 'gn', 'Soft-matte', "50 teintes qui ont changé l'industrie. Le mat le plus flatteur sur les peaux grasses et foncées.", 'mid'),
  p('estee-double-wear', 'fdt-mat', 'estee', 'Double Wear Stay-in-Place SPF 10', 49, '30 ml', 'S', [98, 94, 70, 78], 'g', 'Mat velours', "LA référence mondiale de la tenue depuis 1997. Oxyde un peu : prenez une demi-teinte plus claire.", 'luxe'),
  p('dior-forever-matte', 'fdt-mat', 'dior', 'Dior Forever Fond de Teint Mat 24h', 57, '30 ml', 'A', [94, 90, 80, 66], 'gnm', 'Mat lumineux', "Un mat qui ne fait jamais plâtré, enrichi en soin floral. Somptueux, mais cher au ml."),
  p('vichy-dermablend', 'fdt-mat', 'vichy', 'Dermablend Fond de Teint Correcteur 16h', 25, '30 ml', 'A', [92, 96, 82, 88], 'gx', 'Mat', "Couvrance médicale (cicatrices, vitiligo, rosacée), testé sous contrôle dermatologique. Le choix pharmacie."),
  p('lrp-toleriane-teint', 'fdt-mat', 'lrp', 'Tolériane Teint Correcteur Fluide', 22, '30 ml', 'B', [78, 80, 90, 80], 'gx', 'Semi-mat', "Formule minimaliste pour peaux intolérantes. Moins de teintes, mais zéro réaction."),
  p('huda-fauxfilter', 'fdt-mat', 'huda', '#FauxFilter Luminous Matte', 42, '35 ml', 'Surcote', [86, 92, 64, 62], 'g', 'Mat masque', "Couvrance impressionnante mais lourde, dessèche et marque les pores. Fenty fait mieux pour moins cher."),

  // ——— FONDS DE TEINT LUMINEUX
  p('loreal-accord-parfait', 'fdt-lumineux', 'loreal', 'Accord Parfait Fond de Teint Fluide', 14.9, '30 ml', 'S', [74, 80, 90, 96], 'snm', 'Satiné naturel', "Le best-seller de France : acide hyaluronique, sous-tons N/R/D bien pensés. Seconde peau parfaite.", 'budget'),
  p('hauslabs-triclone', 'fdt-lumineux', 'hauslabs', 'Triclone Skin Tech Medium Coverage', 44, '30 ml', 'S', [86, 88, 90, 80], 'gsnxm', 'Satin peau', "Fermenté d'arnica, sans parfum, 51 teintes : l'équilibre idéal couvrance/soin/tenue de la nouvelle génération.", 'mid'),
  p('armani-luminous-silk', 'fdt-lumineux', 'armani', 'Luminous Silk Foundation', 63, '30 ml', 'S', [82, 90, 94, 72], 'snm', 'Soie lumineuse', "LA référence mondiale des maquilleurs depuis 2000 : texture de soie, invisible en photo, sublime sur peau mature.", 'luxe'),
  p('nars-light-reflecting', 'fdt-lumineux', 'nars', 'Light Reflecting Foundation', 52, '30 ml', 'A', [82, 86, 90, 70], 'snm', 'Lumineux floutant', "Couvrance modulable, cristaux photochromiques qui adaptent l'éclat à la lumière. 36 teintes."),
  p('ct-beautiful-skin', 'fdt-lumineux', 'ct', 'Beautiful Skin Foundation', 49, '30 ml', 'A', [76, 82, 92, 70], 'snm', 'Glow naturel', "Idéal sur peau sèche et mature, effet bonne mine. Tenue moyenne sur zone T grasse."),
  p('toofaced-born-this-way', 'fdt-lumineux', 'toofaced', 'Born This Way Natural Finish', 41, '30 ml', 'B', [80, 84, 82, 74], 'gn', 'Naturel', "Couvrance moyenne à forte, bien pour peaux mixtes, mais la formule commence à dater face à la concurrence."),

  // ——— SKIN TINTS / BB / CC
  p('maybelline-instant-perfector', 'skin-tint', 'maybelline', 'Instant Perfector 4-en-1 Glow', 14.5, '20 ml', 'A', [66, 76, 88, 90], 'snm', 'Glow', "Base, anti-cernes, teint et highlighter en un : le meilleur tout-en-un du drugstore.", 'budget'),
  p('missha-m-perfect-cover', 'skin-tint', 'missha', 'M Perfect Cover BB Cream SPF 42', 15, '50 ml', 'A', [74, 82, 84, 92], 'gn', 'Satiné', "La BB crème coréenne culte : SPF 42, couvrance moyenne, 50 ml. Teintes un peu limitées."),
  p('erborian-cc-creme', 'skin-tint', 'erborian', 'CC Crème Centella Asiatica SPF 25', 42, '45 ml', 'S', [76, 86, 90, 82], 'snxm', 'Glow adaptatif', "Les microcapsules changent de couleur au contact de la peau : unifie tous les teints clairs à moyens. Un classique absolu.", 'mid'),
  p('erborian-bb-creme', 'skin-tint', 'erborian', 'BB Crème au Ginseng SPF 20', 39, '45 ml', 'A', [80, 88, 82, 80], 'gn', 'Mat velouté', "Plus couvrante et plus mate que la CC : la BB des peaux mixtes depuis 2012."),
  p('tirtir-mask-fit-red', 'skin-tint', 'tirtir', 'Mask Fit Red Cushion SPF 40', 24, '18 g', 'A', [86, 88, 82, 84], 'gn', 'Semi-mat', "Le cushion viral coréen : couvrance forte en tapotant, tenue étonnante, 40 teintes."),
  p('typology-teint-serum', 'skin-tint', 'typology', 'Sérum Teinté Éclat', 24, '30 ml', 'A', [64, 70, 92, 84], 'snxm', 'Peau nue', "Formule clean française à 98 % d'origine naturelle (squalane, aloe vera). Couvrance très légère."),
  p('clio-kill-cover', 'skin-tint', 'clio', 'Kill Cover Founwear Cushion', 28, '15 g', 'B', [88, 86, 70, 76], 'g', 'Mat', "Excellente tenue, mais finit sec sur les peaux normales à sèches."),
  p('chanel-eau-de-teint', 'skin-tint', 'chanel', 'Les Beiges Eau de Teint', 60, '30 ml', 'A', [66, 78, 94, 58], 'snm', 'Lumière d\'été', "Micro-perles de pigments en suspension : le teint « je ne suis pas maquillée » le plus luxueux qui soit.", 'luxe'),
  p('ilia-skin-tint', 'skin-tint', 'ilia', 'Super Serum Skin Tint SPF 40', 48, '30 ml', 'A', [68, 76, 92, 66], 'snxm', 'Rosé naturel', "Clean beauty, SPF minéral 40 et niacinamide. Sublime, mais le SPF minéral peut griser les peaux foncées."),
  p('glossier-perfecting-tint', 'skin-tint', 'glossier', 'Perfecting Skin Tint', 26, '30 ml', 'Surcote', [52, 50, 88, 58], 'n', 'Transparent', "Quasiment aucune couvrance : un hydratant teinté au prix d'un vrai produit de teint."),

  // ——— CORRECTEURS
  p('maybelline-instant-anti-age', 'concealer', 'maybelline', "Instant Anti-Âge L'Effaceur", 11.9, '6,8 ml', 'S', [82, 86, 84, 96], 'gsnm', 'Naturel', "Applicateur éponge iconique, couvrance modulable : l'anti-cernes le plus vendu au monde, à raison.", 'budget'),
  p('nyx-bare-with-me-concealer', 'concealer', 'nyx', 'Bare With Me Concealer Serum', 12, '9,6 ml', 'A', [72, 74, 92, 92], 'snxm', 'Lumineux', "Sérum anti-cernes (camomille, chanvre) qui ne craquelle jamais : parfait pour le contour de l'œil sec."),
  p('nars-radiant-creamy', 'concealer', 'nars', 'Radiant Creamy Concealer', 34, '6 ml', 'S', [86, 94, 86, 76], 'gsnm', 'Satiné', "La référence des maquilleurs : crémeux, couvrant et lumineux à la fois. 30 teintes.", 'mid'),
  p('tarte-shape-tape', 'concealer', 'tarte', 'Shape Tape Contour Concealer', 32, '10 ml', 'A', [92, 96, 68, 78], 'gn', 'Mat', "Couvrance totale pour les imperfections. Trop sec sous les yeux matures : réservez-le aux boutons."),
  p('kosas-revealer-concealer', 'concealer', 'kosas', 'Revealer Super Creamy + Brightening Concealer', 32, '6 ml', 'A', [78, 82, 92, 74], 'snxm', 'Lumineux crémeux', "Peptides, caféine et acide hyaluronique : le correcteur-soin qui ne marque jamais les ridules."),
  p('dior-forever-skin-correct', 'concealer', 'dior', 'Dior Forever Skin Correct', 40, '11 ml', 'S', [92, 94, 88, 80], 'gsnm', 'Crème naturel', "11 ml (presque le double de NARS), 24 h de tenue, correcteur ET anti-cernes. Le meilleur luxe au ml.", 'luxe'),
  p('ysl-touche-eclat', 'concealer', 'ysl', 'Touche Éclat Le Stylo', 42, '2,5 ml', 'Surcote', [60, 40, 88, 40], 'snm', 'Lumière', "Une icône… d'enlumineur, pas d'anti-cernes : il ne couvre rien. 2,5 ml à 42 €."),

  // ——— CORRECTEURS DE COULEUR
  p('nyx-color-correcting-palette', 'color-corrector', 'nyx', 'Color Correcting Palette', 13, '9 g', 'A', [74, 84, 76, 90], 'gsn', 'Crème', "6 correcteurs (vert, jaune, pêche, lavande…) : la palette parfaite pour apprendre.", 'budget'),
  p('catrice-allround-palette', 'color-corrector', 'catrice', 'Allround Concealer Palette', 5.5, '6 g', 'B', [64, 72, 70, 88], 'gn', 'Crème', "Fonctionnelle et ultra-abordable, mais texture plus sèche, à travailler au doigt."),
  p('erborian-cc-red-correct', 'color-corrector', 'erborian', 'CC Red Correct SPF 25', 39, '45 ml', 'S', [78, 86, 92, 82], 'nxs', 'Neutre', "Crème verte qui devient beige au contact de la peau : neutralise les rougeurs et la rosacée sur tout le visage.", 'mid'),
  p('avene-couvrance-stick', 'color-corrector', 'avene', 'Couvrance Stick Correcteur Vert', 18, '3 g', 'A', [76, 82, 88, 84], 'xg', 'Mat', "Le vert de pharmacie pour les rougeurs localisées et les boutons enflammés. Testé sur peaux sensibles."),
  p('bobbi-corrector', 'color-corrector', 'bobbi', 'Corrector (Peach / Bisque)', 40, '1,4 g', 'S', [84, 92, 86, 66], 'snm', 'Crème', "Le correcteur pêche original : neutralise les cernes bleutés les plus profonds sans masque.", 'luxe'),

  // ——— POUDRES
  p('rimmel-stay-matte', 'powder', 'rimmel', 'Stay Matte Pressed Powder', 7, '14 g', 'A', [74, 78, 76, 96], 'g', 'Mat', "La poudre compacte des sacs à main depuis 20 ans : contrôle les brillances pour 7 €.", 'budget'),
  p('elf-halo-glow-powder', 'powder', 'elf', 'Halo Glow Setting Powder', 9, '6,5 g', 'A', [70, 82, 84, 90], 'snm', 'Flou lumineux', "Une poudre qui fixe sans matifier : rendu velouté, idéal pour les peaux sèches."),
  p('nyx-cant-stop-powder', 'powder', 'nyx', "Can't Stop Won't Stop Setting Powder", 12, '6 g', 'B', [80, 76, 72, 86], 'g', 'Mat', "Excellente tenue et baking efficace, mais légèrement blanchissante au flash."),
  p('huda-easy-bake', 'powder', 'huda', 'Easy Bake Loose Baking & Setting Powder', 39, '20 g', 'S', [94, 90, 80, 82], 'gn', 'Mat flouté', "La reine absolue du baking : texture ultra-fine, 7 teintes dont « Pound Cake » et « Cherry Blossom Cake ».", 'mid'),
  p('laura-mercier-translucent', 'powder', 'lauramercier', 'Translucent Loose Setting Powder', 46, '29 g', 'S', [90, 88, 86, 74], 'gsnm', 'Flou naturel', "La référence historique des maquilleurs : invisible, sans flashback, 29 g qui durent un an.", 'luxe'),
  p('givenchy-prisme-libre', 'powder', 'givenchy', 'Prisme Libre Poudre Libre 4 Couleurs', 55, '4 × 3 g', 'A', [80, 84, 90, 62], 'snm', 'Satiné', "Quatre poudres colorées qui corrigent et illuminent : la poudre « couture » des peaux sèches et matures."),
  p('hourglass-ambient', 'powder', 'hourglass', 'Ambient Lighting Powder', 58, '10 g', 'A', [76, 88, 90, 60], 'snm', 'Lumière diffuse', "Une poudre de finition « filtre de lumière » unique au monde. Ne fixe pas : elle sublime."),
  p('ct-airbrush-powder', 'powder', 'ct', 'Airbrush Flawless Finish', 49, '8 g', 'Surcote', [78, 82, 80, 48], 'gn', 'Mat flouté', "Joli rendu, mais 8 g pour 49 € : six fois plus cher au gramme que Laura Mercier."),

  // ——— BRONZERS
  p('elf-putty-bronzer', 'bronzer', 'elf', 'Putty Bronzer', 8, '10 g', 'A', [76, 82, 84, 96], 'gn', 'Satiné', "Texture poudre-crème qui fond sur la peau : le bronzer drugstore le plus naturel.", 'budget'),
  p('essence-sun-club', 'bronzer', 'essence', 'Sun Club Matt Bronzing Powder', 4.5, '15 g', 'B', [68, 72, 74, 92], 'gn', 'Mat', "Basique mais honnête à moins de 5 € ; peut virer orangé sur peau très claire."),
  p('bourjois-delice', 'bronzer', 'bourjois', 'Délice de Poudre Bronzante', 13, '18 g', 'A', [70, 76, 82, 90], 'snm', 'Satiné parfumé chocolat', "Le classique français au parfum de chocolat : bonne mine instantanée, rendu chaud et lumineux."),
  p('benefit-hoola', 'bronzer', 'benefit', 'Hoola Matte Bronzer', 36, '8 g', 'A', [84, 86, 84, 70], 'gn', 'Mat', "Le bronzer mat iconique sans éclat orangé, avec son pinceau-kabuki. 6 teintes.", 'mid'),
  p('fenty-sun-stalkr', 'bronzer', 'fenty', "Sun Stalk'r Instant Warmth Bronzer", 34, '6,23 g', 'B', [82, 84, 82, 68], 'gn', 'Satiné', "Teintes superbes pour les peaux mates à foncées, moins flatteuses sur peaux claires."),
  p('guerlain-terracotta', 'bronzer', 'guerlain', 'Terracotta Poudre Bronzante', 54, '10 g', 'S', [86, 90, 90, 72], 'gsnm', 'Naturel', "La première poudre soleil de l'histoire (1984). 96 % d'origine naturelle, teintes les plus réalistes du marché.", 'luxe'),
  p('chanel-soleil-tan', 'bronzer', 'chanel', 'Les Beiges Healthy Glow Bronzing Cream', 55, '30 g', 'A', [80, 84, 92, 66], 'snm', 'Crème lumineuse', "La crème bronzante fétiche des maquilleurs (ex-Soleil Tan) : se pose aux doigts, effet bonne mine invisible."),

  // ——— CONTOURS
  p('nyx-wonder-stick', 'contour', 'nyx', 'Wonder Stick', 14, '8 g', 'A', [80, 82, 74, 90], 'gn', 'Crème', "Double stick contour/highlight ; le côté contour, froid et estompable, est le vrai trésor.", 'budget'),
  p('judydoll-contour-3d', 'contour', 'judydoll', 'Contour Palette 3D', 10, '6 g', 'A', [76, 84, 80, 94], 'gn', 'Mat gris-taupe', "Teintes parfaitement froides, sans orange : le secret du contour coréen « ombre naturelle »."),
  p('revolution-fast-base-contour', 'contour', 'revolution', 'Fast Base Contour Stick', 7, '6,2 g', 'B', [70, 74, 72, 88], 'gn', 'Crème', "Correct pour débuter, mais les teintes tirent légèrement vers le chaud."),
  p('fenty-match-stix', 'contour', 'fenty', 'Match Stix Matte Skinstick', 30, '7,1 g', 'S', [86, 88, 84, 80], 'gsn', 'Mat crème', "Le stick contour de référence, 30+ teintes, estompable 2 minutes puis ne bouge plus.", 'mid'),
  p('ct-contour-wand', 'contour', 'ct', 'Hollywood Contour Wand', 39, '12 ml', 'A', [74, 80, 86, 70], 'snm', 'Satiné', "Applicateur coussin génial pour les débutantes, teintes un peu limitées (2)."),
  p('westman-face-trace', 'contour', 'westman', 'Face Trace Contour Stick', 60, '6,5 g', 'S', [84, 90, 92, 62], 'snm', 'Crème peau', "Le contour de Gucci Westman : texture fondante qui imite une vraie ombre, sublime sur peau mature.", 'luxe'),

  // ——— BLUSHS
  p('elf-camo-blush', 'blush', 'elf', 'Camo Liquid Blush', 8, '4 ml', 'A', [84, 92, 80, 96], 'gsn', 'Mat naturel', "Le dupe du Soft Pinch : ultra-pigmenté, une goutte suffit pour les deux joues.", 'budget'),
  p('rare-soft-pinch', 'blush', 'rare', 'Soft Pinch Liquid Blush', 25, '7,5 ml', 'S', [88, 96, 86, 88], 'gsnm', 'Mat ou dewy', "Le blush le plus vendu de la décennie : un point par joue, tenue toute la journée. Teintes « Hope » et « Joy » cultes.", 'mid'),
  p('glossier-cloud-paint', 'blush', 'glossier', 'Cloud Paint', 22, '10 ml', 'A', [72, 80, 92, 78], 'snm', 'Gel transparent', "Gel-crème aérien qui donne un vrai rose de joues « sortie de froid ». Le plus naturel du marché."),
  p('tower28-beachplease', 'blush', 'tower28', 'BeachPlease Cream Blush', 24, '4,5 g', 'A', [76, 82, 90, 76], 'snxm', 'Crème lumineux', "Formulé pour peaux eczémateuses (agréé National Eczema Association). Joues et lèvres."),
  p('nars-blush-orgasm', 'blush', 'nars', 'Blush Orgasm', 35, '4,8 g', 'B', [82, 80, 84, 66], 'gn', 'Nacré pêche', "Une teinte de légende, mais les nacres dorées ne flattent pas tout le monde et la formule poudre a vieilli."),
  p('patrickta-double-take', 'blush', 'patrickta', 'Major Headlines Double-Take Crème & Powder Blush', 42, '8 g', 'S', [92, 94, 88, 72], 'gsnm', 'Crème + poudre', "Le duo crème + poudre assorti : la technique pro du double blush dans un seul boîtier.", 'luxe'),
  p('dior-rosy-glow', 'blush', 'dior', 'Backstage Rosy Glow Blush', 42, '4,4 g', 'Surcote', [78, 70, 86, 56], 'gn', 'Satiné', "Le rose « qui réagit au pH » donne en réalité le même rose à tout le monde. Joli, pas magique."),

  // ——— HIGHLIGHTERS
  p('revolution-highlight-reloaded', 'highlighter', 'revolution', 'Highlight Reloaded', 6, '10 g', 'A', [76, 88, 74, 94], 'snm', 'Métallique', "Reflets intenses façon prestige pour 6 €. Choisissez « Just My Type » pour un rendu plus doux.", 'budget'),
  p('rare-positive-light', 'highlighter', 'rare', 'Positive Light Liquid Luminizer', 25, '15 ml', 'S', [80, 90, 90, 86], 'gsnm', 'Perlé lumineux', "Un liquide qui donne un glow « de l'intérieur », sans paillette visible. Se mélange au teint.", 'mid'),
  p('fenty-killawatt', 'highlighter', 'fenty', "Killawatt Freestyle Highlighter", 38, '8 g', 'A', [84, 94, 78, 66], 'gn', 'Métallique', "Le highlighter « qui se voit de la Lune ». Spectaculaire en soirée, trop intense le jour."),
  p('saie-glowy-super-gel', 'highlighter', 'saie', 'Glowy Super Gel', 32, '30 ml', 'A', [72, 82, 92, 76], 'snxm', 'Gel lumineux', "Gel enlumineur à mélanger au teint ou poser sur les pommettes : rendu peau mouillée naturel."),
  p('westman-lit-up', 'highlighter', 'westman', 'Lit Up Highlight Stick', 60, '6,5 g', 'A', [74, 84, 92, 60], 'snm', 'Baume mouillé', "Baume effet mouillé d'une finesse incroyable, sans aucune paillette. Parfait sur peau mature."),
  p('dior-backstage-glow-palette', 'highlighter', 'dior', 'Backstage Glow Face Palette', 49, '10 g', 'S', [86, 92, 86, 74], 'gsnm', 'Lumière modulable', "4 teintes pour enluminer, bronzer et éclairer. La palette la plus polyvalente du luxe.", 'luxe'),
  p('glossier-haloscope', 'highlighter', 'glossier', 'Haloscope', 26, '5,5 g', 'Surcote', [58, 66, 84, 56], 'snm', 'Baume', "Joli rendu humide, mais glisse en 2 h et petit format. Westman ou Saie font beaucoup mieux."),

  // ——— SPRAYS FIXATEURS
  p('nyx-matte-setting-spray', 'setting-spray', 'nyx', 'Matte Finish Setting Spray', 12, '60 ml', 'A', [82, 76, 78, 90], 'g', 'Mat', "Le classique drugstore pour fixer et matifier. Format long-lasting aussi disponible.", 'budget'),
  p('essence-fix-last', 'setting-spray', 'essence', 'Fix & Last 18h Make-up Fixing Spray', 5, '50 ml', 'B', [72, 70, 80, 92], 'gn', 'Naturel', "Efficace pour le prix, mais brumisation moins fine (risque de gouttes)."),
  p('ud-all-nighter', 'setting-spray', 'ud', 'All Nighter Setting Spray', 36, '118 ml', 'S', [96, 80, 82, 82], 'gn', 'Naturel', "Le setting spray de référence : technologie « température control », 16 h de tenue garantie.", 'mid'),
  p('mac-fix-plus', 'setting-spray', 'mac', 'Prep + Prime Fix+', 31, '100 ml', 'A', [78, 88, 92, 78], 'snm', 'Fusionnant', "LE fixing spray : il fait disparaître l'effet poudré et rend la peau réelle. À utiliser aussi pour humidifier les fards."),
  p('ct-airbrush-spray', 'setting-spray', 'ct', 'Airbrush Flawless Setting Spray', 40, '100 ml', 'A', [90, 84, 86, 66], 'gsnm', 'Naturel', "Brumisation ultra-fine, tenue 16 h, rendu jamais collant. Le setting spray le plus agréable du luxe.", 'luxe'),

  // ——— BASES À PAUPIÈRES
  p('essence-stage-base', 'eye-primer', 'essence', 'I ♥ Stage Eyeshadow Base', 4, '4 ml', 'S', [88, 76, 80, 98], 'gsn', 'Mat transparent', "La base à 4 € qui égale les bases à 25 € : les fards ne bougent plus jusqu'au soir.", 'budget'),
  p('ud-primer-potion', 'eye-primer', 'ud', 'Eyeshadow Primer Potion', 24, '10 ml', 'S', [94, 82, 82, 80], 'gsnm', 'Transparent', "La base à paupières de référence depuis 2004 : tenue 24 h, plus aucun fard dans le pli.", 'mid'),
  p('mac-paint-pot', 'eye-primer', 'mac', 'Pro Longwear Paint Pot', 27, '5 g', 'A', [88, 86, 76, 76], 'gn', 'Crème teintée', "Base teintée « Painterly » ou « Soft Ochre » : unifie la paupière et sert de fard de jour."),
  p('toofaced-shadow-insurance', 'eye-primer', 'toofaced', 'Shadow Insurance', 24, '10 g', 'B', [84, 76, 78, 70], 'gn', 'Transparent', "Fait le travail, mais n'apporte rien de plus que la Primer Potion ou la base Essence."),
  p('lauramercier-eye-basics', 'eye-primer', 'lauramercier', 'Eye Basics Primer', 34, '5,1 g', 'A', [86, 84, 90, 64], 'snm', 'Crème teintée', "Base crème teintée qui unifie et corrige les paupières veinées, sans jamais sécher. Idéale sur peau mature.", 'luxe'),

  // ——— PALETTES & FARDS
  p('revolution-reloaded', 'palette', 'revolution', 'Reloaded Palette (Iconic 1.0 / Velvet Rose)', 7, '16,5 g', 'A', [72, 84, 72, 96], 'gsn', 'Mats & nacrés', "15 fards pour 7 € : pigmentation surprenante, parfaite pour apprendre sans culpabiliser.", 'budget'),
  p('colourpop-palette', 'palette', 'colourpop', 'Pressed Powder Palette (ex. Going Coconuts)', 17, '9 × 0,8 g', 'B', [74, 86, 70, 82], 'gsn', 'Mats & métalliques', "Teintes tendance et prix doux, mais fards friables et livraison depuis les USA."),
  p('huda-nude-obsessions', 'palette', 'huda', 'Nude Obsessions Palette', 32, '9 × 1,3 g', 'A', [84, 88, 78, 82], 'gsn', 'Nudes', "9 nudes parfaitement agencés (Light/Medium/Rich) pour un regard naturel en 5 minutes.", 'mid'),
  p('abh-soft-glam', 'palette', 'abh', 'Soft Glam Eye Shadow Palette', 52, '14 × 0,7 g', 'A', [86, 90, 80, 74], 'gsn', 'Mats chauds & métalliques', "La palette la plus polyvalente jamais créée : du jour au smoky, 14 fards chauds qui s'estompent tout seuls."),
  p('ct-eyes-to-mesmerise', 'palette', 'ct', 'Eyes to Mesmerise Cream Eyeshadow', 34, '7 ml', 'A', [86, 84, 86, 72], 'gsnm', 'Crème satinée', "Le fard crème le plus simple à poser au doigt : une teinte, 10 secondes, 12 h de tenue."),
  p('nd-biba', 'palette', 'nd', 'Biba All Neutral Palette', 129, '15 fards', 'S', [94, 98, 88, 70], 'gsnm', 'Mats, crème-poudre, métalliques', "Les meilleures formules de fards au monde : mats beurrés, métalliques crème-poudre. Un investissement pour 5 ans.", 'luxe'),
  p('patmcgrath-mothership', 'palette', 'patmcgrath', 'Mothership Palette', 135, '10 fards', 'Surcote', [88, 96, 84, 50], 'gsn', 'Couture', "Des formules exceptionnelles, mais un prix et un packaging démesurés pour 10 fards."),

  // ——— EYELINERS
  p('nyx-epic-ink', 'eyeliner', 'nyx', 'Epic Ink Liner', 12, '1 ml', 'S', [92, 92, 82, 94], 'gsnm', 'Noir intense', "Pointe pinceau souple, noir pur, waterproof : il rivalise avec tous les feutres de luxe.", 'budget'),
  p('catrice-kohl-kajal', 'eyeliner', 'catrice', 'Kohl Kajal Waterproof', 3.5, '0,78 g', 'B', [70, 80, 80, 92], 'gsn', 'Crémeux', "Glisse bien sur la muqueuse, mais ne tient que 4 h sur l'œil larmoyant."),
  p('bobbi-gel-liner', 'eyeliner', 'bobbi', 'Long-Wear Gel Eyeliner', 32, '3 g', 'A', [92, 92, 80, 76], 'gsn', 'Gel', "Le gel en pot de référence : une précision au pinceau inégalée pour le trait graphique.", 'mid'),
  p('mufe-aqua-resist', 'eyeliner', 'mufe', 'Aqua Resist Color Pencil', 22, '0,5 g', 'A', [90, 90, 84, 76], 'gsn', 'Crémeux waterproof', "Crayon waterproof crémeux, 15 h de tenue, sublimes teintes couleurs (bordeaux, kaki, bronze)."),
  p('vb-satin-kajal', 'eyeliner', 'vb', 'Satin Kajal Liner', 28, '1,1 g', 'S', [90, 90, 92, 72], 'gsnm', 'Satin', "Le khôl de muqueuse le plus confortable du monde : ne pique pas, ne file pas, teintes « Cocoa » et « Bronze » cultes.", 'luxe'),
  p('dior-onstage-liner', 'eyeliner', 'dior', 'Diorshow On Stage Liner', 35, '0,55 ml', 'Surcote', [86, 88, 84, 54], 'gsn', 'Mat', "Bon feutre, mais rien que le NYX Epic Ink ne fasse pas pour trois fois moins cher."),

  // ——— MASCARAS
  p('maybelline-sky-high', 'mascara', 'maybelline', 'Lash Sensational Sky High', 14, '7,2 ml', 'S', [88, 88, 86, 96], 'gsnxm', 'Longueur', "Le mascara le plus vendu au monde : brosse flexible, longueur spectaculaire, aucun paquet.", 'budget'),
  p('essence-lash-princess', 'mascara', 'essence', 'Lash Princess False Lash Effect', 5, '12 ml', 'A', [80, 88, 80, 98], 'gsn', 'Volume', "Le dupe absolu du Better Than Sex, à 5 € : volume faux-cils et noir intense."),
  p('lancome-lash-idole', 'mascara', 'lancome', 'Lash Idôle Lash-Lifting Mascara', 34, '8 ml', 'S', [88, 90, 90, 80], 'gsnm', 'Courbure & longueur', "Brosse courbée qui lifte les cils droits asiatiques ou tombants comme aucun autre.", 'mid'),
  p('clinique-lash-power', 'mascara', 'clinique', 'Lash Power Long-Wearing Mascara', 28, '6 ml', 'A', [94, 76, 92, 78], 'gxm', 'Tubing longueur', "Formule tubing ophtalmologiquement testée : ne coule pas, s'enlève à l'eau tiède. Le must des yeux sensibles."),
  p('ysl-lash-clash', 'mascara', 'ysl', 'Lash Clash Extreme Volume', 37, '9 ml', 'B', [82, 92, 80, 66], 'gsn', 'Volume XXL', "Effet faux-cils réel, mais l'énorme brosse tache facilement la paupière."),
  p('milk-kush', 'mascara', 'milk', 'Kush High Volume Mascara', 28, '10 ml', 'B', [78, 84, 82, 70], 'gsn', 'Volume', "Formule à l'huile de chanvre, bon volume, mais sèche vite dans le tube."),
  p('dior-iconic-overcurl', 'mascara', 'dior', 'Diorshow Iconic Overcurl', 40, '6 g', 'A', [88, 90, 86, 66], 'gsnm', 'Courbure volume', "La courbure 24 h la plus fiable du luxe, avec une brosse fibre qui ne fait aucun paquet.", 'luxe'),
  p('toofaced-better-than-sex', 'mascara', 'toofaced', 'Better Than Sex Mascara', 29, '8 ml', 'Surcote', [62, 88, 72, 54], 'sn', 'Volume', "Volume spectaculaire… pendant 3 heures. Il file et marque la paupière sur la plupart des yeux."),

  // ——— FAUX-CILS
  p('ardell-wispies', 'false-lashes', 'ardell', 'Wispies Demi Wispies', 7, '1 paire', 'S', [86, 90, 84, 96], 'gsnxm', 'Naturel effilé', "Les faux-cils préférés des maquilleurs depuis 1971 : bande souple, rendu « cils naturels en mieux ».", 'budget'),
  p('essence-light-feather', 'false-lashes', 'essence', 'Light as a Feather 3D Faux Mink Lashes', 4.5, '1 paire', 'A', [78, 82, 80, 94], 'gsn', 'Volume', "Bande fine et souple, réutilisable 5 fois. Imbattable pour débuter."),
  p('duo-lash-glue', 'false-lashes', 'duo', 'Quick-Set Striplash Adhesive (Clear)', 9, '7 g', 'S', [94, 80, 80, 92], 'gsnm', 'Colle transparente', "LA colle de référence : sèche transparente en 30 secondes, tient 12 h. Une colle ratée ruine les meilleurs cils."),
  p('huda-classic-lashes', 'false-lashes', 'huda', 'Classic Lash (Giselle / Samantha)', 22, '1 paire', 'A', [84, 88, 80, 72], 'gsn', 'Glamour', "Les cils qui ont fait la gloire de Huda Kattan : réutilisables 10-15 fois, effet glamour assumé.", 'mid'),
  p('huda-faux-mink', 'false-lashes', 'huda', 'Faux Mink Lash (Scarlett)', 29, '1 paire', 'A', [86, 92, 82, 66], 'gsn', 'Volume vaporeux', "Fibres synthétiques ultra-fines effet vison, sans cruauté : le haut de gamme des faux-cils en bande.", 'luxe'),

  // ——— CRAYONS SOURCILS
  p('nyx-micro-brow', 'brow-pencil', 'nyx', 'Micro Brow Pencil', 12, '0,09 g', 'S', [84, 88, 86, 94], 'gsnm', 'Poudré', "Mine de 1,5 mm qui dessine de vrais poils. Le dupe officieux du Precisely My Brow.", 'budget'),
  p('essence-microprecise', 'brow-pencil', 'essence', 'Microprecise Brow Pencil', 4, '0,05 g', 'B', [76, 80, 80, 94], 'gsn', 'Poudré', "Très bien pour 4 €, mais la mine s'épuise en un mois."),
  p('benefit-precisely', 'brow-pencil', 'benefit', 'Precisely, My Brow Pencil', 28, '0,08 g', 'S', [88, 92, 88, 76], 'gsnm', 'Naturel', "Le crayon ultra-fin le plus vendu de la planète. 12 teintes pour une précision poil-à-poil.", 'mid'),
  p('abh-brow-wiz', 'brow-pencil', 'abh', 'Brow Wiz', 27, '0,085 g', 'A', [86, 90, 88, 74], 'gsnm', 'Mat', "L'original des micro-crayons (2010), teintes taupes froides parfaites pour éviter le roux."),
  p('benefit-microfilling-pen', 'brow-pencil', 'benefit', 'Brow Microfilling Pen', 27, '0,8 ml', 'A', [94, 82, 88, 74], 'gsnm', 'Effet microblading', "Feutre à 3 pointes fendues qui imite le microblading. Waterproof 24 h."),
  p('dior-brow-styler', 'brow-pencil', 'dior', 'Diorshow Brow Styler', 34, '0,09 g', 'A', [86, 88, 86, 64], 'gsnm', 'Poudré', "Mine triangulaire ultra-fine, belle tenue. Bon produit, mais aucun avantage réel sur Benefit.", 'luxe'),

  // ——— POMMADES SOURCILS
  p('maybelline-tattoo-brow-pomade', 'brow-pomade', 'maybelline', 'Tattoo Brow 36H Pomade', 12, '4 g', 'A', [90, 86, 80, 92], 'gn', 'Mat', "Tenue waterproof 36 h, texture plus crémeuse que les pommades premium, plus facile pour débuter.", 'budget'),
  p('revolution-brow-pomade', 'brow-pomade', 'revolution', 'Brow Pomade', 6, '2,5 g', 'B', [78, 80, 74, 86], 'gn', 'Mat', "Correct, mais sèche vite dans le pot une fois ouvert."),
  p('abh-dipbrow', 'brow-pomade', 'abh', 'Dipbrow Pomade', 24, '4 g', 'S', [96, 94, 82, 86], 'gsnm', 'Mat', "La pommade qui a inventé les « Instagram brows ». 4 g qui durent 2 ans : la référence absolue.", 'mid'),
  p('benefit-ka-brow', 'brow-pomade', 'benefit', 'Ka-BROW! Cream-Gel', 28, '3 g', 'A', [92, 88, 84, 74], 'gsn', 'Mat', "Pinceau intégré au couvercle, ultra-pratique en voyage. Un peu plus difficile à estomper."),

  // ——— GELS SOURCILS
  p('nyx-brow-glue', 'brow-gel', 'nyx', 'The Brow Glue Instant Brow Styler', 11, '5 g', 'S', [94, 80, 80, 96], 'gsnm', 'Transparent laminé', "La « brow lamination » en 30 secondes : fixe les poils à la verticale toute la journée.", 'budget'),
  p('essence-make-me-brow', 'brow-gel', 'essence', 'Make Me Brow Eyebrow Gel Mascara', 4, '3,8 ml', 'A', [84, 86, 82, 98], 'gsnm', 'Teinté fibreux', "Le célèbre dupe du Gimme Brow+ : fibres densifiantes, même brosse, 7 fois moins cher."),
  p('benefit-gimme-brow', 'brow-gel', 'benefit', 'Gimme Brow+ Volumizing Fiber Gel', 28, '3 g', 'A', [86, 90, 84, 70], 'gsnm', 'Teinté fibreux', "Mini-brosse précise, fibres qui épaississent : le gel teinté de référence.", 'mid'),
  p('abh-brow-freeze', 'brow-gel', 'abh', 'Brow Freeze Styling Wax', 26, '8 g', 'A', [92, 80, 80, 76], 'gsn', 'Cire transparente', "Cire coiffante type savon : effet laminé plus souple et naturel que la colle."),
  p('glossier-boy-brow', 'brow-gel', 'glossier', 'Boy Brow', 20, '3 g', 'B', [72, 80, 86, 70], 'snm', 'Pommade crème', "Effet « sourcils brossés » charmant, mais tient moins bien que ses concurrents."),
  p('chanel-gel-sourcils', 'brow-gel', 'chanel', 'Le Gel Sourcils', 33, '6 g', 'Surcote', [80, 74, 84, 46], 'gsn', 'Transparent', "Un gel correct au prix d'un parfum. Le drugstore fait strictement mieux ici."),

  // ——— CRAYONS LÈVRES
  p('nyx-slim-lip-pencil', 'lip-liner', 'nyx', 'Slim Lip Pencil', 6, '1 g', 'S', [80, 88, 84, 96], 'gsnm', 'Crémeux', "Teintes nudes iconiques (« Nude Truffle », « Mauve », « Espresso ») à 6 €. Le crayon le plus rentable.", 'budget'),
  p('sephora-crayon-levres', 'lip-liner', 'sephora', 'Crayon Lèvres Haute Tenue', 7, '1,2 g', 'A', [84, 84, 80, 92], 'gsn', 'Semi-mat', "Une mine rétractable waterproof, 30 teintes. Excellent pour les maquillages longue tenue."),
  p('mac-lip-pencil', 'lip-liner', 'mac', 'Lip Pencil (Spice / Whirl / Soar)', 22, '1,45 g', 'S', [86, 92, 82, 78], 'gsnm', 'Mat', "« Spice » et « Whirl » : les deux crayons nudes qui ont défini le maquillage des années 2010 à aujourd'hui.", 'mid'),
  p('mufe-artist-color-pencil', 'lip-liner', 'mufe', 'Artist Color Pencil', 22, '1,41 g', 'A', [88, 88, 82, 78], 'gsn', 'Mat', "Multi-usage yeux/lèvres/sourcils, tenue 12 h. Teinte « Anywhere Caffeine » parfaite pour l'overline."),
  p('ct-lip-cheat', 'lip-liner', 'ct', 'Lip Cheat Pillow Talk', 25, '1,2 g', 'A', [86, 90, 88, 72], 'gsnm', 'Velours', "Le nude rosé le plus flatteur au monde, sur tous les teints. Le crayon de luxe par excellence.", 'luxe'),

  // ——— ROUGES À LÈVRES
  p('loreal-color-riche', 'lipstick', 'loreal', 'Color Riche Satin', 12, '4,8 g', 'A', [70, 84, 86, 90], 'gsnm', 'Satiné', "Hydratant, enrichi en huile d'argan, large palette de nudes et de rouges. Le classique drugstore.", 'budget'),
  p('mac-matte-lipstick', 'lipstick', 'mac', 'Matte Lipstick (Ruby Woo / Velvet Teddy)', 25, '3 g', 'S', [86, 94, 72, 80], 'gsn', 'Mat velours', "« Ruby Woo », le rouge bleuté le plus vendu de l'histoire. « Velvet Teddy », le nude des années 2010.", 'mid'),
  p('clinique-black-honey', 'lipstick', 'clinique', 'Almost Lipstick Black Honey', 28, '1,9 g', 'A', [60, 70, 92, 76], 'gsnxm', 'Baume transparent', "La teinte prune transparente qui s'adapte à toutes les carnations. Une légende des années 70 revenue grâce à TikTok."),
  p('ct-matte-revolution', 'lipstick', 'ct', 'Matte Revolution Pillow Talk', 37, '3,5 g', 'A', [80, 88, 86, 70], 'gsnm', 'Mat confort', "Le nude rosé iconique, mat mais jamais desséchant grâce à l'huile d'orchidée."),
  p('lisaeldridge-true-velvet', 'lipstick', 'lisaeldridge', 'True Velvet Lip Colour', 35, '3,5 g', 'A', [82, 92, 90, 72], 'gsnm', 'Velours', "La formule velours conçue par une maquilleuse : fini flouté, confort de baume. « Velvet Ribbon » culte."),
  p('ysl-loveshine', 'lipstick', 'ysl', 'Loveshine Rouge à Lèvres Brillant', 43, '3,2 g', 'A', [62, 82, 94, 62], 'snm', 'Brillant miroir', "60 % d'huiles soins, rendu vinyle lumineux. Superbe confort, tenue limitée."),
  p('rouge-dior', 'lipstick', 'dior', 'Rouge Dior (999)', 47, '3,5 g', 'S', [88, 94, 90, 70], 'gsnm', 'Velours / satin / mat', "Le « 999 », rouge parfait universel, rechargeable. La quintessence du rouge à lèvres couture.", 'luxe'),
  p('patmcgrath-mattetrance', 'lipstick', 'patmcgrath', 'MatteTrance Lipstick', 40, '4 g', 'Surcote', [86, 96, 70, 56], 'gsn', 'Mat intense', "Pigmentation hallucinante, mais sèche et le parfum vanille est très présent."),

  // ——— LIQUIDES SANS TRANSFERT
  p('maybelline-matte-ink', 'liquid-lipstick', 'maybelline', 'SuperStay Matte Ink', 12, '5 ml', 'S', [98, 92, 64, 96], 'gsn', 'Mat', "Indestructible 16 h : repas, baisers, masque. Le meilleur rouge liquide toutes gammes confondues.", 'budget'),
  p('maybelline-vinyl-ink', 'liquid-lipstick', 'maybelline', 'SuperStay Vinyl Ink', 13, '4,2 ml', 'A', [90, 90, 78, 92], 'gsnm', 'Vinyle', "La tenue du Matte Ink avec un fini brillant. Évitez de boire dans les 2 minutes."),
  p('mufe-rouge-artist-matte', 'liquid-lipstick', 'mufe', 'Rouge Artist For Ever Matte', 24, '4,5 ml', 'A', [92, 90, 76, 76], 'gsn', 'Mat', "24 h sans transfert, plus confortable que le Matte Ink grâce à la cire d'abeille.", 'mid'),
  p('huda-liquid-matte', 'liquid-lipstick', 'huda', 'Liquid Matte Ultra-Comfort', 22, '4,2 ml', 'B', [80, 90, 72, 70], 'gsn', 'Mat', "Belle couleur, mais transfère plus que les drugstores. Nudes très populaires."),
  p('ysl-tatouage-couture', 'liquid-lipstick', 'ysl', 'Tatouage Couture Velvet Cream', 39, '6 ml', 'A', [84, 94, 86, 68], 'gsnm', 'Crème velours', "Mousse ultra-légère, pigmentation couture, presque sans transfert. Le luxe confortable.", 'luxe'),

  // ——— GLOSS & HUILES
  p('kiko-3d-hydra', 'gloss-oil', 'kiko', '3D Hydra Lipgloss', 9, '6,5 ml', 'S', [68, 84, 88, 96], 'gsnm', 'Miroir', "Brillance 3D, non collant, odeur vanille : le gloss drugstore qui rivalise avec Fenty.", 'budget'),
  p('nyx-fat-oil', 'gloss-oil', 'nyx', 'Fat Oil Lip Drip', 11, '4,8 ml', 'A', [66, 82, 88, 92], 'gsnm', 'Huile brillante', "Le dupe du Lip Glow Oil : couleur plus présente, applicateur dôme, 0 % collant."),
  p('fenty-gloss-bomb', 'gloss-oil', 'fenty', 'Gloss Bomb Universal Lip Luminizer', 22, '9 ml', 'S', [72, 90, 90, 84], 'gsnm', 'Miroir', "« Fenty Glow », le gloss universel qui flatte toutes les carnations. Parfum pêche-vanille addictif.", 'mid'),
  p('clarins-lip-comfort-oil', 'gloss-oil', 'clarins', 'Lip Comfort Oil', 29, '7 ml', 'A', [64, 76, 96, 76], 'gsnmx', 'Huile soin', "Le soin-huile original (2013) : noisette, jojoba, églantier. Le plus soignant de tous."),
  p('lancome-juicy-tubes', 'gloss-oil', 'lancome', 'Juicy Tubes Original', 22, '15 ml', 'B', [56, 74, 82, 72], 'gsn', 'Brillant', "Nostalgie Y2K garantie, mais texture collante et tenue faible face aux formules modernes."),
  p('dior-lip-glow-oil', 'gloss-oil', 'dior', 'Dior Addict Lip Glow Oil', 42, '6 ml', 'A', [64, 82, 94, 60], 'gsnm', 'Huile brillante', "Huile de cerise, applicateur XXL, packaging couture. Le plaisir de luxe, pas la meilleure tenue.", 'luxe'),
  p('toofaced-lip-injection', 'gloss-oil', 'toofaced', 'Lip Injection Extreme', 28, '4 g', 'Surcote', [60, 70, 50, 56], 'gsn', 'Repulpant', "L'effet repulpant vient d'un piquant intense (capsicum) : ça brûle 10 minutes pour un résultat minime."),

  // ——— BAUMES & ENCRES
  p('romand-juicy-tint', 'lip-balm-tint', 'romand', 'Juicy Lasting Tint', 12, '5,5 g', 'S', [88, 92, 82, 96], 'gsnm', 'Effet mouillé', "L'encre coréenne culte : couleur qui reste même après le repas, finis gelée irrésistibles.", 'budget'),
  p('peripera-ink-velvet', 'lip-balm-tint', 'peripera', 'Ink The Velvet', 10, '4 g', 'A', [86, 90, 76, 94], 'gsn', 'Velours', "Le tint velours qui a lancé l'effet « gradient lips ». Teintes rosées et corail parfaites."),
  p('glossier-balm-dotcom', 'lip-balm-tint', 'glossier', 'Balm Dotcom', 16, '15 ml', 'A', [56, 50, 94, 80], 'gsnxm', 'Baume brillant', "Le baume soin universel (lèvres, cuticules, pommettes). Saveurs « Birthday » et « Cherry » cultes."),
  p('laneige-lip-sleeping-mask', 'lip-balm-tint', 'laneige', 'Lip Sleeping Mask', 22, '20 g', 'A', [70, 60, 96, 80], 'gsnxm', 'Baume épais', "Le masque de nuit qui répare les lèvres en une nuit. Saveur « Berry » iconique.", 'mid'),
  p('benefit-benetint', 'lip-balm-tint', 'benefit', 'Benetint', 22, '6 ml', 'Surcote', [80, 74, 70, 58], 'gn', 'Encre transparente', "Pionnier historique (1977), mais sèche trop vite et laisse des démarcations ; les encres coréennes font bien mieux."),
  p('dior-lip-glow', 'lip-balm-tint', 'dior', 'Dior Addict Lip Glow', 40, '3,2 g', 'A', [62, 70, 94, 62], 'gsnmx', 'Baume teinté', "Baume à la cerise qui ravive la couleur naturelle des lèvres. Le baume teinté de luxe par excellence.", 'luxe'),

  // ——— OUTILS
  p('rt-miracle-sponge', 'tools', 'realtechniques', 'Miracle Complexion Sponge', 8, '1 éponge', 'S', [88, 88, 90, 98], 'gsnxm', 'Teint seconde peau', "Fait 95 % du travail d'un Beautyblender pour un tiers du prix. Côté biseauté parfait pour les ailes du nez.", 'budget'),
  p('beautyblender-original', 'tools', 'beautyblender', 'Beautyblender Original', 22, '1 éponge', 'B', [90, 90, 92, 64], 'gsnxm', 'Teint seconde peau', "L'invention qui a tout changé (2003). Toujours excellente, mais l'écart avec Real Techniques ne justifie plus le prix."),
  p('rt-everyday-essentials', 'tools', 'realtechniques', 'Everyday Essentials Set (5 pinceaux + éponge)', 28, '6 pièces', 'A', [86, 84, 86, 94], 'gsnxm', 'Kit complet', "Le kit de départ parfait : teint, poudre, anti-cernes, blush et éponge pour moins de 30 €."),
  p('sigma-f80', 'tools', 'sigma', 'F80 Flat Kabuki', 30, '1 pinceau', 'S', [90, 92, 88, 84], 'gsnxm', 'Pinceau teint', "Le pinceau de fond de teint le plus vendu au monde : couvrance airbrush en 60 secondes.", 'mid'),
  p('mac-217s', 'tools', 'mac', '217S Blending Brush', 31, '1 pinceau', 'A', [90, 88, 88, 78], 'gsnxm', 'Pinceau yeux', "L'estompeur de paupières de référence de tous les maquilleurs professionnels depuis 30 ans."),
  p('hourglass-vanish-brush', 'tools', 'hourglass', 'Vanish Seamless Finish Foundation Brush', 66, '1 pinceau', 'A', [92, 94, 92, 60], 'gsnxm', 'Pinceau teint', "Fibres taklon ultra-denses et biseautées : le pinceau de teint le plus luxueux, une vraie seconde peau.", 'luxe'),
];

export const PRODUCTS: Product[] = [...BASE_PRODUCTS, ...PRODUCTS_EXTRA];

export const productById = (id: string) => PRODUCTS.find((pr) => pr.id === id);

export const productsByCategory = (cat: string) => PRODUCTS.filter((pr) => pr.category === cat);

export const totalScore = (pr: Product) =>
  Math.round(pr.scores.tenue * 0.3 + pr.scores.pigment * 0.25 + pr.scores.confort * 0.25 + pr.scores.valeur * 0.2);
