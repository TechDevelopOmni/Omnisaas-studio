# studio.IA - Handoff de Continuidade

## Objetivo do projeto

Este projeto e uma plataforma SaaS para usuario final criar e gerenciar atendentes de IA.

No estado atual, o foco principal esta na jornada:

- acompanhar a operacao e a conta comercial na rota `/dashboard`;
- criar atendentes na rota `/criaragente`;
- listar atendentes na rota `/agentes`;
- explorar a rota `/Biblioteca` para descobrir agentes por departamento e especialidade;
- configurar conta do cliente final em `/profile-page-view`;
- usar um workflow n8n fixo como template;
- permitir que o usuario final configure apenas os dados funcionais do atendente;
- deixar configuracoes de infraestrutura e credenciais tecnicas sob responsabilidade futura de um perfil administrativo.

## Decisao importante de produto

O projeto deve ser pensado para `usuario final`.

Isso significa que o cliente NAO deve configurar diretamente:

- conta n8n;
- pasta/projeto do n8n;
- credenciais Redis;
- credenciais OpenAI;
- workflow auxiliar de tool;
- publicacao automatica do workflow;
- outros segredos ou ids tecnicos da plataforma.

Esses dados devem viver em uma camada administrativa central da plataforma.

## O que ja foi implementado

### Branding

O projeto foi rebatizado internamente para `studio.IA`.

Arquivos ja atualizados:

- [package.json](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/package.json:2)
- [package-lock.json](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/package-lock.json:2)
- [index.html](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/index.html:7)
- [README.md](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/README.md:1)
- [src/constants/app.constant.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/constants/app.constant.ts:1)

Observacao:

- a pasta raiz do projeto atual e `Studio.IA`.

### Template do workflow n8n

O JSON enviado pelo usuario foi transformado em um template higienizado:

- [src/assets/templates/clinic-attendant-workflow.json](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/assets/templates/clinic-attendant-workflow.json:1)

O que foi feito nesse template:

- remocao de `pinData`;
- remocao de `id`, `versionId` e `meta` do workflow original;
- desativacao inicial do workflow;
- limpeza de tags originais;
- substituicao de credenciais e ids sensiveis por placeholders;
- manutencao da estrutura do fluxo, sem alterar logica funcional.

### Jornada de criacao de atendente

Arquivo principal:

- [src/views/ai-platform/CreateAgent.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/views/ai-platform/CreateAgent.tsx:1)

Estado atual da tela:

- wizard de 4 etapas;
- foco em `atendente para clinica`;
- usuario final preenche:
  - nome do atendente;
  - nome da clinica;
  - descricao;
  - status;
  - tags;
  - conexao WhatsApp/Z-API;
  - prompt principal;
  - mensagem de handoff;
  - janela de memoria;
  - tags de erro/handoff/suporte;
  - memorias/RAGs.

O usuario final NAO preenche mais:

- folderId do n8n;
- projectId do n8n;
- webhook path manual;
- guide workflow id;
- credential id/name de OpenAI;
- credential id/name de Redis;
- publishOnCreate.

### Listagem de atendentes

Arquivo principal:

- [src/views/ai-platform/AgentConfiguration.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/views/ai-platform/AgentConfiguration.tsx:1)

Estado atual:

- a tela deixou de ser uma listagem grande por instancia e passou a priorizar os agentes liberados pelos departamentos contratados;
- se o cliente contratou um departamento com 3 agentes no catalogo, a pagina mostra 3 cards pequenos, um para cada agente liberado;
- ganhou foco comercial e operacional, com CTA para `Biblioteca` e para criacao;
- mostra visao consolidada com:
  - agentes contratados;
  - agentes ja configurados;
  - agentes ativos;
- cada card pequeno exibe:
  - nome do agente;
  - papel do agente;
  - status atual;
  - status de provisionamento;
  - nome da configuracao criada, quando ja existir uma instancia;
  - execucoes estimadas;
  - tokens estimados;
  - taxa de sucesso estimada;
  - tempo medio de resposta estimado;
