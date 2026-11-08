import { Moon, Search, ShoppingBag, Sun, Trophy, Wand2, Repeat, Library, Palette } from 'lucide-react';
import { useEffect, useState } from 'react';
import { SearchPalette } from './components/SearchPalette';
import { useStore, type ViewId } from './lib/store';
import { TierListView } from './views/TierListView';
import { RoutineBuilderView } from './views/RoutineBuilderView';
import { DupeFinderView } from './views/DupeFinderView';
import { BrandDirectoryView } from './views/BrandDirectoryView';
import { MasterclassView } from './views/MasterclassView';
import { MyBagView } from './views/MyBagView';
import { PRODUCTS } from './data/products';
import { BRANDS } from './data/brands';
import { CATEGORIES } from './data/categories';
import { DUPES } from './data/dupes';

const NAV: { id: ViewId; label: string; short: string; icon: typeof Trophy }[] = [
  { id: 'tier', label: 'Le Grand Ranking', short: 'Ranking', icon: Trophy },
  { id: 'routine', label: 'Générateur de Trousse', short: 'Trousse', icon: Wand2 },
  { id: 'dupes', label: 'Radar à Dupes', short: 'Dupes', icon: Repeat },
  { id: 'brands', label: 'Encyclopédie', short: 'Marques', icon: Library },
  { id: 'masterclass', label: 'Masterclass', short: 'Guide', icon: Palette },
];

export default function App() {
  const { nav, navigate, theme, toggleTheme, bag, toast } = useStore();
  const [search, setSearch] = useState(false);

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

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/75 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 h-16 flex items-center gap-3">
          <button onClick={() => navigate('tier')} className="flex items-baseline gap-2 shrink-0" aria-label="Accueil">
            <span className="font-display text-xl sm:text-2xl italic">L'Atelier</span>
            <span className="font-display text-xl sm:text-2xl gold-text font-semibold">Makeup</span>
          </button>
          <nav className="hidden xl:flex items-center gap-1 ml-6" aria-label="Navigation principale">
            {NAV.map((n) => (
              <button key={n.id} onClick={() => navigate(n.id)} data-active={nav.view === n.id}
                className="whitespace-nowrap px-3 py-2 rounded-full text-[13px] font-medium text-muted hover:text-ink data-[active=true]:text-ink data-[active=true]:bg-surface data-[active=true]:shadow-sm transition">
                {n.label}
              </button>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-2">
            <button onClick={() => setSearch(true)} className="flex items-center gap-2 h-9 pl-3 pr-2 rounded-full border border-line bg-surface text-muted text-sm hover:border-gold transition" aria-label="Rechercher (Ctrl+K)">
              <Search size={15} />
              <span className="hidden sm:inline">Rechercher</span>
              <kbd className="hidden sm:inline font-mono text-[10px] border border-line rounded px-1.5 py-0.5">Ctrl K</kbd>
            </button>
            <button onClick={toggleTheme} className="grid place-items-center size-9 rounded-full border border-line bg-surface hover:border-gold transition" aria-label={theme === 'dark' ? 'Mode ivoire' : 'Mode Dark Velvet'}>
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button onClick={() => navigate('bag')} data-active={nav.view === 'bag'} className="relative whitespace-nowrap flex items-center gap-2 h-9 px-3 rounded-full bg-ink text-bg text-sm font-semibold hover:opacity-90 transition" aria-label={`Ma Trousse (${bag.length})`}>
              <ShoppingBag size={15} />
              <span className="hidden sm:inline">Ma Trousse</span>
              <span className="font-mono text-xs bg-gold text-[#2a1a0c] rounded-full min-w-5 h-5 px-1 grid place-items-center">{bag.length}</span>
            </button>
          </div>
        </div>
        <nav className="xl:hidden flex gap-1 overflow-x-auto no-scrollbar px-4 pb-2" aria-label="Navigation mobile">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => navigate(n.id)} data-active={nav.view === n.id} className="chip">
              <n.icon size={14} /> {n.short}
            </button>
          ))}
        </nav>
      </header>

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 py-8 sm:py-12" key={nav.view}>
        {nav.view === 'tier' && <TierListView param={nav.param} />}
        {nav.view === 'routine' && <RoutineBuilderView />}
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
          <p className="max-w-md">Prix indicatifs constatés en France (Sephora, Nocibé, Marionnaud, pharmacies, Monoprix). Classements éditoriaux indépendants, sans affiliation.</p>
        </div>
      </footer>

      <SearchPalette open={search} onClose={() => setSearch(false)} />

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] pop">
          <div className="px-4 py-2.5 rounded-full bg-ink text-bg text-sm font-medium shadow-xl">{toast}</div>
        </div>
      )}
    </div>
  );
}
