import { Lightbulb, Medal, Rows3, LayoutList } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { brandName } from '../data/brands';
import { CATEGORIES, ZONES, categoryById } from '../data/categories';
import { PRODUCTS, productsByCategory, totalScore } from '../data/products';
import type { PriceLevel, Product, SkinType, Tier } from '../data/types';
import { LEVEL_LABELS, SKIN_LABELS, TIER_META, euro, priceLevel } from '../lib/helpers';
import { useStore } from '../lib/store';
import { ProductActions, ProductCard, ScoreBars, ScoreRing, SectionTitle, TierBadge } from '../components/ui';

const TIERS: Tier[] = ['S', 'A', 'B', 'Surcote'];
const LEVELS: PriceLevel[] = ['budget', 'mid', 'luxe'];

function Podium({ catId }: { catId: string }) {
  const cat = categoryById(catId)!;
  const items = LEVELS.map((lv) => ({ lv, p: PRODUCTS.find((p) => p.category === catId && p.podium === lv) }));
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {items.map(({ lv, p }, i) => (
        <div key={lv} className="glass rounded-3xl p-5 relative overflow-hidden fade-up" style={{ animationDelay: `${i * 70}ms` }}>
          <div className="absolute -right-8 -top-8 size-28 rounded-full opacity-25" style={{ background: lv === 'budget' ? 'var(--sage)' : lv === 'mid' ? 'var(--gold)' : 'var(--rose)' }} />
          <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-gold-ink flex items-center gap-1.5">
            <Medal size={14} /> 🥇 {LEVEL_LABELS[lv].podium}
          </p>
          <p className="text-[11px] text-muted mt-0.5">{lv === 'budget' ? '< 15 – 16 €' : lv === 'mid' ? 'Milieu de gamme' : 'Sans limite de budget'}</p>
          {p ? (
            <>
              <div className="mt-4 flex items-start gap-3">
                <ScoreRing value={totalScore(p)} size={52} />
                <div className="min-w-0">
                  <p className="text-[11px] uppercase tracking-wider text-muted">{brandName(p.brand)}</p>
                  <h3 className="font-display text-xl leading-tight">{p.name}</h3>
                </div>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-mono text-2xl font-semibold">{euro(p.price)}</span>
                <span className="font-mono text-xs text-muted">{p.size}</span>
                <span className="ml-auto"><TierBadge tier={p.tier} /></span>
              </div>
              <p className="mt-2 text-[13px] text-muted leading-relaxed">{p.verdict}</p>
              <div className="mt-3"><ScoreBars scores={p.scores} /></div>
              <div className="mt-4 flex justify-end"><ProductActions id={p.id} /></div>
            </>
          ) : (
            <p className="mt-4 text-sm text-muted leading-relaxed italic">{cat.podiumNote ?? 'Pas de recommandation dans cette gamme.'}</p>
          )}
        </div>
      ))}
    </div>
  );
}

