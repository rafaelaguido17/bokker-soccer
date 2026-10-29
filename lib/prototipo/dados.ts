// Dados fictícios e regras do protótipo navegável do Book Soccer.

export type AttrKey = 'passe' | 'drible' | 'final' | 'vel' | 'res' | 'forca' | 'pos' | 'leitura' | 'marc' | 'dec' | 'conc' | 'lid';
export type Hist = [periodo: string, clube: string, categoria: string];

export interface Obs { d: string; j: string; n: number; por: string }

export interface Atleta {
  id: string; nome: string; idade: number; nasc: string;
  pos: string; posF: string; pe: string; alt: number; peso: number;
  clube: string; cat: string; cidade: string; uf: string;
  verificado: boolean;
  a: Partial<Record<AttrKey, number>>;
  obs: Obs[];
  hist: Hist[];
}

export const ATTRS: { k: AttrKey; n: string; g: string }[] = [
  { k: 'passe', n: 'Passe', g: 'Técnicos' }, { k: 'drible', n: 'Drible', g: 'Técnicos' }, { k: 'final', n: 'Finalização', g: 'Técnicos' },
  { k: 'vel', n: 'Velocidade', g: 'Físicos' }, { k: 'res', n: 'Resistência', g: 'Físicos' }, { k: 'forca', n: 'Força', g: 'Físicos' },
  { k: 'pos', n: 'Posicionamento', g: 'Táticos' }, { k: 'leitura', n: 'Leitura de jogo', g: 'Táticos' }, { k: 'marc', n: 'Marcação', g: 'Táticos' },
  { k: 'dec', n: 'Decisão', g: 'Mentais' }, { k: 'conc', n: 'Concentração', g: 'Mentais' }, { k: 'lid', n: 'Liderança', g: 'Mentais' },
];
export const GROUPS = ['Técnicos', 'Físicos', 'Táticos', 'Mentais'];
export const POSICOES = ['Goleiro', 'Zagueiro', 'Lateral', 'Volante', 'Meia', 'Ponta', 'Centroavante'];
export const PES = ['Destro', 'Canhoto', 'Ambidestro'];
export const CARTEIRA = ['davi', 'lucas', 'enzo'];
export const ETAPAS = ['Observando', 'Interesse', 'Contato', 'Fechado', 'Descartado'];
export const ETAPA_COR: Record<string, string> = { Observando: '', Interesse: 'g', Contato: 'g', Fechado: 'g', Descartado: 'r' };
export const DESTINOS = [{ n: 'Helena Duarte', c: 'Real Várzea FC' }, { n: 'Rogério Silva', c: 'Academia Litoral' }, { n: 'Marcos Tavares', c: 'EC Aurora' }];
export const UFS = ['Todas', 'SP', 'MG', 'PR', 'PE', 'RS'];

// O protótipo usa uma data fixa de demonstração para as idades não mudarem com o tempo
export const HOJE = { ano: 2026, mes: 10, dia: 29, iso: '2026-10-29' };

export const fmt = (n: number | null | undefined) => (n == null ? '–' : n.toFixed(1).replace('.', ','));
export const avg = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
export const metros = (cm: number) => (cm / 100).toFixed(2).replace('.', ',');
export const primeiro = (nome: string) => nome.trim().split(/\s+/)[0] || nome;

export function ageOf(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  if (!y || !m || !d) return 0;
  let a = HOJE.ano - y;
  if (HOJE.mes < m || (HOJE.mes === m && HOJE.dia < d)) a--;
  return a;
}
export const isMenor = (iso: string) => ageOf(iso) < 18;

