import { Heart, ShoppingBag, Check, X } from 'lucide-react';
import { useEffect, type ReactNode } from 'react';
import { brandName } from '../data/brands';
import { totalScore } from '../data/products';
import type { Product, Scores, Tier } from '../data/types';
import { LEVEL_LABELS, SKIN_LABELS, TIER_META, euro, priceLevel, unitPrice } from '../lib/helpers';
import { useStore } from '../lib/store';

export function TierBadge({ tier, size = 'sm' }: { tier: Tier; size?: 'sm' | 'lg' }) {
  const m = TIER_META[tier];
  return (
    <span
      className={`${m.cls} inline-flex items-center justify-center font-mono font-semibold rounded-md ${size === 'lg' ? 'px-3 py-1 text-sm' : 'px-1.5 py-0.5 text-[11px]'}`}
      title={m.desc}
    >
      {tier === 'Surcote' ? 'SURCOTÉ' : tier}
    </span>
  );
}

export function ScoreRing({ value, size = 44 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} aria-label={`Score ${value} sur 100`}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--gold)" strokeWidth={3} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <span className="absolute inset-0 grid place-items-center font-mono text-[12px] font-semibold">{value}</span>
    </div>
  );
}

const SCORE_LABELS: Record<keyof Scores, string> = {
  tenue: 'Tenue',
  pigment: 'Pigment./Fini',
  confort: 'Confort peau',
  valeur: 'Qualité/Prix',
};

export function ScoreBars({ scores, compact }: { scores: Scores; compact?: boolean }) {
  return (
    <div className={`grid ${compact ? 'grid-cols-2 gap-x-3 gap-y-1' : 'gap-1.5'}`}>
      {(Object.keys(SCORE_LABELS) as (keyof Scores)[]).map((k) => (
        <div key={k} className="flex items-center gap-2 text-[11px]">
          <span className="w-[5.5rem] shrink-0 text-muted">{SCORE_LABELS[k]}</span>
          <div className="h-1 flex-1 rounded-full bg-line overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${scores[k]}%`, background: 'linear-gradient(90deg, var(--rose), var(--gold))' }} />
          </div>
          <span className="font-mono w-6 text-right">{scores[k]}</span>
        </div>
      ))}
    </div>
  );
}

export function ProductActions({ id }: { id: string }) {
  const { bag, wishlist, toggleBag, toggleWish } = useStore();
  const inBag = bag.includes(id);
  const wished = wishlist.includes(id);
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={() => toggleWish(id)}
        className={`grid place-items-center size-8 rounded-full border border-line transition hover:border-rose ${wished ? 'bg-rose/20 text-rose-ink' : ''}`}
        aria-label={wished ? 'Retirer de la wishlist' : 'Ajouter à la wishlist'}
        aria-pressed={wished}
      >
        <Heart size={15} fill={wished ? 'currentColor' : 'none'} />
      </button>
      <button
        onClick={() => toggleBag(id)}
        className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-xs font-semibold transition ${inBag ? 'bg-gold/25 text-gold-ink border border-gold/50' : 'bg-ink text-bg hover:opacity-85'}`}
        aria-pressed={inBag}
      >
        {inBag ? <Check size={14} /> : <ShoppingBag size={14} />}
        {inBag ? 'Dans ma trousse' : 'Ajouter'}
      </button>
    </div>
  );
}

export function ProductCard({ p, highlight, showScores = true }: { p: Product; highlight?: boolean; showScores?: boolean }) {
  const { profile } = useStore();
  const lvl = LEVEL_LABELS[priceLevel(p)];
  const up = unitPrice(p);
  const skinOk = !profile.skin || p.skin.includes(profile.skin);
  return (
    <article
      id={`p-${p.id}`}
      className={`glass rounded-2xl p-4 flex flex-col gap-3 transition hover:-translate-y-0.5 ${highlight ? 'ring-2 ring-gold' : ''} ${p.tier === 'Surcote' ? 'opacity-90' : ''}`}
    >
      <header className="flex items-start gap-3">
        <ScoreRing value={totalScore(p)} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted">
            <span className="truncate">{brandName(p.brand)}</span>
          </div>
          <h4 className="font-display text-[1.05rem] leading-snug">{p.name}</h4>
        </div>
        <TierBadge tier={p.tier} />
      </header>
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-lg font-semibold">{euro(p.price)}</span>
        <span className="font-mono text-xs text-muted">{p.size}{up ? ` · ${up}` : ''}</span>
        <span className="text-[11px] text-muted ml-auto">{lvl.emoji} {lvl.label}</span>
      </div>
      <p className="text-[13px] leading-relaxed text-muted">{p.verdict}</p>
      {showScores && <ScoreBars scores={p.scores} compact />}
      <div className="flex flex-wrap gap-1">
        <span className="text-[10.5px] px-2 py-0.5 rounded-full bg-gold/15 text-gold-ink">Fini : {p.finish}</span>
        {p.skin.map((s) => (
          <span key={s} className={`text-[10.5px] px-2 py-0.5 rounded-full border border-line ${profile.skin === s ? 'bg-sage/20 border-sage/40' : 'text-muted'}`}>
            {SKIN_LABELS[s]}
          </span>
        ))}
      </div>
      {!skinOk && (
        <p className="text-[11.5px] text-rose-ink">⚠︎ Pas idéal pour votre peau ({SKIN_LABELS[profile.skin!]}).</p>
      )}
      <div className="mt-auto pt-1 flex justify-end">
        <ProductActions id={p.id} />
      </div>
    </article>
  );
}

export function SectionTitle({ kicker, title, children }: { kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-6 fade-up">
      <p className="text-[11px] uppercase tracking-[0.25em] text-gold-ink font-semibold mb-2">{kicker}</p>
      <h1 className="font-display text-3xl sm:text-5xl leading-[1.05] tracking-tight">{title}</h1>
      {children && <p className="mt-3 max-w-2xl text-muted leading-relaxed">{children}</p>}
    </div>
  );
}

export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title: string }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="pop relative w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-solid border border-line shadow-2xl">
        <button onClick={onClose} className="absolute right-4 top-4 z-10 grid place-items-center size-9 rounded-full border border-line bg-solid hover:border-gold" aria-label="Fermer">
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  );
}