- quando o agente ainda nao foi configurado, o card continua aparecendo como `Liberado`, com CTA para seguir para a criacao;
- quando o agente ja existe na conta, o card oferece duplicacao e exclusao local;
- essa tela hoje usa correspondencia entre catalogo + assinatura do departamento + agentes persistidos localmente para montar a visao final.

### Dashboard

Arquivos principais:

- [src/views/dashboard/index.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/views/dashboard/index.tsx:1)
- [src/views/ai-platform/UsageDashboard.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/views/ai-platform/UsageDashboard.tsx:1)

Estado atual:

- a antiga visao genérica de uso foi substituida por um painel executivo do cliente final;
- mostra:
  - agentes configurados;
  - departamentos contratados;
  - mensalidade recorrente;
  - agentes em rascunho;
- resume departamentos ativos da conta;
- apresenta proximos passos comerciais e operacionais;
- faz ponte direta para:
  - `Biblioteca`;
  - `Agentes`;
  - `Configuracao da conta`.

### Biblioteca de agentes

Arquivo principal:

- [src/views/Biblioteca/index.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/views/Biblioteca/index.tsx:1)

Estado atual:

- recebeu a apresentacao visual premium em tema escuro;
- deixou de depender apenas de constantes fixas e agora consome um catalogo administravel pela plataforma;
- organiza descoberta de agentes em dois blocos:
  - `Departamentos`
  - `Especialidades`
- a navegacao principal da biblioteca foi simplificada para um estilo horizontal mais escalavel, com separadores em linha entre `Departamentos` e `Especialidades`;
- departamentos atuais:
  - `Marketing`
  - `Comercial`
  - `Atendimento`
  - `Financeiro`
  - `Fiscal`
  - `Administrativo`
  - `RH`
  - `Logistica`
  - `Compras`
  - `TI`
- especialidades atuais:
  - `Juridico`
  - `Engenharia`
- mostra cards com ilustracoes SVG para simbolizar cada agente;
- destaca cards `Disponivel` vs `Em breve`;
- agora a liberacao comercial da biblioteca considera assinatura por categoria;
- quando o cliente contrata um departamento, os agentes daquela categoria passam a ficar liberados visualmente para configuracao;
- a base de departamentos/especialidades e agentes agora pode ser alterada pela area admin por meio do `AdminCatalogService`;
- hoje o catalogo ja esta preparado visualmente, mas a jornada real de criacao continua mais madura no fluxo atual de `/criaragente`.

### Conta do cliente final

Arquivos principais:

- [src/views/layouts/profilepage/Settings.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/views/layouts/profilepage/Settings.tsx:1)
- [src/views/layouts/profilepage/components/SettingsProfile.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/views/layouts/profilepage/components/SettingsProfile.tsx:1)
- [src/views/layouts/profilepage/components/SettingsBilling.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/views/layouts/profilepage/components/SettingsBilling.tsx:1)
- [src/services/ClientAccountService.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/services/ClientAccountService.ts:1)

Estado atual:

- a area de configuracao do cliente final foi simplificada para duas abas:
  - `Dados pessoais`
  - `Pagamento e assinaturas`
- `Dados pessoais` salva:
  - nome completo;
  - empresa;
  - e-mail;
  - celular;
  - CPF/CNPJ;
  - cargo;
- `Pagamento e assinaturas` salva:
  - forma de pagamento basica;
  - resumo da mensalidade recorrente;
  - contratacao/cancelamento por departamento;
- modelo comercial atual:
  - preco fixo de `R$ 299,00` por departamento/categoria;
  - a assinatura ativa libera os agentes daquela categoria na biblioteca;
- a tela passou a ler categorias dinamicas do catalogo administrativo, incluindo preco mensal por categoria;
- toda essa camada ainda opera em `localStorage`, como base de prototipagem comercial do frontend.

### Administracao da plataforma

Arquivos principais:

