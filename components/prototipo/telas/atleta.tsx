'use client';
import { POSICOES, PES, ageOf, isMenor, metros, primeiro } from '@/lib/prototipo/dados';
import { back, go, type State } from '@/lib/prototipo/estado';
import { escolherPerfil, reiniciar, sheet, toast } from '@/lib/prototipo/acoes';
import { Av, B, Body, Fld, Hdr, Ic, Inp, Sel, Steps, Thumb, Top, Up, cx, useP } from '../ui';
import { Historico, MinorInfo } from './scout';

/* ----- Entrada ----- */
export function Welcome() {
  const { set } = useP();
  return (
    <div className="welcome">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img className="logo-lg" src="/marca/book-soccer-logo.svg" alt="Book Soccer" />
      <p className="lead">Descubra, avalie e acompanhe talentos do futebol.</p>
      <div className="acts">
        <B className="btn" h="comecar" onClick={() => set(d => go(d, 'escolha'))}>Começar</B>
        <button type="button" className="btn ghost" onClick={() => set(d => go(d, 'escolha'))}>Já tenho conta</button>
      </div>
    </div>
  );
}

export function Escolha() {
  const { set } = useP();
  const roles = [
    ['scout', 'search', 'Scout', 'Cadastre, avalie e compare atletas'],
    ['agente', 'brief', 'Agente', 'Gerencie sua carteira e apresente atletas'],
    ['atleta', 'ball', 'Atleta', 'Crie seu perfil e seja visto por quem importa'],
  ] as const;
  return (
    <>
      <Hdr t="Seu perfil" />
      <Body><div className="stack">
        <h1 className="big-title">Como você vai usar o Book Soccer?</h1>
        <div className="roles">
          {roles.map(([r, ic, t, sub]) => (
            <B key={r} className="role" h={`role:${r}`} onClick={() => set(d => escolherPerfil(d, r))}>
              <span className="ico"><Ic n={ic} s={24} /></span><span><b>{t}</b><small>{sub}</small></span><Ic n="chev" />
            </B>
          ))}
        </div>
      </div></Body>
    </>
  );
}

export function Pro1() {
  const { s, set } = useP();
  const p = s.pro, sc = p.tipo === 'scout';
  const up = (fn: (x: State['pro']) => void) => set(d => fn(d.pro));
  return (
    <>
      <Hdr t="Criar conta" /><Steps n={1} t={2} />
      <Body act><div className="stack">
        <div><h1 className="big-title flush">Verificação profissional</h1><p className="muted">Para proteger atletas menores, a equipe Book Soccer confere quem é você antes de liberar esses perfis.</p></div>
        <Fld label="Nome completo"><Inp value={p.nome} on={v => up(x => { x.nome = v; })} /></Fld>
        <Fld label={sc ? 'Clube' : 'Agência'}><Inp value={p.org} on={v => up(x => { x.org = v; })} /></Fld>
        <Fld label={sc ? 'Cargo' : 'Registro de intermediário'}><Inp value={p.cargo} on={v => up(x => { x.cargo = v; })} /></Fld>
        <Up ok={p.docId} title="Documento de identidade" okTitle="documento-identidade.jpg" sub="RG ou CNH. Toque para anexar (simulado)" onClick={() => up(x => { x.docId = !x.docId; })} />
        <Up ok={p.docV} title={sc ? 'Comprovante de vínculo com o clube' : 'Registro de intermediário'} okTitle={sc ? 'carta-do-clube.pdf' : 'registro-intermediario.pdf'}
          sub={sc ? 'Carta ou crachá do clube. Toque para anexar (simulado)' : 'Registro ou contrato da agência. Toque para anexar (simulado)'} onClick={() => up(x => { x.docV = !x.docV; })} />
      </div></Body>
      <div className="actionbar"><button type="button" className="btn" disabled={!(p.docId && p.docV)} onClick={() => set(d => go(d, 'pro-2'))}>Enviar para verificação</button></div>
    </>
  );
}

