// Estado do protótipo, navegação entre telas e fluxos guiados da apresentação.
import { ATTRS, FDEF, HOJE, buildAtletas, type Atleta, type AttrKey, type Filtros, type Hist } from './dados';

export type Role = 'scout' | 'agente' | 'atleta';

export interface Lista { id: string; nome: string; ids: string[]; etapa: Record<string, string> }
export interface Pedido { id: string; de: string; clube: string; ath: string; quando: string; msg: string; status: 'novo' | 'aceito' | 'recusado' }
export interface Aval { ath: string; data: string; jogo: string; local: string; min: string; v: Record<AttrKey, number>; fortes: string[]; dev: string[]; rec: string; obs: string }
export interface Rel extends Aval { nota: number; dataFmt: string }
export type SheetTipo = 'lista' | 'contato' | 'rel-share' | 'contato-liberado' | 'etapa' | 'salvar-busca' | 'hist';

export interface State {
  role: Role | null;
  stack: string[];
  cur: string;
  lastTab: string | null;
  atletas: Atleta[];
  q: string;
  f: Filtros;
  buscas: { nome: string; f: Filtros }[];
  fav: string[];
  sel: string[];
  contato: string[];
  listas: Lista[];
  listaId: string;
  etapaId: string | null;
  perfilId: string;
  perfilTab: 'resumo' | 'aval' | 'videos' | 'hist';
  pedidos: Pedido[];
  pedidoId: string;
  share: { ath: string; to: number[] };
  aval: Aval;
  rel: Rel | null;
  recentes: string[];
  avalMes: number;
  novo: { nome: string; nasc: string; pos: string; pe: string; alt: number; clube: string; cidade: string; resp: string; tel: string; aut: boolean; saved: boolean };
  at: { nome: string; nasc: string; pos: string; pe: string; alt: number; cidade: string; parent: string; resp: string; tel: string; cpf: string; docId: boolean; docAut: boolean; hist: Hist[]; video: boolean };
  // Conta profissional criada pela escolha de perfil. Contas de "Ver como" já vêm verificadas.
  pro: { tipo: 'scout' | 'agente'; nome: string; org: string; cargo: string; docId: boolean; docV: boolean };
  proVerif: boolean;
  verif: boolean;
  notif: boolean;
  vis: boolean;
  flow: { n: number; i: number } | null;
  sheet: { tipo: SheetTipo; arg?: string } | null;
  toast: { msg: string; id: number } | null;
}