- [admin-portal/src/App.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/admin-portal/src/App.tsx:1)
- [admin-portal/src/pages/DashboardPage.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/admin-portal/src/pages/DashboardPage.tsx:1)
- [admin-portal/src/pages/DepartmentsPage.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/admin-portal/src/pages/DepartmentsPage.tsx:1)
- [admin-portal/src/pages/AgentsPage.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/admin-portal/src/pages/AgentsPage.tsx:1)
- [admin-portal/src/pages/ClientsPage.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/admin-portal/src/pages/ClientsPage.tsx:1)
- [admin-portal/src/pages/SettingsPage.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/admin-portal/src/pages/SettingsPage.tsx:1)
- [admin-portal/src/api.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/admin-portal/src/api.ts:1)
- [src/services/AdminCatalogService.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/services/AdminCatalogService.ts:1)

Estado atual:

- a administracao foi isolada em um frontend proprio chamado `admin-portal`;
- esse projeto novo vive dentro do mesmo repositorio, mas usa a mesma API `.NET 8` compartilhada;
- o app principal do cliente final deixou de expor rotas e menu administrativos;
- a antiga camada admin embutida no app principal foi descontinuada como ponto de entrada, e o acesso administrativo passa a acontecer pelo projeto separado `admin-portal`;
- no modo mock atual, os acessos de referencia sao:
  - `admin@studioia.com`
  - `suporte@studioia.com`
  - senha `123Qwe`;
- o `admin-portal` possui:
  - login proprio;
  - dashboard interno;
  - gestao de departamentos;
  - gestao de agentes;
  - operacao de clientes;
  - leitura de configuracoes globais da API;
- o `admin-portal` agora conversa diretamente com a API para:
  - autenticar no `POST /api/auth/sign-in`;
  - criar, editar e excluir categorias e agentes do catalogo;
  - editar perfil e pagamento do cliente;
  - ativar e cancelar assinaturas;
  - criar, editar e excluir agentes configurados do cliente;
  - editar configuracoes globais em `PUT /api/admin/platform-settings`;
- o cliente HTTP do `admin-portal` passou a enviar o token da sessao e usa por padrao:
  - `http://localhost:5202/api`;
- o dashboard interno resume:
  - quantidade de categorias do catalogo;
  - quantidade de agentes do catalogo;
  - clientes identificados na base;
  - agentes configurados na plataforma;
- a tela de departamentos permite:
  - criar;
  - editar;
  - excluir;
  - precificar departamentos e especialidades;
- a tela de agentes permite:
  - criar;
  - editar;
  - excluir;
  - marcar disponibilidade de agentes do catalogo;
- a tela de clientes funciona como console de operacao/suporte e permite:
  - visualizar contas encontradas na base local;
  - liberar ou cancelar departamentos para um cliente;
  - criar agente para o cliente pelo login administrativo;
  - editar perfil e forma de pagamento do cliente;
  - editar e excluir agentes da conta do cliente;
- a tela de configuracoes da API deixou de ser apenas leitura e agora salva os dados globais da plataforma direto no backend;

Como rodar o admin isolado:

- entrar em [admin-portal](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/admin-portal)
- executar `npm install`
- executar `npm run dev`
- a API local sobe por padrao em:
  - `http://localhost:5202`

Arquivos do isolamento do admin no app principal:

- [src/auth/AuthProvider.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/auth/AuthProvider.tsx:1)
- [src/configs/routes.config/authRoute.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/configs/routes.config/authRoute.ts:1)
- [src/configs/routes.config/routes.config.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/configs/routes.config/routes.config.ts:1)
- [src/configs/navigation.config/index.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/configs/navigation.config/index.ts:1)
- [src/views/auth/SignIn/SignIn.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/views/auth/SignIn/SignIn.tsx:1)

### Backend .NET 8

Arquivos principais:

- [backend/StudioIA.Api/Program.cs](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/backend/StudioIA.Api/Program.cs:1)
- [backend/StudioIA.Api/Data/StudioIaDbContext.cs](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/backend/StudioIA.Api/Data/StudioIaDbContext.cs:1)
- [backend/StudioIA.Api/Data/DbSeeder.cs](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/backend/StudioIA.Api/Data/DbSeeder.cs:1)
- [backend/StudioIA.Api/Services](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/backend/StudioIA.Api/Services)
- [backend/StudioIA.Api/Controllers](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/backend/StudioIA.Api/Controllers)

Estado atual:

