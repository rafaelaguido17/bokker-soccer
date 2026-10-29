'use client';
import { ATTRS, ETAPA_COR, FDEF, GROUPS, POSICOES, PES, UFS, CARTEIRA, fmt, filtrar, isMenor, metros, nFiltros, ov, primeiro, sameF, type AttrKey } from '@/lib/prototipo/dados';
import { back, go, type State } from '@/lib/prototipo/estado';
import { abrirPerfil, avaliar, getA, limited, notifs, salvarAval, salvarNovo, selComparar, sheet, toast, toggle } from '@/lib/prototipo/acoes';
import { AthRow, Av, B, Bars, Body, Chart, Chip, Fld, Hdr, Ic, Inp, Sel, Steps, Thumb, Top, Up, VTag, cx, useP } from '../ui';

/* Aviso para scout ou agente recém-cadastrado, enquanto a conta é verificada */
export function ProBanner() {
  const { s, set } = useP();
  if (!limited(s)) return null;
  return (
    <div className="info warn">
      <Ic n="lock" s={20} />
      <span>Conta em verificação. Perfis de menores ficam ocultos até a equipe Book Soccer aprovar.{' '}
        <button type="button" className="link" onClick={() => set(d => { d.proVerif = true; toast(d, 'Conta verificada. Perfis de menores liberados'); })}>Simular aprovação</button>
      </span>
    </div>
  );
}

export function ScoutHome() {
  const { s, set } = useP();
  const nn = notifs(s).filter(n => n.novo).length, aceito = s.pedidos[0].status === 'aceito';
  return (
    <>
      <Top t="Seu painel" eb="Olá, Marcos" right={
        <button type="button" className="icon-btn fbtn" aria-label="Notificações" onClick={() => set(d => go(d, 'notifs'))}>
          <Ic n="bell" />{nn > 0 && <span className="badge">{nn}</span>}
        </button>} />
      <Body><div className="stack">
        <ProBanner />
        {aceito && (
          <button type="button" className="card notif-ok" onClick={() => set(d => sheet(d, 'contato-liberado'))}>
            <span className="score" style={{ minWidth: 40, height: 40 }}><Ic n="check" s={20} /></span>
            <span style={{ flex: 1 }}><b>Juliana Prado aceitou seu pedido</b><small className="muted" style={{ display: 'block' }}>Contato sobre Davi Ferreira liberado</small></span>
            <Ic n="chev" s={18} />
          </button>
        )}
        <div className="card next">
          <p className="eyebrow">Próxima observação</p>
          <h3>Academia Litoral x Tupã FC</h3>
          <p className="note"><Ic n="cal" s={16} /> Sáb 31/10 · 15h · Sub-17 · Estádio Municipal</p>
          <p className="note"><Ic n="users" s={16} /> 3 atletas das suas listas devem jogar</p>
          <button type="button" className="btn sm" style={{ marginTop: 6 }} onClick={() => set(d => avaliar(d, 'davi'))}>Preparar avaliação</button>
        </div>
        <div className="stats">
          <div className="stat"><b>14</b><span>Em acompanhamento</span></div>
          <div className="stat"><b>{s.avalMes}</b><span>Avaliações no mês</span></div>
          <div className="stat"><b>{2 + (aceito ? 1 : 0)}</b><span>Contatos aceitos</span></div>
        </div>
        <div className="row2">
          <button type="button" className="card tile" onClick={() => set(d => go(d, 'buscar', { reset: true }))}><Ic n="search" s={24} /><b>Buscar atletas</b></button>
          <button type="button" className="card tile" onClick={() => set(d => go(d, 'cadastrar'))}><Ic n="plus" s={24} /><b>Cadastrar</b></button>
        </div>
        <div className="sect"><h3>Últimas avaliações</h3><button type="button" className="link" onClick={() => set(d => go(d, 'listas', { reset: true }))}>Ver listas</button></div>
        <div>
          {limited(s)
            ? <div className="card empty" style={{ padding: 22 }}><Ic n="file" s={28} /><span>Suas avaliações aparecem aqui. Comece por um atleta maior de idade enquanto sua conta é verificada.</span></div>
            : s.recentes.slice(0, 3).map(id => {
              const a = getA(s, id), l = a.obs[a.obs.length - 1];
              return (
                <button type="button" className="ath" key={id} onClick={() => set(d => abrirPerfil(d, id))}>
                  <Av nome={a.nome} s={40} />
                  <span className="mid"><b>{a.nome} <VTag a={a} /></b><small>{l.j} · {l.d}</small></span>
                  <span className="score">{fmt(l.n)}</span>
                </button>
              );
            })}
        </div>
      </div></Body>
    </>
  );
}

