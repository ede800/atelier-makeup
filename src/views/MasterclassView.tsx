import { FlaskConical, ListOrdered, Palette, ScanFace, RotateCcw, Check, X, AlertTriangle, Clock } from 'lucide-react';
import { useState } from 'react';
import { APPLICATION_STEPS, FACE_SHAPES, FORMULATION_RULES, UNDERTONES, UNDERTONE_QUIZ, type Undertone } from '../data/masterclass';
import { useStore } from '../lib/store';
import { SectionTitle } from '../components/ui';

type Tab = 'undertone' | 'order' | 'chemistry' | 'shape';

const TABS: { id: Tab; label: string; icon: typeof Palette }[] = [
  { id: 'undertone', label: 'Sous-tons', icon: Palette },
  { id: 'order', label: "Ordre d'application", icon: ListOrdered },
  { id: 'chemistry', label: 'Chimie des textures', icon: FlaskConical },
  { id: 'shape', label: 'Morphologie', icon: ScanFace },
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
          <h3 className="font-display text-2xl">Le test des sous-tons</h3>
          <span className="font-mono text-xs text-muted">{Math.min(answers.length + 1, UNDERTONE_QUIZ.length)}/{UNDERTONE_QUIZ.length}</span>
        </div>
        <div className="h-1 rounded-full bg-line mb-6 overflow-hidden">
          <div className="h-full bg-gold transition-all" style={{ width: `${(answers.length / UNDERTONE_QUIZ.length) * 100}%` }} />
        </div>
        {!done ? (
          <div key={answers.length} className="pop">
            <p className="text-lg leading-snug mb-4">{current.q}</p>
            <div className="grid gap-2">
              {current.options.map((o, i) => (
                <button key={o.label} onClick={() => {
                  const next = [...answers, i];
                  setAnswers(next);
                  if (next.length === UNDERTONE_QUIZ.length) setProfile({ ...profile, undertone: computeUndertone(next) });
                }} className="text-left rounded-xl border border-line px-4 py-3 text-sm hover:border-gold hover:bg-gold/5 transition">
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="pop text-center py-4">
            <p className="text-muted text-sm">Votre résultat</p>
            <p className="font-display text-3xl mt-1">{UNDERTONES[result!].title}</p>
            <p className="text-xs text-muted mt-2">Enregistré dans votre profil.</p>
          </div>
        )}
        {answers.length > 0 && (
          <button className="btn btn-ghost mt-5" onClick={() => setAnswers([])}><RotateCcw size={14} /> Recommencer</button>
        )}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        {(Object.keys(UNDERTONES) as Undertone[]).map((k) => {
          const u = UNDERTONES[k];
          const mine = result === k;
          return (
            <div key={k} className={`glass rounded-2xl p-4 transition ${mine ? 'ring-2 ring-gold' : ''}`}>
              <div className="flex items-center gap-2">
                <span className="size-6 rounded-full border border-line" style={{ background: u.color }} />
                <h4 className="font-display text-lg">{u.title}</h4>
                {mine && <span className="ml-auto text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-gold/25 text-gold-ink">Vous</span>}
              </div>
              <p className="text-[12.5px] text-muted mt-2 leading-relaxed">{u.description}</p>
              <p className="text-[12.5px] mt-2"><strong>{u.codes}</strong></p>
              <ul className="mt-2 space-y-0.5">
                {u.foundations.map((f) => <li key={f} className="text-[12px]">• {f}</li>)}
              </ul>
              <p className="text-[12px] mt-2"><span className="text-muted">Blush :</span> {u.blush}</p>
              <p className="text-[12px]"><span className="text-muted">Lèvres :</span> {u.lips}</p>
              <p className="text-[12px] text-rose-ink mt-2">✕ {u.avoid}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ApplicationOrder() {
  return (
    <ol className="relative grid md:grid-cols-2 gap-3">
      {APPLICATION_STEPS.map((s, i) => (
        <li key={s.step} className="glass rounded-2xl p-4 flex gap-4 fade-up" style={{ animationDelay: `${i * 30}ms` }}>
          <span className="font-display text-3xl gold-text font-semibold w-10 shrink-0">{s.step}</span>
          <div>
            <h4 className="font-semibold">{s.title}</h4>
            <p className="text-[13px] text-muted leading-relaxed mt-1">{s.detail}</p>
            {s.wait && <p className="text-[11.5px] mt-2 inline-flex items-center gap-1 font-mono text-gold-ink"><Clock size={12} /> Temps de pose : {s.wait}</p>}
          </div>
        </li>
      ))}
    </ol>
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
        <h3 className="font-display text-2xl mb-2">Pourquoi mon fond de teint peluche ?</h3>
        <p className="leading-relaxed max-w-3xl">{FORMULATION_RULES.intro}</p>
        <p className="mt-3 text-sm text-muted max-w-3xl"><strong className="text-ink">Comment savoir ? </strong>{FORMULATION_RULES.howTo}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-3">
        {FORMULATION_RULES.families.map((f) => (
          <div key={f.name} className="glass rounded-2xl p-4">
            <h4 className="font-semibold">{f.name}</h4>
            <p className="font-mono text-[11px] text-gold-ink mt-2 leading-relaxed">{f.inci}</p>
            <p className="text-[11px] uppercase tracking-wider text-muted mt-3 mb-1">Exemples</p>
            <ul className="text-[13px] space-y-0.5">{f.examples.map((e) => <li key={e}>• {e}</li>)}</ul>
          </div>
        ))}
      </div>

      <div className="glass rounded-3xl p-6">
        <h3 className="font-display text-xl mb-4">Le testeur de compatibilité</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-muted mb-2">Ma base / mon soin est à base de…</p>
            <div className="flex gap-2 flex-wrap">{BASES.map((b) => <button key={b} className="chip" data-active={base === b} onClick={() => setBase(b)}>{b}</button>)}</div>
          </div>
          <div>
            <p className="text-xs text-muted mb-2">Mon fond de teint est à base de…</p>
            <div className="flex gap-2 flex-wrap">{FDTS.map((b) => <button key={b} className="chip" data-active={fdt === b} onClick={() => setFdt(b)}>{b}</button>)}</div>
          </div>
        </div>
        <div key={base + fdt} className={`pop mt-5 rounded-2xl p-4 flex items-center gap-3 ${rule.ok === 'oui' ? 'bg-sage/15' : rule.ok === 'non' ? 'bg-rose/15' : 'bg-gold/15'}`}>
          <span className="grid place-items-center size-10 rounded-full bg-solid"><Icon size={18} /></span>
          <div>
            <p className="font-semibold">{rule.ok === 'oui' ? 'Compatible' : rule.ok === 'non' ? 'Incompatible' : 'Sous conditions'}</p>
            <p className="text-sm text-muted">{rule.note}</p>
          </div>
        </div>
        <div className="overflow-x-auto mt-5">
          <table className="w-full text-sm min-w-[420px]">
            <thead><tr className="text-left text-[11px] uppercase tracking-wider text-muted border-b border-line"><th className="py-2">Base</th><th>Fond de teint</th><th>Verdict</th></tr></thead>
            <tbody>
              {FORMULATION_RULES.matrix.map((m) => (
                <tr key={m.base + m.fdt} className="border-b border-line last:border-0">
                  <td className="py-2">{m.base}</td><td>{m.fdt}</td>
                  <td>{m.ok === 'oui' ? '✅' : m.ok === 'non' ? '❌' : '⚠️'} <span className="text-muted">{m.note}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function FaceShapes() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {FACE_SHAPES.map((f) => (
        <div key={f.name} className="glass rounded-2xl p-5">
          <p className="text-3xl">{f.emoji}</p>
          <h4 className="font-display text-xl mt-2">Visage {f.name}</h4>
          <dl className="mt-3 space-y-2 text-[13px]">
            <div><dt className="text-[11px] uppercase tracking-wider text-muted">Contour</dt><dd>{f.contour}</dd></div>
            <div><dt className="text-[11px] uppercase tracking-wider text-muted">Blush</dt><dd>{f.blush}</dd></div>
            <div><dt className="text-[11px] uppercase tracking-wider text-muted">Highlighter</dt><dd>{f.highlight}</dd></div>
          </dl>
        </div>
      ))}
    </div>
  );
}

export function MasterclassView() {
  const [tab, setTab] = useState<Tab>('undertone');
  return (
    <div>
      <SectionTitle kicker="🎨 La Masterclass" title={<>Sous-tons, morphologie <em className="gold-text">& chimie des textures</em>.</>}>
        Ne plus jamais acheter un fond de teint orange ou gris, appliquer dans le bon ordre, et comprendre pourquoi certains produits peluchent.
      </SectionTitle>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
        {TABS.map((t) => <button key={t.id} className="chip" data-active={tab === t.id} onClick={() => setTab(t.id)}><t.icon size={14} /> {t.label}</button>)}
      </div>
      <div key={tab} className="fade-up">
        {tab === 'undertone' && <UndertoneQuiz />}
        {tab === 'order' && <ApplicationOrder />}
        {tab === 'chemistry' && <Chemistry />}
        {tab === 'shape' && <FaceShapes />}
      </div>
    </div>
  );
}
