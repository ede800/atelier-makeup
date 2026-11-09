import { useId, useState } from 'react';
import {
  EYE_LAYERS, EYE_SHAPES, FACE_MODES, ZONE_META,
  type EyeLayer, type EyeShape, type FaceShape, type ZoneKind, type ZoneShape,
} from '../data/morphology';

const KINDS: ZoneKind[] = ['contour', 'bronzer', 'blush', 'concealer', 'highlighter'];

const FACE_PATHS: Record<FaceShape, string> = {
  ovale: 'M150 58 C 225 58 258 130 255 205 C 252 290 205 352 150 352 C 95 352 48 290 45 205 C 42 130 75 58 150 58 Z',
  rond: 'M150 70 C 232 70 262 140 262 210 C 262 290 215 340 150 340 C 85 340 38 290 38 210 C 38 140 68 70 150 70 Z',
  carre: 'M150 62 C 215 62 250 80 252 140 L 254 270 C 254 315 215 345 150 348 C 85 345 46 315 46 270 L 48 140 C 50 80 85 62 150 62 Z',
  long: 'M150 46 C 215 46 242 120 242 205 C 242 300 200 362 150 362 C 100 362 58 300 58 205 C 58 120 85 46 150 46 Z',
};

function mirror(z: ZoneShape): ZoneShape[] {
  return z.center ? [z] : [z, { ...z, cx: 300 - z.cx, rot: z.rot ? -z.rot : 0 }];
}

function Patterns({ uid }: { uid: string }) {
  return (
    <defs>
      <pattern id={`${uid}-hatch`} width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="6" height="6" fill={ZONE_META.contour.color} fillOpacity="0.35" />
        <line x1="0" y1="0" x2="0" y2="6" stroke={ZONE_META.contour.color} strokeWidth="2.5" />
      </pattern>
      <pattern id={`${uid}-dots`} width="6" height="6" patternUnits="userSpaceOnUse">
        <rect width="6" height="6" fill={ZONE_META.bronzer.color} fillOpacity="0.45" />
        <circle cx="3" cy="3" r="1.4" fill={ZONE_META.bronzer.color} />
      </pattern>
      <pattern id={`${uid}-cross`} width="7" height="7" patternUnits="userSpaceOnUse">
        <rect width="7" height="7" fill={ZONE_META.concealer.color} />
        <path d="M0 0 L7 7 M7 0 L0 7" stroke="#C9A27E" strokeWidth="0.8" />
      </pattern>
    </defs>
  );
}

function fillFor(kind: ZoneKind, uid: string) {
  if (kind === 'contour') return `url(#${uid}-hatch)`;
  if (kind === 'bronzer') return `url(#${uid}-dots)`;
  if (kind === 'concealer') return `url(#${uid}-cross)`;
  return ZONE_META[kind].color;
}