export function Notifs() {
  const { s, set } = useP();
  return (
    <>
      <Hdr t="Notificações" />
      <Body><div className="stack">
        {notifs(s).map((n, i) => (
          <button type="button" key={i} className="ath" style={n.novo ? { borderColor: 'var(--green)' } : undefined}
            onClick={() => n.act && set(d => sheet(d, 'contato-liberado'))}>
            <span className="icon-btn" style={{ color: 'var(--green)' }}><Ic n={n.ic} s={18} /></span>
            <span className="mid"><b className="plain">{n.t}</b><small>{n.s}</small></span>
            {n.novo && <span className="tag g">Novo</span>}
          </button>
        ))}
      </div></Body>
    </>
  );
}

function Resultados() {
  const { s, set } = useP();
  const r = filtrar(s.atletas, s.f, s.q), lim = limited(s), oc = lim ? r.filter(a => a.idade < 18).length : 0;
  if (!r.length) return (
    <div className="empty">
      <Ic n="search" s={34} /><b style={{ color: 'var(--text)' }}>Nenhum atleta encontrado</b>
      <span>Tente ampliar a faixa de idade ou remover algum filtro.</span>
      <button type="button" className="btn sm ghost" style={{ width: 'auto', padding: '0 18px' }} onClick={() => set(d => { d.f = structuredClone(FDEF); d.q = ''; })}>Limpar filtros</button>
    </div>
  );
  const primeiroId = r.find(a => !(lim && a.idade < 18))?.id;
  return (
    <>
      <p className="muted" style={{ margin: '2px 0 10px' }}>{r.length} {r.length === 1 ? 'atleta' : 'atletas'}{oc ? ` · ${oc} ocultos até a verificação` : ''}</p>
      {r.map(a => {
        if (lim && a.idade < 18) return (
          <div className="ath" key={a.id} style={{ opacity: 0.75 }}>
            <span className="av" style={{ color: 'var(--dim)' }}><Ic n="lock" s={18} /></span>
            <span className="mid"><b style={{ color: 'var(--muted)' }}>Perfil de menor de idade</b><small>{a.pos} · {a.cat}</small><small>Liberado após a verificação da sua conta</small></span>
          </div>
        );
        return <AthRow key={a.id} a={a} h={a.id === primeiroId ? 'resultado' : undefined} onClick={() => set(d => abrirPerfil(d, a.id))}
          extra={s.fav.includes(a.id) && <span className="tag g"><Ic n="heart" s={12} /> Favorito</span>} />;
      })}
    </>
  );
}

export function Buscar() {
  const { s, set } = useP();
  const nf = nFiltros(s.f), ativa = s.buscas.some(b => sameF(b.f, s.f));
  return (
    <>
      <Top t="Buscar" eb="Atletas" right={
        <B className="icon-btn fbtn" aria-label="Filtros" h="go:filtros" onClick={() => set(d => go(d, 'filtros'))}>
          <Ic n="filter" />{nf > 0 && <span className="badge">{nf}</span>}
        </B>} />
      <Body><div className="stack">
        <ProBanner />
        <div className="search"><Ic n="search" s={20} />
          <input className="in" type="search" placeholder="Nome, clube ou cidade" aria-label="Buscar atleta" value={s.q} onChange={e => { const v = e.target.value; set(d => { d.q = v; }); }} />
        </div>
        <div>
          <span className="l">Buscas salvas</span>
          <div className="chips">
            {s.buscas.map((b, i) => (
              <Chip key={i} on={sameF(b.f, s.f)} onClick={() => set(d => { d.f = sameF(b.f, d.f) ? structuredClone(FDEF) : structuredClone(b.f); })}><Ic n="search" s={14} /> {b.nome}</Chip>
            ))}
            {nf > 0 && !ativa && (
              <button type="button" className="chip chip-save" onClick={() => set(d => sheet(d, 'salvar-busca'))}><Ic n="save" s={14} /> Salvar esta busca</button>
            )}
          </div>
        </div>
        <div><Resultados /></div>
      </div></Body>
    </>
  );
}