export function Pro2() {
  const { s, set } = useP();
  const sc = s.pro.tipo === 'scout';
  return (
    <>
      <Hdr t="Verificação" /><Steps n={2} t={2} />
      <Body act><div className="stack">
        <div><h1 className="big-title flush">Em análise</h1><p className="muted">A equipe Book Soccer confere sua identidade e {sc ? 'o vínculo com o clube' : 'o registro de agente'}.</p></div>
        <ul className="tl card">
          <li className="done"><span className="dot"><Ic n="check" s={14} /></span><div><b>Dados enviados</b><small>{s.pro.nome} · {s.pro.org}</small></div></li>
          <li className="done"><span className="dot"><Ic n="check" s={14} /></span><div><b>Documentos recebidos</b><small>Identidade e {sc ? 'vínculo' : 'registro'}</small></div></li>
          <li className="now"><span className="dot"><Ic n="clock" s={14} /></span><div><b>Análise da equipe Book Soccer</b><small>Em andamento</small></div></li>
          <li><span className="dot"><Ic n="shieldok" s={14} /></span><div><b>Conta verificada</b><small>Perfis de menores liberados</small></div></li>
        </ul>
        <div className="info"><Ic n="eye" s={20} /><span>Enquanto isso, você já pode usar o app. Só os perfis de menores de 18 anos ficam ocultos.</span></div>
      </div></Body>
      <div className="actionbar"><button type="button" className="btn" onClick={() => set(d => go(d, sc ? 'scout-home' : 'ag-home', { reset: true }))}>Entrar no app</button></div>
    </>
  );
}

/* ----- Cadastro do atleta ----- */
export function At1() {
  const { s, set } = useP();
  const a = s.at, up = (fn: (x: State['at']) => void) => set(d => fn(d.at));
  return (
    <>
      <Hdr t="Criar perfil" /><Steps n={1} t={4} />
      <Body act><div className="stack">
        <div><h1 className="big-title flush">Seus dados</h1><p className="muted">Passo 1 de 4</p></div>
        <Fld label="Nome completo"><Inp value={a.nome} on={v => up(x => { x.nome = v; })} /></Fld>
        <div className="row2">
          <Fld label="Nascimento"><Inp type="date" value={a.nasc} on={v => up(x => { x.nasc = v; })} /></Fld>
          <Fld label="Altura (cm)"><Inp type="number" value={a.alt} on={v => up(x => { x.alt = +v; })} /></Fld>
        </div>
        <div className="row2">
          <Fld label="Posição"><Sel value={a.pos} on={v => up(x => { x.pos = v; })} opts={POSICOES} /></Fld>
          <Fld label="Pé dominante"><Sel value={a.pe} on={v => up(x => { x.pe = v; })} opts={PES} /></Fld>
        </div>
        <Fld label="Cidade"><Inp value={a.cidade} on={v => up(x => { x.cidade = v; })} /></Fld>
        {isMenor(a.nasc) && <MinorInfo who="Você" />}
      </div></Body>
      <div className="actionbar"><B className="btn" h="at-next1" onClick={() => set(d => go(d, isMenor(d.at.nasc) ? 'at-2' : 'at-3'))}>Continuar</B></div>
    </>
  );
}

export function At2() {
  const { s, set } = useP();
  const a = s.at, up = (fn: (x: State['at']) => void) => set(d => fn(d.at));
  return (
    <>
      <Hdr t="Responsável" /><Steps n={2} t={4} />
      <Body act><div className="stack">
        <div><h1 className="big-title flush">Dados do responsável</h1><p className="muted">Passo 2 de 4</p></div>
        <Fld label="Nome completo"><Inp value={a.resp} on={v => up(x => { x.resp = v; })} /></Fld>
        <div className="row2">
          <Fld label="Parentesco"><Sel value={a.parent} on={v => up(x => { x.parent = v; })} opts={['Mãe', 'Pai', 'Avó ou avô', 'Tutor legal']} /></Fld>
          <Fld label="Telefone"><Inp type="tel" value={a.tel} on={v => up(x => { x.tel = v; })} /></Fld>
        </div>
        <Fld label="CPF"><Inp value={a.cpf} on={v => up(x => { x.cpf = v; })} /></Fld>
        <div className="info"><Ic n="shield" s={20} /><span>O responsável recebe os pedidos de contato e decide quem fala com você.</span></div>
      </div></Body>
      <div className="actionbar"><B className="btn" h="at-next2" onClick={() => set(d => go(d, 'at-3'))}>Continuar</B></div>
    </>
  );
}

