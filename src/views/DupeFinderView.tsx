import { ArrowRight, Scale, ShoppingBag, Check } from 'lucide-react';
import { useMemo, useState } from 'react';
import { brandName } from '../data/brands';
import { ZONES, categoryById } from '../data/categories';
import { DUPES } from '../data/dupes';
import type { Dupe, DupeSide, ZoneId } from '../data/types';
import { euro } from '../lib/helpers';
import { useStore } from '../lib/store';
import { BrandLogo, SectionTitle } from '../components/ui';

type Sort = 'savings' | 'similarity' | 'percent';

function Side({ s, kind }: { s: DupeSide; kind: 'luxe' | 'dupe' }) {
  const { bag, toggleBag } = useStore();
  const inBag = s.productId ? bag.includes(s.productId) : false;
  return (
    <div className={`flex-1 rounded-2xl p-4 ${kind === 'luxe' ? 'bg-bg-2' : 'bg-sage/12 border border-sage/30'}`} role="group" aria-label={kind === 'luxe' ? 'Produit original' : 'Dupe'}>
      <p className={`text-[10.5px] uppercase tracking-[0.18em] font-semibold ${kind === 'luxe' ? 'text-rose-ink' : 'text-sage-ink'}`}>
        {kind === 'luxe' ? 'L\'original' : 'Le dupe certifié'}
      </p>
      <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted mt-2"><BrandLogo brand={s.brand} size={20} />{brandName(s.brand)}</p>
      <h3 className="font-display text-lg leading-snug">{s.name}</h3>
      <div className="flex items-baseline gap-2 mt-2">
        <span className={`font-mono text-xl font-semibold ${kind === 'luxe' ? 'line-through decoration-rose/60 decoration-2' : ''}`}><span className="sr-only">Prix : </span>{euro(s.price)}</span>
        <span className="font-mono text-xs text-muted">{s.size}</span>
      </div>
      {s.productId && kind === 'dupe' && (
        <button type="button" aria-pressed={inBag} onClick={() => toggleBag(s.productId!)} className={`mt-3 inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold ${inBag ? 'bg-gold/25 text-gold-ink' : 'bg-ink text-bg'}`}>
          {inBag ? <Check size={13} aria-hidden="true" /> : <ShoppingBag size={13} aria-hidden="true" />} <span aria-hidden="true">{inBag ? 'Dans ma trousse' : 'Ajouter le dupe'}</span><span className="sr-only">Dans ma trousse : {brandName(s.brand)} {s.name}</span>
        </button>
      )}
    </div>
  );
}

function DupeCard({ d, i }: { d: Dupe; i: number }) {
  const saved = d.luxe.price - d.dupe.price;
  const pct = Math.round((saved / d.luxe.price) * 100);
  return (
    <article aria-label={`${brandName(d.luxe.brand)} ${d.luxe.name} contre ${brandName(d.dupe.brand)} ${d.dupe.name}`} className="glass rounded-3xl p-4 sm:p-5 fade-up" style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}>
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-[11px] uppercase tracking-wider text-muted">{categoryById(d.category)?.name}</span>
        <span className="font-mono text-xs px-2.5 py-1 rounded-full bg-sage/20 text-sage-ink font-semibold"><span className="sr-only">Économie : </span>−{euro(saved)} · −{pct} %</span>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch gap-2">
        <Side s={d.luxe} kind="luxe" />
        <div className="grid place-items-center text-muted py-1" aria-hidden="true"><ArrowRight size={18} className="rotate-90 sm:rotate-0" /></div>
        <Side s={d.dupe} kind="dupe" />
      </div>
      <div className="mt-4">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted">Similarité de texture & rendu</span>
          <span className="font-mono font-semibold">{d.similarity} %</span>
        </div>
        <div className="h-1.5 rounded-full bg-line overflow-hidden" aria-hidden="true">
          <div className="h-full rounded-full" style={{ width: `${d.similarity}%`, background: 'linear-gradient(90deg, var(--sage), var(--gold))' }} />
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed">{d.verdict}</p>
      <ul className="mt-3 space-y-1" aria-label="Compromis">
        {d.tradeoffs.map((t) => (
          <li key={t} className="text-[12.5px] text-muted flex gap-2"><Scale size={13} className="shrink-0 mt-0.5 text-gold-ink" aria-hidden="true" />{t}</li>
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
      <SectionTitle emoji="🔄" kicker="Le Radar à Dupes Certifiés" title={<>Le même rendu, <em className="gold-text">jusqu'à −90 %</em>.</>}>
        {DUPES.length} duels luxe vs drugstore, analysés formule contre formule. Avec les vrais compromis : packaging, parfum, tenue, nombre de teintes.
      </SectionTitle>

      <div className="glass rounded-3xl p-5 mb-6 grid sm:grid-cols-3 gap-4" role="group" aria-label="Bilan des économies">
        <div><p className="text-xs text-muted">Si vous achetiez tous les originaux</p><p className="font-mono text-2xl font-semibold line-through decoration-rose/60"><span className="sr-only">Barré : </span>{euro(totalLuxe)}</p></div>
        <div><p className="text-xs text-muted">Avec les dupes</p><p className="font-mono text-2xl font-semibold">{euro(totalDupe)}</p></div>
        <div><p className="text-xs text-muted">Économie totale</p><p className="font-mono text-2xl font-semibold text-sage-ink">{euro(totalLuxe - totalDupe)}</p></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-5">
        <div role="group" aria-label="Filtrer par zone" className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button type="button" className="chip" data-active={zone === 'all'} aria-pressed={zone === 'all'} onClick={() => setZone('all')}>Toutes zones</button>
          {ZONES.filter((z) => DUPES.some((d) => categoryById(d.category)?.zone === z.id)).map((z) => (
            <button type="button" key={z.id} className="chip" data-active={zone === z.id} aria-pressed={zone === z.id} onClick={() => setZone(z.id)}><span aria-hidden="true">{z.emoji}</span> {z.name}</button>
          ))}
        </div>
        <div role="group" aria-label="Trier par" className="flex gap-2 shrink-0">
          <button type="button" className="chip" data-active={sort === 'savings'} aria-pressed={sort === 'savings'} onClick={() => setSort('savings')}>€ économisés</button>
          <button type="button" className="chip" data-active={sort === 'percent'} aria-pressed={sort === 'percent'} onClick={() => setSort('percent')}>% d'économie</button>
          <button type="button" className="chip" data-active={sort === 'similarity'} aria-pressed={sort === 'similarity'} onClick={() => setSort('similarity')}>Similarité</button>
        </div>
      </div>

      <h2 className="sr-only">Les duels ({list.length})</h2>
      <ul className="grid lg:grid-cols-2 gap-4">
        {list.map((d, i) => <li key={d.id}><DupeCard d={d} i={i} /></li>)}
      </ul>
    </div>
  );
}
