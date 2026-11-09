import type { PriceLevel, Product, SkinType, Tier } from './types';

/* 67 références ajoutées (nouvelles marques, K/J-beauty, pro backstage, pigments mélangeurs). Prix indicatifs France. */
const SKIN: Record<string, SkinType> = { g: 'grasse', s: 'seche', n: 'normale', x: 'sensible', m: 'mature' };

function p(
  id: string, category: string, brand: string, name: string, price: number, size: string, tier: Tier,
  sc: [number, number, number, number], skin: string, finish: string, verdict: string, podium?: PriceLevel,
): Product {
  return {
    id, category, brand, name, price, size, tier,
    scores: { tenue: sc[0], pigment: sc[1], confort: sc[2], valeur: sc[3] },
    skin: skin.split('').map((c) => SKIN[c]), finish, verdict, podium,
  };
}

export const PRODUCTS_EXTRA: Product[] = [
  // PRÉPARATION
  p('danessa-yummy-skin', 'primer-blur', 'danessa', 'Yummy Skin Blurring Balm Powder', 41, '8 g', 'A', [84, 88, 84, 72], 'gnm', 'Flou poudré', "Baume qui se transforme en poudre : floute les pores comme un filtre, seul ou sur le teint."),

  // TEINT
  p('revlon-colorstay', 'fdt-mat', 'revlon', 'ColorStay Combination/Oily Skin', 16, '30 ml', 'A', [90, 88, 72, 90], 'g', 'Mat', "Le classique américain longue tenue, avec pompe. Une alternative solide à l'Infaillible."),
  p('maxfactor-facefinity', 'fdt-mat', 'maxfactor', 'Facefinity All Day Flawless 3-en-1', 14, '30 ml', 'B', [84, 82, 74, 86], 'gn', 'Mat naturel', "Base, fond de teint et correcteur, SPF 20. Correct, mais moins de teintes que L'Oréal."),
  p('valentino-very', 'fdt-mat', 'valentino', 'Very Valentino 24H Wear', 52, '25 ml', 'A', [94, 90, 84, 64], 'gnm', 'Semi-mat', "La tenue du Double Wear avec un confort bien supérieur. 25 ml seulement."),
  p('shiseido-synchro', 'fdt-mat', 'shiseido', 'Synchro Skin Self-Refreshing Foundation', 49, '30 ml', 'A', [92, 86, 86, 70], 'gnm', 'Naturel velouté', "Technologie japonaise anti-transpiration : le teint reste net même par 30 °C."),
  p('sisley-phyto-teint', 'fdt-lumineux', 'sisley', 'Phyto-Teint Expert', 75, '30 ml', 'A', [78, 84, 94, 54], 'snm', 'Satiné soin', "Un vrai soin teinté aux extraits de plantes, sublime sur peau mature sèche."),
  p('lamer-soft-fluid', 'fdt-lumineux', 'lamer', 'The Soft Fluid Long Wear Foundation', 95, '30 ml', 'Surcote', [82, 84, 90, 38], 'snm', 'Satiné', "Très beau rendu, mais rien qui justifie 95 € face à Armani ou Haus Labs."),
  p('hera-black-cushion', 'skin-tint', 'hera', 'Black Cushion SPF 34', 44, '15 g', 'A', [86, 86, 82, 74], 'gn', 'Semi-mat', "Le cushion de luxe coréen : couvrance modulable, fini velouté, recharge disponible."),
  p('svr-sebiaclear-teint', 'skin-tint', 'svr', 'Sebiaclear Teint', 18, '30 ml', 'A', [78, 80, 88, 86], 'gx', 'Mat soin', "Gluconolactone + niacinamide : couvre et traite les imperfections. Non comédogène."),
  p('caudalie-vinocrush', 'skin-tint', 'caudalie', 'Vinocrush Skin Tint', 32, '30 ml', 'B', [60, 62, 92, 66], 'snx', 'Peau nue', "Agréable et soignant, mais couvre très peu."),
  p('lagirl-pro-conceal', 'concealer', 'lagirl', 'HD Pro Conceal', 6, '8 g', 'A', [82, 86, 76, 98], 'gn', 'Naturel', "Le correcteur pro à 6 € : couvrance moyenne à forte, 30+ teintes dont des correcteurs couleur."),
  p('cledepeau-concealer', 'concealer', 'cledepeau', 'Concealer SPF 25', 75, '5 g', 'A', [90, 96, 92, 40], 'gsnm', 'Crème seconde peau', "Le correcteur le plus réputé du monde : stick crémeux d'une finesse incroyable. Prix démesuré."),
  p('kryolan-dermacolor', 'concealer', 'kryolan', 'Dermacolor Camouflage Creme', 22, '4 g', 'A', [96, 98, 70, 84], 'g', 'Mat couvrant', "Couvre tatouages, vitiligo et taches de naissance. Se fixe avec la poudre Dermacolor."),
  p('lagirl-mixing-pigment', 'color-corrector', 'lagirl', 'Pro Matte Mixing Pigment (Blue / Yellow / White)', 9, '15 ml', 'A', [80, 94, 80, 96], 'gsn', 'Pigment pur', "Le secret pro pour réparer un fond de teint : bleu contre l'orange, jaune pour réchauffer, blanc pour éclaircir."),
  p('lagirl-corrector', 'color-corrector', 'lagirl', 'HD Pro Conceal Correcteurs (Orange / Green / Peach)', 6, '8 g', 'A', [80, 86, 78, 96], 'gsn', 'Crème', "Les correcteurs couleur à 6 € : l'orange neutralise les cernes foncés des peaux mates."),
  p('rcma-no-color', 'powder', 'rcma', 'No-Color Powder', 22, '85 g', 'A', [86, 82, 82, 92], 'gn', 'Invisible', "La poudre des plateaux de cinéma, sans talc, zéro flashback. 85 g pour des années."),
  p('canmake-marshmallow', 'powder', 'canmake', 'Marshmallow Finish Powder', 12, '10 g', 'A', [76, 84, 86, 90], 'gsn', 'Flou mat', "Le flou japonais culte à 12 € : effet peau de pêche, SPF 26."),
  p('onesize-blurring-powder', 'powder', 'onesize', 'Ultimate Blurring Setting Powder', 35, '15 g', 'A', [92, 84, 78, 74], 'g', 'Mat flouté', "Fixation extrême pour peaux grasses, sans flashback. Moins naturelle que Laura Mercier."),
  p('physicians-butter-bronzer', 'bronzer', 'physicians', 'Butter Bronzer', 17, '11 g', 'S', [84, 86, 88, 92], 'gsnm', 'Satiné', "Beurre de murumuru, parfum tropical, teintes réalistes : un des meilleurs bronzers tous prix confondus."),
  p('mbm-softsculpt', 'contour', 'mbm', 'SoftSculpt Shaping Stick', 30, '7,5 g', 'S', [84, 88, 88, 80], 'gsnm', 'Crème doux', "Le stick contour/bronzer le plus facile à estomper : une seule passe au pinceau suffit."),
  p('tomford-shade-illuminate', 'contour', 'tomford', 'Shade & Illuminate', 78, '12 g', 'A', [82, 86, 90, 50], 'snm', 'Crème duo', "Le duo crème ombre/lumière culte des maquilleurs. Somptueux, mais cher."),
  p('milani-baked-blush', 'blush', 'milani', 'Baked Blush Luminoso', 11, '3,5 g', 'A', [80, 84, 80, 94], 'gsnm', 'Satiné lumineux', "Le blush cuit culte : un pêche doré lumineux qui flatte toutes les carnations."),
  p('canmake-cream-cheek', 'blush', 'canmake', 'Cream Cheek', 8, '2,2 g', 'A', [72, 80, 88, 92], 'snm', 'Crème transparent', "Le blush crème japonais : se fond comme un baume, effet joues naturellement rosées."),
  p('fwee-pudding-pot', 'blush', 'fwee', 'Lip & Cheek Blurry Pudding Pot', 19, '5 g', 'A', [76, 86, 88, 82], 'gsnm', 'Flou poudré', "Texture pudding qui devient poudre : le flou coréen parfait, joues et lèvres."),
  p('mitchell-blursh', 'blush', 'mitchell', 'Blursh', 16, '10 g', 'A', [80, 86, 86, 84], 'gsn', 'Gel-poudre', "Gel qui sèche en fini flouté, ultra-pigmenté. Une goutte pour les deux joues."),
  p('rhode-pocket-blush', 'blush', 'rhode', 'Pocket Blush', 26, '5,3 g', 'B', [70, 76, 86, 66], 'snm', 'Crème lumineux', "Joli stick crème, mais pigmentation légère et prix élevé pour 5 g."),
  p('merit-flush-balm', 'blush', 'merit', 'Flush Balm', 32, '6 g', 'B', [72, 78, 90, 64], 'snm', 'Baume', "Le baume joues minimaliste chic, plus agréable qu'efficace."),
  p('hermes-silky-blush', 'blush', 'hermes', 'Rose Hermès Silky Blush', 80, '6 g', 'B', [78, 76, 88, 40], 'snm', 'Poudre soyeuse', "Un objet magnifique, mais une pigmentation timide pour 80 €."),
  p('wetnwild-megaglo', 'highlighter', 'wetnwild', 'MegaGlo Highlighting Powder', 6, '5,4 g', 'A', [78, 88, 80, 96], 'gsn', 'Métallique', "« Precious Petals » ou « Blossom Glow » : l'éclat d'un highlighter de luxe pour 6 €."),
  p('nuxe-huile-or', 'highlighter', 'nuxe', 'Huile Prodigieuse Or', 34, '100 ml', 'B', [50, 60, 92, 72], 'snm', 'Huile pailletée', "L'astuce des backstages : une goutte sur les pommettes et les jambes. Ne tient pas sur peau grasse."),
  p('onesize-on-til-dawn', 'setting-spray', 'onesize', "On 'Til Dawn Mattifying Waterproof Setting Spray", 36, '100 ml', 'S', [98, 80, 78, 80], 'g', 'Mat waterproof', "Le setting spray le plus résistant du marché : sueur, pluie, nuit blanche."),
  p('loreal-3-second-mist', 'setting-spray', 'loreal', 'Infaillible 3-Second Setting Mist', 13, '75 ml', 'A', [86, 76, 80, 92], 'gn', 'Naturel', "Brumisation ultra-fine, tenue 36 h annoncée : le dupe drugstore du On 'Til Dawn."),
  p('milani-make-it-last', 'setting-spray', 'milani', 'Make It Last Setting Spray', 14, '60 ml', 'A', [86, 76, 80, 88], 'gn', 'Naturel', "Prime et fixe en un geste, un classique américain longue tenue."),
  p('kryolan-fixing-spray', 'setting-spray', 'kryolan', 'Fixing Spray', 17, '100 ml', 'A', [92, 74, 76, 88], 'gn', 'Naturel', "Le fixateur de scène et de cinéma : fixe sans briller, idéal pour les longues journées."),
  p('caudalie-eau-beaute', 'setting-spray', 'caudalie', 'Eau de Beauté', 36, '100 ml', 'B', [62, 70, 90, 66], 'snm', 'Lumineux frais', "Le fixateur-soin lumineux des maquilleurs : réveille et unifie, mais ne fait pas tenir 16 h."),

  // YEUX
  p('mbm-master-mattes', 'palette', 'mbm', 'Master Mattes Palette', 54, '12 × 1,2 g', 'A', [88, 90, 84, 72], 'gsnm', 'Mats', "12 mats parfaits pour sculpter l'œil : la palette de travail des maquilleurs."),
  p('juvias-nubian', 'palette', 'juvias', 'The Nubian Palette', 25, '12 fards', 'A', [86, 94, 78, 88], 'gsn', 'Mats & métalliques', "Pigmentation hors norme, teintes pensées pour sublimer les peaux mates à foncées."),
  p('dasique-shadow', 'palette', 'dasique', 'Shadow Palette (Milk Latte / Cream Cheese)', 22, '9 fards', 'A', [80, 84, 84, 86], 'gsn', 'Pastels & paillettes', "Les harmonies coréennes les plus douces, idéales pour un regard frais."),
  p('tomford-quad', 'palette', 'tomford', 'Eye Color Quad', 90, '6 g', 'A', [88, 92, 86, 52], 'gsnm', 'Satinés', "4 fards au fini satiné couture : « Honeymoon » et « Cocoa Mirage » sont des classiques."),
  p('suqqu-signature', 'palette', 'suqqu', 'Signature Color Eyes', 75, '6,2 g', 'A', [86, 88, 90, 56], 'gsnm', 'Satinés transparents', "Le raffinement japonais : des harmonies subtiles qui ne vieillissent jamais."),
  p('lh-infinity-stick', 'palette', 'lh', 'Infinity Eyeshadow Stick', 24, '1,4 g', 'A', [96, 86, 84, 80], 'gsnm', 'Crème longue tenue', "Stick crème qui ne bouge plus une fois posé : le fard parfait pour paupières grasses."),
  p('kvd-tattoo-liner', 'eyeliner', 'kvd', 'Tattoo Liner', 24, '0,55 ml', 'S', [94, 94, 84, 80], 'gsnm', 'Noir mat', "Pointe pinceau la plus précise du marché, noir intense waterproof."),
  p('heroine-liner', 'eyeliner', 'heroinemake', 'Smooth Liquid Eyeliner Super Keep', 14, '0,4 ml', 'A', [94, 90, 84, 90], 'gsn', 'Noir', "Le liner japonais indestructible : larmes, sueur, rien ne le fait bouger."),
  p('heroine-mascara', 'mascara', 'heroinemake', 'Long & Curl Mascara Super WP', 14, '6 g', 'S', [96, 86, 82, 92], 'gsnm', 'Longueur & courbure', "Le mascara qui tient la courbe des cils raides et asiatiques toute la journée. Se démaquille à l'huile."),
  p('sensai-38', 'mascara', 'sensai', 'Lash Volumiser 38°C', 36, '10 ml', 'A', [92, 86, 92, 72], 'gxm', 'Tubing volume', "Le tubing de luxe : ne coule jamais, s'enlève à l'eau à 38 °C."),
  p('maxfactor-2000', 'mascara', 'maxfactor', '2000 Calorie Dramatic Volume', 12, '9 ml', 'B', [74, 84, 80, 86], 'sn', 'Volume', "Un classique des années 90, toujours correct, mais dépassé par Essence et Maybelline."),
  p('yr-volume-vertige', 'mascara', 'yvesrocher', 'Volume Vertige', 14, '7 ml', 'B', [76, 82, 82, 84], 'gsn', 'Volume', "Bon mascara volume à petit prix, souvent en promotion."),

  // SOURCILS
  p('etude-drawing-brow', 'brow-pencil', 'etude', 'Drawing Eye Brow', 4, '0,25 g', 'A', [76, 82, 84, 98], 'gsn', 'Poudré', "Le crayon coréen culte à 4 €, mine plate à tailler en biseau. Teintes « Grey Brown » parfaites."),
  p('refy-brow-pencil', 'brow-pencil', 'refy', 'Brow Pencil', 19, '0,1 g', 'A', [86, 86, 86, 80], 'gsnm', 'Naturel', "Mine triangulaire + goupillon : précis et naturel."),
  p('milani-stay-put-brow', 'brow-pomade', 'milani', 'Stay Put Brow Color', 12, '2,6 g', 'B', [84, 82, 78, 86], 'gn', 'Mat', "Pommade crème waterproof correcte, plus facile qu'ABH mais moins précise."),
  p('refy-brow-sculpt', 'brow-gel', 'refy', 'Brow Sculpt', 23, '10 ml', 'A', [92, 80, 84, 74], 'gsnm', 'Laminé transparent', "Gel fixant avec brosse et peigne intégrés : l'effet brow lamination pro."),

  // LÈVRES
  p('mbm-ultra-suede-liner', 'lip-liner', 'mbm', 'Ultra Suede Sculpting Lip Pencil', 22, '0,8 g', 'A', [88, 88, 84, 76], 'gsnm', 'Mat suède', "Mine suède qui ne file jamais : les nudes « Sandy » et « Penny » sont parfaits pour l'overline."),
  p('revlon-super-lustrous', 'lipstick', 'revlon', 'Super Lustrous Lipstick', 11, '4,2 g', 'A', [68, 86, 84, 92], 'gsnm', 'Crémeux', "Les teintes iconiques des années 90 (« Rum Raisin », « Toast of New York ») à petit prix."),
  p('tomford-lip-color', 'lipstick', 'tomford', 'Lip Color', 60, '3 g', 'A', [84, 94, 88, 52], 'gsnm', 'Crémeux couture', "« Pink Dusk » et « Cherry Lush » : la richesse crémeuse ultime, dans un étui iconique."),
  p('prada-monochrome', 'lipstick', 'prada', 'Monochrome Lipstick', 48, '3,8 g', 'A', [84, 90, 86, 58], 'gsnm', 'Mat soft', "Formule mate confortable et rechargeable, dans un boîtier triangulaire signature."),
  p('valentino-rosso', 'lipstick', 'valentino', 'Rosso Valentino Lipstick', 48, '3,5 g', 'A', [86, 92, 84, 58], 'gsnm', 'Mat / satin', "Le rouge « 203A » comme manifeste. Rechargeable, très pigmenté."),
  p('hermes-rouge', 'lipstick', 'hermes', 'Rouge Hermès', 72, '3,5 g', 'B', [80, 86, 88, 40], 'gsnm', 'Satiné', "L'objet est sublime, la formule bonne mais pas meilleure que Rouge Dior."),
  p('maxfactor-lipfinity', 'liquid-lipstick', 'maxfactor', 'Lipfinity Lip Colour', 14, '4,2 g', 'A', [96, 88, 72, 90], 'gsn', 'Satiné', "Le duo couleur + baume qui tient 24 h, depuis 2001. Un classique indestructible."),
  p('nabla-dreamy-matte', 'liquid-lipstick', 'nabla', 'Dreamy Matte Liquid Lipstick', 13, '3 ml', 'A', [90, 88, 78, 88], 'gsn', 'Mat', "Mat confortable, sans transfert, teintes mode : la pépite indie italienne."),
  p('rhode-peptide-tint', 'lip-balm-tint', 'rhode', 'Peptide Lip Tint', 24, '10 ml', 'B', [56, 66, 92, 62], 'gsnmx', 'Baume glacé', "Baume teinté brillant aux peptides. Agréable, mais très marketé pour ce qu'il fait."),
  p('summerfridays-lip-butter', 'lip-balm-tint', 'summerfridays', 'Lip Butter Balm', 26, '15 g', 'A', [62, 56, 96, 66], 'gsnmx', 'Baume brillant', "Le baume beurré viral (« Vanilla Beige ») : confort exceptionnel, prix élevé."),
  p('elf-squeeze-me', 'lip-balm-tint', 'elf', 'Squeeze Me Lip Balm', 5, '6 g', 'A', [58, 54, 92, 96], 'gsnmx', 'Baume brillant', "Le dupe du Summer Fridays : même texture beurrée, 5 €."),
  p('3ce-velvet-tint', 'lip-balm-tint', '3ce', 'Velvet Lip Tint', 16, '4 g', 'A', [84, 90, 78, 84], 'gsn', 'Velours', "Le tint velours coréen : « Daffodil » et « Taupe » sont des best-sellers."),
  p('amuse-jel-fit', 'lip-balm-tint', 'amuse', 'Jel-Fit Tint', 16, '3,8 g', 'A', [84, 88, 84, 84], 'gsn', 'Gelée', "Effet lèvres gelée brillant qui tient : le tint vegan le plus réussi."),

  // OUTILS
  p('zoeva-complete-eye', 'tools', 'zoeva', 'Complete Eye Set (8 pinceaux)', 59, '8 pinceaux', 'A', [88, 86, 88, 82], 'gsnxm', 'Kit yeux', "Le kit yeux complet de qualité pro : estompeurs, biseautés, crayon."),
  p('morphe-m439', 'tools', 'morphe', 'M439 Deluxe Buff Brush', 14, '1 pinceau', 'B', [80, 82, 84, 84], 'gsnxm', 'Pinceau teint', "Bon pinceau de teint duveteux, moins dense que le Sigma F80."),
  p('spectrum-a01', 'tools', 'spectrum', 'A01 Pointed Powder Brush', 15, '1 pinceau', 'B', [82, 80, 86, 82], 'gsnxm', 'Pinceau poudre', "Pinceau poudre vegan précis, parfait pour poudrer sous les yeux."),
];