export function Filtros() {
  const { s, set } = useP();
  const f = s.f, n = filtrar(s.atletas, f, s.q).length;
  const setF = (fn: (f: State['f']) => void) => set(d => fn(d.f));
  return (
    <>
      <Hdr t="Filtros" right={<button type="button" className="link" style={{ padding: '0 6px' }} onClick={() => set(d => { d.f = structuredClone(FDEF); d.q = ''; })}>Limpar</button>} />
      <Body act><div className="stack" style={{ gap: 20 }}>
        <div>
          <span className="l">Idade: <b style={{ color: 'var(--text)' }}>{f.imin} a {f.imax} anos</b></span>
          <input type="range" min={14} max={23} value={f.imin} aria-label="Idade mínima" onChange={e => { const v = +e.target.value; setF(x => { x.imin = v; if (x.imax < v) x.imax = v; }); }} />
          <input type="range" min={14} max={23} value={f.imax} aria-label="Idade máxima" onChange={e => { const v = +e.target.value; setF(x => { x.imax = v; if (x.imin > v) x.imin = v; }); }} />
        </div>
        <div><span className="l">Posição</span><div className="chips">{POSICOES.map(p => <Chip key={p} on={f.pos.includes(p)} onClick={() => setF(x => toggle(x.pos, p))}>{p}</Chip>)}</div></div>
        <div><span className="l">Pé dominante</span><div className="chips">{['Todos', ...PES].map(p => <Chip key={p} on={f.pe === p} onClick={() => setF(x => { x.pe = p; })}>{p}</Chip>)}</div></div>
        <div>
          <span className="l">Altura mínima: <b style={{ color: 'var(--text)' }}>{f.alt} cm</b></span>
          <input type="range" min={160} max={195} value={f.alt} aria-label="Altura mínima" onChange={e => { const v = +e.target.value; setF(x => { x.alt = v; }); }} />
        </div>
        <div>
          <span className="l">Atributo mínimo</span>
          <Sel value={f.attr} on={v => setF(x => { x.attr = v as AttrKey | ''; })} opts={[['', 'Qualquer atributo'], ...ATTRS.map(x => [x.k, x.n] as [string, string])]} />
          <div style={{ opacity: f.attr ? 1 : 0.4 }}>
            <span className="l" style={{ marginTop: 10 }}>Nota mínima: <b style={{ color: 'var(--text)' }}>{f.amin}</b></span>
            <input type="range" min={1} max={10} value={f.amin} aria-label="Nota mínima do atributo" onChange={e => { const v = +e.target.value; setF(x => { x.amin = v; }); }} />
          </div>
        </div>
        <div><span className="l">Estado</span><Sel value={f.uf} on={v => setF(x => { x.uf = v; })} opts={UFS} /></div>
      </div></Body>
      <div className="actionbar"><B className="btn" h="aplicar" onClick={() => set(d => back(d))}>Mostrar {n} {n === 1 ? 'atleta' : 'atletas'}</B></div>
    </>
  );
}

const VIDEOS: [string, string][] = [['Gol de falta vs Tupã FC', '0:42'], ['1º tempo completo', '38:10'], ['Dribles e arrancadas', '2:15'], ['Assistências', '1:30']];

