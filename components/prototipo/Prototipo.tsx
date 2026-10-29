'use client';
// Protótipo navegável: o celular com as telas do app e o painel de apresentação ao lado.
import { useCallback, useEffect, useMemo, useState, type ComponentType } from 'react';
import { FLOWS, TABS, activeTab, flowDone, go, hintNow, initState, type Role, type State } from '@/lib/prototipo/estado';
import { iniciarFluxo, reiniciar, verComo, verScoutNotif } from '@/lib/prototipo/acoes';
import { B, Ic, ProtoCtx, cx, type Api } from './ui';
import { Folha } from './Folhas';
import * as Sc from './telas/scout';
import * as Ag from './telas/agente';
import * as At from './telas/atleta';

const TELAS: Record<string, ComponentType> = {
  welcome: At.Welcome, escolha: At.Escolha, 'pro-1': At.Pro1, 'pro-2': At.Pro2,
  'scout-home': Sc.ScoutHome, notifs: Sc.Notifs, buscar: Sc.Buscar, filtros: Sc.Filtros, perfil: Sc.Perfil,
  cadastrar: Sc.Cadastrar, novo: Sc.Novo, 'novo-ok': Sc.NovoOk, 'aval-1': Sc.Aval1, 'aval-2': Sc.Aval2, 'aval-3': Sc.Aval3,
  rel: Sc.Rel, listas: Sc.Listas, 'lista-det': Sc.ListaDet, compare: Sc.Compare,
  'ag-home': Ag.AgHome, carteira: Ag.Carteira, pedidos: Ag.Pedidos, 'pedido-det': Ag.PedidoDet, compartilhar: Ag.Compartilhar,
  'at-1': At.At1, 'at-2': At.At2, 'at-3': At.At3, 'at-4': At.At4, 'at-ok': At.AtOk, 'at-perfil': At.AtPerfil,
  'at-editar': At.AtEditar, 'at-videos': At.AtVideos, 'at-quem': At.AtQuem, conta: At.Conta,
};
const COM_ACOES = new Set(['filtros', 'perfil', 'novo', 'aval-1', 'aval-2', 'aval-3', 'rel', 'lista-det', 'pedido-det', 'compartilhar', 'pro-1', 'pro-2', 'at-1', 'at-2', 'at-3', 'at-4', 'at-editar']);

function StatusBar() {
  return (
    <div className="status">
      <span>9:41</span>
      <span>
        <svg width="18" height="12" viewBox="0 0 18 12" fill="#fff" aria-hidden="true"><rect x="0" y="8" width="3" height="4" rx="1" /><rect x="5" y="5" width="3" height="7" rx="1" /><rect x="10" y="2" width="3" height="10" rx="1" /><rect x="15" y="0" width="3" height="12" rx="1" opacity=".35" /></svg>
        <svg width="26" height="12" viewBox="0 0 26 12" fill="none" aria-hidden="true"><rect x=".5" y=".5" width="21" height="11" rx="3.5" stroke="#fff" opacity=".5" /><rect x="2" y="2" width="15" height="8" rx="2" fill="#fff" /><rect x="23" y="4" width="2" height="4" rx="1" fill="#fff" opacity=".5" /></svg>
      </span>
    </div>
  );
}

function TabBar({ s, set }: Pick<Api, 's' | 'set'>) {
  const act = activeTab(s);
  if (act == null) return null;
  return (
    <nav className="tabbar" aria-label="Navegação">
      {TABS[s.role ?? 'scout'].map(([id, label, icon]) => (
        <B key={id} h={`tab:${id}`} className={cx('tab', id === act && 'on', icon === 'plus' && 'plus')} aria-label={label}
          onClick={() => set(d => go(d, id, { reset: true }))}>
          <Ic n={icon} s={icon === 'plus' ? 44 : 22} /><span>{label}</span>
        </B>
      ))}
    </nav>
  );
}

