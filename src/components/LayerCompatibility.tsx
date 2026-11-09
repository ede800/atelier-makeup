import { AlertTriangle, CheckCircle2, FlaskConical, Info } from 'lucide-react';
import type { Product } from '../data/types';
import { analyzeLayers, type Verdict } from '../lib/compatibility';

const UI: Record<Verdict, { cls: string; icon: typeof Info; title: string }> = {
  ok: { cls: 'bg-sage/15 border-sage/40', icon: CheckCircle2, title: 'Alchimie parfaite' },
  caution: { cls: 'bg-gold/12 border-gold/40', icon: Info, title: 'Compatible, avec précaution' },
  warn: { cls: 'bg-rose/15 border-rose/40', icon: AlertTriangle, title: 'Alerte peluchage' },
};

/** Analyseur anti-peluchage : base → teint → anti-cernes, selon la base de formule (eau, silicone, huile). */
export function LayerCompatibility({ products, context }: { products: Product[]; context: string }) {
  const { pairs, worst } = analyzeLayers(products);
  return (
    <section aria-labelledby="compat-title" className="glass rounded-3xl p-5">
      <h2 id="compat-title" className="font-display text-xl flex items-center gap-2"><FlaskConical size={18} /> Analyseur anti-peluchage</h2>
      {!worst ? (
        <p className="text-sm text-muted mt-2">Ajoutez au moins une base et un fond de teint (ou un anti-cernes) à {context} pour vérifier leur compatibilité.</p>
      ) : (
        <>
          <div className={`mt-3 rounded-2xl border p-4 flex gap-3 ${UI[worst].cls}`} role="status">
            {(() => { const I = UI[worst].icon; return <I size={20} className="shrink-0 mt-0.5" />; })()}
            <div>
              <p className="font-semibold">{UI[worst].title}</p>
              <p className="text-sm mt-0.5">
                {worst === 'ok' && 'Ta base et ton fond de teint partagent une base compatible (zéro risque de peluchage).'}
                {worst === 'warn' && "Au moins une couche à base de silicone ou d'huile est suivie d'une formule à l'eau. Laisse sécher 3 minutes entre les couches ou change de base."}
                {worst === 'caution' && 'Les bases sont différentes mais compatibles : laisse sécher chaque couche 2 à 3 minutes.'}
              </p>
            </div>
          </div>
          <ul className="mt-3 space-y-2">
            {pairs.map((x) => {
              const I = UI[x.verdict].icon;
              return (
                <li key={x.under.id + x.over.id} className="text-[13px] flex gap-2 leading-relaxed">
                  <I size={15} className="shrink-0 mt-0.5" /><span>{x.message}</span>
                </li>
              );
            })}
          </ul>
        </>
      )}
      <p className="text-[11.5px] text-muted mt-3">Base de formule estimée d'après les premiers ingrédients INCI : vérifiez la liste de votre flacon, elle peut changer d'un lot à l'autre.</p>
    </section>
  );
}
