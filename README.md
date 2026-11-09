# L'Atelier Makeup — La Bible & Tier-List du Maquillage

Guide interactif en français : tier-list de 242 produits sur 28 catégories, générateur de trousse par budget et type de peau avec analyseur anti-peluchage, convertisseur de teintes inter-marques (18 références), radar à 43 dupes, encyclopédie de 123 marques, et masterclass (sous-tons, labo de correction des couleurs, schémas SVG visage et yeux, 35 secrets backstage, diagnostic SOS, INCI et péremption). Ma Trousse : duel de 2-3 produits (prix réel au 10 ml, formats mini, base eau/silicone) et suivi PAO.

**Site :** https://ede800.github.io/atelier-makeup/

## Développement

```bash
npm install
npm run dev
npm run build
```

Stack : Vite, React, TypeScript, Tailwind CSS v4, Lucide. Données dans `src/data/`. Prix indicatifs constatés en France.

## Logos des marques

Les logos (icônes officielles des sites des marques) sont hébergés avec le site dans `public/logos/` : aucun service tiers n'est appelé chez les visiteurs. Pour les mettre à jour :

```bash
node scripts/fetch-logos.mjs
```

Les domaines sont dans `src/data/brand-domains.json`. Une marque sans logo exploitable affiche un monogramme. Les logos appartiennent à leurs marques respectives et servent uniquement à les identifier.

## Accessibilité

Objectif : WCAG 2.2 niveau AA (référentiel RGAA). Mis en place :

- Lien d'évitement « Aller au contenu », landmarks (`header`, `nav`, `main`, `footer`), titre de page unique par vue, focus déplacé sur le titre à chaque changement de vue.
- Navigation complète au clavier : boîtes de dialogue avec focus piégé, fermeture par Échap et retour du focus ; recherche `Ctrl+K` en combobox ARIA ; onglets de la masterclass navigables aux flèches.
- Boutons à bascule (`aria-pressed`), page courante (`aria-current`), annonces des résultats de filtres et des notifications (`aria-live`).
- Contrastes de texte ≥ 4,5:1 (≥ 3:1 pour les grands titres) en mode clair et sombre, `prefers-reduced-motion` respecté, emojis et icônes décoratifs masqués aux lecteurs d'écran, tableaux avec en-têtes et légendes.
- Vérifié avec axe-core (`wcag2a`, `wcag2aa`, `wcag21aa`, `wcag22aa`, bonnes pratiques) : 0 violation sur toutes les vues et les 8 onglets de la masterclass, en clair et en sombre.