export function At3() {
  const { s, set } = useP();
  const a = s.at, m = isMenor(a.nasc), ok = a.docId && (!m || a.docAut);
  return (
    <>
      <Hdr t="Documentos" /><Steps n={m ? 3 : 2} t={m ? 4 : 3} />
      <Body act><div className="stack">
        <div><h1 className="big-title flush">Documentos</h1><p className="muted">Passo {m ? 3 : 2} de {m ? 4 : 3}</p></div>
        <Up ok={a.docId} title="Documento do atleta" okTitle="documento-atleta.jpg" sub="RG ou certidão de nascimento. Toque para anexar (simulado)" onClick={() => set(d => { d.at.docId = !d.at.docId; })} />
        {m && <Up ok={a.docAut} title="Autorização do responsável" okTitle="autorizacao-assinada.pdf" sub="Documento assinado. Toque para anexar (simulado)" onClick={() => set(d => { d.at.docAut = !d.at.docAut; })} />}
        {m && <button type="button" className="link" style={{ textAlign: 'left' }} onClick={() => set(d => toast(d, 'Modelo de autorização (demonstração)'))}>Baixar modelo de autorização</button>}
      </div></Body>
      <div className="actionbar"><B className="btn" h="at-enviar" disabled={!ok} onClick={() => set(d => go(d, 'at-4'))}>Enviar para análise</B></div>
    </>
  );
}

export function At4() {
  const { s, set } = useP();
  const m = isMenor(s.at.nasc);
  return (
    <>
      <Hdr t="Verificação" /><Steps n={m ? 4 : 3} t={m ? 4 : 3} />
      <Body act><div className="stack">
        <div><h1 className="big-title flush">Em análise</h1><p className="muted">A equipe do Book Soccer confere identidade, idade{m ? ' e a autorização do responsável. Prazo de até 2 dias úteis' : ''}.</p></div>
        <ul className="tl card">
          <li className="done"><span className="dot"><Ic n="check" s={14} /></span><div><b>Dados enviados</b><small>{s.at.nome}</small></div></li>
          <li className="done"><span className="dot"><Ic n="check" s={14} /></span><div><b>Documentos recebidos</b><small>{m ? 'Atleta e responsável' : 'Documento do atleta'}</small></div></li>
          <li className="now"><span className="dot"><Ic n="clock" s={14} /></span><div><b>Análise da equipe Book Soccer</b><small>Em andamento</small></div></li>
          <li><span className="dot"><Ic n="shieldok" s={14} /></span><div><b>Perfil verificado</b><small>Você aparece na busca</small></div></li>
        </ul>
        <div className="info warn"><Ic n="eye" s={20} /><span>Enquanto estiver em análise, seu perfil não aparece para scouts e agentes.</span></div>
      </div></Body>
      <div className="actionbar"><B className="btn ghost" h="at-aprovar" onClick={() => set(d => { d.verif = true; go(d, 'at-ok', { reset: true }); })}>Simular aprovação da equipe</B></div>
    </>
  );
}

export function AtOk() {
  const { set } = useP();
  return (
    <Body><div className="big-ok" style={{ paddingTop: 90 }}>
      <div className="seal"><Ic n="shieldok" s={54} /></div>
      <h2>Perfil verificado</h2>
      <p>Agora scouts e agentes podem encontrar você. Pedidos de contato chegam primeiro ao seu responsável.</p>
      <div style={{ width: '100%', marginTop: 14 }}><B className="btn" h="at-perfil" onClick={() => set(d => go(d, 'at-perfil', { reset: true }))}>Ver meu perfil</B></div>
    </div></Body>
  );
}