function Toast({ s, set }: Pick<Api, 's' | 'set'>) {
  const id = s.toast?.id;
  useEffect(() => {
    if (id == null) return;
    const t = setTimeout(() => set(d => { if (d.toast?.id === id) d.toast = null; }), 2400);
    return () => clearTimeout(t);
  }, [id, set]);
  return (
    <div className={cx('toast', s.toast && 'on')} role="status">
      {s.toast && <><Ic n="check" s={18} /><span>{s.toast.msg}</span></>}
    </div>
  );
}

function Painel({ s, set }: Pick<Api, 's' | 'set'>) {
  const F = s.flow, done = flowDone(s);
  const pessoas: [Role, string][] = [['scout', 'Scout'], ['agente', 'Agente'], ['atleta', 'Atleta']];
  return (
    <aside className="panel">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="brand" src="/marca/book-soccer-logo.svg" alt="Book Soccer" />
      <div>
        <h1>Navegue pelo app</h1>
        <p className="lead">Use o celular ao lado como se fosse o aplicativo real. Todos os dados são fictícios.</p>
      </div>
      <div>
        <h2>Ver como</h2>
        <div className="seg">{pessoas.map(([r, l]) => <button type="button" key={r} className="pill" onClick={() => set(d => verComo(d, r))}>{l}</button>)}</div>
      </div>
      <div>
        <h2>Fluxos para apresentar</h2>
        <p className="guide">Clique em <b>Iniciar</b> em um dos fluxos para testar o app. No celular, o próximo botão a tocar pisca em verde, e aqui ao lado você acompanha os passos até o fim.</p>
        <ol className="flows">
          {Object.entries(FLOWS).map(([k, f]) => {
            const n = Number(k), on = F?.n === n, fim = on && done;
            return (
              <li key={k} className={cx('flow', on && 'on')}>
                <span className="n">{n}</span>
                <b>{f.t}</b>
                {fim ? <span className="tag g">Concluído</span>
                  : <button type="button" className="go" onClick={() => set(d => iniciarFluxo(d, n))}>{on ? 'Recomeçar' : 'Iniciar'}</button>}
                {on ? (
                  <ol className="fsteps">
                    {f.steps.map((st, j) => <li key={j} className={j < F!.i || fim ? 'done' : j === F!.i ? 'now' : ''}>{st[2]}</li>)}
                  </ol>
                ) : <small>{f.r}</small>}
                {n === 4 && on && F!.i >= 5 && !fim && (
                  <button type="button" className="pill end" onClick={() => set(verScoutNotif)}>Ver como o scout recebe</button>
                )}
              </li>
            );
          })}
        </ol>
      </div>
      <div className="seg"><button type="button" className="pill" onClick={() => set(reiniciar)}>Reiniciar demonstração</button></div>
      <div className="pending">
        <b>Em definição</b>
        <span>A verificação dos cadastros é essencial: o Book Soccer é uma rede de contatos que pode envolver atletas menores de idade. A forma de análise (quem analisa, como confere os documentos e com quais ferramentas) ainda será discutida de acordo com as regras de negócio. No protótipo, a aprovação é simulada, e o prazo de até 2 dias úteis vale só para atletas menores de idade.</span>
      </div>
      <p className="foot">Versão de apresentação. Sem dados reais.</p>
    </aside>
  );
}

export default function Prototipo() {
  const [s, setS] = useState<State>(initState);
  const set = useCallback((fn: (d: State) => void) => {
    setS(prev => { const d = structuredClone(prev); fn(d); return d; });
  }, []);
  const api = useMemo<Api>(() => ({ s, set, hint: hintNow(s) }), [s, set]);
  const Tela = TELAS[s.cur] ?? At.Welcome;
  const tabs = activeTab(s) != null;
  return (
    <ProtoCtx.Provider value={api}>
      <main className="stage">
        <div className="phone-wrap">
          <div className={cx('phone', tabs && 'tabs', COM_ACOES.has(s.cur) && 'has-act')}>
            <StatusBar />
            <div className="screens">
              <section className="screen on" key={s.cur}><Tela /></section>
            </div>
            <TabBar s={s} set={set} />
            <Toast s={s} set={set} />
            <Folha />
          </div>
        </div>
        <Painel s={s} set={set} />
      </main>
    </ProtoCtx.Provider>
  );
}