export function Perfil() {
  const { s, set } = useP();
  const a = getA(s, s.perfilId), o = ov(a), t = s.perfilTab;
  const fav = s.fav.includes(a.id), sent = s.contato.includes(a.id);
  const ag = s.role === 'agente', mine = ag && CARTEIRA.includes(a.id);
  const favBtn = (
    <button type="button" className={cx('icon-btn', fav && 'on')} aria-label="Favoritar" aria-pressed={fav}
      onClick={() => set(d => { toggle(d.fav, a.id); toast(d, d.fav.includes(a.id) ? 'Adicionado aos favoritos' : 'Removido dos favoritos'); })}><Ic n="heart" /></button>
  );
  const contatoBtn = <button type="button" className="btn" disabled={sent} onClick={() => set(d => sheet(d, 'contato'))}>{sent ? 'Pedido enviado' : 'Solicitar contato'}</button>;
  return (
    <>
      <Hdr t="Perfil do atleta" />
      <Body act>
        <div className="hero">
          <Av nome={a.nome} s={64} />
          <div style={{ flex: 1, minWidth: 0 }}><h2>{a.nome}</h2><p className="muted">{a.pos} · {a.clube}</p><p className="muted">{a.cidade}/{a.uf} · {a.cat}</p></div>
          {o != null && <span className="score big">{fmt(o)}</span>}
        </div>
        <div className="chips" style={{ marginTop: 12 }}>
          {a.verificado ? <span className="tag g"><Ic n="shieldok" s={13} /> Verificado pelo Book Soccer</span> : <span className="tag a"><Ic n="clock" s={13} /> Aguardando verificação</span>}
          <span className="tag">{mine ? 'Na sua carteira' : a.id === 'novo' ? 'Cadastrado por você' : 'Cadastrado por scout'}</span>
          {a.idade < 18 && <span className="tag">Menor de idade</span>}
        </div>
        <div className="tabs-in" role="tablist">
          {([['resumo', 'Resumo'], ['aval', 'Avaliações'], ['videos', 'Vídeos'], ['hist', 'Histórico']] as const).map(([k, l]) => (
            <button type="button" key={k} role="tab" aria-selected={t === k} onClick={() => set(d => { d.perfilTab = k; })}>{l}</button>
          ))}
        </div>
        {t === 'resumo' && (
          <>
            <div className="facts">
              <div><b>{a.idade}</b><span>anos</span></div><div><b>{metros(a.alt)}</b><span>metros</span></div>
              <div><b>{a.peso || '–'}</b><span>kg</span></div><div><b>{a.pe}</b><span>pé</span></div>
            </div>
            {o != null ? (
              <>
                <div className="card" style={{ marginTop: 14 }}><Bars v={a.a} /></div>
                {a.obs.length > 1 && <div className="card" style={{ marginTop: 14 }}><div className="sect" style={{ margin: '0 0 8px' }}><h3>Evolução</h3><span className="muted">nota geral</span></div><Chart pts={a.obs.map(x => x.n)} labels={a.obs.map(x => x.d)} /></div>}
              </>
            ) : (
              <div className="card empty" style={{ marginTop: 14 }}><Ic n="clock" s={30} /><b style={{ color: 'var(--text)' }}>Ainda sem avaliações</b><span>Faça a primeira avaliação para ver notas e evolução.</span></div>
            )}
          </>
        )}
        {t === 'aval' && (a.obs.length
          ? [...a.obs].reverse().map((x, i) => <div className="ath" key={i} style={{ marginBottom: 10 }}><span className="mid"><b>{x.j}</b><small>{x.d} · por {x.por}</small></span><span className="score">{fmt(x.n)}</span></div>)
          : <div className="empty"><Ic n="file" s={30} /><span>Nenhuma avaliação registrada.</span></div>)}
        {t === 'videos' && <div className="vid">{VIDEOS.map(v => <Thumb key={v[0]} t={v[0]} dur={v[1]} onClick={() => set(d => toast(d, 'Reproduzindo vídeo (demonstração)'))} />)}</div>}
        {t === 'hist' && (a.hist.length ? <Historico h={a.hist} /> : <div className="empty"><Ic n="clock" s={30} /><span>Sem histórico informado.</span></div>)}
      </Body>
      <div className="actionbar">
        {mine ? <>{favBtn}<button type="button" className="btn" onClick={() => set(d => { d.share = { ath: a.id, to: [] }; go(d, 'compartilhar'); })}><Ic n="send" s={18} /> Compartilhar perfil</button></>
          : ag ? <>{favBtn}{contatoBtn}</>
            : <>
              <button type="button" className="btn ghost" onClick={() => set(d => avaliar(d, a.id))}>Avaliar</button>
              {favBtn}
              <B className="icon-btn" aria-label="Adicionar à lista" h="lista-sheet" onClick={() => set(d => sheet(d, 'lista'))}><Ic n="list" /></B>
              {contatoBtn}
            </>}
      </div>
    </>
  );
}

