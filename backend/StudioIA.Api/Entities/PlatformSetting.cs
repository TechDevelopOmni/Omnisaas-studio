namespace StudioIA.Api.Entities;

public class PlatformSetting
{
    public Guid Id { get; set; }
    public string N8nFolderId { get; set; } = string.Empty;
    public string N8nProjectId { get; set; } = string.Empty;
    public string N8nGuideWorkflowId { get; set; } = string.Empty;
    public bool PublishOnCreate { get; set; }
    public string OpenAiCredentialId { get; set; } = string.Empty;
    public string OpenAiCredentialName { get; set; } = string.Empty;
    public string RedisCredentialId { get; set; } = string.Empty;
    public string RedisCredentialName { get; set; } = string.Empty;
    public string WebhookPrefix { get; set; } = "studioia";
    public DateTime UpdatedAtUtc { get; set; }
}
