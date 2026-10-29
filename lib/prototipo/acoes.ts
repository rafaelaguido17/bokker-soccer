// Ações do protótipo. Todas recebem um rascunho do estado e o alteram diretamente.
import { ageOf, avg, primeiro, type AttrKey } from './dados';
import { back, FLOWS, go, homeOf, initState, type Role, type SheetTipo, type State } from './estado';

export const getA = (s: State, id: string) => s.atletas.find(a => a.id === id)!;
export const limited = (s: State) => !s.proVerif && s.role === s.pro.tipo;

export function toast(d: State, msg: string) { d.toast = { msg, id: (d.toast?.id ?? 0) + 1 }; }
export function sheet(d: State, tipo: SheetTipo, arg?: string) { d.sheet = { tipo, arg }; }
export function closeSheet(d: State) { d.sheet = null; }

export function iniciarFluxo(d: State, n: number) {
  Object.assign(d, initState());
  d.flow = { n, i: 0 };
  if (n === 1) { d.role = 'scout'; go(d, 'scout-home', { reset: true }); }
  if (n === 2) { d.role = 'scout'; go(d, 'buscar', { reset: true }); }
  if (n === 3) go(d, 'welcome', { reset: true });
  if (n === 4) { d.role = 'agente'; go(d, 'ag-home', { reset: true }); }
}
export function reiniciar(d: State) { Object.assign(d, initState()); }

export function verComo(d: State, r: Role) {
  d.role = r; d.flow = null; d.sheet = null;
  if (r === 'atleta') d.verif = true;
  go(d, homeOf(d), { reset: true });
}
export function verScoutNotif(d: State) {
  d.role = 'scout';
  if (d.flow) d.flow.i = FLOWS[4].steps.length - 1;
  go(d, 'scout-home', { reset: true });
}

/** Escolha de perfil na abertura do app: atleta cria o perfil; scout e agente passam pela verificação profissional. */
export function escolherPerfil(d: State, r: Role) {
  d.role = r;
  if (r === 'atleta') return go(d, 'at-1', { reset: 'welcome' });
  const sc = r === 'scout';
  d.pro = { tipo: r, nome: sc ? 'Marcos Tavares' : 'Juliana Prado', org: sc ? 'EC Aurora' : 'JP Sports', cargo: sc ? 'Analista de captação' : 'Registro de intermediário nº 000000', docId: false, docV: false };
  d.proVerif = false;
  go(d, 'pro-1', { reset: 'escolha' });
}

export function abrirPerfil(d: State, id: string) { d.perfilId = id; d.perfilTab = 'resumo'; go(d, 'perfil'); }
export function avaliar(d: State, id: string) { d.aval.ath = id; go(d, 'aval-1'); }

export function salvarNovo(d: State) {
  const n = d.novo, a = getA(d, 'novo');
  Object.assign(a, { nome: n.nome || 'Atleta sem nome', idade: ageOf(n.nasc), nasc: n.nasc, pos: n.pos, posF: n.pos, pe: n.pe, alt: Number(n.alt) || 0, clube: n.clube, cidade: n.cidade });
  n.saved = true;
  go(d, 'novo-ok', { reset: homeOf(d) });
}

export function salvarAval(d: State) {
  const v = d.aval, a = getA(d, v.ath);
  const nota = Math.round(avg(Object.values(v.v)) * 10) / 10;
  const p = v.data.split('-');
  a.a = { ...v.v };
  a.obs.push({ d: p.length === 3 ? `${p[2]}/${p[1]}` : v.data, j: v.jogo, n: nota, por: 'Marcos Tavares' });
  d.recentes = [a.id, ...d.recentes.filter(x => x !== a.id)];
  d.avalMes++;
  d.rel = { ...structuredClone(v), nota, dataFmt: p.length === 3 ? `${p[2]}/${p[1]}/${p[0]}` : v.data };
  go(d, 'rel', { reset: homeOf(d) });
  toast(d, 'Avaliação salva');
}

export function toggle(arr: string[], v: string) {
  const i = arr.indexOf(v);
  if (i >= 0) arr.splice(i, 1); else arr.push(v);
}

export function selComparar(d: State, id: string) {
  if (d.sel.includes(id)) d.sel = d.sel.filter(x => x !== id);
  else if (d.sel.length >= 3) toast(d, 'Compare até 3 atletas por vez');
  else d.sel.push(id);
}

export function listaToggle(d: State, lid: string) {
  const l = d.listas.find(x => x.id === lid)!, id = d.perfilId;
  if (l.ids.includes(id)) l.ids = l.ids.filter(x => x !== id);
  else { l.ids.push(id); l.etapa[id] = 'Observando'; toast(d, 'Adicionado a ' + l.nome); }
}

export function definirEtapa(d: State, etapa: string) {
  const l = d.listas.find(x => x.id === d.listaId)!;
  if (d.etapaId) { l.etapa[d.etapaId] = etapa; toast(d, `${primeiro(getA(d, d.etapaId).nome)} agora está em ${etapa}`); }
  closeSheet(d);
}

export function responderPedido(d: State, status: 'aceito' | 'recusado') {
  d.pedidos.find(x => x.id === d.pedidoId)!.status = status;
  toast(d, status === 'aceito' ? 'Pedido aceito' : 'Pedido recusado');
}

export function enviarVitrine(d: State) {
  const a = getA(d, d.share.ath), n = d.share.to.length;
  go(d, 'ag-home', { reset: true });
  toast(d, `Vitrine de ${primeiro(a.nome)} enviada a ${n} ${n === 1 ? 'contato' : 'contatos'}`);
}

export const setNota = (d: State, k: AttrKey, n: number) => { d.aval.v[k] = n; };
export { back, go };

export interface Notif { ic: string; t: string; s: string; act?: 'contato-liberado'; novo?: boolean }
export function notifs(s: State): Notif[] {
  const p = s.pedidos.find(x => x.id === 'p1')!, out: Notif[] = [];
  if (p.status === 'aceito') out.push({ ic: 'check', t: 'Juliana Prado aceitou seu pedido', s: 'Contato sobre Davi Ferreira liberado · agora', act: 'contato-liberado', novo: true });
  if (p.status === 'recusado') out.push({ ic: 'x', t: 'Juliana Prado recusou seu pedido', s: 'Sobre Davi Ferreira · agora', novo: true });
  s.contato.forEach(id => out.push({ ic: 'send', t: `Pedido enviado sobre ${getA(s, id).nome}`, s: 'Aguardando resposta' }));
  out.push({ ic: 'cal', t: 'Academia Litoral x Tupã FC no sábado', s: 'Sáb 31/10 · 15h · 3 atletas das suas listas' });
  out.push({ ic: 'video', t: 'Gabriel Andrade enviou vídeos novos', s: 'ontem' });
  return out;
}
