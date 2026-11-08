import { Search, Package, LayoutGrid, CornerDownLeft } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BRANDS, brandName } from '../data/brands';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import type { Tier } from '../data/types';
import { euro, normalize } from '../lib/helpers';
import { useStore } from '../lib/store';
import { BrandLogo, TierBadge, useDialog } from './ui';

type Hit =
  | { kind: 'product'; id: string; title: string; sub: string; extra: string; tier: Tier; brand: string }
  | { kind: 'brand'; id: string; title: string; sub: string }
  | { kind: 'category'; id: string; title: string; sub: string };

const KIND_LABEL = { product: 'Produit', brand: 'Marque', category: 'Catégorie' } as const;

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { navigate } = useStore();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLUListElement>(null);
  useDialog(open, onClose, dialog);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
    }
  }, [open]);

  const hits = useMemo<Hit[]>(() => {
    const n = normalize(q.trim());
    if (!n) {
      return CATEGORIES.slice(0, 8).map((c) => ({ kind: 'category', id: c.id, title: c.name, sub: c.en }));
    }
    const terms = n.split(/\s+/);
    const match = (s: string) => terms.every((t) => normalize(s).includes(t));
    const cats: Hit[] = CATEGORIES.filter((c) => match(`${c.name} ${c.en}`)).map((c) => ({ kind: 'category', id: c.id, title: c.name, sub: c.en }));
    const brands: Hit[] = BRANDS.filter((b) => match(`${b.name} ${b.specialty}`)).map((b) => ({ kind: 'brand', id: b.id, title: b.name, sub: b.specialty }));
    const prods: Hit[] = PRODUCTS.filter((p) => match(`${p.name} ${brandName(p.brand)} ${p.finish}`)).map((p) => ({
      kind: 'product', id: p.id, title: p.name, sub: brandName(p.brand), extra: euro(p.price), tier: p.tier, brand: p.brand,
    }));
    return [...cats.slice(0, 4), ...brands.slice(0, 5), ...prods.slice(0, 12)];
  }, [q]);

  useEffect(() => setActive(0), [q]);
  useEffect(() => {
    list.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  const choose = (h: Hit) => {
    onClose();
    if (h.kind === 'category') navigate('tier', h.id);
    else if (h.kind === 'brand') navigate('brands', h.id);
    else {
      const p = PRODUCTS.find((x) => x.id === h.id)!;
      navigate('tier', `${p.category}~${p.id}`);
    }
  };

  if (!open) return null;

  const optionId = (i: number) => `search-opt-${i}`;

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div ref={dialog} role="dialog" aria-modal="true" aria-label="Recherche rapide"
        className="pop relative w-full max-w-xl rounded-2xl bg-solid border border-line shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <Search size={18} className="text-muted" aria-hidden="true" />
          <input
            data-autofocus
            role="combobox"
            aria-expanded="true"
            aria-controls="search-results"
            aria-autocomplete="list"
            aria-activedescendant={hits[active] ? optionId(active) : undefined}
            aria-label="Rechercher un produit, une marque ou une catégorie"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              if (e.key === 'Home') { e.preventDefault(); setActive(0); }
              if (e.key === 'End') { e.preventDefault(); setActive(hits.length - 1); }
              if (e.key === 'Enter' && hits[active]) { e.preventDefault(); choose(hits[active]); }
            }}
            placeholder="Produit, marque, catégorie… (ex. « mascara », « Dior »)"
            className="flex-1 bg-transparent py-4 outline-none text-[15px] placeholder:text-muted"
          />
          <kbd className="font-mono text-[10px] text-muted border border-line rounded px-1.5 py-0.5" aria-hidden="true">ESC</kbd>
        </div>
        {!q && <p className="px-5 pt-3 text-[11px] uppercase tracking-wider text-muted" id="search-hint">Catégories populaires</p>}
        <ul ref={list} id="search-results" role="listbox" aria-label="Résultats" className="max-h-[55vh] overflow-y-auto p-2">
          {hits.map((h, i) => (
            <li
              key={h.kind + h.id}
              id={optionId(i)}
              data-index={i}
              role="option"
              aria-selected={i === active}
              onMouseEnter={() => setActive(i)}
              onClick={() => choose(h)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer ${i === active ? 'bg-bg-2 outline-2 outline-gold' : ''}`}
            >
              {h.kind === 'brand' ? <BrandLogo brand={h.id} size={32} /> : h.kind === 'product' ? <BrandLogo brand={h.brand} size={32} /> : (
                <span className="grid place-items-center size-8 rounded-lg bg-gold/15 text-gold-ink shrink-0" aria-hidden="true">
                  {h.kind === 'category' ? <LayoutGrid size={15} /> : <Package size={15} />}
                </span>
              )}
              <span className="min-w-0 flex-1">
                <span className="sr-only">{KIND_LABEL[h.kind]} : </span>
                <span className="block text-sm font-medium truncate">{h.title}</span>
                <span className="block text-xs text-muted truncate" lang={h.kind === 'category' ? 'en' : undefined}>{h.sub}</span>
              </span>
              {h.kind === 'product' && (
                <>
                  <TierBadge tier={h.tier} />
                  <span className="font-mono text-xs">{h.extra}</span>
                </>
              )}
              {i === active && <CornerDownLeft size={14} className="text-muted" aria-hidden="true" />}
            </li>
          ))}
        </ul>
        {hits.length === 0 && <p className="px-3 pb-8 pt-4 text-center text-muted text-sm">Aucun résultat pour « {q} »</p>}
        <p className="sr-only" role="status" aria-live="polite">{q ? `${hits.length} résultat${hits.length > 1 ? 's' : ''}` : ''}</p>
      </div>
    </div>
  );
}
