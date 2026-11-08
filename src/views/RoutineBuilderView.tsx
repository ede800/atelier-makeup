import { PiggyBank, Sparkles, TrendingUp, ShoppingBag, AlertTriangle } from 'lucide-react';
import { useMemo } from 'react';
import { brandName } from '../data/brands';
import { totalScore } from '../data/products';
import type { SkinType } from '../data/types';
import { BUDGETS, FINISHES, buildRoutine, type BudgetId, type FinishId } from '../lib/routine';
import { LEVEL_LABELS, SKIN_LABELS, euro } from '../lib/helpers';
import { usePersistent, useStore } from '../lib/store';
import { BrandLogo, ProductActions, ScoreRing, SectionTitle, TierBadge } from '../components/ui';

const ROLE_UI = {
  invest: { label: 'Investir', icon: TrendingUp, cls: 'bg-gold/20 text-gold-ink' },
  neutral: { label: 'Équilibre', icon: Sparkles, cls: 'bg-rose/15 text-rose-ink' },
  save: { label: 'Économiser', icon: PiggyBank, cls: 'bg-sage/20 text-sage-ink' },
} as const;

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6" role="group" aria-labelledby={`step-${n}`}>
      <h2 id={`step-${n}`} className="flex items-center gap-3 mb-3">
        <span aria-hidden="true" className="font-mono text-xs size-7 grid place-items-center rounded-full bg-ink text-bg">{n}</span>
        <span className="sr-only">Étape {n} : </span>
        <span className="font-display text-xl">{title}</span>
      </h2>
      {children}
    </section>
  );
}

