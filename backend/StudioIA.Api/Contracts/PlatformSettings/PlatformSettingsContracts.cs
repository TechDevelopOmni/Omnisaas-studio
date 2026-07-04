namespace StudioIA.Api.Contracts.PlatformSettings;

public class PlatformSettingsResponse
{
    public Guid Id { get; init; }
    public string N8nFolderId { get; init; } = string.Empty;
    public string N8nProjectId { get; init; } = string.Empty;
    public string N8nGuideWorkflowId { get; init; } = string.Empty;
    public bool PublishOnCreate { get; init; }
    public string OpenAiCredentialId { get; init; } = string.Empty;
    public string OpenAiCredentialName { get; init; } = string.Empty;
    public string RedisCredentialId { get; init; } = string.Empty;
    public string RedisCredentialName { get; init; } = string.Empty;
    public string WebhookPrefix { get; init; } = string.Empty;
    public DateTime UpdatedAtUtc { get; init; }
}

public class UpdatePlatformSettingsRequest
{
    public string N8nFolderId { get; init; } = string.Empty;
    public string N8nProjectId { get; init; } = string.Empty;
    public string N8nGuideWorkflowId { get; init; } = string.Empty;
    public bool PublishOnCreate { get; init; }
    public string OpenAiCredentialId { get; init; } = string.Empty;
    public string OpenAiCredentialName { get; init; } = string.Empty;
    public string RedisCredentialId { get; init; } = string.Empty;
    public string RedisCredentialName { get; init; } = string.Empty;
    public string WebhookPrefix { get; init; } = string.Empty;
}