- foi criada uma API nova em `.NET 8` para substituir o mock atual do frontend;
- a API usa:
  - `ASP.NET Core Web API`;
  - `Swagger`;
  - `Entity Framework Core`;
  - `SQLite`;
- a organizacao foi separada em:
  - `Controllers`;
  - `Contracts`;
  - `Data`;
  - `Entities`;
  - `Services`;
- a logica principal ficou centralizada em `Services`, conforme a diretriz do projeto;
- o banco local usa `SQLite` com inicializacao automatica via `EnsureCreated()` no startup;
- existe seed inicial para:
  - usuarios de admin, suporte e cliente;
  - conta demo de cliente;
  - departamentos e especialidades;
  - agentes de catalogo;
  - configuracao base da plataforma;
- o seed foi expandido para um mock mais completo com:
  - `12` categorias;
  - `36` agentes de catalogo;
  - `3` contas de cliente demo;
  - assinaturas ativas/inativas por conta;
  - agentes configurados de exemplo em contas diferentes;
- o Swagger fica habilitado para documentacao e teste da API;
- existe arquivo de exemplos HTTP em:
  - [backend/StudioIA.Api/StudioIA.Api.http](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/backend/StudioIA.Api/StudioIA.Api.http:1)

Endpoints principais disponiveis:

- `POST /api/auth/sign-in`
- `GET/POST/PUT/DELETE /api/admin/catalog/categories`
- `GET/POST/PUT/DELETE /api/admin/catalog/agents`
- `GET /api/client-accounts`
- `GET /api/client-accounts/{clientAccountId}`
- `GET /api/client-accounts/by-user/{userKey}`
- `PUT /api/client-accounts/{clientAccountId}/profile`
- `PUT /api/client-accounts/{clientAccountId}/payment-method`
- `PUT /api/client-accounts/{clientAccountId}/subscriptions`
- `GET/POST/PUT/DELETE /api/client-accounts/{clientAccountId}/configured-agents`
- `GET/PUT /api/admin/platform-settings`
- `POST /api/agents/provision`
- `GET /api/health`

Integracao validada manualmente:

- login administrativo via API;
- leitura de categorias, clientes e settings;
- escrita de `platform-settings`;
- criacao de agente configurado pelo endpoint do cliente, com preenchimento automatico de defaults de `n8nFolderId`, `n8nProjectId` e `libraryCategoryKey` quando o admin nao envia tudo.
- para desenvolvimento local, a API deixou de forcar redirecionamento HTTPS quando `ASPNETCORE_ENVIRONMENT=Development`, evitando falha de CORS/preflight no `admin-portal` rodando em `http://localhost:5175`.

### Gatilhos

Estado atual:

- a rota `/gatilhos` foi removida do produto;
- o item saiu da navegacao principal;
- a tela antiga foi descontinuada para simplificar a experiencia do cliente final e manter foco em:
  - dashboard;
  - biblioteca;
  - agentes;
  - conta/comercial.

### Tipos de dominio

Arquivo principal:

- [src/@types/agents.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/@types/agents.ts:1)

Tipos importantes:

- `ClinicAttendantInput`
- `AgentRecord`
- `AdminPlatformSettings`
- `AgentProvisioningRequest`
- `WorkflowCreatePayload`
- `AgentLibraryCategoryRecord`
- `AgentLibraryCategoryGroupRecord`

### Servico de agentes

Arquivo principal:

- [src/services/AgentService.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/services/AgentService.ts:1)

Responsabilidades atuais:

- carregar o template do workflow;
- aplicar placeholders com dados do usuario e da camada admin;
- injetar prompt e memorias RAG no node `AI Agent`;
- ajustar model e `contextWindowLength`;
- montar payload para provisionamento;
- persistir agentes localmente via `localStorage`;
- listar, duplicar e excluir agentes;
- listar agentes por ownerKey para operacao administrativa;
- atualizar dados basicos de agentes ja configurados;
- preparar chamada para backend real em `POST /agents/provision`.

### Configuracao administrativa central

Arquivo principal:

- [src/services/AdminPlatformSettingsService.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/services/AdminPlatformSettingsService.ts:1)

