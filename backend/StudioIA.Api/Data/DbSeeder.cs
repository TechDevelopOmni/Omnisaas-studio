using Microsoft.EntityFrameworkCore;
using StudioIA.Api.Entities;

namespace StudioIA.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(StudioIaDbContext dbContext)
    {
        var now = DateTime.UtcNow;

        var users = await SeedUsersAsync(dbContext);
        var accounts = await SeedClientAccountsAsync(dbContext, users, now);
        var categories = await SeedCatalogCategoriesAsync(dbContext, now);
        await SeedCatalogAgentsAsync(dbContext, categories);
        await SeedPlatformSettingsAsync(dbContext, now);
        await SeedSubscriptionsAsync(dbContext, accounts, categories, now);
        await SeedConfiguredAgentsAsync(dbContext, accounts, categories, now);
    }

    private static async Task<Dictionary<string, UserAccount>> SeedUsersAsync(
        StudioIaDbContext dbContext)
    {
        var seeds = new[]
        {
            new UserSeed("admin@studioia.com", "Administrador Studio.IA", "123Qwe", "admin,user"),
            new UserSeed("suporte@studioia.com", "Suporte Studio.IA", "123Qwe", "support"),
            new UserSeed("cliente@studioia.com", "Cliente Demo", "123Qwe", "user"),
            new UserSeed("financeiro@empresademo.com", "Financeiro Demo", "123Qwe", "user"),
            new UserSeed("juridico@atlas.com", "Juridico Atlas", "123Qwe", "user"),
        };

        foreach (var seed in seeds)
        {
            var user = await dbContext.UserAccounts.FirstOrDefaultAsync(
                item => item.Email == seed.Email);

            if (user is null)
            {
                user = new UserAccount
                {
                    Id = Guid.NewGuid(),
                    Email = seed.Email,
                };
                dbContext.UserAccounts.Add(user);
            }

            user.UserName = seed.UserName;
            user.Password = seed.Password;
            user.Avatar = string.Empty;
            user.AuthorityCsv = seed.AuthorityCsv;
        }

        await dbContext.SaveChangesAsync();

        return await dbContext.UserAccounts
            .Where(item => seeds.Select(seed => seed.Email).Contains(item.Email))
            .ToDictionaryAsync(item => item.Email);
    }

    private static async Task<Dictionary<string, ClientAccount>> SeedClientAccountsAsync(
        StudioIaDbContext dbContext,
        Dictionary<string, UserAccount> users,
        DateTime now)
    {
        var seeds = new[]
        {
            new ClientSeed(
                users["cliente@studioia.com"].Id,
                "Cliente Demo",
                "Empresa Demo",
                "cliente@studioia.com",
                "11999990001",
                "12.345.678/0001-90",
                "Gestor",
                "Visa",
                "Cliente Demo",
                "4587",
                "08",
                "29",
                "financeiro@empresademo.com"),
            new ClientSeed(
                users["financeiro@empresademo.com"].Id,
                "Financeiro Demo",
                "Loja Brasil Sul",
                "financeiro@empresademo.com",
                "11999990002",
                "45.987.123/0001-12",
                "Financeiro",
                "Mastercard",
                "Financeiro Demo",
                "7744",
                "11",
                "28",
                "financeiro@empresademo.com"),
            new ClientSeed(
                users["juridico@atlas.com"].Id,
                "Juridico Atlas",
                "Atlas Engenharia",
                "juridico@atlas.com",
                "11999990003",
                "88.777.666/0001-11",
                "Coordenador juridico",
                "Visa",
                "Juridico Atlas",
                "9911",
                "04",
                "30",
                "juridico@atlas.com"),
        };

        foreach (var seed in seeds)
        {
            var account = await dbContext.ClientAccounts
                .FirstOrDefaultAsync(item => item.UserAccountId == seed.UserAccountId);

            if (account is null)
            {
                account = new ClientAccount
                {
                    Id = Guid.NewGuid(),
                    UserAccountId = seed.UserAccountId,
                };
                dbContext.ClientAccounts.Add(account);
            }

            account.FullName = seed.FullName;
            account.CompanyName = seed.CompanyName;
            account.Email = seed.Email;
            account.Phone = seed.Phone;
            account.Document = seed.Document;
            account.Role = seed.Role;
            account.PaymentBrand = seed.PaymentBrand;
            account.PaymentHolderName = seed.PaymentHolderName;
            account.PaymentLast4 = seed.PaymentLast4;
            account.PaymentExpiryMonth = seed.PaymentExpiryMonth;
            account.PaymentExpiryYear = seed.PaymentExpiryYear;
            account.BillingEmail = seed.BillingEmail;
            account.UpdatedAtUtc = now;
        }

        await dbContext.SaveChangesAsync();

        return await dbContext.ClientAccounts
            .Include(item => item.UserAccount)
            .ToDictionaryAsync(item => item.UserAccount.Email);
    }

    private static async Task<Dictionary<string, CatalogCategory>> SeedCatalogCategoriesAsync(
        StudioIaDbContext dbContext,
        DateTime now)
    {
        var seeds = new[]
        {
            new CategorySeed("marketing", "Marketing", "Campanhas, inbound, conteudo e relacionamento com leads.", "departamentos"),
            new CategorySeed("comercial", "Comercial", "Prospeccao, follow-up, pipeline e conversao de oportunidades.", "departamentos"),
            new CategorySeed("atendimento", "Atendimento", "Suporte ao cliente, triagem inicial e resolucao de demandas.", "departamentos"),
            new CategorySeed("financeiro", "Financeiro", "Cobranca, conciliacao, alertas e operacoes financeiras.", "departamentos"),
            new CategorySeed("fiscal", "Fiscal", "Documentos fiscais, alertas de obrigacoes e suporte tributario operacional.", "departamentos"),
            new CategorySeed("administrativo", "Administrativo", "Rotinas internas, organizacao de demandas e apoio operacional.", "departamentos"),
            new CategorySeed("rh", "RH", "Recrutamento, onboarding e suporte interno a pessoas.", "departamentos"),
            new CategorySeed("logistica", "Logistica", "Roteirizacao, status operacional e comunicacao de entrega.", "departamentos"),
            new CategorySeed("compras", "Compras", "Cotacoes, fornecedores e acompanhamento do processo de aquisicao.", "departamentos"),
            new CategorySeed("ti", "TI", "Service desk, suporte interno e organizacao de chamados.", "departamentos"),
            new CategorySeed("juridico", "Juridico", "Triagem, contratos, compliance e analise documental.", "especialidades"),
            new CategorySeed("engenharia", "Engenharia", "Documentacao tecnica, suporte de projeto e operacao especializada.", "especialidades"),
        };

        foreach (var seed in seeds)
        {
            var category = await dbContext.CatalogCategories.FirstOrDefaultAsync(
                item => item.Key == seed.Key);

            if (category is null)
            {
                category = new CatalogCategory
                {
                    Id = Guid.NewGuid(),
                    Key = seed.Key,
                };
                dbContext.CatalogCategories.Add(category);
            }

            category.Label = seed.Label;
            category.Description = seed.Description;
            category.GroupId = seed.GroupId;
            category.MonthlyPrice = 299;
            category.UpdatedAtUtc = now;
        }

        await dbContext.SaveChangesAsync();

        return await dbContext.CatalogCategories.ToDictionaryAsync(item => item.Key);
    }

    private static async Task SeedCatalogAgentsAsync(
        StudioIaDbContext dbContext,
        Dictionary<string, CatalogCategory> categories)
    {
        var seeds = new[]
        {
            new AgentSeed("marketing", "SDR Inbound", "Qualificacao de leads", "Recebe leads de campanhas, qualifica o interesse e conduz a passagem para o time comercial.", "Inbound,Qualificacao,Passagem comercial", "#34d399", "#0f766e", "#0d1f1d", "SD"),
            new AgentSeed("marketing", "Curador de conteudo", "Apoio editorial", "Organiza pautas, reaproveita materiais e ajuda a manter a esteira de conteudo ativa.", "Conteudo,Pautas,Calendario", "#fb923c", "#9a3412", "#22120a", "CT"),
            new AgentSeed("marketing", "Analista de campanha", "Performance e acompanhamento", "Monitora execucao de campanhas e resume sinais importantes para o time de marketing.", "Campanhas,Resumo,Sinais de performance", "#f59e0b", "#92400e", "#24160a", "MK"),
            new AgentSeed("financeiro", "Cobranca inteligente", "Cobranca e follow-up", "Acompanha vencimentos, envia lembretes e organiza o contato com clientes inadimplentes.", "Cobranca,Lembretes,Status de pagamento", "#60a5fa", "#1d4ed8", "#091a2f", "CB"),
            new AgentSeed("financeiro", "Conciliador financeiro", "Operacao financeira", "Consolida movimentacoes e ajuda a sinalizar divergencias para revisao do time.", "Conciliacao,Divergencias,Conferencia", "#c084fc", "#7e22ce", "#1d1029", "FN"),
            new AgentSeed("financeiro", "Assistente de relatorios", "Resumo gerencial", "Prepara resumos operacionais e apoia a leitura rapida de indicadores financeiros.", "Relatorios,Indicadores,Resumo executivo", "#22d3ee", "#0e7490", "#0b1c23", "RL"),
            new AgentSeed("comercial", "BDR outbound", "Prospeccao ativa", "Dispara abordagens iniciais, organiza listas de prospeccao e ajuda a abrir novas conversas comerciais.", "Outbound,Prospeccao,Cadencia", "#fb7185", "#9f1239", "#231019", "BD"),
            new AgentSeed("comercial", "Follow-up comercial", "Acompanhamento de propostas", "Reforca contatos, acompanha negociacoes em aberto e ajuda o time a nao perder timing comercial.", "Follow-up,Propostas,Pipeline", "#f59e0b", "#92400e", "#24160a", "FP"),
            new AgentSeed("comercial", "Qualificador de leads", "Pre-venda", "Conduz perguntas-chave, identifica aderencia e prepara a passagem do lead para o consultor.", "Leads,Qualificacao,Passagem", "#22d3ee", "#0e7490", "#0b1c23", "QL"),
            new AgentSeed("atendimento", "Atendente WhatsApp", "Atendimento ao cliente", "Recebe duvidas, organiza o primeiro atendimento e direciona casos mais sensiveis para a equipe.", "WhatsApp,Triagem,Encaminhamento", "#34d399", "#0f766e", "#0d1f1d", "WA"),
            new AgentSeed("atendimento", "Triagem de suporte", "Classificacao de chamados", "Classifica chamados, identifica prioridade e organiza o repasse para o time responsavel.", "Suporte,Prioridade,Chamados", "#60a5fa", "#1d4ed8", "#091a2f", "SP"),
            new AgentSeed("atendimento", "Pos-atendimento", "Qualidade e CSAT", "Coleta feedback apos o atendimento e ajuda a medir a satisfacao do cliente.", "CSAT,Feedback,Qualidade", "#2dd4bf", "#0f766e", "#0b1d1b", "CS"),
            new AgentSeed("fiscal", "Leitor fiscal", "Suporte documental", "Ajuda a organizar notas, documentos e pendencias de rotina fiscal para o time interno.", "Notas,Documentos,Pendencias", "#c084fc", "#7e22ce", "#1d1029", "FS"),
            new AgentSeed("fiscal", "Monitor de obrigacoes", "Alertas operacionais", "Lembra vencimentos, etapas e obrigacoes recorrentes para reduzir risco operacional no calendario fiscal.", "Obrigacoes,Prazos,Alertas", "#f87171", "#991b1b", "#261012", "OB"),
            new AgentSeed("fiscal", "Validador de cadastro", "Conferencia inicial", "Apoia a conferencia de dados cadastrais e documentos antes da entrada no fluxo fiscal.", "Cadastro,Conferencia,Validacao", "#fbbf24", "#b45309", "#251707", "VC"),
            new AgentSeed("administrativo", "Agendador interno", "Rotina administrativa", "Coordena compromissos, confirma agendas e ajuda a organizar a rotina operacional do escritorio.", "Agenda,Confirmacoes,Rotina", "#67e8f9", "#0e7490", "#0a1d24", "AG"),
            new AgentSeed("administrativo", "Organizador de demandas", "Backoffice", "Recebe solicitacoes internas, categoriza prioridades e distribui a demanda para o responsavel correto.", "Backoffice,Solicitacoes,Distribuicao", "#a78bfa", "#6d28d9", "#18112a", "DM"),
            new AgentSeed("administrativo", "Controlador de protocolos", "Documentacao interna", "Acompanha entradas, saidas e atualizacoes de processos administrativos com mais rastreabilidade.", "Protocolos,Controle,Rastreabilidade", "#38bdf8", "#0369a1", "#081c28", "PR"),
            new AgentSeed("rh", "Triagem de candidatos", "Recrutamento", "Ajuda a organizar perfis, perguntas iniciais e priorizacao de candidatos.", "Triagem,Candidatos,Priorizacao", "#f87171", "#991b1b", "#261012", "RH"),
            new AgentSeed("rh", "Onboarding interno", "Integracao de colaboradores", "Conduz boas-vindas, organiza passos iniciais e reforca informacoes importantes para novos colaboradores.", "Onboarding,Boas-vindas,Checklist", "#fbbf24", "#b45309", "#251707", "ON"),
            new AgentSeed("rh", "Atendente de RH", "Suporte interno", "Responde duvidas frequentes de politicas internas e direciona demandas para o time correto.", "FAQ interno,Politicas,Encaminhamento", "#a78bfa", "#6d28d9", "#18112a", "HP"),
            new AgentSeed("logistica", "Status de entregas", "Comunicacao operacional", "Atualiza clientes e equipes sobre etapas logisticas e ocorrencias no percurso.", "Entregas,Atualizacao,Ocorrencias", "#2dd4bf", "#0f766e", "#0b1d1b", "LG"),
            new AgentSeed("logistica", "Coordenador de rotas", "Planejamento operacional", "Apoia a leitura de prioridades e a distribuicao de rotas com mais clareza para a operacao.", "Rotas,Prioridades,Distribuicao", "#38bdf8", "#0369a1", "#081c28", "RT"),
            new AgentSeed("logistica", "Monitor de SLA", "Acompanhamento de prazo", "Sinaliza atrasos e ajuda a antecipar riscos operacionais antes que impactem o cliente.", "SLA,Atrasos,Alertas", "#10b981", "#047857", "#0b1c17", "SL"),
            new AgentSeed("compras", "Gestor de cotacoes", "Cotacao e comparacao", "Organiza pedidos de cotacao, resume respostas de fornecedores e facilita comparacoes iniciais.", "Cotacoes,Fornecedores,Comparacao", "#22c55e", "#166534", "#0b1b13", "CQ"),
            new AgentSeed("compras", "Relacionamento com fornecedor", "Gestao de fornecedores", "Mantem o contato operacional com fornecedores e ajuda a acompanhar pendencias de compras.", "Fornecedor,Pendencias,Acompanhamento", "#10b981", "#047857", "#0b1c17", "FR"),
            new AgentSeed("compras", "Reposicao de estoque", "Abastecimento", "Sinaliza necessidade de reposicao e ajuda o time de compras a agir antes da ruptura.", "Estoque,Reposicao,Abastecimento", "#fb923c", "#9a3412", "#22120a", "RP"),
            new AgentSeed("ti", "Service desk interno", "Atendimento de TI", "Recebe chamados, coleta contexto tecnico e direciona incidentes para a fila correta.", "Chamados,Incidentes,TI interno", "#60a5fa", "#1d4ed8", "#091a2f", "TI"),
            new AgentSeed("ti", "Gestor de acessos", "Solicitacoes internas", "Apoia pedidos de acesso, organizacao de permissoes e triagem de necessidades recorrentes do time.", "Acessos,Permissoes,Solicitacoes", "#22d3ee", "#0e7490", "#0b1c23", "AC"),
            new AgentSeed("ti", "Monitor de incidentes", "Operacao tecnica", "Consolida sinais de indisponibilidade e ajuda a acelerar o entendimento inicial de incidentes.", "Incidentes,Monitoramento,Alertas", "#f59e0b", "#92400e", "#24160a", "MN"),
            new AgentSeed("juridico", "Revisor de contrato", "Analise documental", "Apoia a revisao inicial de clausulas, riscos e inconsistencias em contratos padrao.", "Revisao inicial,Clausulas,Sinalizacao de risco", "#f87171", "#991b1b", "#261012", "RC"),
            new AgentSeed("juridico", "Criador de contrato", "Minutas padronizadas", "Monta a primeira versao de contratos recorrentes com base em dados e regras predefinidas.", "Minutas,Padronizacao,Preenchimento guiado", "#fbbf24", "#b45309", "#251707", "CC"),
            new AgentSeed("juridico", "Triagem juridica", "Intake de casos", "Coleta contexto do cliente, identifica o tema juridico e organiza a entrada do atendimento.", "Intake,Coleta de contexto,Direcionamento", "#a78bfa", "#6d28d9", "#18112a", "TJ"),
            new AgentSeed("engenharia", "Coordenador de obra", "Operacao de campo", "Centraliza comunicacoes de obra, tarefas do dia e alertas de acompanhamento de execucao.", "Obra,Campo,Acompanhamento", "#fb7185", "#9f1239", "#241018", "OB"),
            new AgentSeed("engenharia", "Suporte tecnico", "Atendimento especializado", "Orienta duvidas tecnicas iniciais e ajuda a distribuir a demanda para o especialista adequado.", "Tecnico,Triagem,Distribuicao", "#67e8f9", "#0e7490", "#0a1d24", "ST"),
            new AgentSeed("engenharia", "Leitor de memoriais", "Documentacao tecnica", "Resume memoriais, especificacoes e documentos de projeto para facilitar a consulta operacional.", "Memoriais,Resumo,Projeto", "#22c55e", "#166534", "#0b1b13", "DG"),
        };

        foreach (var seed in seeds)
        {
            var categoryId = categories[seed.CategoryKey].Id;
            var agent = await dbContext.CatalogAgents.FirstOrDefaultAsync(
                item => item.CatalogCategoryId == categoryId && item.Title == seed.Title);

            if (agent is null)
            {
                agent = new CatalogAgent
                {
                    Id = Guid.NewGuid(),
                    CatalogCategoryId = categoryId,
                    Title = seed.Title,
                };
                dbContext.CatalogAgents.Add(agent);
            }

            agent.Role = seed.Role;
            agent.Description = seed.Description;
            agent.HighlightsCsv = seed.HighlightsCsv;
            agent.Route = "/criaragente";
            agent.Available = false;
            agent.Accent = seed.Accent;
            agent.Glow = seed.Glow;
            agent.Panel = seed.Panel;
            agent.Symbol = seed.Symbol;
        }

        await dbContext.SaveChangesAsync();
    }

    private static async Task SeedPlatformSettingsAsync(
        StudioIaDbContext dbContext,
        DateTime now)
    {
        var entity = await dbContext.PlatformSettings.FirstOrDefaultAsync();

        if (entity is null)
        {
            entity = new PlatformSetting
            {
                Id = Guid.NewGuid(),
            };
            dbContext.PlatformSettings.Add(entity);
        }

        entity.N8nFolderId = "folder-studioia-main";
        entity.N8nProjectId = "project-studioia-prod";
        entity.N8nGuideWorkflowId = "workflow-guide-default";
        entity.PublishOnCreate = false;
        entity.OpenAiCredentialId = "openai-default";
        entity.OpenAiCredentialName = "OpenAI Default";
        entity.RedisCredentialId = "redis-default";
        entity.RedisCredentialName = "Redis Default";
        entity.WebhookPrefix = "studioia";
        entity.UpdatedAtUtc = now;

        await dbContext.SaveChangesAsync();
    }

    private static async Task SeedSubscriptionsAsync(
        StudioIaDbContext dbContext,
        Dictionary<string, ClientAccount> accounts,
        Dictionary<string, CatalogCategory> categories,
        DateTime now)
    {
        await UpsertSubscriptionAsync(dbContext, accounts["cliente@studioia.com"], categories["atendimento"], "active", now);
        await UpsertSubscriptionAsync(dbContext, accounts["cliente@studioia.com"], categories["financeiro"], "active", now);
        await UpsertSubscriptionAsync(dbContext, accounts["cliente@studioia.com"], categories["comercial"], "active", now);

        await UpsertSubscriptionAsync(dbContext, accounts["financeiro@empresademo.com"], categories["financeiro"], "active", now);
        await UpsertSubscriptionAsync(dbContext, accounts["financeiro@empresademo.com"], categories["fiscal"], "active", now);
        await UpsertSubscriptionAsync(dbContext, accounts["financeiro@empresademo.com"], categories["administrativo"], "active", now);

        await UpsertSubscriptionAsync(dbContext, accounts["juridico@atlas.com"], categories["juridico"], "active", now);
        await UpsertSubscriptionAsync(dbContext, accounts["juridico@atlas.com"], categories["engenharia"], "active", now);
        await UpsertSubscriptionAsync(dbContext, accounts["juridico@atlas.com"], categories["rh"], "inactive", now);

        await dbContext.SaveChangesAsync();
    }

    private static async Task UpsertSubscriptionAsync(
        StudioIaDbContext dbContext,
        ClientAccount account,
        CatalogCategory category,
        string status,
        DateTime now)
    {
        var subscription = await dbContext.DepartmentSubscriptions.FirstOrDefaultAsync(
            item => item.ClientAccountId == account.Id && item.CategoryKey == category.Key);

        if (subscription is null)
        {
            subscription = new DepartmentSubscription
            {
                Id = Guid.NewGuid(),
                ClientAccountId = account.Id,
                CategoryKey = category.Key,
            };
            dbContext.DepartmentSubscriptions.Add(subscription);
        }

        subscription.CategoryLabel = category.Label;
        subscription.Status = status;
        subscription.MonthlyPrice = category.MonthlyPrice;
        subscription.StartedAtUtc = status == "active"
            ? subscription.StartedAtUtc ?? now
            : subscription.StartedAtUtc;
    }

    private static async Task SeedConfiguredAgentsAsync(
        StudioIaDbContext dbContext,
        Dictionary<string, ClientAccount> accounts,
        Dictionary<string, CatalogCategory> categories,
        DateTime now)
    {
        await UpsertConfiguredAgentAsync(
            dbContext,
            accounts["cliente@studioia.com"],
            categories["atendimento"],
            "Atendente principal Empresa Demo",
            "Empresa Demo",
            "Atendente de WhatsApp configurado para a operacao principal do cliente.",
            "Ativo",
            "suporte,whatsapp,comercial",
            "Atendimento ao cliente");

        await UpsertConfiguredAgentAsync(
            dbContext,
            accounts["cliente@studioia.com"],
            categories["financeiro"],
            "Cobranca Empresa Demo",
            "Empresa Demo",
            "Agente financeiro para cobranca e follow-up recorrente.",
            "Programado",
            "financeiro,cobranca,follow-up",
            "Operacao financeira");

        await UpsertConfiguredAgentAsync(
            dbContext,
            accounts["financeiro@empresademo.com"],
            categories["fiscal"],
            "Fiscal Loja Brasil Sul",
            "Loja Brasil Sul",
            "Agente fiscal de apoio operacional para documentos e obrigacoes.",
            "Ativo",
            "fiscal,documentos,alertas",
            "Suporte documental");

        await UpsertConfiguredAgentAsync(
            dbContext,
            accounts["juridico@atlas.com"],
            categories["juridico"],
            "Revisor Atlas Engenharia",
            "Atlas Engenharia",
            "Agente juridico para revisao inicial de contratos da empresa.",
            "Ativo",
            "juridico,contratos,compliance",
            "Analise documental");

        await dbContext.SaveChangesAsync();
    }

    private static async Task UpsertConfiguredAgentAsync(
        StudioIaDbContext dbContext,
        ClientAccount account,
        CatalogCategory category,
        string name,
        string clinicName,
        string description,
        string status,
        string tagsCsv,
        string role)
    {
        var entity = await dbContext.ConfiguredAgents.FirstOrDefaultAsync(
            item => item.ClientAccountId == account.Id && item.Name == name);

        if (entity is null)
        {
            entity = new ConfiguredAgent
            {
                Id = Guid.NewGuid(),
                ClientAccountId = account.Id,
                CreatedAtUtc = DateTime.UtcNow,
            };
            dbContext.ConfiguredAgents.Add(entity);
        }

        entity.TemplateKey = "clinic-attendant";
        entity.LibraryCategoryKey = category.Key;
        entity.Name = name;
        entity.ClinicName = clinicName;
        entity.Description = description;
        entity.Status = status;
        entity.TagsCsv = tagsCsv;
        entity.ChannelLabel = "WhatsApp / Z-API";
        entity.ProvisioningStatus = "rascunho-local";
        entity.ProvisioningMessage =
            "Configuracao persistida na API de mock com base SQLite.";
        entity.N8nFolderId = "folder-studioia-main";
        entity.N8nProjectId = "project-studioia-prod";
        entity.N8nWorkflowId = null;
        entity.N8nWorkflowUrl = null;
        entity.ConfigurationJson =
            $$"""
              {
                "name": "{{name}}",
                "clinicName": "{{clinicName}}",
                "description": "{{description}}",
                "status": "{{status}}",
                "tags": [{{string.Join(", ", tagsCsv.Split(',').Select(tag => $"\"{tag}\""))}}],
                "channelLabel": "WhatsApp / Z-API",
                "role": "{{role}}"
              }
              """;
        entity.UpdatedAtUtc = DateTime.UtcNow;
    }

    private sealed record UserSeed(
        string Email,
        string UserName,
        string Password,
        string AuthorityCsv);

    private sealed record ClientSeed(
        Guid UserAccountId,
        string FullName,
        string CompanyName,
        string Email,
        string Phone,
        string Document,
        string Role,
        string PaymentBrand,
        string PaymentHolderName,
        string PaymentLast4,
        string PaymentExpiryMonth,
        string PaymentExpiryYear,
        string BillingEmail);

    private sealed record CategorySeed(
        string Key,
        string Label,
        string Description,
        string GroupId);

    private sealed record AgentSeed(
        string CategoryKey,
        string Title,
        string Role,
        string Description,
        string HighlightsCsv,
        string Accent,
        string Glow,
        string Panel,
        string Symbol);
}
