import { Heart, ShoppingBag, Check, X } from 'lucide-react';
import { useEffect, useId, useRef, useState, type ReactNode, type RefObject } from 'react';
import { brandById, brandName } from '../data/brands';
import LOGOS from '../data/logos.json';
import { totalScore } from '../data/products';
import type { Product, Scores, Tier } from '../data/types';
import { LEVEL_LABELS, SKIN_LABELS, TIER_META, euro, priceLevel } from '../lib/helpers';
import { BASE_LABELS, detailsOf, pricePer10 } from '../data/product-details';
import { useStore } from '../lib/store';

const LOGO_FILES = LOGOS as Record<string, string>;

/**
 * Logo de marque hébergé avec le site (public/logos), avec monogramme de secours.
 * Décoratif par défaut (alt="") car le nom de la marque est toujours écrit à côté.
 */
export function BrandLogo({ brand, size = 32, label }: { brand: string; size?: number; label?: boolean }) {
  const [failed, setFailed] = useState(false);
  const file = LOGO_FILES[brand];
  const name = brandById(brand)?.name ?? brand;
  const alt = label ? `Logo ${name}` : '';
  const initials = name.replace(/[^A-Za-zÀ-ÿ&' ]/g, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase();
  const box = { width: size, height: size };
  if (!file || failed) {
    return (
      <span
        className="shrink-0 grid place-items-center rounded-lg border border-line bg-gold/15 text-gold-ink font-display font-semibold"
        style={{ ...box, fontSize: size * 0.38 }}
        role={label ? 'img' : undefined}
        aria-label={label ? alt : undefined}
        aria-hidden={label ? undefined : true}
      >
        {initials}
      </span>
    );
  }
  return (
    <span className="shrink-0 grid place-items-center rounded-lg border border-line bg-white overflow-hidden" style={box}>
      <img
        src={`${import.meta.env.BASE_URL}logos/${file}`}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className="size-[78%] object-contain"
      />
    </span>
  );
}

export function TierBadge({ tier, size = 'sm' }: { tier: Tier; size?: 'sm' | 'lg' }) {
  const m = TIER_META[tier];
  return (
    <span
      className={`${m.cls} inline-flex items-center justify-center font-mono font-semibold rounded-md ${size === 'lg' ? 'px-3 py-1 text-sm' : 'px-1.5 py-0.5 text-[11px]'}`}
      title={m.desc}
    >
      <span aria-hidden="true">{tier === 'Surcote' ? 'SURCOTÉ' : tier}</span>
      <span className="sr-only">{tier === 'Surcote' ? 'Classement : surcoté' : `Classement : ${m.label}`}</span>
    </span>
  );
}

export function ScoreRing({ value, size = 44 }: { value: number; size?: number }) {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }} role="img" aria-label={`Score global ${value} sur 100`}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true" focusable="false">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line)" strokeWidth={3} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--gold)" strokeWidth={3} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - value / 100)} />
      </svg>
      <span aria-hidden="true" className="absolute inset-0 grid place-items-center font-mono text-[12px] font-semibold">{value}</span>
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
    <dl className={`grid ${compact ? 'grid-cols-2 gap-x-3 gap-y-1' : 'gap-1.5'}`}>
      {(Object.keys(SCORE_LABELS) as (keyof Scores)[]).map((k) => (
        <div key={k} className="flex items-center gap-2 text-[11px]">
          <dt className="w-[5.5rem] shrink-0 text-muted">{SCORE_LABELS[k]}</dt>
          <div className="h-1 flex-1 rounded-full bg-line overflow-hidden" aria-hidden="true">
            <div className="h-full rounded-full" style={{ width: `${scores[k]}%`, background: 'linear-gradient(90deg, var(--rose), var(--gold))' }} />
          </div>
          <dd className="font-mono w-10 text-right">{scores[k]}<span className="sr-only"> sur 100</span></dd>
        </div>
      ))}
    </dl>
  );
}

export function ProductActions({ id, name }: { id: string; name: string }) {
  const { bag, wishlist, toggleBag, toggleWish } = useStore();
  const inBag = bag.includes(id);
  const wished = wishlist.includes(id);
  return (
    <div className="flex items-center gap-1.5">
      <button
        type="button"
        onClick={() => toggleWish(id)}
        className={`grid place-items-center size-9 rounded-full border border-line transition hover:border-rose ${wished ? 'bg-rose/20 text-rose-ink' : ''}`}
        aria-label={`Wishlist : ${name}`}
        aria-pressed={wished}
      >
        <Heart size={15} fill={wished ? 'currentColor' : 'none'} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => toggleBag(id)}
        className={`inline-flex items-center gap-1.5 h-9 px-3 rounded-full text-xs font-semibold transition ${inBag ? 'bg-gold/25 text-gold-ink border border-gold/50' : 'bg-ink text-bg hover:opacity-85'}`}
        aria-pressed={inBag}
      >
        {inBag ? <Check size={14} aria-hidden="true" /> : <ShoppingBag size={14} aria-hidden="true" />}
        <span aria-hidden="true">{inBag ? 'Dans ma trousse' : 'Ajouter'}</span>
        <span className="sr-only">Dans ma trousse : {name}</span>
      </button>
    </div>
  );
}