Estado atual:

- agora ja existe uma primeira camada administrativa para catalogo, operacao e suporte;
- a tela administrativa de infraestrutura global ainda nao existe;
- existe uma camada local que centraliza defaults administrativos;
- hoje ela usa `localStorage` com fallback para valores padrao;
- serve como base para futuramente criar um perfil admin/settings da plataforma.

Campos administrativos atuais:

- `n8n.folderId`
- `n8n.projectId`
- `n8n.guideWorkflowId`
- `n8n.publishOnCreate`
- `credentials.openAiCredentialId`
- `credentials.openAiCredentialName`
- `credentials.redisCredentialId`
- `credentials.redisCredentialName`
- `defaults.webhookPrefix`

## Comportamento atual de persistencia

Hoje existem dois modos praticos:

### Modo mock

Como `enableMock` ainda esta `true` em:

- [src/configs/app.config.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/configs/app.config.ts:10)

o sistema:

- salva atendentes localmente;
- nao provisiona workflow real no n8n;
- marca o atendente como `rascunho-local`.

### Modo backend real

Quando `enableMock` for `false`, o fluxo esperado sera:

1. usuario cria atendente;
2. frontend monta `AgentProvisioningRequest`;
3. frontend envia para `POST /agents/provision`;
4. backend usa conta tecnica do n8n;
5. backend cria novo workflow na pasta/projeto corretos;
6. backend devolve `workflowId` e `workflowUrl`.

Observacao atual:

- o endpoint `POST /api/agents/provision` ja existe na nova API, mas hoje ainda responde como simulacao controlada;
- a proxima evolucao e conectar essa camada ao n8n real e persistir o resultado oficial do provisionamento.

## Referencias oficiais que embasaram a implementacao

Foram usadas as docs oficiais do n8n para guiar o desenho:

