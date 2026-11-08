import { Search, Package, Building2, LayoutGrid, CornerDownLeft } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { BRANDS, brandName } from '../data/brands';
import { CATEGORIES } from '../data/categories';
import { PRODUCTS } from '../data/products';
import { euro, normalize } from '../lib/helpers';
import { useStore } from '../lib/store';
import { TierBadge } from './ui';

type Hit =
  | { kind: 'product'; id: string; title: string; sub: string; extra: string; tier: import('../data/types').Tier }
  | { kind: 'brand'; id: string; title: string; sub: string }
  | { kind: 'category'; id: string; title: string; sub: string };

export function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { navigate } = useStore();
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => input.current?.focus(), 10);
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
      kind: 'product', id: p.id, title: p.name, sub: brandName(p.brand), extra: euro(p.price), tier: p.tier,
    }));
    return [...cats.slice(0, 4), ...brands.slice(0, 5), ...prods.slice(0, 12)];
  }, [q]);

  useEffect(() => setActive(0), [q]);

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

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]" role="dialog" aria-modal="true" aria-label="Recherche">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="pop relative w-full max-w-xl rounded-2xl bg-solid border border-line shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 border-b border-line">
          <Search size={18} className="text-muted" />
          <input
            ref={input}
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Escape') onClose();
              if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, hits.length - 1)); }
              if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
              if (e.key === 'Enter' && hits[active]) choose(hits[active]);
            }}
            placeholder="Produit, marque, catégorie… (ex. « mascara », « Dior », « blush »)"
            className="flex-1 bg-transparent py-4 outline-none text-[15px] placeholder:text-muted"
          />
          <kbd className="font-mono text-[10px] text-muted border border-line rounded px-1.5 py-0.5">ESC</kbd>
        </div>
        <ul className="max-h-[55vh] overflow-y-auto p-2">
          {!q && <li className="px-3 pt-1 pb-2 text-[11px] uppercase tracking-wider text-muted">Catégories populaires</li>}
          {hits.length === 0 && <li className="px-3 py-8 text-center text-muted text-sm">Aucun résultat pour « {q} »</li>}
          {hits.map((h, i) => (
            <li key={h.kind + h.id}>
              <button
                onMouseEnter={() => setActive(i)}
                onClick={() => choose(h)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left ${i === active ? 'bg-bg-2' : ''}`}
              >
                <span className="grid place-items-center size-8 rounded-lg bg-gold/15 text-gold-ink shrink-0">
                  {h.kind === 'product' ? <Package size={15} /> : h.kind === 'brand' ? <Building2 size={15} /> : <LayoutGrid size={15} />}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium truncate">{h.title}</span>
                  <span className="block text-xs text-muted truncate">{h.sub}</span>
                </span>
                {h.kind === 'product' && (
                  <>
                    <TierBadge tier={h.tier} />
                    <span className="font-mono text-xs">{h.extra}</span>
                  </>
                )}
                {i === active && <CornerDownLeft size={14} className="text-muted" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
