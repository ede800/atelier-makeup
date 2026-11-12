import { AlertTriangle, Info } from 'lucide-react';
import { useMemo, useState } from 'react';
import { brandName } from '../data/brands';
import { UNDERTONES, type Undertone } from '../data/masterclass';
import { productById } from '../data/products';
import { ARCHETYPES, DEPTHS, SHADE_LINES, archetypesForShade, nearestArchetype, uniqueShades, type ShadeKind } from '../data/shadeMatrix';
import { useStore } from '../lib/store';
import { BrandLogo, SectionTitle } from '../components/ui';

type Mode = 'owned' | 'skin';
const productCat = (id: string) => productById(id)?.category ?? '';
const KIND_ORDER: ShadeKind[] = ['Fond de teint', 'Teint léger', 'Anti-cernes', 'Poudre'];

export function ShadeMatcherView() {
  const { profile, navigate } = useStore();
  const [mode, setMode] = useState<Mode>('owned');
  const [lineId, setLineId] = useState(SHADE_LINES[0].id);
  const [shade, setShade] = useState(SHADE_LINES[0].shades[5]!);
  const [depth, setDepth] = useState(3);
  const [undertone, setUndertone] = useState<Undertone>(profile.undertone ?? 'neutre');
  const [pick, setPick] = useState<string | null>(null);

  const line = SHADE_LINES.find((l) => l.id === lineId)!;
  const candidates = mode === 'owned' ? archetypesForShade(lineId, shade) : [];
  const archetype = useMemo(() => {
    if (mode === 'skin') return nearestArchetype(depth, undertone);
    if (candidates.length === 1) return candidates[0];
    return candidates.find((a) => a.id === pick) ?? candidates.find((a) => a.undertone === undertone) ?? candidates[0];
  }, [mode, depth, undertone, candidates, pick]);
  const idx = ARCHETYPES.findIndex((a) => a.id === archetype?.id);

  return (
    <div>
      <SectionTitle emoji="🎯" kicker="Convertisseur de teintes inter-marques" title={<>Votre teinte, <em className="gold-text">dans 18 références</em>.</>}>
        Partez d'une teinte que vous possédez déjà, ou de votre profondeur de peau et de votre sous-ton : on vous donne l'équivalent dans les fonds de teint, anti-cernes et poudres les plus vendus.
      </SectionTitle>

      <p className="glass rounded-2xl p-4 mb-6 text-sm flex gap-3 max-w-3xl">
        <AlertTriangle size={18} className="text-rose-ink shrink-0 mt-0.5" />
        <span>Correspondances <strong>indicatives</strong>, établies d'après les nuanciers publics (profondeur et sous-ton). Les gammes évoluent et chaque formule oxyde différemment : testez toujours sur la mâchoire, à la lumière du jour, avant d'acheter.</span>
      </p>

      <div role="group" aria-label="Point de départ" className="flex gap-2 mb-5">
        <button type="button" className="chip" data-active={mode === 'owned'} aria-pressed={mode === 'owned'} onClick={() => setMode('owned')}>J'ai déjà une teinte</button>
        <button type="button" className="chip" data-active={mode === 'skin'} aria-pressed={mode === 'skin'} onClick={() => setMode('skin')}>Je décris ma peau</button>
      </div>

      <div className="grid lg:grid-cols-[360px_minmax(0,1fr)] gap-8">
        <div className="glass rounded-3xl p-5 space-y-5 lg:self-start lg:sticky lg:top-24">
          {mode === 'owned' ? (
            <>
              <div>
                <label htmlFor="sm-line" className="text-xs text-muted">Produit que je possède</label>
                <select id="sm-line" value={lineId} className="mt-1 w-full rounded-xl border border-line bg-solid px-3 py-2.5 text-sm"
                  onChange={(e) => { const l = SHADE_LINES.find((x) => x.id === e.target.value)!; setLineId(l.id); setShade(uniqueShades(l)[0]); setPick(null); }}>
                  {KIND_ORDER.map((k) => (
                    <optgroup key={k} label={k}>
                      {SHADE_LINES.filter((l) => l.kind === k).map((l) => <option key={l.id} value={l.id}>{brandName(l.brand)} — {l.name}</option>)}
                    </optgroup>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="sm-shade" className="text-xs text-muted">Ma teinte</label>
                <select id="sm-shade" value={shade} onChange={(e) => { setShade(e.target.value); setPick(null); }} className="mt-1 w-full rounded-xl border border-line bg-solid px-3 py-2.5 text-sm">
                  {uniqueShades(line).map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              {candidates.length > 1 && (
                <fieldset>
                  <legend className="text-xs text-muted mb-2">Cette teinte couvre plusieurs carnations. Laquelle vous ressemble ?</legend>
                  <div className="flex flex-col gap-2">
                    {candidates.map((a) => (
                      <button key={a.id} type="button" className="chip justify-start" data-active={archetype?.id === a.id} aria-pressed={archetype?.id === a.id} onClick={() => setPick(a.id)}>
                        <span aria-hidden="true" className="size-4 rounded-full border border-line" style={{ background: a.swatch }} />{a.label}
                      </button>
                    ))}
                  </div>
                </fieldset>
              )}
            </>
          ) : (
            <>
              <fieldset>
                <legend className="text-xs text-muted mb-2">Profondeur de peau</legend>
                <div className="flex flex-col gap-1.5">
                  {DEPTHS.map((d) => (
                    <button key={d.value} type="button" className="chip justify-start" data-active={depth === d.value} aria-pressed={depth === d.value} onClick={() => setDepth(d.value)}>
                      <span aria-hidden="true" className="size-4 rounded-full border border-line" style={{ background: ARCHETYPES.find((a) => a.depth >= d.value)?.swatch ?? '#4A2E21' }} />{d.label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="text-xs text-muted mb-2">Sous-ton</legend>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(UNDERTONES) as Undertone[]).map((u) => (
                    <button key={u} type="button" className="chip" data-active={undertone === u} aria-pressed={undertone === u} onClick={() => setUndertone(u)}>{UNDERTONES[u].title.replace('Sous-ton ', '')}</button>
                  ))}
                </div>
                <button type="button" onClick={() => navigate('masterclass')} className="text-xs underline underline-offset-4 text-muted mt-2">Je ne connais pas mon sous-ton : faire le test</button>
              </fieldset>
            </>
          )}
        </div>

        <section aria-labelledby="sm-result" className="min-w-0">
          {archetype && (
            <div className="glass rounded-3xl p-5 mb-5 flex items-center gap-4" role="status">
              <span aria-hidden="true" className="size-14 rounded-full border border-line shrink-0" style={{ background: archetype.swatch }} />
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-gold-ink font-semibold">Votre carnation</p>
                <h2 id="sm-result" className="font-display text-2xl">{archetype.label}</h2>
                <p className="text-sm text-muted">{archetype.description}</p>
              </div>
            </div>
          )}
          {KIND_ORDER.map((k) => (
            <div key={k} className="mb-6">
              <h3 className="font-display text-xl mb-2">{k}</h3>
              <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">
                {SHADE_LINES.filter((l) => l.kind === k).map((l) => {
                  const s = idx >= 0 ? l.shades[idx] : null;
                  const isSource = mode === 'owned' && l.id === lineId;
                  return (
                    <li key={l.id} className={`glass rounded-2xl p-3 flex items-center gap-3 min-w-0 ${isSource ? 'ring-2 ring-gold' : ''}`}>
                      <BrandLogo brand={l.brand} size={34} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] uppercase tracking-wider text-muted truncate">{brandName(l.brand)}</p>
                        {l.productId ? (
                          <a href={`#/tier/${productCat(l.productId)}~${l.productId}`} className="text-sm font-medium hover:underline block truncate">{l.name}</a>
                        ) : <p className="text-sm font-medium truncate">{l.name}</p>}
                      </div>
                      <span className={`font-mono text-sm font-semibold text-right max-w-[45%] break-words ${s ? '' : 'text-muted'}`}>
                        {s ?? <span className="text-xs font-normal">Pas de teinte</span>}
                        {isSource && <span className="block text-[10px] font-normal text-gold-ink">votre teinte</span>}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <p className="text-[12px] text-muted flex gap-2"><Info size={14} className="shrink-0 mt-0.5" /> Les poudres translucides conviennent à un large éventail de carnations : c'est normal qu'elles se répètent.</p>
        </section>
      </div>
    </div>
  );
}