export function initials(nome: string) {
  const p = nome.trim().split(/\s+/);
  return ((p[0]?.[0] ?? '') + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
}

export function ov(a: Atleta) {
  const v = Object.values(a.a) as number[];
  return v.length ? avg(v) : null;
}
export const gavg = (v: Partial<Record<AttrKey, number>>, g: string) => avg(ATTRS.filter(x => x.g === g).map(x => v[x.k] ?? 0));

const JOGOS = ['vs Portuária AA · Sub-17', 'vs Real Várzea FC · Sub-17', 'vs Tupã FC · Sub-17', 'vs Academia Litoral · Sub-17'];
const DATAS = ['12/08', '05/09', '03/10'];

function mk(id: string, nome: string, idade: number, nasc: string, pos: string, posF: string, pe: string, alt: number, peso: number,
  clube: string, cat: string, cidade: string, uf: string, vals: number[], nObs: number, prev: Hist[]): Atleta {
  const a = Object.fromEntries(ATTRS.map((x, i) => [x.k, vals[i]])) as Record<AttrKey, number>;
  const o = avg(vals);
  const obs: Obs[] = [];
  for (let i = 0; i < nObs; i++) {
    const n = i === nObs - 1 ? o : o - (nObs - 1 - i) * 0.3;
    obs.push({ d: DATAS[3 - nObs + i], j: JOGOS[(i + 1) % 4], n: Math.round(n * 10) / 10, por: 'Marcos Tavares' });
  }
  return { id, nome, idade, nasc, pos, posF, pe, alt, peso, clube, cat, cidade, uf, verificado: true, a, obs, hist: [['2025 – hoje', clube, cat], ...prev] };
}

export function buildAtletas(): Atleta[] {
  return [
    mk('davi', 'Davi Ferreira', 17, '12/03/2009', 'Ponta direita', 'Ponta', 'Canhoto', 176, 68, 'Academia Litoral', 'Sub-17', 'Campinas', 'SP', [8, 9, 8, 9, 8, 6, 8, 8, 5, 8, 8, 7], 3, [['2023 – 2025', 'Escolinha Bola de Ouro', 'Sub-15']]),
    mk('lucas', 'Lucas Menezes', 16, '20/02/2010', 'Meia atacante', 'Meia', 'Destro', 172, 63, 'Tupã FC', 'Sub-17', 'Londrina', 'PR', [9, 8, 7, 7, 7, 5, 8, 9, 6, 9, 8, 8], 2, [['2023 – 2025', 'CT Esperança', 'Sub-15']]),
    mk('gabriel', 'Gabriel Andrade', 19, '08/05/2007', 'Zagueiro', 'Zagueiro', 'Destro', 188, 82, 'Real Várzea FC', 'Sub-20', 'Belo Horizonte', 'MG', [6, 4, 4, 7, 8, 9, 9, 8, 9, 8, 9, 9], 3, [['2022 – 2025', 'Minas Futebol Base', 'Sub-17']]),
    mk('pedro', 'Pedro Souza', 18, '30/04/2008', 'Volante', 'Volante', 'Destro', 180, 74, 'Real Várzea FC', 'Sub-20', 'Porto Alegre', 'RS', [7, 5, 5, 7, 9, 8, 8, 8, 9, 7, 8, 8], 2, [['2023 – 2025', 'Sul Soccer Academy', 'Sub-17']]),
    mk('thiago', 'Thiago Rocha', 18, '22/01/2008', 'Lateral esquerdo', 'Lateral', 'Canhoto', 174, 70, 'Portuária AA', 'Sub-20', 'Recife', 'PE', [7, 7, 5, 9, 9, 7, 7, 7, 7, 7, 7, 6], 2, [['2022 – 2025', 'Escolinha Maré Alta', 'Sub-17']]),
    mk('enzo', 'Enzo Barbosa', 16, '15/07/2010', 'Centroavante', 'Centroavante', 'Destro', 184, 76, 'Tupã FC', 'Sub-17', 'Londrina', 'PR', [6, 6, 9, 8, 7, 8, 9, 7, 3, 8, 7, 7], 3, [['2023 – 2025', 'CT Esperança', 'Sub-15']]),
    { id: 'novo', nome: 'Bruno Castro', idade: 17, nasc: '', pos: 'Meia', posF: 'Meia', pe: 'Destro', alt: 175, peso: 0, clube: 'Sem clube', cat: 'Sub-17', cidade: 'Santos', uf: 'SP', verificado: false, a: {}, obs: [], hist: [] },
  ];
}

export interface Filtros { imin: number; imax: number; pos: string[]; pe: string; alt: number; attr: AttrKey | ''; amin: number; uf: string }
export const FDEF: Filtros = { imin: 14, imax: 23, pos: [], pe: 'Todos', alt: 160, attr: '', amin: 7, uf: 'Todas' };

export const sameF = (a: Filtros, b: Filtros) => JSON.stringify(a) === JSON.stringify(b);
export const nFiltros = (f: Filtros) =>
  (f.imin !== 14 || f.imax !== 23 ? 1 : 0) + (f.pos.length ? 1 : 0) + (f.pe !== 'Todos' ? 1 : 0) + (f.alt > 160 ? 1 : 0) + (f.attr ? 1 : 0) + (f.uf !== 'Todas' ? 1 : 0);
export const nomeBusca = (f: Filtros) =>
  `${f.pos.length ? f.pos.join(', ') : 'Todas as posições'} · ${f.imin} a ${f.imax} anos${f.pe !== 'Todos' ? ' · ' + f.pe.toLowerCase() : ''}`;

export function filtrar(atletas: Atleta[], f: Filtros, q: string) {
  const t = q.trim().toLowerCase();
  return atletas.filter(a => a.verificado && a.idade >= f.imin && a.idade <= f.imax
    && (!f.pos.length || f.pos.includes(a.posF)) && (f.pe === 'Todos' || a.pe === f.pe) && a.alt >= f.alt
    && (f.uf === 'Todas' || a.uf === f.uf) && (!f.attr || (a.a[f.attr] ?? 0) >= f.amin)
    && (!t || `${a.nome} ${a.clube} ${a.cidade} ${a.pos}`.toLowerCase().includes(t)));
}