function AllPodiums() {
  const { navigate } = useStore();
  return (
    <div className="space-y-10">
      {ZONES.map((z) => (
        <section key={z.id}>
          <h2 className="font-display text-2xl mb-3">{z.emoji} {z.name}</h2>
          <div className="glass rounded-2xl overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted border-b border-line">
                  <th className="p-3 font-medium">Catégorie</th>
                  {LEVELS.map((lv) => <th key={lv} className="p-3 font-medium">{LEVEL_LABELS[lv].emoji} {LEVEL_LABELS[lv].podium}</th>)}
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.filter((c) => c.zone === z.id).map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0 hover:bg-bg-2/60 cursor-pointer" onClick={() => navigate('tier', c.id)}>
                    <td className="p-3 font-medium">{c.name}</td>
                    {LEVELS.map((lv) => {
                      const p = PRODUCTS.find((x) => x.category === c.id && x.podium === lv);
                      return (
                        <td key={lv} className="p-3 align-top">
                          {p ? (
                            <>
                              <span className="block text-[11px] text-muted">{brandName(p.brand)}</span>
                              <span className="block">{p.name}</span>
                              <span className="font-mono text-xs text-gold-ink">{euro(p.price)} · {totalScore(p)}/100</span>
                            </>
                          ) : <span className="text-muted">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </div>
  );
}

export function TierListView({ param }: { param?: string }) {
  const { profile, navigate } = useStore();
  const [paramCat, highlightId] = (param ?? '').split('~');
  const catId = categoryById(paramCat) ? paramCat : CATEGORIES[0].id;
  const cat = categoryById(catId)!;
  const [mode, setMode] = useState<'cat' | 'all'>('cat');
  const [tierFilter, setTierFilter] = useState<Tier | 'all'>('all');
  const [levelFilter, setLevelFilter] = useState<PriceLevel | 'all'>('all');
  const [skinFilter, setSkinFilter] = useState<SkinType | 'all'>(profile.skin ?? 'all');

  useEffect(() => {
    if (!highlightId) return;
    setMode('cat');
    setTierFilter('all');
    setLevelFilter('all');
    setSkinFilter('all');
    const t = setTimeout(() => document.getElementById(`p-${highlightId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
    return () => clearTimeout(t);
  }, [highlightId]);

  const products = useMemo(() => {
    return productsByCategory(catId)
      .filter((p) => tierFilter === 'all' || p.tier === tierFilter)
      .filter((p) => levelFilter === 'all' || priceLevel(p) === levelFilter)
      .filter((p) => skinFilter === 'all' || p.skin.includes(skinFilter))
      .sort((a, b) => totalScore(b) - totalScore(a));
  }, [catId, tierFilter, levelFilter, skinFilter]);

  const byTier = TIERS.map((t) => ({ t, list: products.filter((p) => p.tier === t) })).filter((g) => g.list.length);

  return (
    <div>
      <SectionTitle kicker="🏆 Le Grand Ranking & Tier-List" title={<>Le meilleur produit, <em className="gold-text">pour chaque geste</em> et chaque budget.</>}>
        {CATEGORIES.length} catégories, {PRODUCTS.length} références testées et notées sur 100 : tenue, pigmentation, confort et rapport qualité/prix. Sans langue de bois — y compris les produits surcotés.
      </SectionTitle>

      <div className="flex gap-2 mb-6">
        <button className="chip" data-active={mode === 'cat'} onClick={() => setMode('cat')}><LayoutList size={14} /> Par catégorie</button>
        <button className="chip" data-active={mode === 'all'} onClick={() => setMode('all')}><Rows3 size={14} /> Tous les podiums</button>
      </div>

      {mode === 'all' ? <AllPodiums /> : (
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          {/* Sélecteur de catégorie */}
          <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto no-scrollbar">
            <div className="lg:hidden">
              <label className="text-[11px] uppercase tracking-wider text-muted" htmlFor="cat-select">Catégorie</label>
              <select id="cat-select" value={catId} onChange={(e) => navigate('tier', e.target.value)}
                className="mt-1 w-full glass rounded-xl px-3 py-3 text-sm bg-solid">
                {ZONES.map((z) => (
                  <optgroup key={z.id} label={`${z.emoji} ${z.name}`}>
                    {CATEGORIES.filter((c) => c.zone === z.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <nav className="hidden lg:block space-y-5" aria-label="Catégories">
              {ZONES.map((z) => (
                <div key={z.id}>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-muted font-semibold mb-1.5 px-2">{z.emoji} {z.name}</p>
                  {CATEGORIES.filter((c) => c.zone === z.id).map((c) => (
                    <button key={c.id} onClick={() => navigate('tier', c.id)} data-active={c.id === catId}
                      className="block w-full text-left px-2 py-1.5 rounded-lg text-[13px] text-muted hover:text-ink data-[active=true]:bg-surface data-[active=true]:text-ink data-[active=true]:font-semibold data-[active=true]:shadow-sm transition">
                      {c.name}
                    </button>
                  ))}
                </div>
              ))}
            </nav>
          </aside>

          <div className="min-w-0" key={catId}>
            <div className="mb-6 fade-up">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{ZONES.find((z) => z.id === cat.zone)?.name} · {cat.en}</p>
              <h2 className="font-display text-3xl sm:text-4xl mt-1">{cat.name}</h2>
              <p className="mt-2 text-muted max-w-3xl leading-relaxed">{cat.description}</p>
              <div className="mt-4 glass rounded-2xl p-4 flex gap-3 max-w-3xl">
                <Lightbulb size={18} className="text-gold-ink shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed"><strong className="font-semibold">Le conseil de la maquilleuse — </strong>{cat.expertTip}</p>
              </div>
            </div>

            <Podium catId={catId} />

            {/* Filtres */}
            <div className="mt-10 mb-5 flex flex-col gap-3">
              <h3 className="font-display text-2xl">La Tier-List complète</h3>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button className="chip" data-active={tierFilter === 'all'} onClick={() => setTierFilter('all')}>Tous les tiers</button>
                {TIERS.map((t) => <button key={t} className="chip" data-active={tierFilter === t} onClick={() => setTierFilter(t)}>{TIER_META[t].label}</button>)}
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button className="chip" data-active={levelFilter === 'all'} onClick={() => setLevelFilter('all')}>Tous budgets</button>
                {LEVELS.map((l) => <button key={l} className="chip" data-active={levelFilter === l} onClick={() => setLevelFilter(l)}>{LEVEL_LABELS[l].emoji} {LEVEL_LABELS[l].label}</button>)}
              </div>
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                <button className="chip" data-active={skinFilter === 'all'} onClick={() => setSkinFilter('all')}>Toutes peaux</button>
                {(Object.keys(SKIN_LABELS) as SkinType[]).map((s) => <button key={s} className="chip" data-active={skinFilter === s} onClick={() => setSkinFilter(s)}>{SKIN_LABELS[s]}</button>)}
              </div>
            </div>

            {byTier.length === 0 && <p className="glass rounded-2xl p-8 text-center text-muted">Aucun produit ne correspond à ces filtres dans cette catégorie.</p>}

            <div className="space-y-6">
              {byTier.map(({ t, list }) => (
                <TierRow key={t} tier={t} list={list} highlightId={highlightId} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TierRow({ tier, list, highlightId }: { tier: Tier; list: Product[]; highlightId?: string }) {
  const m = TIER_META[tier];
  return (
    <section className="grid sm:grid-cols-[88px_1fr] gap-3 fade-up">
      <div className={`${m.cls} rounded-2xl flex sm:flex-col items-center justify-center gap-2 p-3 sm:min-h-32`}>
        <span className="font-display text-2xl sm:text-4xl font-semibold">{tier === 'Surcote' ? '✕' : tier}</span>
        <span className="text-[10px] uppercase tracking-wider font-semibold text-center leading-tight">{m.label}</span>
      </div>
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {list.map((p) => <ProductCard key={p.id} p={p} highlight={p.id === highlightId} />)}
      </div>
    </section>
  );
}
