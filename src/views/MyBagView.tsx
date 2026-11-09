import { Download, Copy, Trash2, Swords, Heart, ShoppingBag, UserRound, ArrowRight, Timer, X } from 'lucide-react';
import { useState } from 'react';
import { brandName } from '../data/brands';
import { CATEGORIES, ZONES, categoryById } from '../data/categories';
import { PAO_BY_CATEGORY } from '../data/inci';
import { UNDERTONES } from '../data/masterclass';
import { BASE_LABELS, detailsOf, pricePer10 } from '../data/product-details';
import { productById, totalScore } from '../data/products';
import type { Product, SkinType } from '../data/types';
import { SKIN_LABELS, euro } from '../lib/helpers';
import { usePersistent, useStore } from '../lib/store';
import { BrandLogo, ScoreRing, SectionTitle, Sheet, TierBadge } from '../components/ui';
import { LayerCompatibility } from '../components/LayerCompatibility';

function exportText(items: Product[]) {
  const lines = ["L'ATELIER MAKEUP — Ma liste de courses", `Générée le ${new Date().toLocaleDateString('fr-FR')}`, ''];
  for (const z of ZONES) {
    const zi = items.filter((p) => categoryById(p.category)?.zone === z.id);
    if (!zi.length) continue;
    lines.push(`— ${z.name.toUpperCase()}`);
    zi.forEach((p) => lines.push(`☐ ${brandName(p.brand)} — ${p.name} (${p.size}) : ${euro(p.price)}`));
    lines.push('');
  }
  lines.push(`TOTAL : ${euro(items.reduce((s, p) => s + p.price, 0))} · ${items.length} produits`);
  return lines.join('\n');
}

// ——— Duel côte à côte (2 ou 3 produits)
type Row = { label: string; values: string[]; best?: number[] };
const yesNo = (v?: boolean) => (v === true ? 'Oui' : v === false ? 'Non' : 'Non communiqué');

function bestIdx(nums: (number | null)[], higher: boolean): number[] {
  const valid = nums.filter((n): n is number => n !== null);
  if (valid.length < 2) return [];
  const target = higher ? Math.max(...valid) : Math.min(...valid);
  if (valid.every((n) => n === target)) return [];
  return nums.map((n, i) => (n === target ? i : -1)).filter((i) => i >= 0);
}

