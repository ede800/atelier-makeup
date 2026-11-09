import { FlaskConical, ListOrdered, Palette, ScanFace, RotateCcw, Check, X, AlertTriangle, Clock, Pipette, Sparkles, LifeBuoy, Microscope } from 'lucide-react';
import { useState } from 'react';
import { APPLICATION_STEPS, FORMULATION_RULES, UNDERTONES, UNDERTONE_QUIZ, type Undertone } from '../data/masterclass';
import { useStore } from '../lib/store';
import { SectionTitle } from '../components/ui';
import { ColorLab, InciPao, Morphology, ProTips, Troubleshooting } from './masterclass/Panels';

type Tab = 'undertone' | 'lab' | 'order' | 'chemistry' | 'shape' | 'tips' | 'sos' | 'inci';

const TABS: { id: Tab; label: string; icon: typeof Palette }[] = [
  { id: 'undertone', label: 'Sous-tons', icon: Palette },
  { id: 'lab', label: 'Labo couleurs', icon: Pipette },
  { id: 'shape', label: 'Morphologie', icon: ScanFace },
  { id: 'order', label: "Ordre d'application", icon: ListOrdered },
  { id: 'chemistry', label: 'Chimie des textures', icon: FlaskConical },
  { id: 'tips', label: 'Secrets backstage', icon: Sparkles },
  { id: 'sos', label: 'Diagnostic SOS', icon: LifeBuoy },
  { id: 'inci', label: 'INCI & péremption', icon: Microscope },
];

function computeUndertone(answers: number[]): Undertone {
  const score: Record<Undertone, number> = { chaud: 0, froid: 0, neutre: 0, olive: 0 };
  answers.forEach((a, i) => {
    const s = UNDERTONE_QUIZ[i].options[a].scores;
    (Object.keys(s) as Undertone[]).forEach((k) => (score[k] += s[k] ?? 0));
  });
  return (Object.keys(score) as Undertone[]).sort((a, b) => score[b] - score[a])[0];
}