export function FaceChart() {
  const uid = useId().replace(/:/g, '');
  const [modeId, setModeId] = useState(FACE_MODES[0].id);
  const [hidden, setHidden] = useState<ZoneKind[]>([]);
  const mode = FACE_MODES.find((m) => m.id === modeId)!;
  const kinds = KINDS.filter((k) => mode.zones[k]?.length);
  const desc = kinds.map((k) => `${ZONE_META[k].label} : ${mode.steps[k]}`).join(' ');

  return (
    <section aria-labelledby={`${uid}-title`} className="glass rounded-3xl p-5 sm:p-6">
      <h2 id={`${uid}-title`} className="font-display text-2xl">Le schéma visage interactif</h2>
      <p className="text-sm text-muted mt-1">Choisissez un effet : les zones se mettent à jour sur le schéma et dans la liste.</p>
      <div role="group" aria-label="Effet recherché" className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mt-4">
        {FACE_MODES.map((m) => (
          <button key={m.id} type="button" className="chip" data-active={m.id === modeId} aria-pressed={m.id === modeId} onClick={() => setModeId(m.id)}>{m.label}</button>
        ))}
      </div>

      <div className="grid md:grid-cols-[minmax(0,320px)_1fr] gap-6 mt-5 items-start">
        <svg viewBox="0 0 300 400" className="w-full max-w-[320px] mx-auto" role="img" aria-labelledby={`${uid}-svgt ${uid}-svgd`}>
          <title id={`${uid}-svgt`}>Schéma de placement — {mode.label}</title>
          <desc id={`${uid}-svgd`}>{desc}</desc>
          <Patterns uid={uid} />
          <path d={FACE_PATHS[mode.shape]} fill="#F3DCC8" stroke="#B88D6E" strokeWidth="2" />
          {/* traits du visage */}
          <g fill="none" stroke="#8A6A57" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M92 165 Q 112 152 132 160" /><path d="M208 165 Q 188 152 168 160" />
            <path d="M96 188 Q 115 176 134 188 Q 115 197 96 188 Z" /><path d="M204 188 Q 185 176 166 188 Q 185 197 204 188 Z" />
            <path d="M150 196 L 145 236 Q 150 242 157 236" />
            <path d="M126 278 Q 150 268 174 278 Q 150 292 126 278 Z" />
          </g>
          {kinds.filter((k) => !hidden.includes(k)).map((k) => (
            <g key={k} aria-hidden="true">
              {mode.zones[k]!.flatMap(mirror).map((z, i) => (
                <ellipse key={i} cx={z.cx} cy={z.cy} rx={z.rx} ry={z.ry} transform={z.rot ? `rotate(${z.rot} ${z.cx} ${z.cy})` : undefined}
                  fill={fillFor(k, uid)} fillOpacity={k === 'blush' ? 0.7 : k === 'highlighter' ? 0.95 : 0.9}
                  stroke={k === 'highlighter' ? '#C9A24A' : 'none'} strokeWidth={k === 'highlighter' ? 1.2 : 0} className="transition-all duration-300" />
              ))}
            </g>
          ))}
        </svg>

        <div>
          <p className="leading-relaxed">{mode.intro}</p>
          <ul className="mt-4 space-y-3" aria-label="Où placer chaque produit">
            {kinds.map((k) => {
              const off = hidden.includes(k);
              return (
                <li key={k} className="flex gap-3 items-start">
                  <button type="button" aria-pressed={!off} onClick={() => setHidden((h) => (off ? h.filter((x) => x !== k) : [...h, k]))}
                    className={`mt-0.5 shrink-0 size-9 rounded-lg border-2 grid place-items-center transition ${off ? 'opacity-40 border-line' : 'border-ink/30'}`}
                    aria-label={`Afficher ${ZONE_META[k].label} sur le schéma`}>
                    <svg width="22" height="22" aria-hidden="true"><Patterns uid={`${uid}l`} /><rect width="22" height="22" rx="4" fill={fillFor(k, `${uid}l`)} stroke={k === 'highlighter' ? '#C9A24A' : 'none'} /></svg>
                  </button>
                  <div>
                    <p className="font-semibold text-sm">{ZONE_META[k].label}</p>
                    <p className="text-[13px] text-muted leading-relaxed">{mode.steps[k]}</p>
                  </div>
                </li>
              );
            })}
          </ul>
          <p className="text-[11.5px] text-muted mt-4">Chaque produit a son motif (hachures, points, quadrillage) en plus de sa couleur. Cliquez sur une pastille pour masquer ou afficher la zone.</p>
        </div>
      </div>
    </section>
  );
}

const EYE_PATHS: Record<EyeShape, { eye: string; lid: string; crease: string; hood?: string; inner: [number, number]; outer: [number, number] }> = {
  amande: {
    eye: 'M70 120 Q 160 72 250 120 Q 160 150 70 120 Z', lid: 'M70 120 Q 160 72 250 120',
    crease: 'M78 112 Q 160 48 248 104', inner: [74, 121], outer: [250, 120],
  },
  rond: {
    eye: 'M84 122 Q 160 56 236 122 Q 160 168 84 122 Z', lid: 'M84 122 Q 160 56 236 122',
    crease: 'M86 108 Q 160 30 236 100', inner: [88, 123], outer: [236, 122],
  },
  tombant: {
    eye: 'M70 124 Q 160 86 250 124 Q 160 152 70 124 Z', lid: 'M70 124 Q 160 86 250 124',
    crease: 'M74 104 Q 160 36 250 92', hood: 'M72 116 Q 160 76 252 116', inner: [74, 125], outer: [250, 124],
  },
};

