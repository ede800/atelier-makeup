import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import type { SkinType } from '../data/types';
import type { Undertone } from '../data/masterclass';

export type ViewId = 'tier' | 'routine' | 'shades' | 'dupes' | 'brands' | 'masterclass' | 'bag';

export interface Profile {
  skin?: SkinType;
  undertone?: Undertone;
}

interface Nav {
  view: ViewId;
  param?: string;
}

interface Store {
  nav: Nav;
  navigate: (view: ViewId, param?: string) => void;
  bag: string[];
  toggleBag: (id: string) => void;
  addManyToBag: (ids: string[]) => void;
  clearBag: () => void;
  wishlist: string[];
  toggleWish: (id: string) => void;
  profile: Profile;
  setProfile: (p: Profile) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  toast: string | null;
  notify: (msg: string) => void;
}

const Ctx = createContext<Store | null>(null);

export function usePersistent<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* stockage indisponible : on garde l'état en mémoire */
    }
  }, [key, value]);
  return [value, setValue] as const;
}

const VIEWS: ViewId[] = ['tier', 'routine', 'shades', 'dupes', 'brands', 'masterclass', 'bag'];

function readHash(): Nav {
  const [view, param] = window.location.hash.replace(/^#\/?/, '').split('/');
  return VIEWS.includes(view as ViewId) ? { view: view as ViewId, param: param ? decodeURIComponent(param) : undefined } : { view: 'tier' };
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [nav, setNav] = useState<Nav>(readHash);
  const [bag, setBag] = usePersistent<string[]>('atelier.bag', []);
  const [wishlist, setWishlist] = usePersistent<string[]>('atelier.wishlist', []);
  const [profile, setProfile] = usePersistent<Profile>('atelier.profile', {});
  const [theme, setTheme] = usePersistent<'light' | 'dark'>(
    'atelier.theme',
    typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light',
  );
  const [toast, setToast] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const onHash = () => {
      setNav(readHash());
      window.scrollTo({ top: 0 });
    };
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setToast(null), 2200);
  }, []);

  const navigate = useCallback((view: ViewId, param?: string) => {
    const hash = `#/${view}${param ? '/' + encodeURIComponent(param) : ''}`;
    if (window.location.hash !== hash) window.location.hash = hash;
    setNav({ view, param });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const value = useMemo<Store>(() => ({
    nav,
    navigate,
    bag,
    toggleBag: (id) => {
      const has = bag.includes(id);
      setBag(has ? bag.filter((x) => x !== id) : [...bag, id]);
      notify(has ? 'Retiré de Ma Trousse' : 'Ajouté à Ma Trousse ✨');
    },
    addManyToBag: (ids) => {
      const fresh = ids.filter((id) => !bag.includes(id));
      setBag([...bag, ...fresh]);
      notify(fresh.length ? `${fresh.length} produit${fresh.length > 1 ? 's' : ''} ajouté${fresh.length > 1 ? 's' : ''} à Ma Trousse ✨` : 'Déjà tout dans votre trousse');
    },
    clearBag: () => setBag([]),
    wishlist,
    toggleWish: (id) => {
      const has = wishlist.includes(id);
      setWishlist(has ? wishlist.filter((x) => x !== id) : [...wishlist, id]);
      notify(has ? 'Retiré de la wishlist' : 'Ajouté à la wishlist ♡');
    },
    profile,
    setProfile,
    theme,
    toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    toast,
    notify,
  }), [nav, navigate, bag, setBag, wishlist, setWishlist, profile, setProfile, theme, setTheme, toast, notify]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore doit être utilisé dans <StoreProvider>');
  return ctx;
}
