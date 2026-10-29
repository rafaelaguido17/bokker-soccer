# Book Soccer

Protótipo navegável do Book Soccer, um aplicativo para descobrir, avaliar e acompanhar talentos do futebol (scouting). É uma apresentação web: simula o app no celular, com dados fictícios, para validar telas, fluxos e regras antes do desenvolvimento.

## Como rodar

```bash
npm install
npm run dev
```

Abra http://localhost:3000. No painel ao lado do celular, clique em **Iniciar** em um dos fluxos: o próximo botão a tocar pisca em verde.

## Fluxos de apresentação

1. **Scout avalia um atleta:** cadastra, dá notas de 1 a 10 em 12 atributos e gera o relatório.
2. **Scout busca e compara:** filtros, listas com etapas e comparação lado a lado.
3. **Atleta se cadastra:** a idade é identificada no cadastro; menores de 18 anos cadastram o responsável e a autorização.
4. **Agente responde contato:** aceita o pedido de um scout, compartilha o perfil e o scout recebe o aviso.

## Estrutura

- `app/`: página e layout do Next.js
- `components/prototipo/`: celular, painel, telas (`telas/`) e folhas
- `lib/prototipo/`: dados fictícios, estado, navegação, fluxos guiados e ações
- `public/marca/`: logo e ícone
- `docs/`: escopo, mapa de telas, identidade visual, fluxograma e a versão original em HTML (`docs/referencia/`)

## Em definição

A forma de análise dos cadastros ainda será discutida de acordo com as regras de negócio. No protótipo, a aprovação é simulada. Veja os pontos em aberto em [docs/01-escopo.md](docs/01-escopo.md).
