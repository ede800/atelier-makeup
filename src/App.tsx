import { Moon, Search, ShoppingBag, Sun, Trophy, Wand2, Repeat, Library, Palette, Target } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { SearchPalette } from './components/SearchPalette';
import { useStore, type ViewId } from './lib/store';
import { TierListView } from './views/TierListView';
import { RoutineBuilderView } from './views/RoutineBuilderView';
import { DupeFinderView } from './views/DupeFinderView';
import { BrandDirectoryView } from './views/BrandDirectoryView';
import { MasterclassView } from './views/MasterclassView';
import { MyBagView } from './views/MyBagView';
import { ShadeMatcherView } from './views/ShadeMatcherView';
import { PRODUCTS } from './data/products';
import { BRANDS } from './data/brands';
import { CATEGORIES } from './data/categories';
import { DUPES } from './data/dupes';

const NAV: { id: ViewId; label: string; short: string; icon: typeof Trophy }[] = [
  { id: 'tier', label: 'Ranking', short: 'Ranking', icon: Trophy },
  { id: 'routine', label: 'Générateur', short: 'Trousse', icon: Wand2 },
  { id: 'shades', label: 'Teintes', short: 'Teintes', icon: Target },
  { id: 'dupes', label: 'Dupes', short: 'Dupes', icon: Repeat },
  { id: 'brands', label: 'Marques', short: 'Marques', icon: Library },
  { id: 'masterclass', label: 'Masterclass', short: 'Guide', icon: Palette },
];

export default function App() {
  const { nav, navigate, theme, toggleTheme, bag, toast } = useStore();
  const [search, setSearch] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearch((s) => !s);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Titre de page unique par vue, et focus déplacé sur le titre principal à chaque changement de vue
  useEffect(() => {
    document.title = `${TITLES[nav.view]} — L'Atelier Makeup`;
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Un lien profond (produit, fiche marque) gère son propre focus
    if (nav.param && (nav.view === 'brands' || nav.param.includes('~'))) return;
    requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-view-title]')?.focus({ preventScroll: true }));
  }, [nav.view]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col">
      <a href="#contenu" onClick={(e) => { e.preventDefault(); document.getElementById('contenu')?.focus(); }}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[80] focus:px-4 focus:py-2 focus:rounded-full focus:bg-ink focus:text-bg focus:font-semibold">
        Aller au contenu
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-bg/85 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-3">
          <a href="#/tier" onClick={(e) => { e.preventDefault(); navigate('tier'); }} className="flex items-baseline gap-2 shrink-0" aria-label="L'Atelier Makeup — accueil">
            <span className="font-display text-xl sm:text-2xl italic">L'Atelier</span>
            <span className="font-display text-xl sm:text-2xl gold-text font-semibold">Makeup</span>
          </a>
          <nav className="hidden xl:block ml-6" aria-label="Navigation principale">
            <ul className="flex items-center gap-1">
              {NAV.map((n) => (
                <li key={n.id}>
                  <a href={`#/${n.id}`} aria-current={nav.view === n.id ? 'page' : undefined}
                    className="block whitespace-nowrap px-3 py-2 rounded-full text-[13px] font-medium text-muted hover:text-ink aria-[current=page]:text-ink aria-[current=page]:bg-surface aria-[current=page]:shadow-sm transition">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button type="button" onClick={() => setSearch(true)} aria-haspopup="dialog" aria-keyshortcuts="Control+K"
              className="flex items-center gap-2 h-10 pl-3 pr-2 rounded-full border border-line bg-surface text-muted text-sm hover:border-gold transition">
              <Search size={15} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Rechercher</span>
              <kbd className="hidden sm:inline font-mono text-[10px] border border-line rounded px-1.5 py-0.5" aria-hidden="true">Ctrl K</kbd>
            </button>
            <button type="button" onClick={toggleTheme} aria-pressed={theme === 'dark'} aria-label="Mode sombre"
              className="grid place-items-center size-10 rounded-full border border-line bg-surface hover:border-gold transition">
              {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
            </button>
            <a href="#/bag" aria-current={nav.view === 'bag' ? 'page' : undefined}
              className="relative whitespace-nowrap flex items-center gap-2 h-10 px-3 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 transition">
              <ShoppingBag size={15} aria-hidden="true" />
              <span className="sr-only sm:not-sr-only">Ma Trousse</span>
              <span className="font-mono text-xs bg-gold text-[#2a1a0c] rounded-full min-w-5 h-5 px-1 grid place-items-center">
                {bag.length}<span className="sr-only"> produit{bag.length > 1 ? 's' : ''}</span>
              </span>
            </a>
          </div>
        </div>
        <nav className="xl:hidden px-4 pb-2" aria-label="Navigation principale (mobile)">
          <ul className="flex gap-1 overflow-x-auto no-scrollbar">
            {NAV.map((n) => (
              <li key={n.id}>
                <a href={`#/${n.id}`} aria-current={nav.view === n.id ? 'page' : undefined} data-active={nav.view === n.id} className="chip">
                  <n.icon size={14} aria-hidden="true" /> {n.short}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="contenu" tabIndex={-1} className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12 outline-none" key={nav.view}>
        {nav.view === 'tier' && <TierListView param={nav.param} />}
        {nav.view === 'routine' && <RoutineBuilderView />}
        {nav.view === 'shades' && <ShadeMatcherView />}
        {nav.view === 'dupes' && <DupeFinderView />}
        {nav.view === 'brands' && <BrandDirectoryView param={nav.param} />}
        {nav.view === 'masterclass' && <MasterclassView />}
        {nav.view === 'bag' && <MyBagView />}
      </main>

      <footer className="border-t border-line mt-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 flex flex-col sm:flex-row gap-4 justify-between text-xs text-muted">
          <p>
            <span className="font-display italic text-base text-ink">L'Atelier Makeup</span> — La Bible & Tier-List du Maquillage.
            <span className="font-mono ml-2">{PRODUCTS.length} produits · {BRANDS.length} marques · {CATEGORIES.length} catégories · {DUPES.length} dupes</span>
          </p>
          <p className="max-w-md">
            Prix indicatifs constatés en France (Sephora, Nocibé, Marionnaud, pharmacies, Monoprix). Classements éditoriaux indépendants, sans affiliation.
            Les logos appartiennent à leurs marques respectives et sont utilisés à titre d'identification.
          </p>
        </div>
      </footer>

      <SearchPalette open={search} onClose={() => setSearch(false)} />

      <div role="status" aria-live="polite" className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70]">
        {toast && <div className="pop px-4 py-2.5 rounded-full bg-ink text-bg text-sm font-medium shadow-xl">{toast}</div>}
      </div>
    </div>
  );
}

const TITLES: Record<ViewId, string> = {
  tier: 'Le Grand Ranking & Tier-List',
  routine: 'Générateur de Trousse',
  shades: 'Convertisseur de Teintes',
  dupes: 'Radar à Dupes',
  brands: 'Encyclopédie des Marques',
  masterclass: 'Masterclass',
  bag: 'Ma Trousse',
};