export const Historico = ({ h }: { h: [string, string, string][] }) => (
  <ul className="tl">
    {h.map((x, i) => (
      <li key={i} className={i === 0 ? 'now' : 'done'}>
        <span className="dot"><Ic n={i === 0 ? 'ball' : 'check'} s={14} /></span>
        <div><b>{x[1]}</b><small>{x[2]} · {x[0]}</small></div>
      </li>
    ))}
  </ul>
);

export function Cadastrar() {
  const { set } = useP();
  return (
    <>
      <Top t="Cadastrar" eb="O que você quer fazer?" />
      <Body><div className="roles">
        <B className="role" h="go:novo" onClick={() => set(d => go(d, 'novo'))}><span className="ico"><Ic n="user" s={24} /></span><span><b>Novo atleta</b><small>Cadastre dados, posição e responsável</small></span><Ic n="chev" /></B>
        <button type="button" className="role" onClick={() => set(d => avaliar(d, 'davi'))}><span className="ico"><Ic n="file" s={24} /></span><span><b>Nova avaliação</b><small>Registre notas e observações de um jogo</small></span><Ic n="chev" /></button>
      </div></Body>
    </>
  );
}

export const MinorInfo = ({ who }: { who: string }) => (
  <div className="info"><Ic n="shield" s={20} /><span>{who} é menor de 18 anos. Pedimos os dados do responsável e uma autorização assinada. O perfil só fica visível depois da verificação.</span></div>
);

export function Novo() {
  const { s, set } = useP();
  const n = s.novo, menor = isMenor(n.nasc);
  const up = (fn: (x: State['novo']) => void) => set(d => fn(d.novo));
  return (
    <>
      <Hdr t="Novo atleta" />
      <Body act><div className="stack">
        <Fld label="Nome completo"><Inp value={n.nome} on={v => up(x => { x.nome = v; })} /></Fld>
        <div className="row2">
          <Fld label="Nascimento"><Inp type="date" value={n.nasc} on={v => up(x => { x.nasc = v; })} /></Fld>
          <Fld label="Altura (cm)"><Inp type="number" value={n.alt} on={v => up(x => { x.alt = +v; })} /></Fld>
        </div>
        <div className="row2">
          <Fld label="Posição"><Sel value={n.pos} on={v => up(x => { x.pos = v; })} opts={POSICOES} /></Fld>
          <Fld label="Pé dominante"><Sel value={n.pe} on={v => up(x => { x.pe = v; })} opts={PES} /></Fld>
        </div>
        <Fld label="Clube atual"><Inp value={n.clube} on={v => up(x => { x.clube = v; })} /></Fld>
        <Fld label="Cidade"><Inp value={n.cidade} on={v => up(x => { x.cidade = v; })} /></Fld>
        {menor && (
          <>
            <MinorInfo who="O atleta" />
            <Fld label="Nome do responsável"><Inp value={n.resp} on={v => up(x => { x.resp = v; })} /></Fld>
            <Fld label="Telefone do responsável"><Inp type="tel" value={n.tel} on={v => up(x => { x.tel = v; })} /></Fld>
            <Up ok={n.aut} title="Anexar autorização do responsável" okTitle="autorizacao-assinada.pdf" sub="Toque para anexar (simulado)" onClick={() => up(x => { x.aut = !x.aut; })} />
          </>
        )}
      </div></Body>
      <div className="actionbar"><B className="btn" h="novo-salvar" onClick={() => set(d => salvarNovo(d))}>Cadastrar atleta</B></div>
    </>
  );
}

