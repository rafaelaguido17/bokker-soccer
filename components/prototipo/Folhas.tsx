'use client';
// Folhas que sobem de baixo dentro do celular.
import { useState } from 'react';
import { ETAPAS, nomeBusca, primeiro } from '@/lib/prototipo/dados';
import { closeSheet, definirEtapa, getA, listaToggle, toast } from '@/lib/prototipo/acoes';
import { Ic, useP } from './ui';

function Lista() {
  const { s, set } = useP();
  return (
    <>
      <h3>Adicionar à lista</h3>
      {s.listas.map(l => (
        <button type="button" key={l.id} className="ath" aria-pressed={l.ids.includes(s.perfilId)} onClick={() => set(d => listaToggle(d, l.id))}>
          <span className="ck"><Ic n="check" s={16} /></span>
          <span className="mid"><b>{l.nome}</b><small>{l.ids.length} {l.ids.length === 1 ? 'atleta' : 'atletas'}</small></span>
        </button>
      ))}
      <button type="button" className="btn" onClick={() => set(closeSheet)}>Pronto</button>
    </>
  );
}

function Contato() {
  const { s, set } = useP();
  const a = getA(s, s.perfilId);
  const [msg, setMsg] = useState('Olá! Gostei do perfil e gostaria de conversar sobre uma avaliação presencial.');
  return (
    <>
      <h3>Solicitar contato</h3>
      <p className="muted">O pedido vai para {a.idade < 18 ? 'o responsável de ' : ''}{a.nome}. Você só vê o contato se aceitarem.</p>
      <label className="fld"><span className="l">Mensagem</span><textarea className="in" value={msg} onChange={e => setMsg(e.target.value)} /></label>
      <button type="button" className="btn" onClick={() => set(d => { d.contato.push(d.perfilId); closeSheet(d); toast(d, 'Pedido de contato enviado'); })}><Ic n="send" s={18} /> Enviar pedido</button>
    </>
  );
}

function RelShare() {
  const { set } = useP();
  const ops: [string, string, string, string][] = [
    ['link', 'Copiar link', 'Quem tem o link pode ver o relatório', 'Link copiado'],
    ['send', 'Enviar ao clube', 'EC Aurora · captação', 'Enviado ao EC Aurora'],
    ['file', 'Gerar PDF', 'Para imprimir ou anexar', 'PDF preparado'],
  ];
  return (
    <>
      <h3>Compartilhar relatório</h3>
      {ops.map(([ic, t, sub, ok]) => (
        <button type="button" key={t} className="ath" onClick={() => set(d => { closeSheet(d); toast(d, ok); })}>
          <Ic n={ic} /><span className="mid"><b>{t}</b><small>{sub}</small></span>
        </button>
      ))}
    </>
  );
}

function ContatoLiberado() {
  const { set } = useP();
  return (
    <>
      <h3>Contato liberado</h3>
      <p className="muted">Juliana Prado aceitou falar sobre Davi Ferreira. Como Davi é menor de idade, a conversa passa pela agência, que envolve o responsável.</p>
      <div className="card grid6"><b>Juliana Prado · JP Sports</b><span className="muted">(11) 90000-0000</span><span className="muted">contato@jpsports.exemplo</span></div>
      <p className="note"><Ic n="shield" s={16} /> Dados fictícios de demonstração.</p>
      <button type="button" className="btn" onClick={() => set(closeSheet)}>Fechar</button>
    </>
  );
}

function Etapa() {
  const { s, set } = useP();
  const l = s.listas.find(x => x.id === s.listaId)!, id = s.etapaId!, cur = l.etapa[id] || 'Observando';
  return (
    <>
      <h3>Etapa de {primeiro(getA(s, id).nome)}</h3>
      <p className="muted">Em que ponto está o acompanhamento?</p>
      {ETAPAS.map(e => (
        <button type="button" key={e} className="ath" aria-pressed={e === cur} onClick={() => set(d => definirEtapa(d, e))}>
          <span className="ck"><Ic n="check" s={16} /></span><span className="mid"><b>{e}</b></span>
        </button>
      ))}
    </>
  );
}

function SalvarBusca() {
  const { s, set } = useP();
  const [nome, setNome] = useState(nomeBusca(s.f));
  return (
    <>
      <h3>Salvar busca</h3>
      <p className="muted">Avisamos você quando um atleta verificado novo combinar com estes filtros.</p>
      <label className="fld"><span className="l">Nome da busca</span><input className="in" value={nome} onChange={e => setNome(e.target.value)} /></label>
      <button type="button" className="btn" onClick={() => set(d => { d.buscas.push({ nome: nome.trim() || nomeBusca(d.f), f: structuredClone(d.f) }); closeSheet(d); toast(d, 'Busca salva'); })}>
        <Ic n="save" s={18} /> Salvar
      </button>
    </>
  );
}

function Hist() {
  const { set } = useP();
  const [clube, setClube] = useState('EC Bauru'), [cat, setCat] = useState('Sub-15'), [per, setPer] = useState('2023 – 2025');
  return (
    <>
      <h3>Adicionar clube</h3>
      <label className="fld"><span className="l">Clube</span><input className="in" value={clube} onChange={e => setClube(e.target.value)} /></label>
      <div className="row2">
        <label className="fld"><span className="l">Categoria</span><input className="in" value={cat} onChange={e => setCat(e.target.value)} /></label>
        <label className="fld"><span className="l">Período</span><input className="in" value={per} onChange={e => setPer(e.target.value)} /></label>
      </div>
      <button type="button" className="btn" onClick={() => set(d => {
        if (!clube.trim()) return toast(d, 'Informe o nome do clube');
        d.at.hist.push([per.trim(), clube.trim(), cat.trim()]); closeSheet(d); toast(d, 'Clube adicionado');
      })}>Adicionar</button>
    </>
  );
}

const FOLHAS = { lista: Lista, contato: Contato, 'rel-share': RelShare, 'contato-liberado': ContatoLiberado, etapa: Etapa, 'salvar-busca': SalvarBusca, hist: Hist };

export function Folha() {
  const { s, set } = useP();
  if (!s.sheet) return null;
  const Conteudo = FOLHAS[s.sheet.tipo];
  return (
    <div className="sheet-bg on" onClick={e => { if (e.target === e.currentTarget) set(closeSheet); }}>
      <div className="sheet" role="dialog" aria-modal="true"><Conteudo /></div>
    </div>
  );
}