export function ProductCard({ p, highlight, showScores = true, headingLevel = 4 }: { p: Product; highlight?: boolean; showScores?: boolean; headingLevel?: 3 | 4 | 5 }) {
  const { profile } = useStore();
  const lvl = LEVEL_LABELS[priceLevel(p)];
  const up = pricePer10(p)?.label;
  const det = detailsOf(p);
  const skinOk = !profile.skin || p.skin.includes(profile.skin);
  const H = `h${headingLevel}` as 'h3' | 'h4' | 'h5';
  return (
    <article
      id={`p-${p.id}`}
      tabIndex={-1}
      aria-labelledby={`t-${p.id}`}
      className={`glass rounded-2xl p-4 flex flex-col gap-3 transition hover:-translate-y-0.5 ${highlight ? 'ring-2 ring-gold' : ''}`}
    >
      <header className="flex items-start gap-3">
        <ScoreRing value={totalScore(p)} />
        <div className="min-w-0 flex-1">
          <p className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider text-muted">
            <BrandLogo brand={p.brand} size={18} />
            <span className="truncate">{brandName(p.brand)}</span>
          </p>
          <H id={`t-${p.id}`} className="font-display text-[1.05rem] leading-snug">{p.name}</H>
        </div>
        <TierBadge tier={p.tier} />
      </header>
      <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-lg font-semibold"><span className="sr-only">Prix : </span>{euro(p.price)}</span>
        <span className="font-mono text-xs text-muted">{p.size}{up ? ` · ${up}` : ''}</span>
        <span className="text-[11px] text-muted ml-auto"><span aria-hidden="true">{lvl.emoji} </span>{lvl.label}</span>
      </p>
      <p className="text-[13px] leading-relaxed text-muted">{p.verdict}</p>
      {det.iconicShades && <p className="text-[12px]"><span className="text-muted">Teintes cultes :</span> {det.iconicShades}</p>}
      <Badges p={p} />
      {showScores && <ScoreBars scores={p.scores} compact />}
      <ul className="flex flex-wrap gap-1" aria-label="Fini et types de peau">
        <li className="text-[10.5px] px-2 py-0.5 rounded-full bg-gold/15 text-gold-ink">Fini : {p.finish}</li>
        {p.skin.map((s) => (
          <li key={s} className={`text-[10.5px] px-2 py-0.5 rounded-full border border-line ${profile.skin === s ? 'bg-sage/20 border-sage/40' : 'text-muted'}`}>
            {SKIN_LABELS[s]}
          </li>
        ))}
      </ul>
      {!skinOk && (
        <p className="text-[11.5px] text-rose-ink"><span aria-hidden="true">⚠︎ </span>Pas idéal pour votre peau ({SKIN_LABELS[profile.skin!]}).</p>
      )}
      <div className="mt-auto pt-1 flex justify-end">
        <ProductActions id={p.id} name={`${brandName(p.brand)} ${p.name}`} />
      </div>
    </article>
  );
}

/** Badges techniques : format mini, base de formule, allégations peau. */
export function Badges({ p }: { p: Product }) {
  const det = detailsOf(p);
  const items: { label: string; cls: string }[] = [];
  if (det.mini) items.push({ label: `Mini dispo : ${euro(det.mini.price)} · ${det.mini.size}`, cls: 'bg-sage/20 text-sage-ink' });
  if (det.baseType && det.baseType !== 'powder') items.push({ label: `Base ${BASE_LABELS[det.baseType].toLowerCase()}`, cls: 'border border-line' });
  if (det.acneSafe) items.push({ label: 'Non comédogène', cls: 'bg-sage/20 text-sage-ink' });
  if (det.fragranceFree === true) items.push({ label: 'Sans parfum', cls: 'bg-sage/20 text-sage-ink' });
  if (det.fragranceFree === false) items.push({ label: 'Parfumé', cls: 'border border-line text-muted' });
  if (det.talcFree === true) items.push({ label: 'Sans talc', cls: 'border border-line' });
  if (det.talcFree === false) items.push({ label: 'Contient du talc', cls: 'border border-line text-muted' });
  if (!items.length) return null;
  return (
    <ul className="flex flex-wrap gap-1" aria-label="Infos techniques">
      {items.map((i) => <li key={i.label} className={`text-[10.5px] px-2 py-0.5 rounded-full font-medium ${i.cls}`}>{i.label}</li>)}
    </ul>
  );
}

export function SectionTitle({ emoji, kicker, title, children }: { emoji?: string; kicker: string; title: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-6 fade-up">
      <p className="text-[11px] uppercase tracking-[0.25em] text-gold-ink font-semibold mb-2">
        {emoji && <span aria-hidden="true">{emoji} </span>}{kicker}
      </p>
      <h1 data-view-title tabIndex={-1} className="font-display text-3xl sm:text-5xl leading-[1.05] tracking-tight outline-none">{title}</h1>
      {children && <p className="mt-3 max-w-2xl text-muted leading-relaxed">{children}</p>}
    </div>
  );
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Piège le focus dans une boîte de dialogue, ferme avec Échap,
 * puis rend le focus à l'élément qui l'a ouverte.
 */
export function useDialog(open: boolean, onClose: () => void, ref: RefObject<HTMLElement | null>) {
  const close = useRef(onClose);
  close.current = onClose;
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    const root = ref.current;
    const first = root?.querySelector<HTMLElement>('[autofocus], [data-autofocus]') ?? root?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close.current();
        return;
      }
      if (e.key !== 'Tab' || !root) return;
      const items = Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
      if (previous && document.contains(previous)) previous.focus();
    };
  }, [open, ref]);
}

export function Sheet({ open, onClose, children, title }: { open: boolean; onClose: () => void; children: ReactNode; title: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const titleId = useId();
  useDialog(open, onClose, ref);
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className="pop relative w-full sm:max-w-3xl max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-solid border border-line shadow-2xl">
        <span id={titleId} className="sr-only">{title}</span>
        <button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 grid place-items-center size-10 rounded-full border border-line bg-solid hover:border-gold" aria-label="Fermer" data-autofocus>
          <X size={16} aria-hidden="true" />
        </button>
        {children}
      </div>
    </div>
  );
}
