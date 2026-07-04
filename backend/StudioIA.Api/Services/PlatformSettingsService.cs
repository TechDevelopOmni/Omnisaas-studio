using Microsoft.EntityFrameworkCore;
using StudioIA.Api.Contracts.PlatformSettings;
using StudioIA.Api.Data;

namespace StudioIA.Api.Services;

public class PlatformSettingsService(StudioIaDbContext dbContext) : IPlatformSettingsService
{
    public async Task<PlatformSettingsResponse> GetAsync(CancellationToken cancellationToken)
    {
        var entity = await dbContext.PlatformSettings
            .AsNoTracking()
            .FirstAsync(cancellationToken);

        return entity.ToResponse();
    }

    public async Task<PlatformSettingsResponse> UpdateAsync(
        UpdatePlatformSettingsRequest request,
        CancellationToken cancellationToken)
    {
        var entity = await dbContext.PlatformSettings.FirstAsync(cancellationToken);

        entity.N8nFolderId = request.N8nFolderId;
        entity.N8nProjectId = request.N8nProjectId;
        entity.N8nGuideWorkflowId = request.N8nGuideWorkflowId;
        entity.PublishOnCreate = request.PublishOnCreate;
        entity.OpenAiCredentialId = request.OpenAiCredentialId;
        entity.OpenAiCredentialName = request.OpenAiCredentialName;
        entity.RedisCredentialId = request.RedisCredentialId;
        entity.RedisCredentialName = request.RedisCredentialName;
        entity.WebhookPrefix = request.WebhookPrefix;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return entity.ToResponse();
    }
}