function Duel({ items }: { items: Product[] }) {
  const det = items.map(detailsOf);
  const p10 = items.map((p) => pricePer10(p));
  const rows: Row[] = [
    { label: 'Score global', values: items.map((p) => `${totalScore(p)}/100`), best: bestIdx(items.map(totalScore), true) },
    { label: 'Prix', values: items.map((p) => euro(p.price)), best: bestIdx(items.map((p) => p.price), false) },
    { label: 'Format', values: items.map((p) => p.size) },
    { label: 'Prix réel / 10 ml ou g', values: p10.map((x) => x?.label ?? '—'), best: bestIdx(p10.map((x) => x?.value ?? null), false) },
    { label: 'Format mini', values: det.map((d) => (d.mini ? `${euro(d.mini.price)} · ${d.mini.size}` : 'Non')) },
    { label: 'Base de formule', values: det.map((d) => (d.baseType ? BASE_LABELS[d.baseType] : '—')) },
    { label: 'Fini', values: items.map((p) => p.finish) },
    { label: 'Tenue', values: items.map((p) => `${p.scores.tenue}`), best: bestIdx(items.map((p) => p.scores.tenue), true) },
    { label: 'Pigmentation / fini', values: items.map((p) => `${p.scores.pigment}`), best: bestIdx(items.map((p) => p.scores.pigment), true) },
    { label: 'Confort', values: items.map((p) => `${p.scores.confort}`), best: bestIdx(items.map((p) => p.scores.confort), true) },
    { label: 'Rapport qualité/prix', values: items.map((p) => `${p.scores.valeur}`), best: bestIdx(items.map((p) => p.scores.valeur), true) },
    { label: 'Non comédogène', values: det.map((d) => yesNo(d.acneSafe)) },
    { label: 'Sans parfum', values: det.map((d) => yesNo(d.fragranceFree)) },
    { label: 'Sans talc', values: det.map((d) => yesNo(d.talcFree)) },
    { label: 'Peaux', values: items.map((p) => p.skin.map((s) => SKIN_LABELS[s]).join(', ')) },
  ];
  return (
    <div className="p-5 sm:p-8">
      <h2 className="font-display text-3xl pr-12">Le duel</h2>
      <p className="text-sm text-muted mt-1">La meilleure valeur de chaque ligne est surlignée.</p>
      <div className="overflow-x-auto mt-5" tabIndex={0} role="region" aria-label="Tableau de comparaison">
        <table className="w-full text-sm min-w-[560px]">
          <caption className="sr-only">Comparaison de {items.map((p) => p.name).join(', ')}</caption>
          <thead>
            <tr className="border-b border-line">
              <td className="w-40" />
              {items.map((p) => (
                <th key={p.id} scope="col" className="text-left p-3 align-top font-normal">
                  <span className="flex items-center gap-2"><BrandLogo brand={p.brand} size={28} /><span className="text-[11px] uppercase tracking-wider text-muted">{brandName(p.brand)}</span></span>
                  <span className="font-display text-lg block mt-1">{p.name}</span> <TierBadge tier={p.tier} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className="border-b border-line last:border-0">
                <th scope="row" className="p-3 text-muted text-[12.5px] text-left font-normal">{r.label}</th>
                {r.values.map((v, i) => {
                  const best = r.best?.includes(i);
                  return (
                    <td key={i} className={`p-3 font-mono text-[13px] ${best ? 'text-sage-ink font-semibold bg-sage/10' : ''}`}>
                      {v}{best && <span className="sr-only"> (meilleur)</span>}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ——— Suivi PAO
interface PaoEntry { opened: string; months: number }
const thisMonth = () => new Date().toISOString().slice(0, 7);
function expiry(e: PaoEntry) {
  const [y, m] = e.opened.split('-').map(Number);
  const end = new Date(y, m - 1 + e.months, 1);
  const now = new Date();
  const monthsLeft = (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth());
  return { end, monthsLeft, status: monthsLeft < 0 ? 'expired' : monthsLeft <= 1 ? 'soon' : 'ok' } as const;
}
const PAO_STATUS = {
  ok: { label: 'En bon état', cls: 'bg-sage/20 text-sage-ink' },
  soon: { label: 'À finir ce mois-ci', cls: 'bg-gold/25 text-gold-ink' },
  expired: { label: 'Périmé : à jeter', cls: 'bg-rose/20 text-rose-ink' },
};

function PaoControl({ p, entry, onChange }: { p: Product; entry?: PaoEntry; onChange: (e: PaoEntry | undefined) => void }) {
  if (!entry) {
    return (
      <button type="button" className="chip !py-1.5 text-xs" onClick={() => onChange({ opened: thisMonth(), months: PAO_BY_CATEGORY[p.category] ?? 12 })}>
        <Timer size={13} /> Ouvert ce mois-ci<span className="sr-only"> : {p.name}</span>
      </button>
    );
  }
  const ex = expiry(entry);
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs w-full sm:w-auto">
      <label className="flex items-center gap-1">
        <span className="text-muted">Ouvert</span>
        <input type="month" value={entry.opened} max={thisMonth()} onChange={(e) => e.target.value && onChange({ ...entry, opened: e.target.value })}
          className="rounded-lg border border-line bg-solid px-2 py-1 font-mono" aria-label={`Mois d'ouverture de ${p.name}`} />
      </label>
      <label className="flex items-center gap-1">
        <span className="text-muted">PAO</span>
        <select value={entry.months} onChange={(e) => onChange({ ...entry, months: Number(e.target.value) })} className="rounded-lg border border-line bg-solid px-2 py-1 font-mono" aria-label={`Durée après ouverture de ${p.name}`}>
          {[3, 6, 12, 18, 24].map((m) => <option key={m} value={m}>{m}M</option>)}
        </select>
      </label>
      <span className={`px-2 py-1 rounded-full font-semibold ${PAO_STATUS[ex.status].cls}`}>
        {PAO_STATUS[ex.status].label} · {ex.end.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' })}
      </span>
      <button type="button" onClick={() => onChange(undefined)} className="grid place-items-center size-7 rounded-full border border-line" aria-label={`Arrêter le suivi de ${p.name}`}><X size={12} /></button>
    </div>
  );
}

function CmpButton({ p, active, onToggle }: { p: Product; active: boolean; onToggle: () => void }) {
  return (
    <button type="button" onClick={onToggle} data-active={active} aria-pressed={active} className="chip !py-1.5 text-xs">
      <Swords size={13} /> Duel<span className="sr-only"> : {p.name}</span>
    </button>
  );
}

export function MyBagView() {
  const { bag, wishlist, toggleBag, toggleWish, clearBag, navigate, profile, setProfile, notify } = useStore();
  const items = bag.map(productById).filter((p): p is Product => !!p);
  const wished = wishlist.map(productById).filter((p): p is Product => !!p);
  const [cmp, setCmp] = useState<string[]>([]);
  const [duelOpen, setDuelOpen] = useState(false);
  const [pao, setPao] = usePersistent<Record<string, PaoEntry>>('atelier.pao', {});
  const total = items.reduce((s, p) => s + p.price, 0);
  const avg = items.length ? Math.round(items.reduce((s, p) => s + totalScore(p), 0) / items.length) : 0;
  const coveredCats = new Set(items.map((p) => p.category)).size;
  const tracked = items.filter((p) => pao[p.id]).map((p) => ({ p, ex: expiry(pao[p.id]) }));
  const expired = tracked.filter((t) => t.ex.status === 'expired');
  const soon = tracked.filter((t) => t.ex.status === 'soon');

  const toggleCmp = (id: string) => setCmp((c) => (c.includes(id) ? c.filter((x) => x !== id) : c.length >= 3 ? [...c.slice(1), id] : [...c, id]));
  const cmpProducts = cmp.map(productById).filter((p): p is Product => !!p);
  const setEntry = (id: string, e?: PaoEntry) => {
    const next = { ...pao };
    if (e) next[id] = e; else delete next[id];
    setPao(next);
  };

  const download = () => {
    const blob = new Blob([exportText(items)], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ma-trousse-atelier-makeup.txt';
    a.click();
    URL.revokeObjectURL(url);
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportText(items));
      notify('Liste copiée dans le presse-papiers 📋');
    } catch {
      notify('Copie impossible dans ce navigateur');
    }
  };

  return (
    <div>
      <SectionTitle emoji="👜" kicker="Ma Trousse & Comparateur" title={<>Votre trousse, <em className="gold-text">composée avec soin</em>.</>}>
        Comparez 2 ou 3 produits côte à côte, vérifiez que vos bases ne peluchent pas, et suivez la date d'ouverture de chaque produit.
      </SectionTitle>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="min-w-0 space-y-6">
          <dl className="glass rounded-3xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4" aria-label="Résumé de la trousse">
            <div><dt className="text-xs text-muted">Produits</dt><dd className="font-mono text-2xl font-semibold">{items.length}</dd></div>
            <div><dt className="text-xs text-muted">Total</dt><dd className="font-mono text-2xl font-semibold">{euro(total)}</dd></div>
            <div><dt className="text-xs text-muted">Score moyen</dt><dd className="font-mono text-2xl font-semibold">{avg}<span className="text-sm text-muted"> /100</span></dd></div>
            <div><dt className="text-xs text-muted">Catégories couvertes</dt><dd className="font-mono text-2xl font-semibold">{coveredCats}<span className="text-sm text-muted"> /{CATEGORIES.length}</span></dd></div>
          </dl>

          {(expired.length > 0 || soon.length > 0) && (
            <div className="rounded-2xl border border-rose/40 bg-rose/10 p-4 text-sm" role="status">
              <p className="font-semibold flex items-center gap-2"><Timer size={16} /> Hygiène</p>
              {expired.length > 0 && <p className="mt-1">À jeter : {expired.map((t) => t.p.name).join(', ')}.</p>}
              {soon.length > 0 && <p className="mt-1">À finir ce mois-ci : {soon.map((t) => t.p.name).join(', ')}.</p>}
            </div>
          )}

          {items.length === 0 ? (
            <div className="glass rounded-3xl p-10 text-center">
              <ShoppingBag className="mx-auto text-gold-ink" size={32} />
              <h2 className="font-display text-2xl mt-3">Votre trousse est vide</h2>
              <p className="text-muted mt-1">Commencez par le générateur : une trousse complète en 3 clics.</p>
              <div className="flex flex-wrap gap-2 justify-center mt-5">
                <button type="button" className="btn btn-primary" onClick={() => navigate('routine')}>Générer ma trousse <ArrowRight size={15} /></button>
                <button type="button" className="btn btn-ghost" onClick={() => navigate('tier')}>Explorer le ranking</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-ghost" onClick={copy}><Copy size={15} /> Copier la liste</button>
                <button type="button" className="btn btn-ghost" onClick={download}><Download size={15} /> Exporter (.txt)</button>
                <button type="button" className="btn btn-ghost text-rose-ink" onClick={() => { if (confirm('Vider toute la trousse ?')) clearBag(); }}><Trash2 size={15} /> Vider</button>
              </div>
              {ZONES.map((z) => {
                const zi = items.filter((p) => categoryById(p.category)?.zone === z.id);
                if (!zi.length) return null;
                return (
                  <section key={z.id}>
                    <h2 className="font-display text-xl mb-2"><span aria-hidden="true">{z.emoji} </span>{z.name} <span className="font-mono text-xs text-muted">{euro(zi.reduce((s, p) => s + p.price, 0))}</span></h2>
                    <ul className="glass rounded-2xl divide-y divide-line">
                      {zi.map((p) => (
                        <li key={p.id} className="p-3 flex flex-wrap items-center gap-3">
                          <ScoreRing value={totalScore(p)} size={38} />
                          <BrandLogo brand={p.brand} size={32} />
                          <a href={`#/tier/${p.category}~${p.id}`} className="min-w-0 flex-1 group">
                            <span className="block text-[11px] uppercase tracking-wider text-muted">{brandName(p.brand)} · {categoryById(p.category)?.name}</span>
                            <span className="block font-medium text-sm group-hover:underline">{p.name}</span>
                          </a>
                          <TierBadge tier={p.tier} />
                          <span className="font-mono text-sm">{euro(p.price)}</span>
                          <CmpButton p={p} active={cmp.includes(p.id)} onToggle={() => toggleCmp(p.id)} />
                          <button type="button" onClick={() => toggleBag(p.id)} className="grid place-items-center size-9 rounded-full border border-line hover:border-rose hover:text-rose-ink" aria-label={`Retirer ${p.name} de la trousse`}><Trash2 size={14} /></button>
                          <div className="basis-full pl-0 sm:pl-[86px]"><PaoControl p={p} entry={pao[p.id]} onChange={(e) => setEntry(p.id, e)} /></div>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </>
          )}

          <LayerCompatibility products={items} context="votre trousse" />

          <section className="glass rounded-3xl p-5" aria-labelledby="duel-title">
            <h2 id="duel-title" className="font-display text-xl flex items-center gap-2"><Swords size={18} /> Comparer côte à côte</h2>
            <p className="text-sm text-muted mt-1" role="status">
              {cmpProducts.length < 2
                ? `Sélectionnez 2 ou 3 produits avec « Duel », dans la trousse ou la wishlist (${cmpProducts.length}/3).`
                : `${cmpProducts.length} produits sélectionnés : ${cmpProducts.map((p) => p.name).join(', ')}.`}
            </p>
            {cmpProducts.length >= 2 && (
              <div className="flex flex-wrap gap-2 mt-3">
                <button type="button" className="btn btn-primary" aria-haspopup="dialog" onClick={() => setDuelOpen(true)}><Swords size={15} /> Lancer le duel</button>
                <button type="button" className="btn btn-ghost" onClick={() => setCmp([])}>Vider la sélection</button>
              </div>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="glass rounded-3xl p-5">
            <h2 className="font-display text-xl flex items-center gap-2"><UserRound size={18} /> Mon profil peau</h2>
            <p className="text-xs text-muted mt-1">Utilisé pour filtrer le ranking et générer votre trousse.</p>
            <div role="group" aria-label="Type de peau" className="flex flex-wrap gap-2 mt-3">
              {(Object.keys(SKIN_LABELS) as SkinType[]).map((s) => (
                <button type="button" key={s} className="chip" data-active={profile.skin === s} aria-pressed={profile.skin === s} onClick={() => setProfile({ ...profile, skin: profile.skin === s ? undefined : s })}>{SKIN_LABELS[s]}</button>
              ))}
            </div>
            <p className="text-sm mt-4">
              Sous-ton : {profile.undertone ? <strong>{UNDERTONES[profile.undertone].title}</strong> : <span className="text-muted">non défini</span>}
            </p>
            <button type="button" className="btn btn-ghost mt-3 w-full" onClick={() => navigate('masterclass')}>Faire le test des sous-tons</button>
          </section>

          <section className="glass rounded-3xl p-5">
            <h2 className="font-display text-xl flex items-center gap-2"><Heart size={18} /> Wishlist <span className="font-mono text-xs text-muted">({wished.length})</span></h2>
            {wished.length === 0 ? (
              <p className="text-sm text-muted mt-2">Cliquez sur ♡ sur un produit pour le garder de côté.</p>
            ) : (
              <ul className="mt-3 divide-y divide-line">
                {wished.map((p) => (
                  <li key={p.id} className="py-2.5 flex flex-wrap items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-muted truncate">{brandName(p.brand)}</p>
                      <p className="text-sm truncate">{p.name}</p>
                    </div>
                    <span className="font-mono text-xs">{euro(p.price)}</span>
                    <CmpButton p={p} active={cmp.includes(p.id)} onToggle={() => toggleCmp(p.id)} />
                    {!bag.includes(p.id) && (
                      <button type="button" onClick={() => toggleBag(p.id)} className="grid place-items-center size-8 rounded-full bg-ink text-bg" aria-label={`Ajouter ${p.name} à la trousse`}><ShoppingBag size={12} /></button>
                    )}
                    <button type="button" onClick={() => toggleWish(p.id)} className="grid place-items-center size-8 rounded-full border border-line" aria-label={`Retirer ${p.name} de la wishlist`}><Trash2 size={12} /></button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="glass rounded-3xl p-5 text-sm">
            <h2 className="font-display text-xl flex items-center gap-2"><Timer size={18} /> Rappels d'hygiène</h2>
            <ul className="mt-2 space-y-1.5 text-muted list-disc pl-5">
              <li>Mascara et eyeliner liquide : 3 mois, même s'ils ne sont pas secs.</li>
              <li>Éponges : à remplacer tous les 3 mois, à laver chaque semaine.</li>
              <li>Ne partagez jamais mascara, crayon yeux ou gloss.</li>
              <li>Odeur ou texture qui change : jetez, quelle que soit la date.</li>
            </ul>
          </section>
        </aside>
      </div>

      <Sheet open={duelOpen && cmpProducts.length >= 2} onClose={() => setDuelOpen(false)} title="Duel de produits">
        <Duel items={cmpProducts} />
      </Sheet>
    </div>
  );
}
