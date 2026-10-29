# Book Soccer — Escopo (rascunho 1)

## Decisões já tomadas

- **Usuários do dia a dia:** olheiro/scout e agente/empresário.
- **Cadastro de atletas:** feito pelo scout/agente **e** pelo próprio atleta.
- **Plataforma do protótipo:** apenas aplicativo (celular).

## Perfis

| Perfil | O que faz no app |
|---|---|
| **Scout** | Cadastra e avalia atletas, escreve relatórios, busca com filtros, monta listas de interesse |
| **Agente** | Mantém sua carteira de atletas, compartilha perfis (vitrine), busca atletas e scouts |
| **Atleta** | Cria o próprio perfil, sobe vídeos, acompanha quem viu seu perfil |
## Módulos e funcionalidades

### 1. Perfil do atleta
- Dados: nome, data de nascimento (idade calculada), posição principal e secundárias, pé dominante, altura, peso, clube atual, categoria, cidade/estado
- Fotos e vídeos (lances, jogos)
- Histórico de clubes
- Selo de origem: **cadastrado por scout/agente** ou **cadastrado pelo atleta**
- Menores de idade: dados do responsável e consentimento

### 2. Avaliação técnica
- Atributos agrupados: técnicos, físicos, táticos e mentais, cada um com nota
- Avaliação ligada a um jogo/observação (data, adversário, local)
- Observações em texto livre

### 3. Relatórios
- Relatório por observação (um jogo)
- Resumo consolidado do atleta (média dos atributos e evolução no tempo)
- Compartilhar/exportar (PDF ou link)

### 4. Busca e filtros
- Filtros: idade, posição, pé dominante, altura, atributos mínimos, região, categoria, origem do cadastro
- Ordenação e salvar buscas

### 5. Listas e acompanhamento
- Favoritos e listas personalizadas
- Comparar atletas lado a lado
- Etapas de acompanhamento: observando → interesse → contato → descartado/fechado

### 6. Agente: carteira e vitrine
- Carteira de atletas representados
- Compartilhar perfil com scouts/clubes
- Pedidos de contato recebidos

### 7. Atleta: autocadastro
- Criar perfil, subir vídeos, editar dados
- Ver quem visualizou o perfil
- Perfil com status de verificação

### 8. Conta e configurações
- Login e escolha do perfil (scout, agente, atleta)
- Notificações
- Privacidade (o que fica visível e para quem)

## Regras definidas

- **Notas:** escala de 1 a 10 em todos os atributos.
- **Menores de idade:** exigem cadastro do responsável e envio de um documento de autorização. Sem isso, o perfil não é ativado.
- **Contato:** apenas "solicitar contato" (sem chat). O destinatário aceita ou recusa.
- **Atleta autocadastrado:** só aparece na busca depois de verificado.
- **Quem verifica:** a equipe do Book Soccer. A forma de análise ainda será definida.
- **Prazo:** até 2 dias úteis, definido só para atletas menores de idade.
- **O que é verificado:** identidade, idade e, para menores, a autorização do responsável.
- **Atletas cadastrados por scout/agente:** também passam pela verificação.
- **Pedido de contato:** quem recebe vê o nome do scout, o clube e uma mensagem curta.
- **Scouts e agentes também são verificados:** a equipe confere identidade e vínculo com o clube (scout) ou registro de intermediário (agente). Até a aprovação, a conta usa o app normalmente, mas não vê perfis de menores.

## Pontos em aberto

1. **Forma de análise dos cadastros:** quem analisa, como confere os documentos e com quais ferramentas.
2. **Prazo de análise** para maiores de idade, scouts e agentes.
