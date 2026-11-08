import { Download, Copy, Trash2, GitCompare, Heart, ShoppingBag, UserRound, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { brandName } from '../data/brands';
import { CATEGORIES, ZONES, categoryById } from '../data/categories';
import { UNDERTONES } from '../data/masterclass';
import { productById, totalScore } from '../data/products';
import type { Product, Scores, SkinType } from '../data/types';
import { SKIN_LABELS, euro, unitPrice } from '../lib/helpers';
import { useStore } from '../lib/store';
import { BrandLogo, ScoreRing, SectionTitle, TierBadge } from '../components/ui';

const SCORE_KEYS: [keyof Scores, string][] = [['tenue', 'Tenue'], ['pigment', 'Pigmentation / Fini'], ['confort', 'Confort peau'], ['valeur', 'Rapport qualité/prix']];

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

function Compare({ a, b }: { a: Product; b: Product }) {
  const rows: [string, string, string, number][] = [
    ['Prix', euro(a.price), euro(b.price), Math.sign(b.price - a.price)],
    ['Format', a.size, b.size, 0],
    ['Prix au ml/g', unitPrice(a) ?? '—', unitPrice(b) ?? '—', 0],
    ['Score global', `${totalScore(a)}/100`, `${totalScore(b)}/100`, Math.sign(totalScore(a) - totalScore(b))],
    ...SCORE_KEYS.map(([k, l]) => [l, `${a.scores[k]}`, `${b.scores[k]}`, Math.sign(a.scores[k] - b.scores[k])] as [string, string, string, number]),
    ['Fini', a.finish, b.finish, 0],
    ['Peaux', a.skin.map((s) => SKIN_LABELS[s]).join(', '), b.skin.map((s) => SKIN_LABELS[s]).join(', '), 0],
  ];
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[520px]">
        <caption className="sr-only">Comparaison de {a.name} et {b.name} ; la meilleure valeur de chaque ligne est mise en avant</caption>
        <thead>
          <tr className="border-b border-line">
            <td className="w-40" />
            {[a, b].map((p) => (
              <th key={p.id} scope="col" className="text-left p-3 align-top">
                <span className="block text-[11px] uppercase tracking-wider text-muted font-normal">{brandName(p.brand)}</span>
                <span className="font-display text-lg font-normal">{p.name}</span> <TierBadge tier={p.tier} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(([l, va, vb, w]) => (
            <tr key={l} className="border-b border-line last:border-0">
              <th scope="row" className="p-3 text-muted text-[12.5px] text-left font-normal">{l}</th>
              <td className={`p-3 font-mono text-[13px] ${w > 0 ? 'text-sage-ink font-semibold' : ''}`}>{va}{w > 0 && <span className="sr-only"> (meilleur)</span>}</td>
              <td className={`p-3 font-mono text-[13px] ${w < 0 ? 'text-sage-ink font-semibold' : ''}`}>{vb}{w < 0 && <span className="sr-only"> (meilleur)</span>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MyBagView() {
  const { bag, wishlist, toggleBag, toggleWish, clearBag, navigate, profile, setProfile, notify } = useStore();
  const items = bag.map(productById).filter((p): p is Product => !!p);
  const wished = wishlist.map(productById).filter((p): p is Product => !!p);
  const [cmp, setCmp] = useState<string[]>([]);
  const total = items.reduce((s, p) => s + p.price, 0);
  const avg = items.length ? Math.round(items.reduce((s, p) => s + totalScore(p), 0) / items.length) : 0;
  const coveredCats = new Set(items.map((p) => p.category)).size;

  const toggleCmp = (id: string) => setCmp((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c.slice(-1), id]));
  const cmpProducts = cmp.map(productById).filter((p): p is Product => !!p);

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
        Ajoutez des produits depuis le Ranking, les Dupes ou le Générateur. Comparez-en deux côte à côte, puis exportez votre liste de courses.
      </SectionTitle>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">
        <div className="min-w-0 space-y-6">
          <dl className="glass rounded-3xl p-5 grid grid-cols-2 sm:grid-cols-4 gap-4" aria-label="Résumé de la trousse">
            <div><dt className="text-xs text-muted">Produits</dt><dd className="font-mono text-2xl font-semibold">{items.length}</dd></div>
            <div><dt className="text-xs text-muted">Total</dt><dd className="font-mono text-2xl font-semibold">{euro(total)}</dd></div>
            <div><dt className="text-xs text-muted">Score moyen</dt><dd className="font-mono text-2xl font-semibold">{avg}<span className="text-sm text-muted"> /100</span></dd></div>
            <div><dt className="text-xs text-muted">Catégories couvertes</dt><dd className="font-mono text-2xl font-semibold">{coveredCats}<span className="text-sm text-muted"> /{CATEGORIES.length}</span></dd></div>
          </dl>

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
                          <button type="button" onClick={() => toggleCmp(p.id)} data-active={cmp.includes(p.id)} aria-pressed={cmp.includes(p.id)} className="chip !py-1.5 text-xs"><GitCompare size={13} /> Comparer<span className="sr-only"> {p.name}</span></button>
                          <button type="button" onClick={() => toggleBag(p.id)} className="grid place-items-center size-9 rounded-full border border-line hover:border-rose hover:text-rose-ink" aria-label={`Retirer ${p.name} de la trousse`}><Trash2 size={14} /></button>
                        </li>
                      ))}
                    </ul>
                  </section>
                );
              })}
            </>
          )}

          <section className="glass rounded-3xl p-5">
            <h2 className="font-display text-xl flex items-center gap-2"><GitCompare size={18} /> Comparateur</h2>
            {cmpProducts.length < 2 ? (
              <p className="text-sm text-muted mt-2" role="status">Sélectionnez deux produits avec « Comparer » ({cmpProducts.length}/2).</p>
            ) : (
              <div className="mt-3"><Compare a={cmpProducts[0]} b={cmpProducts[1]} /></div>
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
                  <li key={p.id} className="py-2.5 flex items-center gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-muted truncate">{brandName(p.brand)}</p>
                      <p className="text-sm truncate">{p.name}</p>
                    </div>
                    <span className="font-mono text-xs">{euro(p.price)}</span>
                    {!bag.includes(p.id) && (
                      <button type="button" onClick={() => toggleBag(p.id)} className="grid place-items-center size-8 rounded-full bg-ink text-bg" aria-label={`Ajouter ${p.name} à la trousse`}><ShoppingBag size={12} /></button>
                    )}
                    <button type="button" onClick={() => toggleWish(p.id)} className="grid place-items-center size-8 rounded-full border border-line" aria-label={`Retirer ${p.name} de la wishlist`}><Trash2 size={12} /></button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
