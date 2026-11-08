import { Search, Star, ThumbsDown, Store, MapPin } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BRANDS, MARKET_TIERS, brandById } from '../data/brands';
import { categoryById } from '../data/categories';
import { PRODUCTS, totalScore } from '../data/products';
import type { MarketTier } from '../data/types';
import { euro, normalize } from '../lib/helpers';
import { useStore } from '../lib/store';
import { ProductActions, SectionTitle, Sheet, TierBadge } from '../components/ui';

export function BrandDirectoryView({ param }: { param?: string }) {
  const { navigate } = useStore();
  const [q, setQ] = useState('');
  const [tier, setTier] = useState<MarketTier | 'all'>('all');
  const open = param ? brandById(param) : undefined;

  const list = useMemo(() => {
    const n = normalize(q.trim());
    return BRANDS.filter((b) => (tier === 'all' || b.tier === tier) && (!n || normalize(`${b.name} ${b.specialty} ${b.country}`).includes(n)));
  }, [q, tier]);

  const products = open ? PRODUCTS.filter((p) => p.brand === open.id).sort((a, b) => totalScore(b) - totalScore(a)) : [];

  return (
    <div>
      <SectionTitle kicker="🏛️ L'Encyclopédie des Marques" title={<>{BRANDS.length} marques, <em className="gold-text">leur ADN</em>, leurs légendes et leurs flops.</>}>
        Ce que chaque maison fait de mieux — et ce qu'il vaut mieux laisser en rayon.
      </SectionTitle>

      <div className="flex flex-col gap-3 mb-6">
        <label className="glass rounded-full flex items-center gap-2 px-4 max-w-md">
          <Search size={16} className="text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une marque, une spécialité…" className="bg-transparent outline-none py-3 flex-1 text-sm placeholder:text-muted" />
        </label>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button className="chip" data-active={tier === 'all'} onClick={() => setTier('all')}>Toutes ({BRANDS.length})</button>
          {(Object.keys(MARKET_TIERS) as MarketTier[]).map((t) => (
            <button key={t} className="chip" data-active={tier === t} onClick={() => setTier(t)}>
              {MARKET_TIERS[t].emoji} {MARKET_TIERS[t].short} <span className="font-mono text-[10px] opacity-60">{BRANDS.filter((b) => b.tier === t).length}</span>
            </button>
          ))}
        </div>
      </div>

      {(Object.keys(MARKET_TIERS) as MarketTier[]).filter((t) => list.some((b) => b.tier === t)).map((t) => (
        <section key={t} className="mb-10">
          <div className="flex items-baseline gap-3 mb-3">
            <h2 className="font-display text-2xl">{MARKET_TIERS[t].emoji} {MARKET_TIERS[t].label}</h2>
            <span className="font-mono text-xs text-muted">{MARKET_TIERS[t].range}</span>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {list.filter((b) => b.tier === t).map((b) => (
              <button key={b.id} onClick={() => navigate('brands', b.id)} className="glass rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:border-gold/50 fade-up">
                <div className="flex justify-between items-start gap-2">
                  <h3 className="font-display text-lg leading-tight">{b.name}</h3>
                  <span className="font-mono text-[11px] text-gold-ink shrink-0">{b.priceRange}</span>
                </div>
                <p className="text-[11px] text-muted mt-0.5">{b.country}</p>
                <p className="text-[13px] mt-2"><span className="text-muted">Spécialité :</span> {b.specialty}</p>
              </button>
            ))}
          </div>
        </section>
      ))}
      {list.length === 0 && <p className="glass rounded-2xl p-8 text-center text-muted">Aucune marque pour « {q} ».</p>}

      <Sheet open={!!open} onClose={() => navigate('brands')} title={open?.name ?? ''}>
        {open && (
          <div className="p-6 sm:p-8">
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold-ink font-semibold">{MARKET_TIERS[open.tier].emoji} {MARKET_TIERS[open.tier].label}</p>
            <h2 className="font-display text-3xl sm:text-4xl mt-1 pr-10">{open.name}</h2>
            <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1"><MapPin size={14} />{open.country}</span>
              <span className="font-mono text-gold-ink">{open.priceRange}</span>
              <span className="inline-flex items-center gap-1"><Store size={14} />{open.shops.join(' · ')}</span>
            </div>

            <h3 className="font-display text-xl mt-6 mb-2">Son ADN</h3>
            <p className="leading-relaxed">{open.dna}</p>
            <p className="mt-2 text-sm"><strong>Ce qu'elle fait de mieux :</strong> {open.specialty}</p>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <div className="rounded-2xl bg-gold/10 border border-gold/30 p-4">
                <h3 className="flex items-center gap-2 font-semibold text-sm mb-2"><Star size={15} className="text-gold-ink" /> Ses 3 produits légendaires</h3>
                <ol className="space-y-1.5">
                  {open.legends.map((l, i) => <li key={l} className="text-sm flex gap-2"><span className="font-mono text-gold-ink">{i + 1}.</span>{l}</li>)}
                </ol>
              </div>
              <div className="rounded-2xl bg-rose/10 border border-rose/30 p-4">
                <h3 className="flex items-center gap-2 font-semibold text-sm mb-2"><ThumbsDown size={15} className="text-rose-ink" /> Ses flops / à éviter</h3>
                <p className="text-sm leading-relaxed">{open.flops}</p>
              </div>
            </div>

            {products.length > 0 && (
              <>
                <h3 className="font-display text-xl mt-8 mb-3">Dans notre classement ({products.length})</h3>
                <ul className="divide-y divide-line">
                  {products.map((p) => (
                    <li key={p.id} className="py-3 flex flex-wrap items-center gap-3">
                      <TierBadge tier={p.tier} />
                      <button className="min-w-0 flex-1 text-left" onClick={() => navigate('tier', `${p.category}~${p.id}`)}>
                        <p className="font-medium text-sm hover:underline">{p.name}</p>
                        <p className="text-[11.5px] text-muted">{categoryById(p.category)?.name} · <span className="font-mono">{totalScore(p)}/100</span></p>
                      </button>
                      <span className="font-mono text-sm">{euro(p.price)}</span>
                      <ProductActions id={p.id} />
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </Sheet>
    </div>
  );
}
