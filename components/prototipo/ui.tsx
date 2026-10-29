'use client';
// Peças visuais do protótipo e o contexto que dá acesso ao estado.
import { createContext, useContext, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { ATTRS, GROUPS, fmt, gavg, initials, metros, ov, type Atleta, type AttrKey } from '@/lib/prototipo/dados';
import { back, type State } from '@/lib/prototipo/estado';

/* ---------- Contexto ---------- */
export interface Api {
  s: State;
  /** Altera um rascunho do estado. As chamadas em sequência se acumulam. */
  set: (fn: (d: State) => void) => void;
  hint: string | null;
}
export const ProtoCtx = createContext<Api | null>(null);
export function useP() {
  const api = useContext(ProtoCtx);
  if (!api) throw new Error('useP precisa estar dentro do protótipo');
  return api;
}
export const cx = (...c: (string | false | null | undefined)[]) => c.filter(Boolean).join(' ');

/** Botão que conhece o guia: se `h` é o destaque do passo atual, ele pisca e, ao tocar, avança o fluxo. */
export function B({ h, onClick, className, type = 'button', ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { h?: string }) {
  const { hint, set } = useP();
  const on = !!h && hint === h;
  return (
    <button
      type={type}
      className={cx(className, on && 'hint')}
      onClick={e => {
        if (on) set(d => { if (d.flow) d.flow.i++; });
        onClick?.(e);
      }}
      {...rest}
    />
  );
}

/* ---------- Ícones ---------- */
const ICONS: Record<string, ReactNode> = {
  home: <><path d="M3 11l9-8 9 8" /><path d="M5 10v10h14V10" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M21 21l-4.35-4.35" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  user: <><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>,
  users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" /></>,
  back: <path d="M15 18l-6-6 6-6" />,
  chev: <path d="M9 18l6-6-6-6" />,
  heart: <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z" />,
  filter: <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />,
  play: <path d="M7 4l13 8-13 8z" fill="currentColor" />,
  check: <path d="M20 6L9 17l-5-5" />,
  clock: <><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></>,
  shield: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  shieldok: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="M9 12l2 2 4-4" /></>,
  send: <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />,
  eye: <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>,
  upload: <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />,
  file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></>,
  video: <><path d="M23 7l-7 5 7 5V7z" /><rect x="1" y="5" width="15" height="14" rx="2" /></>,
  brief: <><rect x="2" y="7" width="20" height="14" rx="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
  mail: <><path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="M22 6l-10 7L2 6" /></>,
  cols: <path d="M12 3h7a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-7M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h7M12 3v18" />,
  x: <path d="M18 6L6 18M6 6l12 12" />,
  cal: <><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>,
  link: <><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7" /><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7" /></>,
  ball: <><circle cx="12" cy="12" r="10" /><path d="M12 7l4 3-1.5 5h-5L8 10z" /></>,
  bell: <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 0 1-3.46 0" /></>,
  edit: <><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></>,
  save: <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />,
  lock: <><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></>,
};
export function Ic({ n, s = 22 }: { n: string; s?: number }) {
  return (
    <svg className="ic" width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {ICONS[n]}
    </svg>
  );
}

/* ---------- Componentes ---------- */
export const Av = ({ nome, s = 44 }: { nome: string; s?: number }) => (
  <span className="av" style={{ ['--s' as string]: `${s}px` }} aria-hidden="true">{initials(nome)}</span>
);
export const VTag = ({ a }: { a: Atleta }) =>
  a.verificado ? <span style={{ color: 'var(--green)', display: 'inline-flex' }} title="Perfil verificado"><Ic n="shieldok" s={16} /></span> : null;

export function Hdr({ t, right }: { t: string; right?: ReactNode }) {
  const { set } = useP();
  return (
    <header className="bar">
      <button type="button" className="icon-btn" aria-label="Voltar" onClick={() => set(d => back(d))}><Ic n="back" /></button>
      <h2>{t}</h2>
      {right ?? <span className="sp" />}
    </header>
  );
}
export const Top = ({ t, eb, right }: { t: string; eb: string; right?: ReactNode }) => (
  <header className="top"><div><p className="eyebrow">{eb}</p><h1>{t}</h1></div>{right}</header>
);
export const Fld = ({ label, children }: { label: string; children: ReactNode }) => (
  <label className="fld"><span className="l">{label}</span>{children}</label>
);
export function Inp({ value, on, type = 'text' }: { value: string | number; on: (v: string) => void; type?: string }) {
  return <input className="in" type={type} value={value} onChange={e => on(e.target.value)} />;
}
export function Sel({ value, on, opts }: { value: string; on: (v: string) => void; opts: (string | [string, string])[] }) {
  return (
    <select className="in" value={value} onChange={e => on(e.target.value)}>
      {opts.map(o => { const [v, l] = Array.isArray(o) ? o : [o, o]; return <option key={v} value={v}>{l}</option>; })}
    </select>
  );
}
export const Chip = ({ on, onClick, children, h }: { on: boolean; onClick: () => void; children: ReactNode; h?: string }) => (
  <B className="chip" aria-pressed={on} onClick={onClick} h={h}>{children}</B>
);
export const Steps = ({ n, t }: { n: number; t: number }) => (
  <div className="steps" aria-label={`Passo ${n} de ${t}`}>{Array.from({ length: t }, (_, i) => <i key={i} className={i < n ? 'on' : ''} />)}</div>
);
export const Body = ({ act, children }: { act?: boolean; children: ReactNode }) => <div className={cx('body', act && 'act')}>{children}</div>;

export function Bars({ v }: { v: Partial<Record<AttrKey, number>> }) {
  return (
    <>
      {GROUPS.map(g => (
        <div key={g}>
          <div className="grp"><span>{g}</span><em>{fmt(gavg(v, g))}</em></div>
          {ATTRS.filter(x => x.g === g).map(x => {
            const n = v[x.k] ?? 0;
            return (
              <div className="br" key={x.k}>
                <span>{x.n}</span>
                <div className="track"><div className={cx('fill', n < 6 && 'lo')} style={{ width: `${n * 10}%` }} /></div>
                <b>{n}</b>
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}

export function Chart({ pts, labels }: { pts: number[]; labels: string[] }) {
  const W = 300, H = 108, px = 26, py = 14, lo = 5, hi = 10;
  const x = (i: number) => px + (W - 2 * px) * (pts.length === 1 ? 0.5 : i / (pts.length - 1));
  const y = (v: number) => H - 12 - py - (H - 12 - 2 * py) * (Math.min(hi, Math.max(lo, v)) - lo) / (hi - lo);
  const path = pts.map((v, i) => `${i ? 'L' : 'M'}${x(i)} ${y(v)}`).join(' ');
  const last = pts.length - 1;
  return (
    <svg className="chart" viewBox={`0 0 ${W + 6} ${H + 4}`} role="img" aria-label={`Evolução da nota geral: ${pts.map(fmt).join(', ')}`}>
      {[6, 8, 10].map(v => (
        <g key={v}>
          <line x1={px} x2={W} y1={y(v)} y2={y(v)} stroke="#173243" />
          <text x={0} y={y(v) + 4} fill="#5d7788" fontSize={10}>{v}</text>
        </g>
      ))}
      <path d={`${path} L${x(last)} ${y(lo)} L${x(0)} ${y(lo)}Z`} fill="rgba(0,222,99,.1)" />
      <path d={path} fill="none" stroke="#00de63" strokeWidth={2.5} strokeLinejoin="round" />
      {pts.map((v, i) => (
        <circle key={i} cx={x(i)} cy={y(v)} r={i === last ? 5 : 3.5} fill={i === last ? '#00de63' : '#050e16'} stroke="#00de63" strokeWidth={2} />
      ))}
      {labels.map((l, i) => <text key={i} x={x(i)} y={H} fill="#8ea6b5" fontSize={10} textAnchor="middle">{l}</text>)}
    </svg>
  );
}

export function AthRow({ a, extra, onClick, h }: { a: Atleta; extra?: ReactNode; onClick: () => void; h?: string }) {
  const o = ov(a);
  return (
    <B className="ath" onClick={onClick} h={h}>
      <Av nome={a.nome} />
      <span className="mid">
        <b>{a.nome} <VTag a={a} /></b>
        <small>{a.pos} · {a.idade} anos</small>
        <small>{a.clube} · {a.cidade}/{a.uf}</small>
        <span className="tags"><span className="tag">{a.pe}</span><span className="tag">{metros(a.alt)} m</span>{extra}</span>
      </span>
      {o != null ? <span className="score">{fmt(o)}</span> : <span className="tag a">Sem nota</span>}
    </B>
  );
}

export function Up({ ok, title, okTitle, sub, onClick }: { ok: boolean; title: string; okTitle: string; sub: string; onClick: () => void }) {
  return (
    <button type="button" className={cx('up', ok && 'ok')} onClick={onClick}>
      <span className="ico"><Ic n={ok ? 'check' : 'upload'} /></span>
      <span><b>{ok ? okTitle : title}</b><small>{ok ? 'Anexado' : sub}</small></span>
    </button>
  );
}

export const Thumb = ({ t, dur, onClick, pendente }: { t: string; dur: string; onClick?: () => void; pendente?: boolean }) => (
  <button type="button" className="thumb" onClick={onClick}>
    <span className="pic" style={pendente ? { opacity: 0.6 } : undefined}><i><Ic n={pendente ? 'clock' : 'play'} s={16} /></i><em>{dur}</em></span>
    <p>{t}</p>
  </button>
);