export function EyeChart() {
  const uid = useId().replace(/:/g, '');
  const [shape, setShape] = useState<EyeShape>('tombant');
  const [hidden, setHidden] = useState<EyeLayer[]>([]);
  const s = EYE_SHAPES[shape];
  const g = EYE_PATHS[shape];
  const show = (l: EyeLayer) => !hidden.includes(l);
  const [ox, oy] = g.outer;
  const liner = shape === 'tombant'
    ? `M${ox - 70} ${oy - 4} Q ${ox - 30} ${oy - 8} ${ox} ${oy} L ${ox + 22} ${oy - 18} L ${ox + 8} ${oy - 12} L ${ox - 6} ${oy - 10} Z`
    : shape === 'rond'
      ? `M${g.inner[0] + 6} ${g.inner[1] - 2} Q ${ox - 40} ${oy - 34} ${ox} ${oy} L ${ox + 30} ${oy - 8} L ${ox - 4} ${oy - 7} Z`
      : `M${ox - 80} ${oy - 18} Q ${ox - 30} ${oy - 18} ${ox} ${oy} L ${ox + 26} ${oy - 15} L ${ox - 4} ${oy - 8} Z`;

  return (
    <section aria-labelledby={`${uid}-title`} className="glass rounded-3xl p-5 sm:p-6">
      <h2 id={`${uid}-title`} className="font-display text-2xl">Le schéma des yeux</h2>
      <div role="group" aria-label="Forme de l'œil" className="flex gap-2 flex-wrap mt-4">
        {(Object.keys(EYE_SHAPES) as EyeShape[]).map((k) => (
          <button key={k} type="button" className="chip" data-active={shape === k} aria-pressed={shape === k} onClick={() => setShape(k)}>{EYE_SHAPES[k].label}</button>
        ))}
      </div>
      <div className="grid md:grid-cols-[minmax(0,360px)_1fr] gap-6 mt-5 items-start">
        <svg viewBox="0 0 320 200" className="w-full max-w-[360px] mx-auto rounded-2xl bg-[#F3DCC8]" role="img" aria-labelledby={`${uid}-t ${uid}-d`}>
          <title id={`${uid}-t`}>{s.label} : placement des fards et de l'eyeliner</title>
          <desc id={`${uid}-d`}>{(Object.keys(EYE_LAYERS) as EyeLayer[]).map((l) => `${EYE_LAYERS[l].label} : ${s.tips[l]}`).join(' ')}</desc>
          {/* sourcil */}
          <path d="M60 52 Q 150 14 262 40" fill="none" stroke="#5A3E33" strokeWidth="9" strokeLinecap="round" aria-hidden="true" />
          {show('browbone') && <ellipse cx="232" cy="58" rx="26" ry="6" transform="rotate(-8 232 58)" fill={EYE_LAYERS.browbone.color} stroke="#C9A24A" strokeWidth="1" aria-hidden="true" />}
          {show('crease') && <path d={g.crease} fill="none" stroke={EYE_LAYERS.crease.color} strokeWidth="10" strokeOpacity="0.55" strokeLinecap="round" aria-hidden="true" />}
          {show('outerV') && <path d={`M${ox} ${oy} L ${ox - 52} ${oy - 52} Q ${ox - 8} ${oy - 48} ${ox + 10} ${oy - 24} Z`} fill={EYE_LAYERS.outerV.color} fillOpacity="0.6" aria-hidden="true" />}
          {/* œil */}
          <path d={g.eye} fill="#FFFFFF" stroke="#8A6A57" strokeWidth="2" aria-hidden="true" />
          <circle cx="160" cy={shape === 'rond' ? 112 : 114} r={shape === 'rond' ? 26 : 22} fill="#6B4A3A" aria-hidden="true" />
          <circle cx="160" cy={shape === 'rond' ? 112 : 114} r="10" fill="#1D1A19" aria-hidden="true" />
          {g.hood && <path d={g.hood} fill="none" stroke="#B88D6E" strokeWidth="3" aria-hidden="true" />}
          {g.hood && <path d={`${g.hood} L 252 70 Q 160 40 72 82 Z`} fill="#F3DCC8" fillOpacity="0.55" aria-hidden="true" />}
          {show('liner') && <path d={liner} fill={EYE_LAYERS.liner.color} aria-hidden="true" />}
          {show('inner') && <circle cx={g.inner[0] + 4} cy={g.inner[1] - 1} r="6" fill={EYE_LAYERS.inner.color} stroke="#C9A24A" aria-hidden="true" />}
          {shape === 'tombant' && show('crease') && <text x="160" y="34" textAnchor="middle" fontSize="10" fill="#5A3E33" aria-hidden="true">faux creux (au-dessus du pli)</text>}
        </svg>
        <div>
          <p className="leading-relaxed">{s.intro}</p>
          <ul className="mt-4 space-y-3" aria-label="Placement pour cette forme d'œil">
            {(Object.keys(EYE_LAYERS) as EyeLayer[]).map((l) => (
              <li key={l} className="flex gap-3 items-start">
                <button type="button" aria-pressed={show(l)} onClick={() => setHidden((h) => (show(l) ? [...h, l] : h.filter((x) => x !== l)))}
                  aria-label={`Afficher ${EYE_LAYERS[l].label} sur le schéma`}
                  className={`mt-0.5 shrink-0 size-9 rounded-lg border-2 grid place-items-center transition ${show(l) ? 'border-ink/30' : 'opacity-40 border-line'}`}>
                  <span className="size-5 rounded" style={{ background: EYE_LAYERS[l].color, outline: '1px solid #C9A24A' }} />
                </button>
                <div>
                  <p className="font-semibold text-sm">{EYE_LAYERS[l].label}</p>
                  <p className="text-[13px] text-muted leading-relaxed">{s.tips[l]}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
