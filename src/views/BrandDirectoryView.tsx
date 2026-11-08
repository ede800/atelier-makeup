import { Search, Star, ThumbsDown, Store, MapPin, ExternalLink } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BRANDS, MARKET_TIERS, brandById } from '../data/brands';
import DOMAINS from '../data/brand-domains.json';
import { categoryById } from '../data/categories';
import { PRODUCTS, totalScore } from '../data/products';
import type { MarketTier } from '../data/types';
import { euro, normalize } from '../lib/helpers';
import { useStore } from '../lib/store';
import { BrandLogo, ProductActions, SectionTitle, Sheet, TierBadge } from '../components/ui';

const SITES = DOMAINS as Record<string, string>;
const NO_OFFICIAL_SITE = new Set(['duo']);

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
  const site = open && !NO_OFFICIAL_SITE.has(open.id) ? SITES[open.id] : undefined;

  return (
    <div>
      <SectionTitle emoji="🏛️" kicker="L'Encyclopédie des Marques" title={<>{BRANDS.length} marques, <em className="gold-text">leur ADN</em>, leurs légendes et leurs flops.</>}>
        Ce que chaque maison fait de mieux — et ce qu'il vaut mieux laisser en rayon.
      </SectionTitle>

      <div role="search" aria-label="Marques" className="flex flex-col gap-3 mb-6">
        <label className="glass rounded-full flex items-center gap-2 px-4 max-w-md focus-within:ring-2 focus-within:ring-gold">
          <Search size={16} className="text-muted" aria-hidden="true" />
          <span className="sr-only">Rechercher une marque</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une marque, une spécialité…" className="bg-transparent outline-none py-3 flex-1 text-sm placeholder:text-muted" />
        </label>
        <div role="group" aria-label="Filtrer par gamme" className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button type="button" className="chip" data-active={tier === 'all'} aria-pressed={tier === 'all'} onClick={() => setTier('all')}>Toutes ({BRANDS.length})</button>
          {(Object.keys(MARKET_TIERS) as MarketTier[]).map((t) => (
            <button type="button" key={t} className="chip" data-active={tier === t} aria-pressed={tier === t} onClick={() => setTier(t)}>
              <span aria-hidden="true">{MARKET_TIERS[t].emoji}</span> {MARKET_TIERS[t].short} <span className="font-mono text-[10px] opacity-70">({BRANDS.filter((b) => b.tier === t).length})</span>
            </button>
          ))}
        </div>
        <p className="sr-only" role="status" aria-live="polite">{list.length} marque{list.length > 1 ? 's' : ''}</p>
      </div>

      {(Object.keys(MARKET_TIERS) as MarketTier[]).filter((t) => list.some((b) => b.tier === t)).map((t) => (
        <section key={t} className="mb-10" aria-labelledby={`tier-${t}`}>
          <div className="flex items-baseline gap-3 mb-3">
            <h2 id={`tier-${t}`} className="font-display text-2xl"><span aria-hidden="true">{MARKET_TIERS[t].emoji} </span>{MARKET_TIERS[t].label}</h2>
            <span className="font-mono text-xs text-muted">{MARKET_TIERS[t].range}</span>
          </div>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {list.filter((b) => b.tier === t).map((b) => (
              <li key={b.id} className="flex">
                <button type="button" onClick={() => navigate('brands', b.id)} aria-haspopup="dialog"
                  className="flex-1 glass rounded-2xl p-4 text-left transition hover:-translate-y-0.5 hover:border-gold/50 fade-up">
                  <span className="flex items-start gap-3">
                    <BrandLogo brand={b.id} size={44} />
                    <span className="min-w-0 flex-1">
                      <span className="flex justify-between items-start gap-2">
                        <span className="font-display text-lg leading-tight">{b.name}</span>
                        <span className="font-mono text-[11px] text-gold-ink shrink-0">{b.priceRange}</span>
                      </span>
                      <span className="block text-[11px] text-muted mt-0.5">{b.country}</span>
                    </span>
                  </span>
                  <span className="block text-[13px] mt-3"><span className="text-muted">Spécialité :</span> {b.specialty}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {list.length === 0 && <p className="glass rounded-2xl p-8 text-center text-muted">Aucune marque pour « {q} ».</p>}

      <Sheet open={!!open} onClose={() => navigate('brands')} title={open ? `Fiche marque : ${open.name}` : ''}>
        {open && (
          <article className="p-6 sm:p-8" aria-labelledby="brand-title">
            <div className="flex items-center gap-4 pr-12">
              <BrandLogo brand={open.id} size={64} label />
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-gold-ink font-semibold"><span aria-hidden="true">{MARKET_TIERS[open.tier].emoji} </span>{MARKET_TIERS[open.tier].label}</p>
                <h2 id="brand-title" className="font-display text-3xl sm:text-4xl mt-1">{open.name}</h2>
              </div>
            </div>
            <ul className="flex flex-wrap gap-x-5 gap-y-1 mt-3 text-sm text-muted">
              <li className="inline-flex items-center gap-1"><MapPin size={14} aria-hidden="true" /><span className="sr-only">Origine : </span>{open.country}</li>
              <li className="font-mono text-gold-ink"><span className="sr-only">Gamme de prix : </span>{open.priceRange}</li>
              <li className="inline-flex items-center gap-1"><Store size={14} aria-hidden="true" /><span className="sr-only">Où l'acheter : </span>{open.shops.join(' · ')}</li>
              {site && (
                <li>
                  <a href={`https://${site}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 underline underline-offset-4 hover:text-ink">
                    Site officiel<span className="sr-only"> de {open.name} (nouvel onglet)</span><ExternalLink size={13} aria-hidden="true" />
                  </a>
                </li>
              )}
            </ul>

            <h3 className="font-display text-xl mt-6 mb-2">Son ADN</h3>
            <p className="leading-relaxed">{open.dna}</p>
            <p className="mt-2 text-sm"><strong>Ce qu'elle fait de mieux :</strong> {open.specialty}</p>

            <div className="grid sm:grid-cols-2 gap-4 mt-6">
              <section className="rounded-2xl bg-gold/10 border border-gold/30 p-4" aria-labelledby="legends">
                <h3 id="legends" className="flex items-center gap-2 font-semibold text-sm mb-2"><Star size={15} className="text-gold-ink" aria-hidden="true" /> Ses 3 produits légendaires</h3>
                <ol className="space-y-1.5 list-decimal list-inside marker:font-mono marker:text-gold-ink">
                  {open.legends.map((l) => <li key={l} className="text-sm">{l}</li>)}
                </ol>
              </section>
              <section className="rounded-2xl bg-rose/10 border border-rose/30 p-4" aria-labelledby="flops">
                <h3 id="flops" className="flex items-center gap-2 font-semibold text-sm mb-2"><ThumbsDown size={15} className="text-rose-ink" aria-hidden="true" /> Ses flops / à éviter</h3>
                <p className="text-sm leading-relaxed">{open.flops}</p>
              </section>
            </div>

            {products.length > 0 && (
              <section aria-labelledby="ranked">
                <h3 id="ranked" className="font-display text-xl mt-8 mb-3">Dans notre classement ({products.length})</h3>
                <ul className="divide-y divide-line">
                  {products.map((p) => (
                    <li key={p.id} className="py-3 flex flex-wrap items-center gap-3">
                      <TierBadge tier={p.tier} />
                      <a href={`#/tier/${p.category}~${p.id}`} className="min-w-0 flex-1 group">
                        <span className="block font-medium text-sm group-hover:underline">{p.name}</span>
                        <span className="block text-[11.5px] text-muted">{categoryById(p.category)?.name} · <span className="font-mono">{totalScore(p)}/100</span></span>
                      </a>
                      <span className="font-mono text-sm">{euro(p.price)}</span>
                      <ProductActions id={p.id} name={`${open.name} ${p.name}`} />
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </article>
        )}
      </Sheet>
    </div>
  );
}
