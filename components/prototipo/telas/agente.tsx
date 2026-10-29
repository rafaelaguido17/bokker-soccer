'use client';
import { CARTEIRA, DESTINOS, fmt, ov, primeiro } from '@/lib/prototipo/dados';
import { go } from '@/lib/prototipo/estado';
import { abrirPerfil, enviarVitrine, getA, responderPedido } from '@/lib/prototipo/acoes';
import { Av, B, Body, Hdr, Ic, Top, VTag, cx, useP } from '../ui';
import { ProBanner } from './scout';

const statusTag = (st: string) => (st === 'novo' ? 'Novo' : st === 'aceito' ? 'Aceito' : 'Recusado');
const VISTAS: Record<string, number> = { davi: 12, lucas: 8, enzo: 4 };

export function AgHome() {
  const { s, set } = useP();
  const nov = s.pedidos.filter(p => p.status === 'novo').length;
  return (
    <>
      <Top t="Sua carteira" eb="Olá, Juliana" right={<Av nome="Juliana Prado" s={42} />} />
      <Body><div className="stack">
        <ProBanner />
        <div className="stats">
          <div className="stat"><b>3</b><span>Atletas na carteira</span></div>
          <div className="stat"><b>{nov}</b><span>Pedidos novos</span></div>
          <div className="stat"><b>24</b><span>Visualizações na semana</span></div>
        </div>
        <div className="sect"><h3>Pedidos de contato</h3><button type="button" className="link" onClick={() => set(d => go(d, 'pedidos', { reset: true }))}>Ver todos</button></div>
        <div>
          {s.pedidos.slice(0, 2).map(p => (
            <button type="button" key={p.id} className="ath" onClick={() => set(d => { d.pedidoId = p.id; go(d, 'pedido-det'); })}>
              <span className="mid"><b>{p.de}</b><small>{p.clube} quer falar sobre {primeiro(getA(s, p.ath).nome)}</small></span>
              <span className={cx('tag', p.status === 'novo' && 'g')}>{statusTag(p.status)}</span>
            </button>
          ))}
        </div>
        <div className="sect"><h3>Seus atletas</h3><button type="button" className="link" onClick={() => set(d => go(d, 'carteira', { reset: true }))}>Carteira</button></div>
        <div className="chips" style={{ flexWrap: 'nowrap', overflowX: 'auto', gap: 14 }}>
          {CARTEIRA.map(id => {
            const a = getA(s, id);
            return <button type="button" key={id} className="mini" onClick={() => set(d => abrirPerfil(d, id))}><Av nome={a.nome} s={58} /><small>{primeiro(a.nome)}</small></button>;
          })}
        </div>
        <button type="button" className="btn" onClick={() => set(d => { d.share = { ath: 'davi', to: [] }; go(d, 'compartilhar'); })}><Ic n="send" s={18} /> Compartilhar vitrine</button>
      </div></Body>
    </>
  );
}

export function Carteira() {
  const { s, set } = useP();
  return (
    <>
      <Top t="Carteira" eb="Atletas representados" right={<button type="button" className="icon-btn" aria-label="Adicionar atleta" onClick={() => set(d => go(d, 'novo'))}><Ic n="plus" /></button>} />
      <Body><div className="stack">
        {CARTEIRA.map(id => {
          const a = getA(s, id);
          return (
            <div key={id} className="card" style={{ padding: 12, display: 'grid', gap: 10 }}>
              <button type="button" className="ath bare" onClick={() => set(d => abrirPerfil(d, id))}>
                <Av nome={a.nome} s={46} />
                <span className="mid"><b>{a.nome} <VTag a={a} /></b><small>{a.pos} · {a.idade} anos</small><small><Ic n="eye" s={13} /> visualizações: {VISTAS[id]} esta semana</small></span>
                <span className="score">{fmt(ov(a))}</span>
              </button>
              <button type="button" className="btn sm ghost" onClick={() => set(d => { d.share = { ath: id, to: [] }; go(d, 'compartilhar'); })}><Ic n="send" s={16} /> Compartilhar perfil</button>
            </div>
          );
        })}
      </div></Body>
    </>
  );
}

