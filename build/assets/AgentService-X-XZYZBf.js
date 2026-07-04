import{c as b}from"./createUid-DVin_cj3.js";import"./index-DEEr60I9.js";const y="Atendimento DTI | ChatBot",_=[{parameters:{operation:"push",list:"={{ $('Edit Fields2').item.json.telefone }}",messageData:"={{ $json.mensagem }}",tail:!0},id:"00a299d8-c664-40c7-a570-e71878d67b19",name:"Redis",type:"n8n-nodes-base.redis",typeVersion:1,position:[-2960,1184],credentials:{redis:{id:"__REDIS_CREDENTIAL_ID__",name:"__REDIS_CREDENTIAL_NAME__"}}},{parameters:{operation:"get",key:"={{ $('Edit Fields2').item.json.telefone }}",options:{}},id:"907af193-d3f2-4860-a13e-d4a76be74a4e",name:"Redis1",type:"n8n-nodes-base.redis",typeVersion:1,position:[-2512,1184],credentials:{redis:{id:"__REDIS_CREDENTIAL_ID__",name:"__REDIS_CREDENTIAL_NAME__"}}},{parameters:{assignments:{assignments:[{id:"37f63b88-4a52-4421-aa95-db9114e521bc",name:"listaMensagens",value:"={{ $json.propertyName.join(', ') }}",type:"string"}]},options:{}},id:"20601db8-bffe-4e85-94e8-5ea417e01662",name:"Edit Fields1",type:"n8n-nodes-base.set",typeVersion:3.4,position:[-2288,1184]},{parameters:{method:"POST",url:"=https://api.z-api.io/instances/__ZAPI_INSTANCE_ID__/token/__ZAPI_INSTANCE_TOKEN__/send-text",sendHeaders:!0,headerParameters:{parameters:[{name:"client-token",value:"__ZAPI_CLIENT_TOKEN__"}]},sendBody:!0,bodyParameters:{parameters:[{name:"phone",value:"={{ $('Webhook').item.json.body.phone }}"},{name:"message",value:"={{ $json.text }}"}]},options:{}},id:"1991ecc0-7294-4c11-8a99-2731313b9f58",name:"Responde texto",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[448,192]},{parameters:{operation:"delete",key:"={{ $('Edit Fields2').item.json.telefone }}"},id:"fef40ef5-641d-41ad-b025-fcf69036e0a4",name:"Redis2",type:"n8n-nodes-base.redis",typeVersion:1,position:[-2064,1184],credentials:{redis:{id:"__REDIS_CREDENTIAL_ID__",name:"__REDIS_CREDENTIAL_NAME__"}}},{parameters:{assignments:{assignments:[{id:"664b8a4c-fe27-44c8-8169-e495e7b25266",name:"dataBase",value:"120",type:"string"},{id:"b1cab398-5b2a-47d0-8707-31dd95d02920",name:"chatID",value:"={{ $json.body.chatLid }}",type:"string"},{id:"8d88c137-383f-4307-b3cc-1f6a560ea67b",name:"telefone",value:"={{ $json.body.phone }}",type:"string"},{id:"7e2f520e-4952-425b-82ca-792cc46680d4",name:"mensagem",value:"={{ $json.body.text.message }}",type:"string"},{id:"f9545aa6-694a-4637-bde8-1b73b508a2db",name:"chatName",value:"={{ $json.body.chatName }}",type:"string"},{id:"5904d3c0-9810-4478-ab31-2eaa03615a2b",name:"senderName",value:"={{ $json.body.senderName }}",type:"string"},{id:"b91e9187-4e17-49f4-a2fb-ad627c84e9d6",name:"body.image",value:"={{ $json.body.image }}",type:"object"},{id:"b91a1aa7-3770-4812-8e40-54f221186d2d",name:"body.audio",value:"={{ $json.body.audio }}",type:"object"}]},options:{}},id:"e718f565-4807-4abe-9ab0-d4f665a3fd99",name:"Edit Fields2",type:"n8n-nodes-base.set",typeVersion:3.4,position:[-4752,1152]},{parameters:{assignments:{assignments:[{id:"3c5ccbc9-69d1-4b13-a7c3-e6945bc8c655",name:"mensagem",value:"={{ $json.body.audio.audioUrl }}",type:"string"}]},options:{}},id:"480c0a25-7c40-4218-8a84-3809aa9cf248",name:"Edit Fields",type:"n8n-nodes-base.set",typeVersion:3.4,position:[-3856,1184]},{parameters:{assignments:{assignments:[{id:"3c5ccbc9-69d1-4b13-a7c3-e6945bc8c655",name:"data",value:"={{ $('Webhook').item.json.body.data.message.base64 }}",type:"string"},{id:"6de6c8b9-02a5-4c03-9dbe-a87ddccac729",name:"body.image.imageUrl",value:"={{ $json.body.image.imageUrl }}",type:"string"}]},options:{}},id:"3bf90488-a861-49ef-a12c-be8ce68e844e",name:"Edit Fields3",type:"n8n-nodes-base.set",typeVersion:3.4,position:[-3856,1376]},{parameters:{rules:{values:[{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:1},conditions:[{id:"52aaf749-fe4f-44e4-880e-15b2bfc027f1",leftValue:`={{ $('Webhook').item.json["body"]["data"]["messageType"] }}`,rightValue:"extendedTextMessage",operator:{type:"string",operation:"equals",name:"filter.operator.equals"}}],combinator:"and"},renameOutput:!0,outputKey:"text"},{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:1},conditions:[{id:"e514e613-fd6a-48bd-b0ae-bae2448c810e",leftValue:"={{ $('Webhook').item.json.body.text }}",rightValue:"conversation",operator:{type:"object",operation:"exists",singleValue:!0}}],combinator:"and"},renameOutput:!0,outputKey:"text"},{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:1},conditions:[{leftValue:"={{ $('Webhook').item.json.body.audio }}",rightValue:"audioMessage",operator:{type:"object",operation:"exists",singleValue:!0},id:"4c1ea925-f690-4315-93c1-08b2ae7762d3"}],combinator:"and"},renameOutput:!0,outputKey:"audio"},{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:1},conditions:[{id:"c0e434dd-1268-421d-b81b-3a5e90ed9550",leftValue:"={{ $('Webhook').item.json.body.image }}",rightValue:"imageMessage",operator:{type:"object",operation:"exists",singleValue:!0}}],combinator:"and"},renameOutput:!0,outputKey:"image"},{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:1},conditions:[{id:"ead847ea-debe-4c53-bc85-e658f6f79321",leftValue:"={{ $('Webhook').item.json.body.document }}",rightValue:"url",operator:{type:"object",operation:"exists",singleValue:!0}}],combinator:"and"},renameOutput:!0,outputKey:"document"}]},options:{}},id:"8463c1ae-e250-41f5-bf4b-16063b2e3325",name:"Switch",type:"n8n-nodes-base.switch",typeVersion:3,position:[-4080,1232]},{parameters:{rules:{values:[{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{id:"84b6e91c-5e7c-4604-8609-f8a0e6fa8b01",leftValue:"={{ $json.text }}",rightValue:".wav,. mp3, .mov, .mkv, .pdf, .jpeg, .jpg, .png, .webp",operator:{type:"string",operation:"notContains"}}],combinator:"and"},renameOutput:!0,outputKey:"texto"},{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{leftValue:"={{ $json.text.match(/https:\\/\\/.*\\.(jpeg|jpg|png|webp)/g) != null }}",rightValue:"https",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},renameOutput:!0,outputKey:"imagem"},{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{id:"7e5907c4-8b5b-4803-b269-3c1453efee15",leftValue:"={{ $json.text.match(/https:\\/\\/.*\\.(pdf)/g) != null }}",rightValue:"",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},renameOutput:!0,outputKey:"pdf"},{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{id:"220dfbb2-989f-466f-978c-8a5d76410ddb",leftValue:"={{ $json.text.match(/https:\\/\\/.*\\.(wav|mp3|mov|mkv)/g) != null }}",rightValue:"video",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},renameOutput:!0,outputKey:"video"}]},options:{}},id:"53d40014-76fa-4909-b97b-a0d39d76b57b",name:"Switch1",type:"n8n-nodes-base.switch",typeVersion:3.2,position:[224,160]},{parameters:{method:"POST",url:"=seu endpoint",sendHeaders:!0,headerParameters:{parameters:[{name:"apikey",value:"sua api"}]},sendBody:!0,specifyBody:"json",jsonBody:`=
{
    "number": "{{ $('Webhook').item.json["body"]["data"]["key"]["remoteJid"] }}",
    "options": {
        "delay": 1200,
        "presence": "composing"
    },
    "mediaMessage": {
        "mediatype": "image",
        "caption": "This is an example JPG image file sent by Evolution-API via URL.",
        "media": "https://evolution-api.com/files/evolution-api.jpg"
    }
}`,options:{}},id:"5d172dcd-39cb-481e-9e18-fd4a0f1f46b7",name:"Responde imagem",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[448,384]},{parameters:{method:"POST",url:"=seu endpoint",sendHeaders:!0,headerParameters:{parameters:[{name:"apikey",value:"sua api"}]},sendBody:!0,specifyBody:"json",jsonBody:`={
    "number": "{{ $('Webhook').item.json["body"]["data"]["key"]["remoteJid"] }}",
    "options": {
        "delay": 1200,
        "presence": "composing",
        "linkPreview": false
    },
    "textMessage": {
        "text": "{{ $('Envia ao Flowise texto').item.json["text"].replace(/\\n/g, "\\\\n").replace(/['"]/g, '') }}"

    }
}`,options:{}},id:"2a0229c7-f655-472f-94ab-ba115a6f64ef",name:"Responde pdf",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[448,576]},{parameters:{method:"POST",url:"=seu endpoint",sendHeaders:!0,headerParameters:{parameters:[{name:"apikey",value:"sua api"}]},sendBody:!0,specifyBody:"json",jsonBody:`={
    "number": "{{ $('Webhook').item.json["body"]["data"]["key"]["remoteJid"] }}",
    "options": {
        "delay": 1200,
        "presence": "composing",
        "linkPreview": false
    },
    "textMessage": {
        "text": "{{ $('Envia ao Flowise texto').item.json["text"].replace(/\\n/g, "\\\\n").replace(/['"]/g, '') }}"

    }
}`,options:{}},id:"0d21e461-2dda-4117-9fa2-72335454dd6b",name:"Responde vídeo",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[448,768]},{parameters:{assignments:{assignments:[{id:"50cebc66-2dbc-4c7a-a09e-83ffb0f52991",name:"mensagem",value:"={{ $('Edit Fields2').item.json.mensagem }}",type:"string"}]},options:{}},id:"42c9c639-ea48-4bbc-abbd-9da23dbbbd9b",name:"Edit Fields4",type:"n8n-nodes-base.set",typeVersion:3.4,position:[-3184,992]},{parameters:{assignments:{assignments:[{id:"a1e66db0-00dc-481d-951c-1fde558e268e",name:"text",value:"={{ $json.outputLimpo.split('\\n\\n') }}",type:"array"}]},options:{}},id:"bc5f351c-626a-4df1-b453-555c1763c9f1",name:"Edit Fields5",type:"n8n-nodes-base.set",typeVersion:3.4,position:[-672,560]},{parameters:{fieldToSplitOut:"text",options:{}},id:"c4c8aa4b-ed96-454c-93ab-09f07cd62c98",name:"Split Out",type:"n8n-nodes-base.splitOut",typeVersion:1,position:[-448,560]},{parameters:{options:{}},id:"70fa423e-da47-4d59-8cbc-9ca172968f0e",name:"Loop Over Items",type:"n8n-nodes-base.splitInBatches",typeVersion:3,position:[-224,560]},{parameters:{},id:"8b14722c-391f-445a-971a-5ca00f596d1d",name:"Replace Me",type:"n8n-nodes-base.noOp",typeVersion:1,position:[0,0]},{parameters:{amount:1},id:"c2552606-6470-43ac-84bc-4c8a715477e6",name:"Wait1",type:"n8n-nodes-base.wait",typeVersion:1.1,position:[0,192]},{parameters:{resource:"audio",operation:"transcribe",options:{}},id:"0207cb83-a2de-4dd4-8268-9963cad85d7f",name:"OpenAI",type:"@n8n/n8n-nodes-langchain.openAi",typeVersion:1.6,position:[-3408,1184],credentials:{openAiApi:{id:"__OPENAI_CREDENTIAL_ID__",name:"__OPENAI_CREDENTIAL_NAME__"}}},{parameters:{resource:"image",operation:"analyze",modelId:{__rl:!0,value:"gpt-4o-mini",mode:"list",cachedResultName:"GPT-4O-MINI"},text:"Descreva todo o conteudo da imagem. Responda sem acento, sem hifens",inputType:"base64",options:{}},id:"07213956-741d-4df7-a5ed-87dd8a0cff52",name:"OpenAI1",type:"@n8n/n8n-nodes-langchain.openAi",typeVersion:1.6,position:[-3408,1376],credentials:{openAiApi:{id:"__OPENAI_CREDENTIAL_ID__",name:"__OPENAI_CREDENTIAL_NAME__"}}},{parameters:{model:"gpt-4o-mini",options:{frequencyPenalty:0,maxTokens:1300,responseFormat:"text",temperature:0,topP:1}},id:"0c734164-8b4c-4763-8ccb-203e771b4c44",name:"OpenAI Chat Model",type:"@n8n/n8n-nodes-langchain.lmChatOpenAi",typeVersion:1,position:[-1920,1600],credentials:{openAiApi:{id:"__OPENAI_CREDENTIAL_ID__",name:"__OPENAI_CREDENTIAL_NAME__"}}},{parameters:{httpMethod:"POST",path:"__WEBHOOK_PATH__",options:{}},id:"434f3efd-63cf-422e-ac2f-fada98ac22b2",name:"Webhook",type:"n8n-nodes-base.webhook",typeVersion:2,position:[-4976,1152]},{parameters:{promptType:"define",text:`={{$json.listaMensagens.replace(/\\n/g, "\\\\n").replace(/['"]/g, '')}}`,options:{systemMessage:`=PROMPT – ATENDIMENTO AUTOMÁTICO DTI DIGITAL

Você é o assistente virtual oficial do DTI Digital.

Seu papel é atender solicitações simples e recorrentes, exclusivamente por menus numéricos, seguindo rigorosamente o fluxo definido abaixo.

Você NÃO conversa livremente, NÃO responde perguntas institucionais, NÃO fornece horário, contato, status ou informações fora do menu, e NÃO improvisa fluxos.

════════════════════════════════════
MODELO DE ATENDIMENTO
════════════════════════════════════
- Atendimento 100% orientado por menus numéricos
- Texto livre do usuário é aceito apenas para identificar a intenção inicial
- Após identificar a intenção, sempre convergir para menus
- Sempre exigir resposta numérica
- Nunca avançar sem escolha válida
- Em erro, reapresentar o menu atual
- Sempre oferecer opção de voltar e encerrar
- Se o atendimento for encerrado e o usuário voltar a falar, reiniciar no MENU PRINCIPAL

════════════════════════════════════
NAVEGAÇÃO (ANTI-TRAVAMENTO)
════════════════════════════════════
1) Estado do menu:
- Considere sempre que existe um MENU_ATUAL (último menu exibido).
- Toda resposta numérica do usuário deve ser interpretada dentro do MENU_ATUAL.

2) Entradas válidas:
- Aceite como escolha válida apenas: 0, 1, 2, 3, 4, 5, 9.
- Se o usuário digitar "1.1", "1.2", "1.1.3" ou similar:
  - Interpretar apenas o ÚLTIMO número após o último ponto.
  - Exemplo: "1.1.3" → considerar "3".

3) Texto livre durante menus:
- Se o usuário enviar texto livre enquanto um MENU_ATUAL estiver ativo:
  - Não explicar.
  - Reapresentar o MENU_ATUAL.
  - Solicitar: "Responda apenas com o número da opção."

4) Voltar e Encerrar:
- 0️⃣ Voltar → retorna ao menu imediatamente anterior.
- 9️⃣ Encerrar → encerra atendimento imediatamente.

5) Opção inválida:
- Se a opção não existir no MENU_ATUAL:
  - Informar "Opção inválida."
  - Reapresentar o MENU_ATUAL.

════════════════════════════════════
REGRAS GERAIS (OBRIGATÓRIAS)
════════════════════════════════════
- Não usar emojis, exceto emojis numéricos
- Não usar a palavra “Banco”
- Sempre usar “DTI Digital”
- Linguagem formal, objetiva e direta
- Não criar explicações fora do fluxo
- Não inventar opções, fluxos ou guias

════════════════════════════════════
DEFINIÇÃO IMPORTANTE
════════════════════════════════════
- Escolha de menu NÃO é coleta de informações.
- Coleta de informações ocorre apenas quando solicitar dados operacionais
  (ex.: conta, CPF, valor, limite, nome, dados cadastrais).

════════════════════════════════════
REGRA GLOBAL – COLETA → TAG
════════════════════════════════════
Sempre que um fluxo coletar dados operacionais:
- Após a ÚLTIMA informação solicitada, adicionar TAG e encerrar.
- Regra padrão: <<ADD_TAG:2>>

Exceções:
- Erros → <<ADD_TAG:1>>
- Suporte → <<ADD_TAG:3>>

════════════════════════════════════
USO DE TOOLS (GUIAS)
════════════════════════════════════
Quando uma Tool for acionada:
- NÃO escrever nenhum texto próprio
- NÃO complementar a resposta
- Responder SOMENTE com o conteúdo retornado pela Tool
- Após a Tool, encerrar atendimento

Erro em Tool:
- Informar continuidade por atendente humano
- Adicionar <<ADD_TAG:1>>
- Encerrar atendimento

════════════════════════════════════
TAGS (HANDOFF HUMANO)
════════════════════════════════════
Formato obrigatório:
<<ADD_TAG:X>>

Tags válidas:
- <<ADD_TAG:1>> Erro / Equipe
- <<ADD_TAG:2>> Análise (dados coletados)
- <<ADD_TAG:3>> Responder (Suporte)

É permitido prometer retorno humano pelo mesmo número da conversa.

════════════════════════════════════
GUIAS DISPONÍVEIS (CONTROLADOS)
════════════════════════════════════
guide_key válidos:
- emissao_boleto
- alteracao_baixa_boleto
- primeiro_acesso
- desbloqueio_senha
- cadastro_pagamento
- cadastro_favorecido

Mapeamento rígido:
- Emissão / emitir / gerar boleto / cobrança → emissao_boleto
- Alteração / baixa / cancelamento de boleto → alteracao_baixa_boleto
- Primeiro acesso / primeiro login → primeiro_acesso
- Desbloqueio de senha → desbloqueio_senha
- Cadastro de pagamento → cadastro_pagamento
- Cadastro de favorecido → cadastro_favorecido

Se o usuário pedir “guia”, “tutorial” ou “passo a passo” sem especificar:
- Mostrar menu de guias
- Não chamar Tool

════════════════════════════════════
MENU PRINCIPAL – DTI DIGITAL
════════════════════════════════════
Olá!
Você está falando com o atendimento automático do DTI Digital.
Como posso ajudar?
Responda digitando apenas o número da opção:

1️⃣ Conta
2️⃣ Alteração de Limite
3️⃣ Acessos
4️⃣ Suporte
9️⃣ Encerrar atendimento

════════════════════════════════════
1️⃣ CONTA
════════════════════════════════════
1️⃣ Escrow
2️⃣ Movimento
3️⃣ Abertura
4️⃣ Fechamento
0️⃣ Voltar
9️⃣ Encerrar atendimento

════════════════════════════════════
1.1 ESCROW
════════════════════════════════════
1️⃣ Liberação de Saldo
2️⃣ Cobrança
3️⃣ Cadastro de Favorecido
0️⃣ Voltar
9️⃣ Encerrar atendimento

1.1.1 Liberação de Saldo – Escrow
Perguntar número da conta?  
Valor da transferência?  
depois da resposta ao finalizar a coleta passar na resposta: Em breve alguem do time confirmará a sua solicitação<<ADD_TAG:2>> e encerrar

1.1.2 Cobrança – Escrow
1️⃣ Emissão de boleto  
2️⃣ Alteração de boleto  
3️⃣ Baixa de boleto  
0️⃣ Voltar  
9️⃣ Encerrar atendimento  

Regras:  
Sempre usar Tool  
Nunca coletar dados fora da Tool  
Encerrar após retorno  

1.1.2.1 Emissão de boleto  
→ Chamar get_guide com emissao_boleto  

1.1.2.2 Alteração de boleto  
→ Chamar get_guide com alteracao_baixa_boleto  

1.1.2.3 Baixa de boleto  
→ Chamar get_guide com alteracao_baixa_boleto  

1.1.3 Cadastro de Favorecido – Escrow  
Coletar dados mínimos  
depois da resposta ao finalizar a coleta passar na resposta: Em breve alguem do time confirmará a sua solicitação<<ADD_TAG:2>> e encerrar

════════════════════════════════════
1.2 MOVIMENTO
════════════════════════════════════
1️⃣ Liberação de Saldo
2️⃣ Cobrança
3️⃣ Cadastro de Favorecido
4️⃣ Cadastro Pix
0️⃣ Voltar
9️⃣ Encerrar atendimento

1.2.1 Liberação de Saldo – Movimento
Perguntar número da conta?  
Valor da transferência?  
depois da resposta ao finalizar a coleta passar na resposta: Em breve alguem do time confirmará a sua solicitação<<ADD_TAG:2>> e encerrar

1.2.2 Cobrança – Movimento
1️⃣ Emissão de boleto  
2️⃣ Alteração de boleto  
3️⃣ Baixa de boleto  
0️⃣ Voltar  
9️⃣ Encerrar atendimento  

Regras:  
Sempre usar Tool  
Nunca coletar dados fora da Tool  
Encerrar após retorno  

1.2.2.1 Emissão de boleto  
→ Chamar get_guide com emissao_boleto  

1.2.2.2 Alteração de boleto  
→ Chamar get_guide com alteracao_baixa_boleto  

1.2.2.3 Baixa de boleto  
→ Chamar get_guide com alteracao_baixa_boleto  

1.2.3 Cadastro de Favorecido – Movimento  
Coletar dados mínimos  
depois da resposta ao finalizar a coleta passar na resposta: Em breve alguem do time confirmará a sua solicitação<<ADD_TAG:2>> e encerrar

1.2.4 Cadastro Pix – Movimento  
Coletar informações necessárias  
Ao finalizar a coleta: <<ADD_TAG:2>> e encerrar

════════════════════════════════════
1.3 ABERTURA
════════════════════════════════════
1️⃣ Movimento PF
2️⃣ Movimento PJ
3️⃣ Escrow PJ
0️⃣ Voltar
9️⃣ Encerrar atendimento

1.3.1 Abertura – Movimento PF
Coletar:
- CNH ou RG em PDF dentro da validade
- E-mail válido
- Número de celular
- Comprovante de endereço dos últimos 3 meses
Ao finalizar a coleta: <<ADD_TAG:2>> e encerrar

1.3.2 Abertura – Movimento PJ
Coletar:
- Cartão CNPJ
- Contrato social
- Comprovante de endereço PJ
- Documentos dos sócios:
  - CNH ou RG em PDF dentro da validade
  - E-mail válido
  - Número de celular
  - Comprovante de endereço dos últimos 3 meses
Ao finalizar a coleta: <<ADD_TAG:2>> e encerrar

1.3.3 Abertura – Escrow PJ
Coletar:
- Cartão CNPJ
- Contrato social
- Comprovante de endereço PJ
- Documentos dos sócios:
  - CNH ou RG em PDF dentro da validade
  - E-mail válido
  - Número de celular
  - Comprovante de endereço dos últimos 3 meses
Ao finalizar a coleta: <<ADD_TAG:2>> e encerrar

════════════════════════════════════
1.4 FECHAMENTO
════════════════════════════════════
Coletar:
- Número da conta
- Motivo do encerramento

Informar que não é possível encerrar a conta com tarifas pendentes.

Ao finalizar a coleta: <<ADD_TAG:2>> e encerrar

════════════════════════════════════
2️⃣ ALTERAÇÃO DE LIMITE
════════════════════════════════════
1️⃣ Escrow
2️⃣ Movimento
0️⃣ Voltar
9️⃣ Encerrar atendimento

Para qualquer opção:
Perguntar tipo de conta (PJ ou PF)  
Número da conta  
Operação (boleto, Pix, TED, transferência)  
Limite desejado  
Ao finalizar a coleta: <<ADD_TAG:2>> e encerrar

════════════════════════════════════
3️⃣ ACESSOS
════════════════════════════════════
1️⃣ Primeiro acesso
2️⃣ Cadastro de movimentador
3️⃣ Desbloqueio de senhas
4️⃣ Cadastro de senha eletrônica
0️⃣ Voltar
9️⃣ Encerrar atendimento

3.1 Primeiro acesso  
→ Chamar get_guide com primeiro_acesso  

3.2 Cadastro de movimentador  
Coletar informações  
Ao finalizar a coleta: <<ADD_TAG:2>> e encerrar  

3.3 Desbloqueio de senhas  
→ Chamar get_guide com desbloqueio_senha  

3.4 Cadastro de senha eletrônica  
Coletar informações  
Ao finalizar a coleta: <<ADD_TAG:2>> e encerrar

════════════════════════════════════
4️⃣ SUPORTE
════════════════════════════════════
Informar que o atendimento será realizado pelo WhatsApp oficial do DTI Digital  
Prometer retorno humano  
Encerrar com <<ADD_TAG:3>>

════════════════════════════════════
PROIBIÇÕES ABSOLUTAS
════════════════════════════════════
- Não responder fora do menu
- Não criar novos fluxos
- Não misturar texto com Tool
- Não pular etapas
- Não improvisar
`}},id:"5deafbad-cd97-43cd-a018-f6d37c7a0bf5",name:"AI Agent",type:"@n8n/n8n-nodes-langchain.agent",typeVersion:1.7,position:[-1648,1184]},{parameters:{assignments:{assignments:[{id:"db3c6853-ba8a-4fd9-a5a2-1684f9d5c6ac",name:"telefone",value:"={{ $json.telefone }}",type:"string"}]},options:{}},type:"n8n-nodes-base.set",typeVersion:3.4,position:[-3856,1568],id:"a73f3c80-f00b-4fed-b59e-e188e57d8a50",name:"Edit Fields6"},{parameters:{},type:"n8n-nodes-base.noOp",typeVersion:1,position:[-3632,1568],id:"abfcbbb1-9a33-4ffe-add9-2a6d70d385aa",name:"No Operation, do nothing1"},{parameters:{url:"={{ $json.body.image.imageUrl }}",options:{response:{response:{responseFormat:"file"}}}},type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-3632,1376],id:"932c10dd-9d80-43e2-8538-05a9c1681641",name:"HTTP Request2"},{parameters:{assignments:{assignments:[{id:"ca1d391f-6e99-4a68-aa91-d6f502b041ee",name:"mensagem",value:"={{ $json.content }}",type:"string"}]},options:{}},type:"n8n-nodes-base.set",typeVersion:3.4,position:[-3184,1376],id:"76be8917-a830-46ca-a372-87b5dcbaac3c",name:"Edit Fields7"},{parameters:{url:"={{ $json.mensagem }}",options:{response:{response:{responseFormat:"file"}}}},type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[-3632,1184],id:"5dd39e05-7421-4cfe-a06e-fb2e5eb3cdcf",name:"HTTP Request3"},{parameters:{assignments:{assignments:[{id:"bcd26802-0d6a-487e-88fb-2f973b78afe2",name:"mensagem",value:"={{ $json.text }}",type:"string"}]},options:{}},type:"n8n-nodes-base.set",typeVersion:3.4,position:[-3184,1184],id:"e6ef542a-7e72-48be-be8e-7495457d262c",name:"Edit Fields8"},{parameters:{amount:1},type:"n8n-nodes-base.wait",typeVersion:1.1,position:[-2736,1184],id:"f1d95d64-fa51-4b38-97ef-d14ea8b6fd2a",name:"Wait"},{parameters:{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:3},conditions:[{id:"840d1d5b-646e-4819-a43e-41f5a4763543",leftValue:"={{ Array.isArray($json.tags) && $json.tags.length > 0 }}",rightValue:"",operator:{type:"boolean",operation:"true",singleValue:!0}},{id:"1eff4576-8d29-426f-b0fd-14c3f31e1976",leftValue:"={{ $json.phone }}",rightValue:" 5511939248560",operator:{type:"string",operation:"equals",name:"filter.operator.equals"}},{id:"f2d47ea8-5f4f-4d7f-b2c4-bdf747c66b25",leftValue:"={{ $json.phone }}",rightValue:"5511973017500",operator:{type:"string",operation:"equals",name:"filter.operator.equals"}},{id:"f36129c9-37b2-4edf-ac08-f6f6c0debb99",leftValue:'={{    [     "5511939248560",     "5511973017500" ,     "5515996591475" ,"5511999295744","5511910245774", "5515981110171", "5515991178235","5515996018544", "5515981340044", "5515996393231","5515997385384", "5515996574320","5511992244625" ,"5519997663478","5515997109814","5515996727489","5515997328641","5515996993404","5515988284437","55156196629344" ].includes($json.phone)  }}',rightValue:"",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"or"},options:{}},type:"n8n-nodes-base.if",typeVersion:2.3,position:[-4304,1152],id:"c6c9dca8-5d1e-4ed7-8e4c-028d1c62312a",name:"Verifica se conversa tem tag"},{parameters:{},type:"n8n-nodes-base.noOp",typeVersion:1,position:[-4080,1040],id:"d5250e08-c971-4941-850c-925bdc89f611",name:"No Operation, do nothing"},{parameters:{url:"=https://api.z-api.io/instances/__ZAPI_INSTANCE_ID__/token/__ZAPI_INSTANCE_TOKEN__/chats/{{ $('Edit Fields2').item.json.telefone }}",sendHeaders:!0,headerParameters:{parameters:[{name:"client-token",value:"=__ZAPI_CLIENT_TOKEN__"}]},options:{}},type:"n8n-nodes-base.httpRequest",typeVersion:4.3,position:[-4528,1152],id:"08706c48-fcec-4d33-afd3-a57a2d5d4e27",name:"Z-API - Get chat metadata"},{parameters:{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:3},conditions:[{id:"029715f6-a44e-4c06-9e44-75652acc7ced",leftValue:"={{ typeof $json.output === 'string' && $json.output.includes('<<ADD_TAG:') }}",rightValue:"",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},options:{}},type:"n8n-nodes-base.if",typeVersion:2.3,position:[-1120,1184],id:"8bcef761-262f-4684-a1b0-7a71b3227779",name:"IF - Agente pediu tag?"},{parameters:{method:"POST",url:"=https://api.z-api.io/instances/__ZAPI_INSTANCE_ID__/token/__ZAPI_INSTANCE_TOKEN__/send-text",sendHeaders:!0,headerParameters:{parameters:[{name:"client-token",value:"__ZAPI_CLIENT_TOKEN__"}]},sendBody:!0,bodyParameters:{parameters:[{name:"phone",value:"={{ $('Webhook').item.json.body.phone }}"},{name:"message",value:"={{ $json.text }}"}]},options:{}},id:"dc483521-a772-4df3-90ae-b6c3805cf036",name:"Responde texto1",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[448,1296]},{parameters:{rules:{values:[{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{id:"84b6e91c-5e7c-4604-8609-f8a0e6fa8b01",leftValue:"={{ $json.text }}",rightValue:".wav,. mp3, .mov, .mkv, .pdf, .jpeg, .jpg, .png, .webp",operator:{type:"string",operation:"notContains"}}],combinator:"and"},renameOutput:!0,outputKey:"texto"},{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{leftValue:"={{ $json.text.match(/https:\\/\\/.*\\.(jpeg|jpg|png|webp)/g) != null }}",rightValue:"https",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},renameOutput:!0,outputKey:"imagem"},{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{id:"7e5907c4-8b5b-4803-b269-3c1453efee15",leftValue:"={{ $json.text.match(/https:\\/\\/.*\\.(pdf)/g) != null }}",rightValue:"",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},renameOutput:!0,outputKey:"pdf"},{conditions:{options:{caseSensitive:!0,leftValue:"",typeValidation:"strict",version:2},conditions:[{id:"220dfbb2-989f-466f-978c-8a5d76410ddb",leftValue:"={{ $json.text.match(/https:\\/\\/.*\\.(wav|mp3|mov|mkv)/g) != null }}",rightValue:"video",operator:{type:"boolean",operation:"true",singleValue:!0}}],combinator:"and"},renameOutput:!0,outputKey:"video"}]},options:{}},id:"049bba5c-6943-4165-be73-a1300be1f258",name:"Switch2",type:"n8n-nodes-base.switch",typeVersion:3.2,position:[224,1264]},{parameters:{method:"POST",url:"=seu endpoint",sendHeaders:!0,headerParameters:{parameters:[{name:"apikey",value:"sua api"}]},sendBody:!0,specifyBody:"json",jsonBody:`=
{
    "number": "{{ $('Webhook').item.json["body"]["data"]["key"]["remoteJid"] }}",
    "options": {
        "delay": 1200,
        "presence": "composing"
    },
    "mediaMessage": {
        "mediatype": "image",
        "caption": "This is an example JPG image file sent by Evolution-API via URL.",
        "media": "https://evolution-api.com/files/evolution-api.jpg"
    }
}`,options:{}},id:"6f1a4a21-08f0-4d88-b0e3-57305daee0a7",name:"Responde imagem1",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[448,1488]},{parameters:{method:"POST",url:"=seu endpoint",sendHeaders:!0,headerParameters:{parameters:[{name:"apikey",value:"sua api"}]},sendBody:!0,specifyBody:"json",jsonBody:`={
    "number": "{{ $('Webhook').item.json["body"]["data"]["key"]["remoteJid"] }}",
    "options": {
        "delay": 1200,
        "presence": "composing",
        "linkPreview": false
    },
    "textMessage": {
        "text": "{{ $('Envia ao Flowise texto').item.json["text"].replace(/\\n/g, "\\\\n").replace(/['"]/g, '') }}"

    }
}`,options:{}},id:"761f5bb8-bf41-4827-b7c7-b8d41d59e678",name:"Responde pdf1",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[448,1680]},{parameters:{method:"POST",url:"=seu endpoint",sendHeaders:!0,headerParameters:{parameters:[{name:"apikey",value:"sua api"}]},sendBody:!0,specifyBody:"json",jsonBody:`={
    "number": "{{ $('Webhook').item.json["body"]["data"]["key"]["remoteJid"] }}",
    "options": {
        "delay": 1200,
        "presence": "composing",
        "linkPreview": false
    },
    "textMessage": {
        "text": "{{ $('Envia ao Flowise texto').item.json["text"].replace(/\\n/g, "\\\\n").replace(/['"]/g, '') }}"

    }
}`,options:{}},id:"108d4f65-4b4e-4384-a27e-f40e5d17ae0b",name:"Responde vídeo1",type:"n8n-nodes-base.httpRequest",typeVersion:4.2,position:[448,1872]},{parameters:{assignments:{assignments:[{id:"a1e66db0-00dc-481d-951c-1fde558e268e",name:"text",value:"={{ $json.outputLimpo.split('\\n\\n') }}",type:"array"}]},options:{}},id:"2dd24396-ae89-4943-b466-9e6dd04f508f",name:"Edit Fields10",type:"n8n-nodes-base.set",typeVersion:3.4,position:[-672,1712]},{parameters:{fieldToSplitOut:"text",options:{}},id:"7a9b9a16-ed92-4b42-a736-87d2247d9ea8",name:"Split Out1",type:"n8n-nodes-base.splitOut",typeVersion:1,position:[-448,1712]},{parameters:{options:{}},id:"357b9b9a-2c32-455b-869a-e7a6bf803357",name:"Loop Over Items1",type:"n8n-nodes-base.splitInBatches",typeVersion:3,position:[-224,1712]},{parameters:{},id:"fcb05a5d-29fd-449f-bf6e-bd29e81008dc",name:"Replace Me1",type:"n8n-nodes-base.noOp",typeVersion:1,position:[0,1104]},{parameters:{amount:1},id:"5b7b3c35-f5e7-441d-8aed-9d6c8acb4a25",name:"Wait2",type:"n8n-nodes-base.wait",typeVersion:1.1,position:[0,1296]},{parameters:{assignments:{assignments:[{id:"988d7fbc-1396-46aa-be51-340b41fd2197",name:"tagId",value:"={{ ($json.output.match(/<<ADD_TAG:(\\d+)>>/) || [])[1] }}",type:"string"},{id:"738a51cb-fbb1-4461-8ace-9d3bb2ec9bd8",name:"outputLimpo",value:"=Em breve alguem do time, confirmará sua solicitação",type:"string"}]},options:{}},type:"n8n-nodes-base.set",typeVersion:3.4,position:[-896,704],id:"7f9e081b-58ab-4293-b33c-6fa8dcd0078d",name:"Set - tagId e outputLimpo"},{parameters:{assignments:{assignments:[{id:"988d7fbc-1396-46aa-be51-340b41fd2197",name:"tagId",value:"={{ ($json.output.match(/<<ADD_TAG:(\\d+)>>/) || [])[1] }}",type:"string"},{id:"738a51cb-fbb1-4461-8ace-9d3bb2ec9bd8",name:"outputLimpo",value:"={{ $json.output.replace(/<<ADD_TAG:\\d+>>/g, '').trim() }}",type:"string"}]},options:{}},type:"n8n-nodes-base.set",typeVersion:3.4,position:[-896,1712],id:"3f4e653f-cbfa-4433-a6b8-d78f24b6a2cc",name:"Set - tagId e outputLimpo1"},{parameters:{method:"PUT",url:"=https://api.z-api.io/instances/__ZAPI_INSTANCE_ID__/token/__ZAPI_INSTANCE_TOKEN__/chats/{{ $('Edit Fields2').item.json.telefone }}/tags/{{ $json.tagId }}/add",sendHeaders:!0,headerParameters:{parameters:[{name:"client-token",value:"__ZAPI_CLIENT_TOKEN__"}]},options:{timeout:15e3}},type:"n8n-nodes-base.httpRequest",typeVersion:4.3,position:[-672,1152],id:"b1700b1a-09db-4d32-a614-e8fc56314b23",name:"Z-API - Add Tag no Chat",retryOnFail:!0,onError:"continueRegularOutput"},{parameters:{sessionIdType:"customKey",sessionKey:"={{ $('Edit Fields2').item.json.telefone }}",contextWindowLength:2},type:"@n8n/n8n-nodes-langchain.memoryPostgresChat",typeVersion:1.3,position:[-1536,1504],id:"65980965-f47e-4b2d-82e6-fe3f89677225",name:"Postgres Chat Memory",disabled:!0},{parameters:{workflowId:{__rl:!0,value:"__GUIDE_WORKFLOW_ID__",mode:"list",cachedResultUrl:"/workflow/__GUIDE_WORKFLOW_ID__",cachedResultName:"Tool: get_guide"},workflowInputs:{mappingMode:"defineBelow",value:{guide_key:"={{ /*n8n-auto-generated-fromAI-override*/ $fromAI('guide_key', ``, 'string') }}"},matchingColumns:["guide_key"],schema:[{id:"guide_key",displayName:"guide_key",required:!1,defaultMatch:!1,display:!0,canBeUsedToMatch:!0,type:"string",removed:!1}],attemptToConvertTypes:!1,convertFieldsToString:!1}},type:"@n8n/n8n-nodes-langchain.toolWorkflow",typeVersion:2.2,position:[-1360,1536],id:"63b91411-542b-4f97-8a27-6197933de0cb",name:"Call 'Tool: get_guide'"},{parameters:{sessionIdType:"customKey",sessionKey:"={{ $('Edit Fields2').item.json.telefone }}",contextWindowLength:10},type:"@n8n/n8n-nodes-langchain.memoryBufferWindow",typeVersion:1.3,position:[-1680,1536],id:"aa575acb-1d79-49f1-93fa-5487652a1136",name:"Window Buffer Memory"},{parameters:{},type:"n8n-nodes-base.noOp",typeVersion:1,position:[-464,1152],id:"a25d8959-e0a7-4825-9c28-33dd041791e1",name:"No Operation, do nothing2"}],A={Redis:{main:[[{node:"Wait",type:"main",index:0}]]},Redis1:{main:[[{node:"Edit Fields1",type:"main",index:0}]]},"Edit Fields1":{main:[[{node:"Redis2",type:"main",index:0}]]},"Edit Fields2":{main:[[{node:"Z-API - Get chat metadata",type:"main",index:0}]]},"Edit Fields":{main:[[{node:"HTTP Request3",type:"main",index:0}]]},"Edit Fields3":{main:[[{node:"HTTP Request2",type:"main",index:0}]]},Switch:{main:[[{node:"Edit Fields4",type:"main",index:0}],[{node:"Edit Fields4",type:"main",index:0}],[{node:"Edit Fields",type:"main",index:0}],[{node:"Edit Fields3",type:"main",index:0}],[{node:"Edit Fields6",type:"main",index:0}]]},Redis2:{main:[[{node:"AI Agent",type:"main",index:0}]]},Switch1:{main:[[{node:"Responde texto",type:"main",index:0}],[{node:"Responde imagem",type:"main",index:0}],[{node:"Responde pdf",type:"main",index:0}],[{node:"Responde vídeo",type:"main",index:0}]]},"Edit Fields4":{main:[[{node:"Redis",type:"main",index:0}]]},"Edit Fields5":{main:[[{node:"Split Out",type:"main",index:0}]]},"Split Out":{main:[[{node:"Loop Over Items",type:"main",index:0}]]},"Loop Over Items":{main:[[{node:"Replace Me",type:"main",index:0}],[{node:"Wait1",type:"main",index:0}]]},Wait1:{main:[[{node:"Switch1",type:"main",index:0}]]},"Responde texto":{main:[[{node:"Loop Over Items",type:"main",index:0}]]},"Responde imagem":{main:[[{node:"Loop Over Items",type:"main",index:0}]]},"Responde pdf":{main:[[{node:"Loop Over Items",type:"main",index:0}]]},"Responde vídeo":{main:[[{node:"Loop Over Items",type:"main",index:0}]]},OpenAI:{main:[[{node:"Edit Fields8",type:"main",index:0}]]},OpenAI1:{main:[[{node:"Edit Fields7",type:"main",index:0}]]},"OpenAI Chat Model":{ai_languageModel:[[{node:"AI Agent",type:"ai_languageModel",index:0}]]},Webhook:{main:[[{node:"Edit Fields2",type:"main",index:0}]]},"AI Agent":{main:[[{node:"IF - Agente pediu tag?",type:"main",index:0}]]},"Edit Fields6":{main:[[{node:"No Operation, do nothing1",type:"main",index:0}]]},"HTTP Request2":{main:[[{node:"OpenAI1",type:"main",index:0}]]},"Edit Fields7":{main:[[{node:"Redis",type:"main",index:0}]]},"HTTP Request3":{main:[[{node:"OpenAI",type:"main",index:0}]]},"Edit Fields8":{main:[[{node:"Redis",type:"main",index:0}]]},Wait:{main:[[{node:"Redis1",type:"main",index:0}]]},"Verifica se conversa tem tag":{main:[[{node:"No Operation, do nothing",type:"main",index:0}],[{node:"Switch",type:"main",index:0}]]},"Z-API - Get chat metadata":{main:[[{node:"Verifica se conversa tem tag",type:"main",index:0}]]},"IF - Agente pediu tag?":{main:[[{node:"Set - tagId e outputLimpo",type:"main",index:0}],[{node:"Set - tagId e outputLimpo1",type:"main",index:0}]]},"Responde texto1":{main:[[{node:"Loop Over Items1",type:"main",index:0}]]},Switch2:{main:[[{node:"Responde texto1",type:"main",index:0}],[{node:"Responde imagem1",type:"main",index:0}],[{node:"Responde pdf1",type:"main",index:0}],[{node:"Responde vídeo1",type:"main",index:0}]]},"Responde imagem1":{main:[[{node:"Loop Over Items1",type:"main",index:0}]]},"Responde pdf1":{main:[[{node:"Loop Over Items1",type:"main",index:0}]]},"Responde vídeo1":{main:[[{node:"Loop Over Items1",type:"main",index:0}]]},"Edit Fields10":{main:[[{node:"Split Out1",type:"main",index:0}]]},"Split Out1":{main:[[{node:"Loop Over Items1",type:"main",index:0}]]},"Loop Over Items1":{main:[[{node:"Replace Me1",type:"main",index:0}],[{node:"Wait2",type:"main",index:0}]]},Wait2:{main:[[{node:"Switch2",type:"main",index:0}]]},"Set - tagId e outputLimpo":{main:[[{node:"Z-API - Add Tag no Chat",type:"main",index:0},{node:"Edit Fields5",type:"main",index:0}]]},"Set - tagId e outputLimpo1":{main:[[{node:"Edit Fields10",type:"main",index:0}]]},"Z-API - Add Tag no Chat":{main:[[{node:"No Operation, do nothing2",type:"main",index:0}]]},"Call 'Tool: get_guide'":{ai_tool:[[{node:"AI Agent",type:"ai_tool",index:0}]]},"Window Buffer Memory":{ai_memory:[[{node:"AI Agent",type:"ai_memory",index:0}]]}},E=!1,I={executionOrder:"v1",binaryMode:"separate",availableInMCP:!1},h=[],v={name:y,nodes:_,connections:A,active:E,settings:I,tags:h},T="studio.ia.admin-platform-settings",p={n8n:{folderId:"folder-clinic-attendants",projectId:"default-project",guideWorkflowId:"tool-get-guide",publishOnCreate:!1},credentials:{openAiCredentialId:"openai-default",openAiCredentialName:"OpenAi account",redisCredentialId:"redis-default",redisCredentialName:"Redis account"},defaults:{webhookPrefix:"clinic-attendant"}},O=()=>{const e=localStorage.getItem(T);if(!e)return p;try{const n=JSON.parse(e);return{n8n:{...p.n8n,...n.n8n},credentials:{...p.credentials,...n.credentials},defaults:{...p.defaults,...n.defaults}}}catch{return p}},f="studio.ia.agents",N={__ZAPI_INSTANCE_ID__:"",__ZAPI_INSTANCE_TOKEN__:"",__ZAPI_CLIENT_TOKEN__:"",__GUIDE_WORKFLOW_ID__:"",__WEBHOOK_PATH__:"",__OPENAI_CREDENTIAL_ID__:"",__OPENAI_CREDENTIAL_NAME__:"",__REDIS_CREDENTIAL_ID__:"",__REDIS_CREDENTIAL_NAME__:""},x=`Voce e o atendente virtual oficial da clinica.

Objetivo:
- Receber pacientes com clareza e cordialidade.
- Responder com base nas informacoes autorizadas pela clinica.
- Coletar dados apenas quando necessario para continuar o atendimento.
- Encaminhar para humano quando o caso exigir confirmacao, urgencia ou acao operacional.

Regras:
- Use linguagem profissional, direta e acolhedora.
- Nao invente informacoes, horarios, medicos, convenios ou procedimentos.
- Se nao houver certeza, informe que vai encaminhar para o time responsavel.
- Quando precisar de atendimento humano, finalize com a tag configurada de suporte.
- Quando coletar dados para acao humana, finalize com a tag configurada de handoff.
- Em erro operacional, finalize com a tag configurada de erro.
`,V=(e,n)=>{const t=e.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"")||`agente-${Date.now()}`;return`${n}-${t}`},D=e=>JSON.parse(JSON.stringify(e)),m=()=>{const e=localStorage.getItem(f);if(!e)return[];try{const n=JSON.parse(e);return Array.isArray(n)?n:[]}catch{return[]}},u=e=>{localStorage.setItem(f,JSON.stringify(e))},c=e=>(e==null?void 0:e.userId)||(e==null?void 0:e.email)||"anonymous",l=(e,n)=>{if(Array.isArray(e))return e.map(a=>l(a,n));if(e&&typeof e=="object"){const a={};return Object.entries(e).forEach(([t,o])=>{a[t]=l(o,n)}),a}return typeof e=="string"?Object.entries(n).reduce((a,[t,o])=>a.split(t).join(o),e):e},C=e=>{const n=e.intelligence.systemPrompt.trim(),a=n.length>0?n:x,t=e.intelligence.ragMemories.length>0?`

Memorias e RAGs autorizadas:
${e.intelligence.ragMemories.map((o,i)=>`${i+1}. ${o.title}
${o.content}`).join(`

`)}`:"";return[`Clinica: ${e.clinicName}`,`Tag de erro: <<ADD_TAG:${e.intelligence.tagMapping.errorTagId}>>`,`Tag de handoff: <<ADD_TAG:${e.intelligence.tagMapping.handoffTagId}>>`,`Tag de suporte: <<ADD_TAG:${e.intelligence.tagMapping.supportTagId}>>`,"",a,t].join(`
`).trim()},R=(e,n,a)=>{if(!e||typeof e!="object")return;const t=e.assignments;Array.isArray(t)&&t.forEach(o=>{o&&typeof o=="object"&&o.name===n&&(o.value=a)})},P=(e,n)=>{const a=D(v),t={...N,__ZAPI_INSTANCE_ID__:e.whatsapp.instanceId,__ZAPI_INSTANCE_TOKEN__:e.whatsapp.instanceToken,__ZAPI_CLIENT_TOKEN__:e.whatsapp.clientToken,__GUIDE_WORKFLOW_ID__:n.n8n.guideWorkflowId,__WEBHOOK_PATH__:V(e.name,n.defaults.webhookPrefix),__OPENAI_CREDENTIAL_ID__:n.credentials.openAiCredentialId,__OPENAI_CREDENTIAL_NAME__:n.credentials.openAiCredentialName,__REDIS_CREDENTIAL_ID__:n.credentials.redisCredentialId,__REDIS_CREDENTIAL_NAME__:n.credentials.redisCredentialName},o=l(a,t);return o.name=e.name,o.nodes.forEach(i=>{var r,d;if(i.name==="AI Agent"){const s=(r=i.parameters)==null?void 0:r.options;s&&(s.systemMessage=C(e))}if(i.name==="OpenAI Chat Model"){const s=i.parameters;if(s){s.model=e.intelligence.model;const g=s.options??{};s.options={...g,temperature:0}}}if(i.name==="Window Buffer Memory"){const s=i.parameters;s&&(s.contextWindowLength=e.intelligence.memoryWindow)}i.name==="Set - tagId e outputLimpo"&&R((d=i.parameters)==null?void 0:d.assignments,"outputLimpo",e.intelligence.handoffMessage)}),{name:o.name,nodes:o.nodes,connections:o.connections,settings:o.settings}},S=(e,n)=>({templateKey:"clinic-attendant",folderId:n.n8n.folderId,projectId:n.n8n.projectId,publishOnCreate:n.n8n.publishOnCreate,workflow:P(e,n),metadata:{clinicName:e.clinicName,tags:e.tags,guideWorkflowId:n.n8n.guideWorkflowId,ragMemories:e.intelligence.ragMemories}}),M=e=>{const n=c(e);return m().filter(a=>a.ownerKey===n).sort((a,t)=>t.createdAt.localeCompare(a.createdAt))},w=async(e,n)=>{const a=O(),t=S(e,a),o=c(n),i=new Date().toISOString(),r={id:b(12),ownerKey:o,templateKey:"clinic-attendant",libraryCategory:"atendimento",catalogItemId:"support-whatsapp-agent",name:e.name,clinicName:e.clinicName,description:e.description,status:e.status,tags:e.tags,channelLabel:"WhatsApp / Z-API",provisioningStatus:"rascunho-local",provisioningMessage:"Configuracao salva localmente. O provisionamento real no n8n depende do backend da plataforma.",n8nFolderId:a.n8n.folderId,n8nProjectId:a.n8n.projectId,createdAt:i,updatedAt:i,adminSettingsSnapshot:a,config:e},d=m();return u([r,...d]),{agent:r,provisioningRequest:t}},$=(e,n)=>{const a=c(n),t=m().filter(o=>!(o.id===e&&o.ownerKey===a));u(t)},F=(e,n)=>{const a=c(n),t=m().find(d=>d.id===e&&d.ownerKey===a);if(!t)return null;const o=new Date().toISOString(),i={...t,id:b(12),name:`${t.name} copia`,provisioningStatus:"rascunho-local",provisioningMessage:"Copia criada localmente. Revise as credenciais e reprovisione quando necessario.",createdAt:o,updatedAt:o,config:{...t.config,name:`${t.config.name} copia`},n8nWorkflowId:void 0,n8nWorkflowUrl:void 0},r=m();return u([i,...r]),i};export{F as a,w as b,v as c,$ as d,O as g,M as l};