- [n8n API](https://docs.n8n.io/api/)
- [n8n managing workflows](https://docs.n8n.io/hosting/oem-deployment/managing-workflows/)

Ponto principal usado:

- duplicar/gerar workflow por JSON no backend, sem expor credenciais do n8n no navegador do usuario final.

## Arquitetura desejada daqui para frente

### Frontend do usuario final

Deve continuar responsavel apenas por:

- capturar configuracoes funcionais do atendente;
- visualizar atendentes criados;
- editar configuracoes funcionais;
- acionar criacao/duplicacao/exclusao.

### Camada administrativa

Agora existe um frontend administrativo separado em `admin-portal`, e ele deve evoluir para gerenciar:

- configuracao global do n8n;
- ids de pasta/projeto;
- credenciais tecnicas;
- prefixes e defaults de webhook;
- mapeamentos compartilhados da plataforma;
- possivel cadastro de templates de workflow.

### Backend

Deve assumir:

- autenticacao com n8n;
- clonagem do template;
- substituicao final dos placeholders;
- criacao/publicacao do workflow;
- persistencia server-side dos atendentes;
- multi-tenant de usuarios e atendentes;
- seguranca de segredos e credenciais.

## Proximos passos recomendados

### Prioridade 1

Conectar o backend novo ao provisionamento real do n8n:

- receber `AgentProvisioningRequest`;
- montar workflow final;
- criar workflow no n8n;
- salvar `workflowId`;
- retornar URL/id para o frontend.

### Prioridade 2

Integrar o frontend atual com a API .NET 8:

- substituir `localStorage` por chamadas HTTP reais;
- centralizar base URL e contratos;
- alinhar autenticacao e estados de sessao.

### Prioridade 3

Expandir o `admin-portal` separado com:

- edicao completa de perfil do cliente;
- edicao de agente configurado;
- controle de permissao por modulo;
- analytics de operacao.

### Prioridade 4

Criar uma tela/admin para editar os dados de infraestrutura da plataforma:

- `AdminPlatformSettingsService`

Isso pode virar algo como:

- `/admin/platform-settings`

### Prioridade 5

Persistir definitivamente agentes no backend em vez de `localStorage`.

Hoje o armazenamento local funciona bem para prototipagem, mas nao e o desenho final.

### Prioridade 6

Trocar a simulacao local de conta, pagamento e assinaturas por stack real:

- backend de conta do cliente;
- persistencia server-side de perfil e billing;
- gateway de pagamento real;
- webhooks de cobranca;
- trilha de assinatura, cancelamento e inadimplencia;
- regras de acesso por departamento no backend.

### Prioridade 7

Trocar a operacao administrativa local por stack real:

- cadastro de clientes vindo do backend;
- perfis reais de `admin` e `support`;
- auditoria de alteracoes feitas pela equipe interna;
- permissao granular por modulo administrativo.

### Prioridade 8

Criar edicao real de atendente:

- carregar dados de um agente existente;
- alterar prompt, tags, memorias e conexao;
- reprovisionar workflow se necessario.

### Prioridade 9

Expandir o fluxo de criacao para os novos cards/categorias da biblioteca:

- Marketing;
- Comercial;
- Atendimento;
- Financeiro;
- Fiscal;
- Administrativo;
- RH;
- Logistica;
- Compras;
- TI;
- Juridico;
- Engenharia;
- adaptar `/criaragente` para receber template/categoria dinamica, sem ficar preso ao formulario especifico de clinica.

### Prioridade 10

Limpar debitos antigos do projeto:

- erros de lint fora da area implementada;
- encoding quebrado em alguns arquivos antigos;
- telas/template legado nao usadas;
- mocks ainda ativos por padrao.

## Riscos e observacoes importantes

### Seguranca

Nao colocar credenciais do n8n, Redis ou OpenAI diretamente no frontend do usuario final.

Tambem nao manter em frontend real:

- dados sensiveis completos de cartao;
- regras de autorizacao comercial;
- controle oficial de assinatura/pagamento.

### Escalabilidade

Cada usuario pode criar `N` atendentes. O backend deve modelar isso claramente:

- `user`
- `agent`
- `agent configuration`
- `n8n workflow id`

### Template fixo

A diretriz atual e:

- nao alterar a estrutura do fluxo;
- alterar apenas configuracoes.

Se no futuro surgirem novos tipos de atendente, o ideal e manter:

- varios templates fixos;
- uma camada de configuracao por template.

## Estado de verificacao no momento deste handoff

Arquivos novos/alterados dessa funcionalidade:

- estao compilando;
- passaram no lint focado desses arquivos.

Ultimo status validado:

- `npm run build` passou;
- `npx eslint` passou nos arquivos da feature.

## Como retomar em chats futuros

Se um proximo chat precisar continuar daqui, use este roteiro:

1. Ler este arquivo primeiro.
2. Abrir:
- [backend/StudioIA.Api/Program.cs](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/backend/StudioIA.Api/Program.cs:1)
- [backend/StudioIA.Api/Data/StudioIaDbContext.cs](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/backend/StudioIA.Api/Data/StudioIaDbContext.cs:1)
- [backend/StudioIA.Api/Data/DbSeeder.cs](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/backend/StudioIA.Api/Data/DbSeeder.cs:1)
- [backend/StudioIA.Api/Services](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/backend/StudioIA.Api/Services)
- [admin-portal/src/App.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/admin-portal/src/App.tsx:1)
- [src/views/ai-platform/CreateAgent.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/views/ai-platform/CreateAgent.tsx:1)
- [src/views/ai-platform/AgentConfiguration.tsx](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/views/ai-platform/AgentConfiguration.tsx:1)
- [src/services/AgentService.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/services/AgentService.ts:1)
- [src/services/AdminPlatformSettingsService.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/services/AdminPlatformSettingsService.ts:1)
- [src/@types/agents.ts](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/@types/agents.ts:1)
- [src/assets/templates/clinic-attendant-workflow.json](D:/Source Codex/01- Produtos OmniSaaS/Studio.IA/src/assets/templates/clinic-attendant-workflow.json:1)
3. Confirmar se o foco sera:
  - backend de provisionamento;
  - stack real de conta e billing;
  - stack real de administracao e suporte;
  - perfil administrativo;
  - persistencia real;
  - edicao de atendente;
   - expansao do catalogo por departamento/especialidade;
   - novos templates.