/* ----- Área do atleta ----- */
export function AtPerfil() {
  const { s, set } = useP();
  const a = s.at, m = isMenor(a.nasc), pct = 60 + (a.video ? 20 : 0) + (a.hist.length ? 20 : 0);
  return (
    <>
      <Top t="Meu perfil" eb={s.verif ? 'Verificado' : 'Em análise'} right={
        <span className={cx('tag', s.verif ? 'g' : 'a')}><Ic n={s.verif ? 'shieldok' : 'clock'} s={13} /> {s.verif ? 'Visível na busca' : 'Em análise'}</span>} />
      <Body><div className="stack">
        <div className="hero"><Av nome={a.nome} s={68} /><div><h2>{a.nome}</h2><p className="muted">{a.pos} · {ageOf(a.nasc)} anos</p><p className="muted">{a.cidade}</p></div></div>
        <div className="facts">
          <div><b>{ageOf(a.nasc)}</b><span>anos</span></div><div><b>{metros(a.alt)}</b><span>metros</span></div>
          <div><b>{a.pe}</b><span>pé</span></div><div><b>Sub-17</b><span>categoria</span></div>
        </div>
        {!s.verif && <button type="button" className="info warn" style={{ textAlign: 'left' }} onClick={() => set(d => go(d, 'at-4'))}><Ic n="clock" s={20} /><span>Seu perfil está em análise. Toque para ver o andamento.</span></button>}
        {m && <div className="card row-ic"><Ic n="shield" /><div><b>Responsável: {a.resp}</b><p className="muted">{a.parent} · autorização {s.verif ? 'confirmada' : 'em análise'}</p></div></div>}
        <button type="button" className="btn sm ghost" onClick={() => set(d => go(d, 'at-editar'))}><Ic n="edit" s={16} /> Editar perfil</button>
        {pct < 100 ? (
          <div className="card grid10">
            <div className="sect" style={{ margin: 0 }}><h3>Complete seu perfil</h3><span className="link">{pct}%</span></div>
            <div className="track"><div className="fill" style={{ width: `${pct}%` }} /></div>
            <button type="button" className={cx('note', a.video && 'done')} onClick={() => set(d => go(d, 'at-videos', { reset: true }))}><Ic n={a.video ? 'check' : 'video'} s={16} /> Envie um vídeo de jogo ou treino</button>
            <button type="button" className={cx('note', a.hist.length > 0 && 'done')} onClick={() => set(d => go(d, 'at-editar'))}><Ic n={a.hist.length ? 'check' : 'clock'} s={16} /> Adicione seu histórico de clubes</button>
          </div>
        ) : <div className="info"><Ic n="check" s={20} /><span>Perfil completo. Perfis completos aparecem primeiro na busca.</span></div>}
        {a.hist.length > 0 && <div className="card"><div className="sect" style={{ margin: '0 0 12px' }}><h3>Histórico</h3></div><Historico h={a.hist} /></div>}
        <div className="card empty" style={{ padding: 22 }}><Ic n="file" s={28} /><span>Você ainda não tem avaliações. Elas aparecem aqui depois que um scout observar você.</span></div>
      </div></Body>
    </>
  );
}

export function AtEditar() {
  const { s, set } = useP();
  const a = s.at, up = (fn: (x: State['at']) => void) => set(d => fn(d.at));
  return (
    <>
      <Hdr t="Editar perfil" />
      <Body act><div className="stack">
        <Fld label="Nome completo"><Inp value={a.nome} on={v => up(x => { x.nome = v; })} /></Fld>
        <div className="row2">
          <Fld label="Posição"><Sel value={a.pos} on={v => up(x => { x.pos = v; })} opts={POSICOES} /></Fld>
          <Fld label="Pé dominante"><Sel value={a.pe} on={v => up(x => { x.pe = v; })} opts={PES} /></Fld>
        </div>
        <div className="row2">
          <Fld label="Altura (cm)"><Inp type="number" value={a.alt} on={v => up(x => { x.alt = +v; })} /></Fld>
          <Fld label="Cidade"><Inp value={a.cidade} on={v => up(x => { x.cidade = v; })} /></Fld>
        </div>
        <div className="sect"><h3>Histórico de clubes</h3></div>
        {a.hist.length ? <div className="card"><Historico h={a.hist} /></div> : <p className="muted">Nenhum clube adicionado.</p>}
        <button type="button" className="btn sm ghost" onClick={() => set(d => sheet(d, 'hist'))}><Ic n="plus" s={16} /> Adicionar clube</button>
      </div></Body>
      <div className="actionbar"><button type="button" className="btn" onClick={() => set(d => { back(d); toast(d, 'Perfil atualizado'); })}>Salvar alterações</button></div>
    </>
  );
}

const MEUS_VIDEOS: [string, string][] = [['Gol de falta', '0:42'], ['Dribles e arrancadas', '2:15'], ['Passes decisivos', '1:10'], ['Treino de finalização', '3:05']];

