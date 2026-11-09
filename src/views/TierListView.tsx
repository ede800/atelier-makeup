import { Lightbulb, Medal, Rows3, LayoutList } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { brandName } from '../data/brands';
import { CATEGORIES, ZONES, categoryById } from '../data/categories';
import { PRODUCTS, productsByCategory, totalScore } from '../data/products';
import type { PriceLevel, Product, SkinType, Tier } from '../data/types';
import { LEVEL_LABELS, SKIN_LABELS, TIER_META, euro, priceLevel } from '../lib/helpers';
import { useStore } from '../lib/store';
import { detailsOf } from '../data/product-details';
import { BrandLogo, ProductActions, ProductCard, ScoreBars, ScoreRing, SectionTitle, TierBadge } from '../components/ui';

const TIERS: Tier[] = ['S', 'A', 'B', 'Surcote'];
const LEVELS: PriceLevel[] = ['budget', 'mid', 'luxe'];

function Podium({ catId }: { catId: string }) {
  const cat = categoryById(catId)!;
  const items = LEVELS.map((lv) => ({ lv, p: PRODUCTS.find((p) => p.category === catId && p.podium === lv) }));
  return (
    <section aria-labelledby="podium-title">
      <h3 id="podium-title" className="sr-only">Podium par budget</h3>
      <ul className="grid md:grid-cols-3 gap-4">
        {items.map(({ lv, p }, i) => (
          <li key={lv} className="glass rounded-3xl p-5 relative overflow-hidden fade-up" style={{ animationDelay: `${i * 70}ms` }}>
            <div aria-hidden="true" className="absolute -right-8 -top-8 size-28 rounded-full opacity-25" style={{ background: lv === 'budget' ? 'var(--sage)' : lv === 'mid' ? 'var(--gold)' : 'var(--rose)' }} />
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-gold-ink flex items-center gap-1.5">
              <Medal size={14} aria-hidden="true" /> {LEVEL_LABELS[lv].podium}
            </p>
            <p className="text-[11px] text-muted mt-0.5">{lv === 'budget' ? 'Moins de 15 – 16 €' : lv === 'mid' ? 'Milieu de gamme' : 'Sans limite de budget'}</p>
            {p ? (
              <>
                <div className="mt-4 flex items-start gap-3">
                  <ScoreRing value={totalScore(p)} size={52} />
                  <div className="min-w-0">
                    <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted">
                      <BrandLogo brand={p.brand} size={20} />{brandName(p.brand)}
                    </p>
                    <h4 className="font-display text-xl leading-tight">{p.name}</h4>
                  </div>
                </div>
                <p className="mt-3 flex items-baseline gap-2">
                  <span className="font-mono text-2xl font-semibold"><span className="sr-only">Prix : </span>{euro(p.price)}</span>
                  <span className="font-mono text-xs text-muted">{p.size}</span>
                  <span className="ml-auto"><TierBadge tier={p.tier} /></span>
                </p>
                <p className="mt-2 text-[13px] text-muted leading-relaxed">{p.verdict}</p>
                <div className="mt-3"><ScoreBars scores={p.scores} /></div>
                <div className="mt-4 flex justify-end"><ProductActions id={p.id} name={`${brandName(p.brand)} ${p.name}`} /></div>
              </>
            ) : (
              <p className="mt-4 text-sm text-muted leading-relaxed italic">{cat.podiumNote ?? 'Pas de recommandation dans cette gamme.'}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function AllPodiums() {
  const { navigate } = useStore();
  return (
    <div className="space-y-10">
      {ZONES.map((z) => (
        <section key={z.id} aria-labelledby={`zone-${z.id}`}>
          <h2 id={`zone-${z.id}`} className="font-display text-2xl mb-3"><span aria-hidden="true">{z.emoji} </span>{z.name}</h2>
          <div className="glass rounded-2xl overflow-x-auto" tabIndex={0} role="region" aria-label={`Tableau des podiums : ${z.name}`}>
            <table className="w-full text-sm min-w-[720px]">
              <caption className="sr-only">Podiums de la zone {z.name} : meilleur produit par gamme de prix et par catégorie</caption>
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wider text-muted border-b border-line">
                  <th scope="col" className="p-3 font-medium">Catégorie</th>
                  {LEVELS.map((lv) => <th key={lv} scope="col" className="p-3 font-medium">{LEVEL_LABELS[lv].podium}</th>)}
                </tr>
              </thead>
              <tbody>
                {CATEGORIES.filter((c) => c.zone === z.id).map((c) => (
                  <tr key={c.id} className="border-b border-line last:border-0">
                    <th scope="row" className="p-3 font-medium text-left align-top">
                      <a href={`#/tier/${c.id}`} onClick={(e) => { e.preventDefault(); navigate('tier', c.id); }} className="underline decoration-gold/50 underline-offset-4 hover:decoration-gold">
                        {c.name}
                      </a>
                    </th>
                    {LEVELS.map((lv) => {
                      const p = PRODUCTS.find((x) => x.category === c.id && x.podium === lv);
                      return (
                        <td key={lv} className="p-3 align-top">
                          {p ? (
                            <>
                              <span className="flex items-center gap-1.5 text-[11px] text-muted"><BrandLogo brand={p.brand} size={16} />{brandName(p.brand)}</span>
                              <span className="block">{p.name}</span>
                              <span className="font-mono text-xs text-gold-ink">{euro(p.price)} · {totalScore(p)}/100</span>
                            </>
                          ) : <span className="text-muted">—<span className="sr-only"> aucun</span></span>}
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

function FilterGroup<T extends string>({ label, value, options, onChange }: {
  label: string; value: T | 'all'; options: { v: T | 'all'; label: string }[]; onChange: (v: T | 'all') => void;
}) {
  return (
    <div role="group" aria-label={label} className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
      {options.map((o) => (
        <button key={o.v} type="button" className="chip" data-active={value === o.v} aria-pressed={value === o.v} onClick={() => onChange(o.v)}>{o.label}</button>
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
  const [acneOnly, setAcneOnly] = useState(false);
  const [ffOnly, setFfOnly] = useState(false);

  useEffect(() => {
    if (!highlightId) return;
    setMode('cat');
    setTierFilter('all');
    setLevelFilter('all');
    setSkinFilter('all');
    setAcneOnly(false);
    setFfOnly(false);
    const t = setTimeout(() => {
      const el = document.getElementById(`p-${highlightId}`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el?.focus({ preventScroll: true });
    }, 150);
    return () => clearTimeout(t);
  }, [highlightId]);

  const products = useMemo(() => {
    return productsByCategory(catId)
      .filter((p) => tierFilter === 'all' || p.tier === tierFilter)
      .filter((p) => levelFilter === 'all' || priceLevel(p) === levelFilter)
      .filter((p) => skinFilter === 'all' || p.skin.includes(skinFilter))
      .filter((p) => !acneOnly || detailsOf(p).acneSafe === true)
      .filter((p) => !ffOnly || detailsOf(p).fragranceFree === true)
      .sort((a, b) => totalScore(b) - totalScore(a));
  }, [catId, tierFilter, levelFilter, skinFilter, acneOnly, ffOnly]);

  const byTier = TIERS.map((t) => ({ t, list: products.filter((p) => p.tier === t) })).filter((g) => g.list.length);

  return (
    <div>
      <SectionTitle emoji="🏆" kicker="Le Grand Ranking & Tier-List" title={<>Le meilleur produit, <em className="gold-text">pour chaque geste</em> et chaque budget.</>}>
        {CATEGORIES.length} catégories, {PRODUCTS.length} références testées et notées sur 100 : tenue, pigmentation, confort et rapport qualité/prix. Sans langue de bois — y compris les produits surcotés.
      </SectionTitle>

      <div role="group" aria-label="Mode d'affichage" className="flex gap-2 mb-6">
        <button type="button" className="chip" data-active={mode === 'cat'} aria-pressed={mode === 'cat'} onClick={() => setMode('cat')}><LayoutList size={14} aria-hidden="true" /> Par catégorie</button>
        <button type="button" className="chip" data-active={mode === 'all'} aria-pressed={mode === 'all'} onClick={() => setMode('all')}><Rows3 size={14} aria-hidden="true" /> Tous les podiums</button>
      </div>

      {mode === 'all' ? <AllPodiums /> : (
        <div className="grid lg:grid-cols-[260px_1fr] gap-8">
          <aside className="lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto no-scrollbar">
            <div className="lg:hidden">
              <label className="text-[11px] uppercase tracking-wider text-muted" htmlFor="cat-select">Catégorie</label>
              <select id="cat-select" value={catId} onChange={(e) => navigate('tier', e.target.value)}
                className="mt-1 w-full glass rounded-xl px-3 py-3 text-sm bg-solid">
                {ZONES.map((z) => (
                  <optgroup key={z.id} label={z.name}>
                    {CATEGORIES.filter((c) => c.zone === z.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </div>
            <nav className="hidden lg:block space-y-5" aria-label="Catégories">
              {ZONES.map((z) => (
                <div key={z.id}>
                  <p id={`nav-zone-${z.id}`} className="text-[11px] uppercase tracking-[0.18em] text-muted font-semibold mb-1.5 px-2"><span aria-hidden="true">{z.emoji} </span>{z.name}</p>
                  <ul aria-labelledby={`nav-zone-${z.id}`}>
                    {CATEGORIES.filter((c) => c.zone === z.id).map((c) => (
                      <li key={c.id}>
                        <a href={`#/tier/${c.id}`} aria-current={c.id === catId ? 'page' : undefined}
                          className="block w-full text-left px-2 py-1.5 rounded-lg text-[13px] text-muted hover:text-ink aria-[current=page]:bg-surface aria-[current=page]:text-ink aria-[current=page]:font-semibold aria-[current=page]:shadow-sm transition">
                          {c.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </nav>
          </aside>

          <div className="min-w-0" key={catId}>
            <div className="mb-6 fade-up">
              <p className="text-[11px] uppercase tracking-[0.2em] text-muted">{ZONES.find((z) => z.id === cat.zone)?.name} · <span lang="en">{cat.en}</span></p>
              <h2 className="font-display text-3xl sm:text-4xl mt-1">{cat.name}</h2>
              <p className="mt-2 text-muted max-w-3xl leading-relaxed">{cat.description}</p>
              <aside aria-label="Conseil de la maquilleuse" className="mt-4 glass rounded-2xl p-4 flex gap-3 max-w-3xl">
                <Lightbulb size={18} className="text-gold-ink shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-sm leading-relaxed"><strong className="font-semibold">Le conseil de la maquilleuse — </strong>{cat.expertTip}</p>
              </aside>
            </div>

            <Podium catId={catId} />

            <section aria-labelledby="tierlist-title" className="mt-10">
              <div className="mb-5 flex flex-col gap-3">
                <h3 id="tierlist-title" className="font-display text-2xl">La Tier-List complète</h3>
                <FilterGroup label="Filtrer par classement" value={tierFilter} onChange={setTierFilter}
                  options={[{ v: 'all', label: 'Tous les tiers' }, ...TIERS.map((t) => ({ v: t, label: TIER_META[t].label }))]} />
                <FilterGroup label="Filtrer par budget" value={levelFilter} onChange={setLevelFilter}
                  options={[{ v: 'all', label: 'Tous budgets' }, ...LEVELS.map((l) => ({ v: l, label: LEVEL_LABELS[l].label }))]} />
                <FilterGroup label="Filtrer par type de peau" value={skinFilter} onChange={setSkinFilter}
                  options={[{ v: 'all', label: 'Toutes peaux' }, ...(Object.keys(SKIN_LABELS) as SkinType[]).map((s) => ({ v: s, label: SKIN_LABELS[s] }))]} />
                <div role="group" aria-label="Peaux sensibles et acnéiques" className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                  <button type="button" className="chip" data-active={acneOnly} aria-pressed={acneOnly} onClick={() => setAcneOnly(!acneOnly)}>Non comédogène / acné-safe</button>
                  <button type="button" className="chip" data-active={ffOnly} aria-pressed={ffOnly} onClick={() => setFfOnly(!ffOnly)}>Sans parfum</button>
                </div>
                {(acneOnly || ffOnly) && <p className="text-[11.5px] text-muted">Selon les allégations publiées par les marques ; les produits sans information sont masqués.</p>}
                <p className="sr-only" role="status" aria-live="polite">{products.length} produit{products.length > 1 ? 's' : ''} affiché{products.length > 1 ? 's' : ''}</p>
              </div>

              {byTier.length === 0 && <p className="glass rounded-2xl p-8 text-center text-muted">Aucun produit ne correspond à ces filtres dans cette catégorie.</p>}

              <div className="space-y-6">
                {byTier.map(({ t, list }) => (
                  <TierRow key={t} tier={t} list={list} highlightId={highlightId} />
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
}

function TierRow({ tier, list, highlightId }: { tier: Tier; list: Product[]; highlightId?: string }) {
  const m = TIER_META[tier];
  return (
    <section aria-labelledby={`tier-${tier}`} className="grid sm:grid-cols-[88px_1fr] gap-3 fade-up">
      <div className={`${m.cls} rounded-2xl flex sm:flex-col items-center justify-center gap-2 p-3 sm:min-h-32`}>
        <span aria-hidden="true" className="font-display text-2xl sm:text-4xl font-semibold">{tier === 'Surcote' ? '✕' : tier}</span>
        <h4 id={`tier-${tier}`} className="text-[10px] uppercase tracking-wider font-semibold text-center leading-tight">
          {m.label}<span className="sr-only"> — {m.desc} ({list.length})</span>
        </h4>
      </div>
      <ul className="grid md:grid-cols-2 xl:grid-cols-3 gap-3">
        {list.map((p) => <li key={p.id} className="flex"><div className="flex-1 flex flex-col [&>article]:flex-1"><ProductCard p={p} highlight={p.id === highlightId} headingLevel={5} /></div></li>)}
      </ul>
    </section>
  );
}