export function RoutineBuilderView() {
  const { profile, setProfile, addManyToBag } = useStore();
  const [budget, setBudget] = usePersistent<BudgetId>('atelier.routine.budget', 'smart');
  const [finish, setFinish] = usePersistent<FinishId>('atelier.routine.finish', 'clean');
  const skin: SkinType = profile.skin ?? 'normale';

  const routine = useMemo(() => buildRoutine(budget, skin, finish), [budget, skin, finish]);
  const saved = routine.items.filter((i) => i.role === 'save').reduce((s, i) => s + i.product.price, 0);
  const invested = routine.items.filter((i) => i.role === 'invest').reduce((s, i) => s + i.product.price, 0);

  return (
    <div>
      <SectionTitle emoji="💸" kicker="Le Générateur de Trousse" title={<>Votre trousse idéale, <em className="gold-text">au centime près</em>.</>}>
        Choisissez un budget, votre type de peau et le rendu recherché : le moteur compose la liste exacte de 8 à 10 produits et vous dit où investir, où économiser.
      </SectionTitle>

      <div className="grid xl:grid-cols-[420px_1fr] gap-8">
        <div>
          <Step n={1} title="Budget total de la trousse">
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(BUDGETS) as BudgetId[]).map((b) => (
                <button type="button" key={b} onClick={() => setBudget(b)} data-active={budget === b} aria-pressed={budget === b}
                  className="text-left glass rounded-2xl p-3.5 transition data-[active=true]:ring-2 data-[active=true]:ring-gold">
                  <span className="block text-sm font-semibold">{BUDGETS[b].label}</span>
                  <span className="block font-mono text-gold-ink text-sm mt-0.5">{BUDGETS[b].target}</span>
                  <span className="block text-[11.5px] text-muted mt-1 leading-snug">{BUDGETS[b].desc}</span>
                </button>
              ))}
            </div>
          </Step>
          <Step n={2} title="Type de peau">
            <div className="flex flex-wrap gap-2">
              {(Object.keys(SKIN_LABELS) as SkinType[]).map((s) => (
                <button type="button" key={s} className="chip" data-active={skin === s} aria-pressed={skin === s} onClick={() => setProfile({ ...profile, skin: s })}>{SKIN_LABELS[s]}</button>
              ))}
            </div>
            <p className="text-[11.5px] text-muted mt-2">Enregistré dans votre profil peau : les autres vues l'utilisent aussi.</p>
          </Step>
          <Step n={3} title="Fini recherché">
            <div className="grid gap-2">
              {(Object.keys(FINISHES) as FinishId[]).map((f) => (
                <button type="button" key={f} onClick={() => setFinish(f)} data-active={finish === f} aria-pressed={finish === f}
                  className="text-left glass rounded-2xl p-3.5 flex gap-3 items-center transition data-[active=true]:ring-2 data-[active=true]:ring-gold">
                  <span className="text-2xl" aria-hidden="true">{FINISHES[f].emoji}</span>
                  <span>
                    <span className="block text-sm font-semibold">{FINISHES[f].label}</span>
                    <span className="block text-[12px] text-muted">{FINISHES[f].desc}</span>
                  </span>
                </button>
              ))}
            </div>
          </Step>
        </div>

        <section className="min-w-0" aria-labelledby="result-title">
          <h2 id="result-title" className="sr-only">Votre trousse générée</h2>
          <div className="glass rounded-3xl p-5 sm:p-6 xl:sticky xl:top-24">
            <div className="flex flex-wrap items-end gap-4 justify-between border-b border-line pb-5">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-muted">Votre trousse · {routine.items.length} produits</p>
                <p className="font-mono text-4xl font-semibold mt-1" aria-live="polite" aria-atomic="true"><span className="sr-only">Total : </span>{euro(routine.total)}</p>
                <p className="text-xs text-muted mt-1">Budget cible : <span className="font-mono">{BUDGETS[budget].target}</span></p>
              </div>
              <div className="flex gap-4 text-xs">
                <div><p className="text-muted">Investi</p><p className="font-mono text-base text-gold-ink">{euro(invested)}</p></div>
                <div><p className="text-muted">Économisé sur</p><p className="font-mono text-base text-sage-ink">{euro(saved)}</p></div>
              </div>
              <button type="button" className="btn btn-primary" onClick={() => addManyToBag(routine.items.map((i) => i.product.id))}>
                <ShoppingBag size={15} aria-hidden="true" /> Tout ajouter à Ma Trousse
              </button>
            </div>

            <div className="mt-5 rounded-2xl bg-gold/10 border border-gold/30 p-4 text-sm leading-relaxed">
              <strong className="font-display text-base">Où dépenser, où économiser — </strong>{routine.advice}
            </div>

            <ol className="mt-5 divide-y divide-line">
              {routine.items.map((it, i) => {
                const R = ROLE_UI[it.role];
                return (
                  <li key={it.slot} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 fade-up" style={{ animationDelay: `${i * 35}ms` }}>
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <span aria-hidden="true" className="font-mono text-xs text-muted w-5">{String(i + 1).padStart(2, '0')}</span>
                      <ScoreRing value={totalScore(it.product)} size={40} />
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted"><BrandLogo brand={it.product.brand} size={18} />{it.slot} · {brandName(it.product.brand)}</p>
                        <p className="font-medium leading-snug">{it.product.name} <TierBadge tier={it.product.tier} /></p>
                        <p className="text-[12px] text-muted mt-0.5 flex flex-wrap items-center gap-1.5">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-semibold ${R.cls}`}><R.icon size={11} aria-hidden="true" />{R.label}</span>
                          <span><span aria-hidden="true">{LEVEL_LABELS[it.level].emoji} </span>{it.reason}</span>
                        </p>
                        {!it.compatible && (
                          <p className="text-[11.5px] text-rose-ink mt-1 flex items-center gap-1"><AlertTriangle size={12} aria-hidden="true" /> Aucune référence spécifique à votre peau dans cette catégorie : meilleur choix général.</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 sm:justify-end pl-8 sm:pl-0">
                      <span className="font-mono font-semibold">{euro(it.product.price)}</span>
                      <ProductActions id={it.product.id} name={`${brandName(it.product.brand)} ${it.product.name}`} />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>
      </div>
    </div>
  );
}