export function NovoOk() {
  const { s, set } = useP();
  const n = getA(s, 'novo'), menor = n.idade < 18;
  return (
    <Body><div className="big-ok">
      <div className="seal"><Ic n="clock" s={48} /></div>
      <h2>{n.nome} foi cadastrado</h2>
      <p>A equipe do Book Soccer vai verificar identidade e idade{menor ? ' e a autorização do responsável' : ''}. O atleta entra na busca depois de verificado.</p>
      {menor && !s.novo.aut && <div className="info warn"><Ic n="file" s={20} /><span>Falta a autorização do responsável. Sem ela, a verificação não começa.</span></div>}
      <div className="stack" style={{ width: '100%', marginTop: 8 }}>
        <B className="btn" h="avaliar-novo" onClick={() => set(d => avaliar(d, 'novo'))}>Avaliar agora</B>
        <button type="button" className="btn ghost" onClick={() => set(d => go(d, 'scout-home', { reset: true }))}>Voltar ao início</button>
      </div>
    </div></Body>
  );
}

export function Aval1() {
  const { s, set } = useP();
  const a = s.aval, opts = s.atletas.filter(x => x.verificado || (x.id === 'novo' && s.novo.saved)).map(x => [x.id, x.nome] as [string, string]);
  const up = (fn: (x: State['aval']) => void) => set(d => fn(d.aval));
  return (
    <>
      <Hdr t="Nova avaliação" /><Steps n={1} t={3} />
      <Body act><div className="stack">
        <div><h1 className="big-title flush">Jogo observado</h1><p className="muted">Passo 1 de 3</p></div>
        <Fld label="Atleta"><Sel value={a.ath} on={v => up(x => { x.ath = v; })} opts={opts} /></Fld>
        <Fld label="Jogo"><Inp value={a.jogo} on={v => up(x => { x.jogo = v; })} /></Fld>
        <div className="row2">
          <Fld label="Data"><Inp type="date" value={a.data} on={v => up(x => { x.data = v; })} /></Fld>
          <Fld label="Local"><Inp value={a.local} on={v => up(x => { x.local = v; })} /></Fld>
        </div>
        <div><span className="l">Minutos observados</span><div className="chips">{['30', '45', '60', '90'].map(m => <Chip key={m} on={a.min === m} onClick={() => up(x => { x.min = m; })}>{m} min</Chip>)}</div></div>
      </div></Body>
      <div className="actionbar"><B className="btn" h="aval-2" onClick={() => set(d => go(d, 'aval-2'))}>Continuar</B></div>
    </>
  );
}

export function Aval2() {
  const { s, set } = useP();
  const v = s.aval.v, media = Object.values(v).reduce((t, x) => t + x, 0) / ATTRS.length;
  return (
    <>
      <Hdr t="Nova avaliação" right={<span className="score" style={{ minWidth: 40, height: 40, fontSize: 16 }}>{fmt(media)}</span>} /><Steps n={2} t={3} />
      <Body act>
        <h1 className="big-title flush">Notas de 1 a 10</h1><p className="muted">Passo 2 de 3 · a nota geral é a média</p>
        {GROUPS.map(g => (
          <div key={g}>
            <div className="grp"><span>{g}</span></div>
            {ATTRS.filter(x => x.g === g).map(x => (
              <div className="sl" key={x.k}>
                <div className="sl-h"><span>{x.n}</span><output>{v[x.k]}</output></div>
                <input type="range" min={1} max={10} step={1} value={v[x.k]} aria-label={x.n} onChange={e => { const n = +e.target.value; set(d => { d.aval.v[x.k] = n; }); }} />
              </div>
            ))}
          </div>
        ))}
      </Body>
      <div className="actionbar"><B className="btn" h="aval-3" onClick={() => set(d => go(d, 'aval-3'))}>Continuar</B></div>
    </>
  );
}