function UndertoneQuiz() {
  const { profile, setProfile } = useStore();
  const [answers, setAnswers] = useState<number[]>([]);
  const done = answers.length === UNDERTONE_QUIZ.length;

  const result: Undertone | undefined = done ? computeUndertone(answers) : profile.undertone;

  const current = UNDERTONE_QUIZ[answers.length];

  return (
    <div className="grid lg:grid-cols-[1fr_1.1fr] gap-6">
      <div className="glass rounded-3xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl">Le test des sous-tons</h2>
          <span className="font-mono text-xs text-muted" aria-hidden="true">{Math.min(answers.length + 1, UNDERTONE_QUIZ.length)}/{UNDERTONE_QUIZ.length}</span>
        </div>
        <div className="h-1 rounded-full bg-line mb-6 overflow-hidden" role="progressbar" aria-label="Progression du test" aria-valuemin={0} aria-valuemax={UNDERTONE_QUIZ.length} aria-valuenow={answers.length} aria-valuetext={`${answers.length} question${answers.length > 1 ? 's' : ''} sur ${UNDERTONE_QUIZ.length}`}>
          <div className="h-full bg-gold transition-all" style={{ width: `${(answers.length / UNDERTONE_QUIZ.length) * 100}%` }} />
        </div>
        {!done ? (
          <fieldset key={answers.length} className="pop">
            <legend className="text-lg leading-snug mb-4">
              <span className="sr-only">Question {answers.length + 1} sur {UNDERTONE_QUIZ.length} : </span>{current.q}
            </legend>
            <div className="grid gap-2">
              {current.options.map((o, i) => (
                <button type="button" key={o.label} onClick={() => {
                  const next = [...answers, i];
                  setAnswers(next);
                  if (next.length === UNDERTONE_QUIZ.length) setProfile({ ...profile, undertone: computeUndertone(next) });
                }} className="text-left rounded-xl border border-line px-4 py-3 text-sm hover:border-gold hover:bg-gold/5 transition">
                  {o.label}
                </button>
              ))}
            </div>
          </fieldset>
        ) : (
          <div className="pop text-center py-4" role="status">
            <p className="text-muted text-sm">Votre résultat</p>
            <p className="font-display text-3xl mt-1">{UNDERTONES[result!].title}</p>
            <p className="text-xs text-muted mt-2">Enregistré dans votre profil.</p>
          </div>
        )}
        {answers.length > 0 && (
          <button type="button" className="btn btn-ghost mt-5" onClick={() => setAnswers([])}><RotateCcw size={14} /> Recommencer</button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {(Object.keys(UNDERTONES) as Undertone[]).map((k) => {
          const u = UNDERTONES[k];
          const mine = result === k;
          return (
            <div key={k} className={`glass rounded-2xl p-4 transition ${mine ? 'ring-2 ring-gold' : ''}`}>
              <div className="flex items-center gap-2">
                <span aria-hidden="true" className="size-6 rounded-full border border-line" style={{ background: u.color }} />
                <h3 className="font-display text-lg">{u.title}</h3>
                {mine && <span className="ml-auto text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-gold/25 text-gold-ink">Vous</span>}
              </div>
              <p className="text-[12.5px] text-muted mt-2 leading-relaxed">{u.description}</p>
              <p className="text-[12.5px] mt-2"><strong>{u.codes}</strong></p>
              <ul className="mt-2 space-y-0.5">
                {u.foundations.map((f) => <li key={f} className="text-[12px]">• {f}</li>)}
              </ul>
              <p className="text-[12px] mt-2"><span className="text-muted">Blush :</span> {u.blush}</p>
              <p className="text-[12px]"><span className="text-muted">Lèvres :</span> {u.lips}</p>
              <p className="text-[12px] text-rose-ink mt-2"><span aria-hidden="true">✕ </span><span className="sr-only">À éviter : </span>{u.avoid}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApplicationOrder() {
  return (
    <>
    <h2 className="sr-only">Ordre d'application en 12 étapes</h2>
    <ol className="relative grid md:grid-cols-2 gap-3">
      {APPLICATION_STEPS.map((s, i) => (
        <li key={s.step} className="glass rounded-2xl p-4 flex gap-4 fade-up" style={{ animationDelay: `${i * 30}ms` }}>
          <span aria-hidden="true" className="font-display text-3xl gold-text font-semibold w-10 shrink-0">{s.step}</span>
          <div>
            <h3 className="font-semibold">{s.title}</h3>
            <p className="text-[13px] text-muted leading-relaxed mt-1">{s.detail}</p>
            {s.wait && <p className="text-[11.5px] mt-2 inline-flex items-center gap-1 font-mono text-gold-ink"><Clock size={12} /> Temps de pose : {s.wait}</p>}
          </div>
        </li>
      ))}
    </ol>
    </>
  );
}

const BASES = ['Eau', 'Silicone', 'Huile'] as const;
const FDTS = ['Eau', 'Silicone'] as const;

function Chemistry() {
  const [base, setBase] = useState<(typeof BASES)[number]>('Silicone');
  const [fdt, setFdt] = useState<(typeof FDTS)[number]>('Eau');
  const rule = FORMULATION_RULES.matrix.find((m) => m.base === base && m.fdt === fdt)!;
  const Icon = rule.ok === 'oui' ? Check : rule.ok === 'non' ? X : AlertTriangle;
  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6">
        <h2 className="font-display text-2xl mb-2">Pourquoi mon fond de teint peluche ?</h2>
        <p className="leading-relaxed max-w-3xl">{FORMULATION_RULES.intro}</p>
        <p className="mt-3 text-sm text-muted max-w-3xl"><strong className="text-ink">Comment savoir ? </strong>{FORMULATION_RULES.howTo}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {FORMULATION_RULES.families.map((f) => (
          <div key={f.name} className="glass rounded-2xl p-4">
            <h3 className="font-semibold">{f.name}</h3>
            <p className="font-mono text-[11px] text-gold-ink mt-2 leading-relaxed">{f.inci}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted mt-3 mb-1">Exemples</p>
            <ul className="text-[13px] space-y-0.5">{f.examples.map((e) => <li key={e}>• {e}</li>)}</ul>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl p-6">
        <h2 className="font-display text-xl mb-4">Le testeur de compatibilité</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p id="lbl-base" className="text-xs text-muted mb-2">Ma base / mon soin est à base de…</p>
            <div role="group" aria-labelledby="lbl-base" className="flex gap-2 flex-wrap">{BASES.map((b) => <button type="button" key={b} className="chip" data-active={base === b} aria-pressed={base === b} onClick={() => setBase(b)}>{b}</button>)}</div>
          </div>
          <div>
            <p id="lbl-fdt" className="text-xs text-muted mb-2">Mon fond de teint est à base de…</p>
            <div role="group" aria-labelledby="lbl-fdt" className="flex gap-2 flex-wrap">{FDTS.map((b) => <button type="button" key={b} className="chip" data-active={fdt === b} aria-pressed={fdt === b} onClick={() => setFdt(b)}>{b}</button>)}</div>
          </div>
        </div>
        <div key={base + fdt} role="status" className={`pop mt-5 rounded-2xl p-4 flex items-center gap-3 ${rule.ok === 'oui' ? 'bg-sage/15' : rule.ok === 'non' ? 'bg-rose/15' : 'bg-gold/15'}`}>
          <span className="grid place-items-center size-10 rounded-full bg-solid"><Icon size={18} /></span>
          <div>
            <p className="font-semibold">{rule.ok === 'oui' ? 'Compatible' : rule.ok === 'non' ? 'Incompatible' : 'Sous conditions'}</p>
            <p className="text-sm text-muted">{rule.note}</p>
          </div>
        </div>
        <div className="overflow-x-auto mt-5">
          <table className="w-full text-sm min-w-[420px]">
            <caption className="sr-only">Compatibilité entre la base et le fond de teint selon leur solvant principal</caption>
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-muted border-b border-line"><th scope="col" className="py-2">Base</th><th scope="col">Fond de teint</th><th scope="col">Verdict</th></tr></thead>
            <tbody>
              {FORMULATION_RULES.matrix.map((m) => (
                <tr key={m.base + m.fdt} className="border-b border-line last:border-0">
                  <td className="py-2">{m.base}</td><td>{m.fdt}</td>
                  <td><span aria-hidden="true">{m.ok === 'oui' ? '✅' : m.ok === 'non' ? '❌' : '⚠️'} </span><strong className="font-medium">{m.ok === 'oui' ? 'Compatible' : m.ok === 'non' ? 'Incompatible' : 'Sous conditions'}</strong> <span className="text-muted">— {m.note}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function MasterclassView() {
  const [tab, setTab] = useState<Tab>('undertone');
  return (
    <div>
      <SectionTitle emoji="🎨" kicker="La Masterclass" title={<>Sous-tons, couleurs, morphologie <em className="gold-text">& secrets de pros</em>.</>}>
        Trouver son sous-ton, sauver une teinte ratée, placer chaque produit selon son visage, et comprendre pourquoi un maquillage rate.
      </SectionTitle>
      <div role="tablist" aria-label="Chapitres de la masterclass" className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6"
        onKeyDown={(e) => {
          const i = TABS.findIndex((t) => t.id === tab);
          let next = -1;
          if (e.key === 'ArrowRight') next = (i + 1) % TABS.length;
          if (e.key === 'ArrowLeft') next = (i - 1 + TABS.length) % TABS.length;
          if (e.key === 'Home') next = 0;
          if (e.key === 'End') next = TABS.length - 1;
          if (next < 0) return;
          e.preventDefault();
          setTab(TABS[next].id);
          document.getElementById(`tab-${TABS[next].id}`)?.focus();
        }}>
        {TABS.map((t) => (
          <button key={t.id} id={`tab-${t.id}`} type="button" role="tab" aria-selected={tab === t.id} aria-controls={`panel-${t.id}`}
            tabIndex={tab === t.id ? 0 : -1} className="chip" data-active={tab === t.id} onClick={() => setTab(t.id)}>
            <t.icon size={14} /> {t.label}
          </button>
        ))}
      </div>
      <div key={tab} id={`panel-${tab}`} role="tabpanel" aria-labelledby={`tab-${tab}`} tabIndex={0} className="fade-up outline-none">
        {tab === 'undertone' && <UndertoneQuiz />}
        {tab === 'order' && <ApplicationOrder />}
        {tab === 'chemistry' && <Chemistry />}
        {tab === 'shape' && <Morphology />}
        {tab === 'lab' && <ColorLab />}
        {tab === 'tips' && <ProTips />}
        {tab === 'sos' && <Troubleshooting />}
        {tab === 'inci' && <InciPao />}
      </div>
    </div>
  );
}