export function initState(): State {
  const atletas = buildAtletas();
  const davi = atletas[0];
  const v = Object.fromEntries(ATTRS.map(x => [x.k, davi.a[x.k] ?? 5])) as Record<AttrKey, number>;
  return {
    role: null, stack: [], cur: 'welcome', lastTab: null, atletas,
    q: '', f: structuredClone(FDEF),
    buscas: [{ nome: 'Pontas canhotos até 17 anos', f: { ...FDEF, pos: ['Ponta'], pe: 'Canhoto', imax: 17 } }],
    fav: ['lucas'], sel: [], contato: [],
    listas: [
      { id: 'acomp', nome: 'Em acompanhamento', ids: ['davi', 'lucas', 'enzo'], etapa: { davi: 'Interesse', lucas: 'Observando', enzo: 'Contato' } },
      { id: 'final', nome: 'Finalistas Sub-17', ids: ['davi', 'lucas'], etapa: {} },
      { id: 'vivo', nome: 'Para ver ao vivo', ids: ['thiago'], etapa: { thiago: 'Observando' } },
    ],
    listaId: 'acomp', etapaId: null, perfilId: 'davi', perfilTab: 'resumo',
    pedidos: [
      { id: 'p1', de: 'Marcos Tavares', clube: 'EC Aurora', ath: 'davi', quando: 'há 1 h', msg: 'Olá! Gostamos do perfil do Davi e queremos convidá-lo para um período de testes de uma semana.', status: 'novo' },
      { id: 'p2', de: 'Helena Duarte', clube: 'Real Várzea FC', ath: 'lucas', quando: 'ontem', msg: 'Acompanhamos o Lucas em dois jogos. Podemos conversar sobre uma avaliação presencial?', status: 'novo' },
      { id: 'p3', de: 'Rogério Silva', clube: 'Academia Litoral', ath: 'enzo', quando: 'há 3 dias', msg: 'Procuramos um centroavante para o Sub-17. Gostaríamos de ver o Enzo treinar com a gente.', status: 'novo' },
    ],
    pedidoId: 'p1', share: { ath: 'davi', to: [] },
    aval: { ath: 'davi', data: HOJE.iso, jogo: 'Academia Litoral x Tupã FC · Sub-17', local: 'Estádio Municipal', min: '60', v, fortes: ['Drible', 'Velocidade'], dev: ['Marcação'], rec: 'Acompanhar', obs: 'Mantém a bola sob pressão e decide rápido no um contra um. Precisa recompor mais quando perde a bola.' },
    rel: null, recentes: ['davi', 'lucas', 'enzo'], avalMes: 9,
    novo: { nome: 'Bruno Castro', nasc: '2009-08-02', pos: 'Meia', pe: 'Destro', alt: 175, clube: 'Sem clube', cidade: 'Santos', resp: 'Carla Castro', tel: '(13) 99999-0000', aut: false, saved: false },
    at: { nome: 'Miguel Santos', nasc: '2010-06-20', pos: 'Meia', pe: 'Destro', alt: 170, cidade: 'Bauru', parent: 'Mãe', resp: 'Ana Santos', tel: '(14) 99999-0000', cpf: '000.000.000-00', docId: false, docAut: false, hist: [], video: false },
    pro: { tipo: 'scout', nome: '', org: '', cargo: '', docId: false, docV: false },
    proVerif: true, verif: false, notif: true, vis: true,
    flow: null, sheet: null, toast: null,
  };
}

/* ---------- Abas e navegação ---------- */
export const TABS: Record<Role, [id: string, label: string, icon: string][]> = {
  scout: [['scout-home', 'Início', 'home'], ['buscar', 'Buscar', 'search'], ['cadastrar', 'Cadastrar', 'plus'], ['listas', 'Listas', 'list'], ['conta', 'Perfil', 'user']],
  agente: [['ag-home', 'Início', 'home'], ['carteira', 'Carteira', 'brief'], ['buscar', 'Buscar', 'search'], ['pedidos', 'Pedidos', 'mail'], ['conta', 'Perfil', 'user']],
  atleta: [['at-perfil', 'Meu perfil', 'user'], ['at-videos', 'Vídeos', 'video'], ['at-quem', 'Quem viu', 'eye'], ['conta', 'Conta', 'shield']],
};
// Telas com barra de abas: valor 1 = a própria tela é uma aba; texto = aba que fica acesa; '*' = aba de onde veio
const TABMAP: Record<string, 1 | string> = {
  'scout-home': 1, notifs: 'scout-home', buscar: 1, cadastrar: 1, listas: 1, 'lista-det': 'listas', conta: 1,
  'ag-home': 1, carteira: 1, pedidos: 1, 'pedido-det': 'pedidos', 'at-perfil': 1, 'at-videos': 1, 'at-quem': 1, perfil: '*',
};
export function activeTab(s: State) {
  const tm = TABMAP[s.cur];
  if (!tm) return null;
  return tm === '*' ? s.lastTab ?? '' : tm === 1 ? s.cur : tm;
}
export const homeOf = (s: State) => (s.role === 'agente' ? 'ag-home' : s.role === 'atleta' ? 'at-perfil' : 'scout-home');

/** Navega dentro de um rascunho do estado. reset: true limpa o histórico; texto deixa só essa tela para trás. */
export function go(d: State, id: string, o: { back?: boolean; reset?: true | string } = {}) {
  if (o.reset !== undefined) d.stack = o.reset === true ? [] : [o.reset];
  else if (!o.back && d.cur !== id) d.stack.push(d.cur);
  d.cur = id;
  const tm = TABMAP[id];
  if (tm && tm !== '*') d.lastTab = tm === 1 ? id : tm;
  syncFlow(d);
}
export function back(d: State) {
  const prev = d.stack.pop();
  if (prev) go(d, prev, { back: true });
}