export function Aval3() {
  const { s, set } = useP();
  const a = s.aval;
  return (
    <>
      <Hdr t="Nova avaliação" /><Steps n={3} t={3} />
      <Body act><div className="stack">
        <div><h1 className="big-title flush">Observações</h1><p className="muted">Passo 3 de 3</p></div>
        <div><span className="l">Pontos fortes</span><div className="chips">{ATTRS.map(x => <Chip key={x.k} on={a.fortes.includes(x.n)} onClick={() => set(d => toggle(d.aval.fortes, x.n))}>{x.n}</Chip>)}</div></div>
        <div><span className="l">A desenvolver</span><div className="chips">{ATTRS.map(x => <Chip key={x.k} on={a.dev.includes(x.n)} onClick={() => set(d => toggle(d.aval.dev, x.n))}>{x.n}</Chip>)}</div></div>
        <Fld label="Observações"><textarea className="in" value={a.obs} onChange={e => { const v = e.target.value; set(d => { d.aval.obs = v; }); }} /></Fld>
        <div><span className="l">Recomendação</span><div className="chips">{['Acompanhar', 'Indicar ao clube', 'Descartar'].map(r => <Chip key={r} on={a.rec === r} onClick={() => set(d => { d.aval.rec = r; })}>{r}</Chip>)}</div></div>
      </div></Body>
      <div className="actionbar"><B className="btn" h="aval-salvar" onClick={() => set(d => salvarAval(d))}>Salvar avaliação</B></div>
    </>
  );
}

export function Rel() {
  const { s, set } = useP();
  const r = s.rel;
  if (!r) return <Body>{null}</Body>;
  const a = getA(s, r.ath);
  return (
    <>
      <Hdr t="Relatório" />
      <Body act><div className="stack">
        <div className="hero"><Av nome={a.nome} s={56} /><div style={{ flex: 1, minWidth: 0 }}><h2 className="h20">{a.nome}</h2><p className="muted">{a.pos} · {a.idade} anos</p></div><span className="score big">{fmt(r.nota)}</span></div>
        {!a.verificado && <div className="info warn"><Ic n="clock" s={20} /><span>{primeiro(a.nome)} ainda está em verificação. O relatório fica só com você até a equipe Book Soccer aprovar o perfil.</span></div>}
        <div className="card grid6"><p className="eyebrow">Observação</p><b>{r.jogo}</b><p className="muted">{r.dataFmt} · {r.local} · {r.min} min · por Marcos Tavares</p></div>
        <div className="card"><Bars v={r.v} /></div>
        <div className="card grid10">
          <p className="eyebrow">Leitura do scout</p>
          {(r.fortes.length > 0 || r.dev.length > 0) && <div className="chips">{r.fortes.map(x => <span key={x} className="tag g">{x}</span>)}{r.dev.map(x => <span key={x} className="tag a">{x}</span>)}</div>}
          <p>{r.obs}</p>
          <p className="note">Recomendação: <span className={cx('tag', r.rec === 'Descartar' ? 'r' : 'g')}>{r.rec}</span></p>
        </div>
        {a.obs.length > 1 && <div className="card"><div className="sect" style={{ margin: '0 0 8px' }}><h3>Evolução</h3><span className="muted">nota geral</span></div><Chart pts={a.obs.map(x => x.n)} labels={a.obs.map(x => x.d)} /></div>}
      </div></Body>
      <div className="actionbar">
        <button type="button" className="btn ghost" onClick={() => set(d => abrirPerfil(d, a.id))}>Ver perfil</button>
        <button type="button" className="btn" onClick={() => set(d => sheet(d, 'rel-share'))}><Ic n="send" s={18} /> Compartilhar</button>
      </div>
    </>
  );
}

