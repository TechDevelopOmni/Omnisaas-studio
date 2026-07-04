namespace StudioIA.Api.Contracts.Agents;

public class ConfiguredAgentResponse
{
    public Guid Id { get; init; }
    public Guid ClientAccountId { get; init; }
    public Guid? CatalogAgentId { get; init; }
    public string TemplateKey { get; init; } = string.Empty;
    public string LibraryCategoryKey { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string ClinicName { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public string[] Tags { get; init; } = Array.Empty<string>();
    public string ChannelLabel { get; init; } = string.Empty;
    public string ProvisioningStatus { get; init; } = string.Empty;
    public string ProvisioningMessage { get; init; } = string.Empty;
    public string N8nFolderId { get; init; } = string.Empty;
    public string N8nProjectId { get; init; } = string.Empty;
    public string? N8nWorkflowId { get; init; }
    public string? N8nWorkflowUrl { get; init; }
    public string ConfigurationJson { get; init; } = "{}";
    public DateTime CreatedAtUtc { get; init; }
    public DateTime UpdatedAtUtc { get; init; }
}

public class UpsertConfiguredAgentRequest
{
    public Guid? CatalogAgentId { get; init; }
    public string TemplateKey { get; init; } = "clinic-attendant";
    public string LibraryCategoryKey { get; init; } = string.Empty;
    public string Name { get; init; } = string.Empty;
    public string ClinicName { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string Status { get; init; } = "Ativo";
    public string[] Tags { get; init; } = Array.Empty<string>();
    public string ChannelLabel { get; init; } = "WhatsApp / Z-API";
    public string ProvisioningStatus { get; init; } = "rascunho-local";
    public string ProvisioningMessage { get; init; } = string.Empty;
    public string N8nFolderId { get; init; } = string.Empty;
    public string N8nProjectId { get; init; } = string.Empty;
    public string? N8nWorkflowId { get; init; }
    public string? N8nWorkflowUrl { get; init; }
    public string ConfigurationJson { get; init; } = "{}";
}

public class ProvisionAgentRequest
{
    public string TemplateKey { get; init; } = "clinic-attendant";
    public string FolderId { get; init; } = string.Empty;
    public string ProjectId { get; init; } = string.Empty;
    public bool PublishOnCreate { get; init; }
    public object Workflow { get; init; } = new();
    public object Metadata { get; init; } = new();
}

public class ProvisionAgentResponse
{
    public string WorkflowId { get; init; } = string.Empty;
    public string WorkflowUrl { get; init; } = string.Empty;
    public string Status { get; init; } = "accepted";
}
