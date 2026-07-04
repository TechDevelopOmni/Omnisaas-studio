namespace StudioIA.Api.Entities;

public class ConfiguredAgent
{
    public Guid Id { get; set; }
    public Guid ClientAccountId { get; set; }
    public Guid? CatalogAgentId { get; set; }
    public string TemplateKey { get; set; } = "clinic-attendant";
    public string LibraryCategoryKey { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string ClinicName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Ativo";
    public string TagsCsv { get; set; } = string.Empty;
    public string ChannelLabel { get; set; } = "WhatsApp / Z-API";
    public string ProvisioningStatus { get; set; } = "rascunho-local";
    public string ProvisioningMessage { get; set; } = string.Empty;
    public string N8nFolderId { get; set; } = string.Empty;
    public string N8nProjectId { get; set; } = string.Empty;
    public string? N8nWorkflowId { get; set; }
    public string? N8nWorkflowUrl { get; set; }
    public string ConfigurationJson { get; set; } = "{}";
    public DateTime CreatedAtUtc { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
    public ClientAccount ClientAccount { get; set; } = null!;
}