export function Listas() {
  const { s, set } = useP();
  return (
    <>
      <Top t="Listas" eb="Acompanhamento" />
      <Body><div className="stack">
        {s.listas.map(l => (
          <B key={l.id} className="card lista" h={`lista:${l.id}`} onClick={() => set(d => { d.listaId = l.id; d.sel = []; go(d, 'lista-det'); })}>
            <span className="ico"><Ic n="list" /></span>
            <span style={{ flex: 1 }}><b>{l.nome}</b><small>{l.ids.length} {l.ids.length === 1 ? 'atleta' : 'atletas'}</small></span>
            <Ic n="chev" />
          </B>
        ))}
        <div className="info"><Ic n="eye" s={20} /><span>Etapas de acompanhamento: observando, interesse, contato, descartado ou fechado.</span></div>
      </div></Body>
    </>
  );
}

export function ListaDet() {
  const { s, set } = useP();
  const l = s.listas.find(x => x.id === s.listaId)!, n = s.sel.length;
  return (
    <>
      <Hdr t={l.nome} />
      <Body act>
        <p className="muted" style={{ margin: '0 0 10px' }}>Marque 2 ou 3 atletas para comparar. Toque na etapa para mudar o acompanhamento.</p>
        {l.ids.map(id => {
          const a = getA(s, id), o = ov(a), on = s.sel.includes(id), et = l.etapa[id] || 'Observando';
          return (
            <div key={id} className={cx('card lrow', on && 'on')}>
              <div className="top-row">
                <button type="button" className="ck" aria-pressed={on} aria-label={`Marcar ${a.nome} para comparar`} onClick={() => set(d => selComparar(d, id))}><Ic n="check" s={16} /></button>
                <button type="button" className="lmain" onClick={() => set(d => abrirPerfil(d, id))}>
                  <Av nome={a.nome} s={42} />
                  <span className="mid"><b>{a.nome}</b><small>{a.pos} · {a.idade} anos</small></span>
                  {o != null && <span className="score">{fmt(o)}</span>}
                </button>
              </div>
              <div className="lfoot"><span className="muted">Etapa</span>
                <button type="button" className={cx('tag', ETAPA_COR[et])} onClick={() => set(d => { d.etapaId = id; sheet(d, 'etapa'); })}>{et} <Ic n="chev" s={12} /></button>
              </div>
            </div>
          );
        })}
      </Body>
      <div className="actionbar"><B className="btn" h="comparar" disabled={n < 2} onClick={() => set(d => go(d, 'compare'))}><Ic n="cols" s={18} /> Comparar{n ? ` (${n})` : ''}</B></div>
    </>
  );
}

export function Compare() {
  const { s } = useP();
  const A = s.sel.slice(0, 3).map(id => getA(s, id)), n = A.length;
  // best = destaca o maior valor; só faz sentido para notas, não para idade ou altura
  const row = (label: string, vals: (number | string | null)[], best = true) => {
    const nums = vals.filter((v): v is number => typeof v === 'number'), mx = best && nums.length ? Math.max(...nums) : null;
    const unico = mx != null && nums.filter(z => z === mx).length < n;
    return [<span key={label}>{label}</span>, ...vals.map((v, i) => (
      <span key={label + i} className={cx('v', unico && v === mx && 'best')}>{typeof v === 'number' ? (Number.isInteger(v) ? v : fmt(v)) : v ?? '–'}</span>
    ))];
  };
  return (
    <>
      <Hdr t="Comparar" />
      <Body><div className="cmp" style={{ ['--n' as string]: n }}>
        <span />
        {A.map(a => <div className="h" key={a.id}><Av nome={a.nome} s={40} /><small><b>{primeiro(a.nome)}</b></small></div>)}
        <span className="sec">Resumo</span>
        {row('Nota geral', A.map(ov))}{row('Idade', A.map(a => a.idade), false)}{row('Altura (cm)', A.map(a => a.alt), false)}
        {row('Posição', A.map(a => a.posF), false)}{row('Pé', A.map(a => a.pe), false)}
        {GROUPS.map(g => [
          <span className="sec" key={g}>{g}</span>,
          ...ATTRS.filter(x => x.g === g).map(x => row(x.n, A.map(a => a.a[x.k] ?? null))),
        ])}
      </div></Body>
    </>
  );
}