export function Pedidos() {
  const { s, set } = useP();
  return (
    <>
      <Top t="Pedidos" eb="Contato recebido" />
      <Body><div className="stack">
        {s.pedidos.map(p => (
          <B key={p.id} className="ath" h={`pedido:${p.id}`} onClick={() => set(d => { d.pedidoId = p.id; go(d, 'pedido-det'); })}>
            <Av nome={p.de} />
            <span className="mid"><b>{p.de}</b><small>{p.clube} · {p.quando}</small><small>Sobre {getA(s, p.ath).nome}</small></span>
            <span className={cx('tag', p.status === 'novo' ? 'g' : p.status === 'recusado' && 'r')}>{statusTag(p.status)}</span>
          </B>
        ))}
      </div></Body>
    </>
  );
}

export function PedidoDet() {
  const { s, set } = useP();
  const p = s.pedidos.find(x => x.id === s.pedidoId)!, a = getA(s, p.ath);
  return (
    <>
      <Hdr t="Pedido de contato" />
      <Body act><div className="stack">
        <div className="hero"><Av nome={p.de} s={56} /><div><h2 className="h20">{p.de}</h2><p className="muted">{p.clube} · {p.quando}</p></div></div>
        <div className="card grid8"><p className="eyebrow">Sobre o atleta</p>
          <button type="button" className="ath bare" onClick={() => set(d => abrirPerfil(d, a.id))}>
            <Av nome={a.nome} /><span className="mid"><b>{a.nome}</b><small>{a.pos} · {a.idade} anos</small></span><span className="score">{fmt(ov(a))}</span>
          </button>
        </div>
        <div><span className="l">Mensagem</span><div className="quote">{p.msg}</div></div>
        {p.status === 'novo'
          ? <div className="info"><Ic n="shield" s={20} /><span>Ao aceitar, {primeiro(p.de)} recebe o contato da sua agência. Os dados do responsável continuam protegidos.</span></div>
          : <div className={cx('info', p.status !== 'aceito' && 'warn')}><Ic n={p.status === 'aceito' ? 'check' : 'x'} s={20} /><span>{p.status === 'aceito' ? 'Pedido aceito. Você já pode compartilhar o perfil completo.' : 'Pedido recusado. O scout foi avisado.'}</span></div>}
      </div></Body>
      <div className="actionbar">
        {p.status === 'novo' ? (
          <>
            <button type="button" className="btn ghost" onClick={() => set(d => responderPedido(d, 'recusado'))}>Recusar</button>
            <B className="btn" h="aceitar" onClick={() => set(d => responderPedido(d, 'aceito'))}>Aceitar</B>
          </>
        ) : p.status === 'aceito' ? (
          <B className="btn" h="compartilhar" onClick={() => set(d => { d.share = { ath: a.id, to: [] }; go(d, 'compartilhar'); })}><Ic n="send" s={18} /> Compartilhar perfil</B>
        ) : null}
      </div>
    </>
  );
}

export function Compartilhar() {
  const { s, set } = useP();
  const a = getA(s, s.share.ath), to = s.share.to;
  return (
    <>
      <Hdr t="Compartilhar perfil" />
      <Body act><div className="stack">
        <div className="card grid10"><p className="eyebrow">Vitrine</p>
          <div className="hero"><Av nome={a.nome} s={52} /><div style={{ flex: 1 }}><b className="h17">{a.nome}</b><p className="muted">{a.pos} · {a.idade} anos · {a.cat}</p></div><span className="score">{fmt(ov(a))}</span></div>
          <div className="chips"><span className="tag g">Notas e evolução</span><span className="tag g">Vídeos</span><span className="tag g">Histórico</span></div>
          {a.idade < 18 && <p className="note"><Ic n="shield" s={16} /> Dados do responsável não são compartilhados.</p>}
        </div>
        <div><span className="l">Enviar para</span>
          <div className="stack" style={{ gap: 10 }}>
            {DESTINOS.map((d0, i) => (
              <button type="button" key={d0.n} className="ath" aria-pressed={to.includes(i)}
                onClick={() => set(d => { const k = d.share.to.indexOf(i); if (k >= 0) d.share.to.splice(k, 1); else d.share.to.push(i); })}>
                <span className="ck"><Ic n="check" s={16} /></span><Av nome={d0.n} s={40} /><span className="mid"><b>{d0.n}</b><small>{d0.c}</small></span>
              </button>
            ))}
          </div>
        </div>
      </div></Body>
      <div className="actionbar"><B className="btn" h="enviar-vitrine" disabled={!to.length} onClick={() => set(d => enviarVitrine(d))}><Ic n="send" s={18} /> Enviar vitrine{to.length ? ` (${to.length})` : ''}</B></div>
    </>
  );
}
