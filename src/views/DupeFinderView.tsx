import { ArrowRight, Scale, ShoppingBag, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { brandName } from '../data/brands';
import { ZONES, categoryById } from '../data/categories';
import { DUPES } from '../data/dupes';
import type { Dupe, DupeSide, ZoneId } from '../data/types';
import { euro } from '../lib/helpers';
import { useStore } from '../lib/store';
import { SectionTitle } from '../components/ui';

type Sort = 'savings' | 'similarity' | 'percent';

function Side({ s, kind }: { s: DupeSide; kind: 'luxe' | 'dupe' }) {
  const { bag, toggleBag } = useStore();
  const inBag = s.productId ? bag.includes(s.productId) : false;
  return (
    <div className={`flex-1 rounded-2xl p-4 ${kind === 'luxe' ? 'bg-bg-2' : 'bg-sage/12 border border-sage/30'}`}>
      <p className={`text-[10.5px] uppercase tracking-[0.18em] font-semibold ${kind === 'luxe' ? 'text-rose-ink' : 'text-sage'}`}>
        {kind === 'luxe' ? 'L\'original' : 'Le dupe certifié'}
      </p>
      <p className="text-[11px] uppercase tracking-wider text-muted mt-2">{brandName(s.brand)}</p>
      <p className="font-display text-lg leading-snug">{s.name}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <span className={`font-mono text-xl font-semibold ${kind === 'luxe' ? 'line-through decoration-rose/60 decoration-2' : ''}`}>{euro(s.price)}</span>
        <span className="font-mono text-xs text-muted">{s.size}</span>
      </div>
      {s.productId && kind === 'dupe' && (
        <button onClick={() => toggleBag(s.productId!)} className={`mt-3 inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold ${inBag ? 'bg-gold/25 text-gold-ink' : 'bg-ink text-bg'}`}>
          {inBag ? <Check size={13} /> : <ShoppingBag size={13} />} {inBag ? 'Dans ma trousse' : 'Ajouter le dupe'}
        </button>
      )}
    </div>
  );
}

function DupeCard({ d, i }: { d: Dupe; i: number }) {
  const saved = d.luxe.price - d.dupe.price;
  const pct = Math.round((saved / d.luxe.price) * 100);
  return (
    <article className="glass rounded-3xl p-4 sm:p-5 fade-up" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[11px] uppercase tracking-wider text-muted">{categoryById(d.category)?.name}</span>
        <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-sage/20 text-sage font-semibold">−{euro(saved)} · −{pct} %</span>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <Side s={d.luxe} kind="luxe" />
        <div className="grid place-items-center text-muted py-1"><ArrowRight size={18} className="rotate-90 sm:rotate-0" /></div>
        <Side s={d.dupe} kind="dupe" />
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted">Similarité de texture & rendu</span>
          <span className="font-mono font-semibold">{d.similarity} %</span>
        </div>
        <div className="h-1.5 rounded-full bg-line overflow-hidden">
          <div className="h-full rounded-full" style={{ width: `${d.similarity}%`, background: 'linear-gradient(90deg, var(--sage), var(--gold))' }} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed">{d.verdict}</p>
      <ul className="mt-3 space-y-1">
        {d.tradeoffs.map((t) => (
          <li key={t} className="text-[12.5px] text-muted flex gap-2"><Scale size={13} className="shrink-0 mt-0.5 text-gold-ink" />{t}</li>
        ))}
      </ul>
      {d.alt && <p className="mt-3 text-[12.5px]"><span className="text-muted">Alternative :</span> {d.alt}</p>}
    </article>
  );
}

export function DupeFinderView() {
  const [zone, setZone] = useState<ZoneId | 'all'>('all');
  const [sort, setSort] = useState<Sort>('savings');
  const list = useMemo(() => {
    const l = DUPES.filter((d) => zone === 'all' || categoryById(d.category)?.zone === zone);
    const key = (d: Dupe) =>
      sort === 'savings' ? d.luxe.price - d.dupe.price : sort === 'similarity' ? d.similarity : (d.luxe.price - d.dupe.price) / d.luxe.price;
    return [...l].sort((a, b) => key(b) - key(a));
  }, [zone, sort]);
  const totalLuxe = list.reduce((s, d) => s + d.luxe.price, 0);
  const totalDupe = list.reduce((s, d) => s + d.dupe.price, 0);

  return (
    <div>
      <SectionTitle kicker="🔄 Le Radar à Dupes Certifiés" title={<>Le même rendu, <em className="gold-text">jusqu'à −90 %</em>.</>}>
        {DUPES.length} duels luxe vs drugstore, analysés formule contre formule. Avec les vrais compromis : packaging, parfum, tenue, nombre de teintes.
      </SectionTitle>

      <div className="glass rounded-3xl p-5 mb-6 grid sm:grid-cols-3 gap-4">
        <div><p className="text-xs text-muted">Si vous achetiez tous les originaux</p><p className="font-mono text-2xl font-semibold line-through decoration-rose/60">{euro(totalLuxe)}</p></div>
        <div><p className="text-xs text-muted">Avec les dupes</p><p className="font-mono text-2xl font-semibold">{euro(totalDupe)}</p></div>
        <div><p className="text-xs text-muted">Économie totale</p><p className="font-mono text-2xl font-semibold text-sage">{euro(totalLuxe - totalDupe)}</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button className="chip" data-active={zone === 'all'} onClick={() => setZone('all')}>Toutes zones</button>
          {ZONES.filter((z) => DUPES.some((d) => categoryById(d.category)?.zone === z.id)).map((z) => (
            <button key={z.id} className="chip" data-active={zone === z.id} onClick={() => setZone(z.id)}>{z.emoji} {z.name}</button>
          ))}
        </div>
        <div className="flex gap-2 shrink-0">
          <button className="chip" data-active={sort === 'savings'} onClick={() => setSort('savings')}>€ économisés</button>
          <button className="chip" data-active={sort === 'percent'} onClick={() => setSort('percent')}>% d'économie</button>
          <button className="chip" data-active={sort === 'similarity'} onClick={() => setSort('similarity')}>Similarité</button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        {list.map((d, i) => <DupeCard key={d.id} d={d} i={i} />)}
      </div>
    </div>
  );
}
