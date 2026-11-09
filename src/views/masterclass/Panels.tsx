import { AlertTriangle, ChevronDown, Droplet, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { COLOR_FIXES, CORRECTION_TARGETS, TEXTURE_HACKS, type FixId } from '../../data/colorMixology';
import { COMEDOGENIC, PAO_GUIDE } from '../../data/inci';
import { PRO_TIPS, type TipTheme } from '../../data/proTips';
import { TROUBLESHOOTING } from '../../data/troubleshooting';
import { normalize } from '../../lib/helpers';
import { EyeChart, FaceChart } from '../../components/FaceCharts';

export function ColorLab() {
  const [fixId, setFixId] = useState<FixId>('orange');
  const fix = COLOR_FIXES.find((f) => f.id === fixId)!;
  return (
    <div className="space-y-6">
      <section aria-labelledby="sim-title" className="glass rounded-3xl p-5 sm:p-6">
        <h2 id="sim-title" className="font-display text-2xl">Le simulateur de correction chromatique</h2>
        <p className="text-sm text-muted mt-1">Mon fond de teint est…</p>
        <div role="group" aria-label="Problème de teinte" className="flex gap-2 flex-wrap mt-3">
          {COLOR_FIXES.map((f) => (
            <button key={f.id} type="button" className="chip" data-active={f.id === fixId} aria-pressed={f.id === fixId} onClick={() => setFixId(f.id)}>{f.problem}</button>
          ))}
        </div>
        <div key={fix.id} className="pop mt-5 grid md:grid-cols-[auto_1fr] gap-6 items-center" role="status">
          <div className="flex items-center gap-2 justify-center" aria-hidden="true">
            <Swatch color={fix.before} label="Avant" />
            <span className="text-2xl text-muted">+</span>
            <Swatch color={fix.pigmentColor} label={fix.pigment} small />
            <span className="text-2xl text-muted">=</span>
            <Swatch color={fix.after} label="Après" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.18em] text-gold-ink font-semibold">La correction</p>
            <p className="font-display text-xl mt-1">{fix.fix}</p>
            <p className="mt-2 inline-flex items-center gap-2 font-mono text-sm px-3 py-1.5 rounded-full bg-gold/15 text-gold-ink">
              <Droplet size={14} /> <span className="sr-only">Dosage : </span>{fix.ratio}
            </p>
            <p className="mt-3 text-sm leading-relaxed">{fix.explanation}</p>
            <p className="mt-3 text-sm"><strong>Produits à mélanger :</strong> {fix.products.join(' · ')}</p>
            {fix.caution && <p className="mt-2 text-[13px] text-rose-ink flex gap-1.5"><AlertTriangle size={14} className="mt-0.5 shrink-0" />{fix.caution}</p>}
          </div>
        </div>
        <p className="text-[11.5px] text-muted mt-4">Les couleurs « avant / après » sont une illustration. Mélangez toujours sur le dos de la main, en petite quantité, et testez sur la mâchoire à la lumière du jour.</p>
      </section>

      <section aria-labelledby="cc-title">
        <h2 id="cc-title" className="font-display text-2xl mb-3">Camoufler avant l'anti-cernes</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {CORRECTION_TARGETS.map((c) => (
            <li key={c.issue} className="glass rounded-2xl p-4 flex gap-3">
              <span aria-hidden="true" className="size-10 rounded-full shrink-0 border border-line" style={{ background: c.swatch }} />
              <div>
                <h3 className="font-semibold text-sm">{c.issue}</h3>
                <p className="text-[12px] text-muted">{c.skin}</p>
                <p className="text-sm mt-1"><strong>Correcteur : {c.color}.</strong> {c.how}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="tx-title">
        <h2 id="tx-title" className="font-display text-2xl mb-3">Transformer ses textures</h2>
        <ul className="grid sm:grid-cols-2 gap-3">
          {TEXTURE_HACKS.map((h) => (
            <li key={h.title} className="glass rounded-2xl p-4">
              <h3 className="font-semibold text-sm">{h.title}</h3>
              <p className="text-sm text-muted mt-1 leading-relaxed">{h.how}</p>
              {h.caution && <p className="text-[12.5px] text-rose-ink mt-2 flex gap-1.5"><AlertTriangle size={13} className="mt-0.5 shrink-0" />{h.caution}</p>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Swatch({ color, label, small }: { color: string; label: string; small?: boolean }) {
  return (
    <span className="flex flex-col items-center gap-1">
      <span className={`${small ? 'size-10' : 'size-16'} rounded-full border border-line shadow-inner`} style={{ background: color }} />
      <span className="text-[11px] text-muted">{label}</span>
    </span>
  );
}

const THEMES: TipTheme[] = ['Teint', 'Yeux', 'Lèvres', 'Sourcils', 'Outils', 'Tenue'];

export function ProTips() {
  const [theme, setTheme] = useState<TipTheme | 'all'>('all');
  const [q, setQ] = useState('');
  const list = useMemo(() => {
    const n = normalize(q.trim());
    return PRO_TIPS.filter((t) => (theme === 'all' || t.theme === theme) && (!n || normalize(`${t.title} ${t.tip}`).includes(n)));
  }, [theme, q]);
  return (
    <div>
      <h2 className="font-display text-2xl">Les {PRO_TIPS.length} secrets backstage</h2>
      <div className="flex flex-col sm:flex-row gap-3 mt-4 mb-5">
        <label className="glass rounded-full flex items-center gap-2 px-4 sm:w-72 focus-within:ring-2 focus-within:ring-gold">
          <Search size={15} className="text-muted" />
          <span className="sr-only">Rechercher une astuce</span>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Rechercher une astuce…" className="bg-transparent outline-none py-2.5 flex-1 text-sm placeholder:text-muted" />
        </label>
        <div role="group" aria-label="Filtrer par thème" className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button type="button" className="chip" data-active={theme === 'all'} aria-pressed={theme === 'all'} onClick={() => setTheme('all')}>Tout</button>
          {THEMES.map((t) => <button key={t} type="button" className="chip" data-active={theme === t} aria-pressed={theme === t} onClick={() => setTheme(t)}>{t}</button>)}
        </div>
      </div>
      <p className="sr-only" role="status" aria-live="polite">{list.length} astuce{list.length > 1 ? 's' : ''}</p>
      <ol className="grid md:grid-cols-2 gap-3">
        {list.map((t) => (
          <li key={t.title} className="glass rounded-2xl p-4">
            <p className="text-[10.5px] uppercase tracking-wider text-gold-ink font-semibold">{t.theme}</p>
            <h3 className="font-semibold mt-0.5">{t.title}</h3>
            <p className="text-sm text-muted mt-1 leading-relaxed">{t.tip}</p>
          </li>
        ))}
      </ol>
      {list.length === 0 && <p className="glass rounded-2xl p-6 text-center text-muted">Aucune astuce ne correspond.</p>}
    </div>
  );
}

export function Troubleshooting() {
  return (
    <div>
      <h2 className="font-display text-2xl mb-1">Diagnostic SOS : pourquoi mon maquillage rate ?</h2>
      <p className="text-sm text-muted mb-4">{TROUBLESHOOTING.length} pannes fréquentes, leurs causes et les solutions.</p>
      <div className="space-y-2">
        {TROUBLESHOOTING.map((t) => (
          <details key={t.problem} className="glass rounded-2xl group">
            <summary className="flex items-center justify-between gap-3 p-4 cursor-pointer list-none font-semibold rounded-2xl">
              <span>{t.problem}</span>
              <ChevronDown size={18} className="shrink-0 transition group-open:rotate-180" />
            </summary>
            <div className="px-4 pb-4 grid sm:grid-cols-2 gap-4">
              <div>
                <h3 className="text-[11px] uppercase tracking-wider text-rose-ink font-semibold mb-1">Pourquoi</h3>
                <ul className="text-sm space-y-1 list-disc pl-5">{t.causes.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
              <div>
                <h3 className="text-[11px] uppercase tracking-wider text-sage-ink font-semibold mb-1">La solution</h3>
                <ul className="text-sm space-y-1 list-disc pl-5">{t.fixes.map((c) => <li key={c}>{c}</li>)}</ul>
              </div>
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

export function Morphology() {
  return (
    <div className="space-y-6">
      <FaceChart />
      <EyeChart />
    </div>
  );
}

export function InciPao() {
  return (
    <div className="space-y-6">
      <section aria-labelledby="inci-title" className="glass rounded-3xl p-5 sm:p-6">
        <h2 id="inci-title" className="font-display text-2xl">Décoder l'INCI pour les peaux acnéiques</h2>
        <p className="text-sm text-muted mt-1">Ingrédients souvent cités comme comédogènes ou irritants. Leur effet dépend de la concentration et de votre peau : ce n'est pas une liste noire absolue.</p>
        <div className="overflow-x-auto mt-4" tabIndex={0} role="region" aria-label="Tableau des ingrédients à surveiller">
          <table className="w-full text-sm min-w-[560px]">
            <caption className="sr-only">Ingrédients à surveiller, où on les trouve et pourquoi</caption>
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wider text-muted border-b border-line">
                <th scope="col" className="py-2 pr-3">Ingrédient INCI</th><th scope="col" className="pr-3">Où</th><th scope="col">Pourquoi</th>
              </tr>
            </thead>
            <tbody>
              {COMEDOGENIC.map((c) => (
                <tr key={c.inci} className="border-b border-line last:border-0 align-top">
                  <th scope="row" className="py-2 pr-3 font-mono text-[12.5px] text-left font-medium" lang="en">{c.inci}</th>
                  <td className="py-2 pr-3 text-muted">{c.where}</td>
                  <td className="py-2">{c.why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section aria-labelledby="pao-title" className="glass rounded-3xl p-5 sm:p-6">
        <h2 id="pao-title" className="font-display text-2xl">Durée de vie après ouverture (PAO)</h2>
        <p className="text-sm text-muted mt-1">Le symbole du pot ouvert (« 12M ») indique combien de mois un produit se garde une fois ouvert. Suivez vos produits dans Ma Trousse.</p>
        <ul className="mt-4 divide-y divide-line">
          {PAO_GUIDE.map((g) => (
            <li key={g.product} className="py-3 flex gap-4 items-start">
              <span className="font-mono text-sm font-semibold w-14 shrink-0 text-gold-ink">{g.months} mois</span>
              <div><p className="font-medium text-sm">{g.product}</p><p className="text-[13px] text-muted">{g.note}</p></div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