/* ---------- Fluxos guiados ----------
   Cada passo: [tela, destaque, texto do painel]. Tocar no destaque avança;
   se a pessoa navegar por outro caminho, o guia procura adiante o passo da tela atual. */
export const FLOWS: Record<number, { t: string; r: string; steps: [string, string | null, string][] }> = {
  1: { t: 'Scout avalia um atleta', r: 'Início, Cadastrar, Novo atleta, Nova avaliação, Relatório', steps: [
    ['scout-home', 'tab:cadastrar', 'Toque em Cadastrar'],
    ['cadastrar', 'go:novo', 'Escolha Novo atleta'],
    ['novo', 'novo-salvar', 'Confira os dados e cadastre'],
    ['novo-ok', 'avaliar-novo', 'Avalie o atleta agora'],
    ['aval-1', 'aval-2', 'Informe o jogo observado'],
    ['aval-2', 'aval-3', 'Dê as notas de 1 a 10'],
    ['aval-3', 'aval-salvar', 'Escreva as observações e salve'],
    ['rel', null, 'Relatório pronto para compartilhar']] },
  2: { t: 'Scout busca e compara', r: 'Buscar, Filtros, Perfil, Adicionar à lista, Etapa, Comparar', steps: [
    ['buscar', 'go:filtros', 'Abra os filtros'],
    ['filtros', 'aplicar', 'Ajuste os filtros e aplique'],
    ['buscar', 'resultado', 'Abra um perfil'],
    ['perfil', 'lista-sheet', 'Adicione a uma lista'],
    ['perfil', 'tab:listas', 'Vá para Listas'],
    ['listas', 'lista:acomp', 'Abra Em acompanhamento'],
    ['lista-det', 'comparar', 'Marque 2 ou 3 atletas e compare'],
    ['compare', null, 'Comparação lado a lado']] },
  3: { t: 'Atleta se cadastra', r: 'Perfil, Dados e idade, Responsável quando necessário, Documentos, Análise, Verificado', steps: [
    ['welcome', 'comecar', 'Toque em Começar'],
    ['escolha', 'role:atleta', 'Escolha Atleta'],
    ['at-1', 'at-next1', 'Preencha os dados e a data de nascimento'],
    ['at-2', 'at-next2', 'Cadastre o responsável'],
    ['at-3', 'at-enviar', 'Anexe os documentos e envie'],
    ['at-4', 'at-aprovar', 'Simule a aprovação da equipe'],
    ['at-ok', 'at-perfil', 'Perfil verificado'],
    ['at-perfil', null, 'Atleta visível na busca']] },
  4: { t: 'Agente responde contato', r: 'Pedidos, Detalhe, Aceitar, Compartilhar perfil, Notificação do scout', steps: [
    ['ag-home', 'tab:pedidos', 'Abra Pedidos'],
    ['pedidos', 'pedido:p1', 'Abra o pedido do EC Aurora'],
    ['pedido-det', 'aceitar', 'Aceite o pedido'],
    ['pedido-det', 'compartilhar', 'Compartilhe o perfil'],
    ['compartilhar', 'enviar-vitrine', 'Escolha o destino e envie'],
    ['ag-home', 'ver-scout-notif', 'Veja o aviso chegar ao scout'],
    ['scout-home', null, 'Scout recebe o contato liberado']] },
};

function syncFlow(d: State) {
  const F = d.flow;
  if (!F) return;
  const st = FLOWS[F.n].steps;
  if (st[F.i]?.[0] === d.cur) return;
  for (let j = F.i; j < st.length; j++) if (st[j][0] === d.cur) { F.i = j; return; }
}
/** Destaque que deve piscar agora, ou null. */
export function hintNow(s: State) {
  const F = s.flow;
  if (!F) return null;
  const st = FLOWS[F.n].steps[F.i];
  return st && st[0] === s.cur ? st[1] : null;
}
export function flowDone(s: State) {
  const F = s.flow;
  if (!F) return false;
  const st = FLOWS[F.n].steps, last = st.length - 1;
  return F.i === last && st[last][0] === s.cur;
}