export function AtVideos() {
  const { s, set } = useP();
  const enviar = () => set(d => { d.at.video = true; toast(d, 'Vídeo enviado e em análise'); });
  return (
    <>
      <Top t="Vídeos" eb="Seus lances" right={<button type="button" className="icon-btn" aria-label="Enviar vídeo" onClick={enviar}><Ic n="upload" /></button>} />
      <Body><div className="stack">
        <div className="vid">
          {s.at.video && <Thumb t="Novo vídeo · em análise" dur="1:05" pendente />}
          {MEUS_VIDEOS.map(v => <Thumb key={v[0]} t={v[0]} dur={v[1]} onClick={() => set(d => toast(d, 'Reproduzindo vídeo (demonstração)'))} />)}
        </div>
        <button type="button" className="btn sm ghost" onClick={enviar}><Ic n="upload" s={16} /> Enviar vídeo</button>
      </div></Body>
    </>
  );
}

export function AtQuem() {
  const { s, set } = useP();
  const m = isMenor(s.at.nasc);
  return (
    <>
      <Top t="Quem viu" eb="Esta semana" />
      <Body><div className="stack">
        <div className="stats"><div className="stat"><b>12</b><span>Visualizações</span></div><div className="stat"><b>3</b><span>Scouts</span></div><div className="stat"><b>1</b><span>Pedido de contato</span></div></div>
        <div className="card grid8">
          <p className="eyebrow">Pedido de contato</p>
          <div className="hero"><Av nome="Marcos Tavares" /><div style={{ flex: 1 }}><b>Marcos Tavares</b><p className="muted">EC Aurora</p></div><span className={cx('tag', m ? 'a' : 'g')}>{m ? 'Com o responsável' : 'Novo'}</span></div>
          {m
            ? <p className="note"><Ic n="shield" s={16} /> {primeiro(s.at.resp)} ({s.at.parent.toLowerCase()}) decide se o contato é liberado.</p>
            : <div className="row2">
              <button type="button" className="btn sm ghost" onClick={() => set(d => toast(d, 'Pedido recusado'))}>Recusar</button>
              <button type="button" className="btn sm" onClick={() => set(d => toast(d, 'Contato liberado para Marcos Tavares'))}>Aceitar</button>
            </div>}
        </div>
        <div className="sect"><h3>Visualizações</h3></div>
        <div>
          {[['Helena Duarte', 'Real Várzea FC', 'há 2 h'], ['Marcos Tavares', 'EC Aurora', 'ontem'], ['JP Sports', 'Agência', 'há 3 dias']].map(v => (
            <div className="ath" key={v[0]}><Av nome={v[0]} s={40} /><span className="mid"><b>{v[0]}</b><small>{v[1]}</small></span><small className="muted">{v[2]}</small></div>
          ))}
        </div>
      </div></Body>
    </>
  );
}

export function Conta() {
  const { s, set } = useP();
  const r = s.role ?? 'scout';
  const who = r === 'scout' ? ['Marcos Tavares', 'Captação · EC Aurora'] : r === 'agente' ? ['Juliana Prado', 'Agente · JP Sports'] : [s.at.nome, 'Atleta'];
  const sw = (k: 'notif' | 'vis', label: string) => (
    <div className="setrow"><span>{label}</span>
      <button type="button" className="sw" role="switch" aria-checked={s[k]} aria-label={label} onClick={() => set(d => { d[k] = !d[k]; })}><i /></button>
    </div>
  );
  return (
    <>
      <Top t={r === 'atleta' ? 'Conta' : 'Perfil'} eb="Configurações" />
      <Body><div className="stack">
        <div className="hero"><Av nome={who[0]} s={64} /><div><h2>{who[0]}</h2><p className="muted">{who[1]}</p></div></div>
        <div>
          {r === 'atleta' && <button type="button" className="setrow" onClick={() => set(d => go(d, 'at-editar'))}><span>Editar perfil</span><Ic n="chev" s={18} /></button>}
          {sw('notif', 'Notificações')}
          {sw('vis', r === 'atleta' ? 'Perfil visível na busca' : 'Mostrar meu nome a atletas')}
          <button type="button" className="setrow" onClick={() => set(d => go(d, 'escolha'))}><span>Trocar perfil</span><Ic n="chev" s={18} /></button>
          <button type="button" className="setrow" onClick={() => set(d => { reiniciar(d); })}><span>Sair</span><Ic n="chev" s={18} /></button>
        </div>
      </div></Body>
    </>
  );
}
