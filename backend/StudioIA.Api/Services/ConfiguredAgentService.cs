using Microsoft.EntityFrameworkCore;
using StudioIA.Api.Contracts.Agents;
using StudioIA.Api.Data;
using StudioIA.Api.Entities;

namespace StudioIA.Api.Services;

public class ConfiguredAgentService(StudioIaDbContext dbContext) : IConfiguredAgentService
{
    public async Task<IReadOnlyList<ConfiguredAgentResponse>> ListByClientAsync(
        Guid clientAccountId,
        CancellationToken cancellationToken)
    {
        var entities = await dbContext.ConfiguredAgents
            .AsNoTracking()
            .Where(item => item.ClientAccountId == clientAccountId)
            .OrderByDescending(item => item.CreatedAtUtc)
            .ToListAsync(cancellationToken);

        return entities.Select(item => item.ToResponse()).ToList();
    }

    public async Task<ConfiguredAgentResponse?> CreateAsync(
        Guid clientAccountId,
        UpsertConfiguredAgentRequest request,
        CancellationToken cancellationToken)
    {
        var clientAccount = await dbContext.ClientAccounts
            .AsNoTracking()
            .FirstOrDefaultAsync(item => item.Id == clientAccountId, cancellationToken);

        if (clientAccount is null)
        {
            return null;
        }

        var platformSettings = await dbContext.PlatformSettings
            .AsNoTracking()
            .FirstAsync(cancellationToken);

        var catalogAgent = await ResolveCatalogAgentAsync(
            request.CatalogAgentId,
            cancellationToken);

        var normalizedRequest = NormalizeRequest(
            request,
            clientAccount,
            platformSettings,
            catalogAgent);

        var entity = BuildEntity(clientAccountId, normalizedRequest);
        dbContext.ConfiguredAgents.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return entity.ToResponse();
    }

    public async Task<ConfiguredAgentResponse?> UpdateAsync(
        Guid clientAccountId,
        Guid configuredAgentId,
        UpsertConfiguredAgentRequest request,
        CancellationToken cancellationToken)
    {
        var entity = await dbContext.ConfiguredAgents.FirstOrDefaultAsync(
            item => item.Id == configuredAgentId && item.ClientAccountId == clientAccountId,
            cancellationToken);

        if (entity is null)
        {
            return null;
        }

        var clientAccount = await dbContext.ClientAccounts
            .AsNoTracking()
            .FirstAsync(item => item.Id == clientAccountId, cancellationToken);
        var platformSettings = await dbContext.PlatformSettings
            .AsNoTracking()
            .FirstAsync(cancellationToken);
        var catalogAgent = await ResolveCatalogAgentAsync(
            request.CatalogAgentId,
            cancellationToken);

        var normalizedRequest = NormalizeRequest(
            request,
            clientAccount,
            platformSettings,
            catalogAgent);

        entity.CatalogAgentId = normalizedRequest.CatalogAgentId;
        entity.TemplateKey = normalizedRequest.TemplateKey;
        entity.LibraryCategoryKey = normalizedRequest.LibraryCategoryKey;
        entity.Name = normalizedRequest.Name;
        entity.ClinicName = normalizedRequest.ClinicName;
        entity.Description = normalizedRequest.Description;
        entity.Status = normalizedRequest.Status;
        entity.TagsCsv = string.Join(',', normalizedRequest.Tags);
        entity.ChannelLabel = normalizedRequest.ChannelLabel;
        entity.ProvisioningStatus = normalizedRequest.ProvisioningStatus;
        entity.ProvisioningMessage = normalizedRequest.ProvisioningMessage;
        entity.N8nFolderId = normalizedRequest.N8nFolderId;
        entity.N8nProjectId = normalizedRequest.N8nProjectId;
        entity.N8nWorkflowId = normalizedRequest.N8nWorkflowId;
        entity.N8nWorkflowUrl = normalizedRequest.N8nWorkflowUrl;
        entity.ConfigurationJson = normalizedRequest.ConfigurationJson;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return entity.ToResponse();
    }

    public async Task<bool> DeleteAsync(
        Guid clientAccountId,
        Guid configuredAgentId,
        CancellationToken cancellationToken)
    {
        var entity = await dbContext.ConfiguredAgents.FirstOrDefaultAsync(
            item => item.Id == configuredAgentId && item.ClientAccountId == clientAccountId,
            cancellationToken);

        if (entity is null)
        {
            return false;
        }

        dbContext.ConfiguredAgents.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    private async Task<CatalogAgent?> ResolveCatalogAgentAsync(
        Guid? catalogAgentId,
        CancellationToken cancellationToken)
    {
        if (catalogAgentId is null)
        {
            return null;
        }

        return await dbContext.CatalogAgents
            .AsNoTracking()
            .Include(item => item.CatalogCategory)
            .FirstOrDefaultAsync(item => item.Id == catalogAgentId.Value, cancellationToken);
    }

    private static UpsertConfiguredAgentRequest NormalizeRequest(
        UpsertConfiguredAgentRequest request,
        ClientAccount clientAccount,
        PlatformSetting platformSettings,
        CatalogAgent? catalogAgent)
    {
        var derivedCategoryKey =
            catalogAgent?.CatalogCategory?.Key ?? request.LibraryCategoryKey;
        var derivedName = string.IsNullOrWhiteSpace(request.Name)
            ? catalogAgent?.Title ?? "Agente configurado"
            : request.Name.Trim();
        var derivedClinicName = string.IsNullOrWhiteSpace(request.ClinicName)
            ? clientAccount.CompanyName
            : request.ClinicName.Trim();
        var fallbackClinicName =
            string.IsNullOrWhiteSpace(derivedClinicName)
                ? clientAccount.FullName
                : derivedClinicName;

        return new UpsertConfiguredAgentRequest
        {
            CatalogAgentId = request.CatalogAgentId,
            TemplateKey = string.IsNullOrWhiteSpace(request.TemplateKey)
                ? "clinic-attendant"
                : request.TemplateKey.Trim(),
            LibraryCategoryKey = derivedCategoryKey,
            Name = derivedName,
            ClinicName = fallbackClinicName,
            Description = string.IsNullOrWhiteSpace(request.Description)
                ? catalogAgent?.Description ?? string.Empty
                : request.Description.Trim(),
            Status = string.IsNullOrWhiteSpace(request.Status)
                ? "Ativo"
                : request.Status.Trim(),
            Tags = request.Tags
                .Where(item => !string.IsNullOrWhiteSpace(item))
                .Select(item => item.Trim())
                .Distinct(StringComparer.OrdinalIgnoreCase)
                .ToArray(),
            ChannelLabel = string.IsNullOrWhiteSpace(request.ChannelLabel)
                ? "WhatsApp / Z-API"
                : request.ChannelLabel.Trim(),
            ProvisioningStatus = string.IsNullOrWhiteSpace(request.ProvisioningStatus)
                ? "rascunho-local"
                : request.ProvisioningStatus.Trim(),
            ProvisioningMessage = request.ProvisioningMessage.Trim(),
            N8nFolderId = string.IsNullOrWhiteSpace(request.N8nFolderId)
                ? platformSettings.N8nFolderId
                : request.N8nFolderId.Trim(),
            N8nProjectId = string.IsNullOrWhiteSpace(request.N8nProjectId)
                ? platformSettings.N8nProjectId
                : request.N8nProjectId.Trim(),
            N8nWorkflowId = string.IsNullOrWhiteSpace(request.N8nWorkflowId)
                ? null
                : request.N8nWorkflowId.Trim(),
            N8nWorkflowUrl = string.IsNullOrWhiteSpace(request.N8nWorkflowUrl)
                ? null
                : request.N8nWorkflowUrl.Trim(),
            ConfigurationJson = string.IsNullOrWhiteSpace(request.ConfigurationJson)
                ? "{}"
                : request.ConfigurationJson.Trim(),
        };
    }

    private static ConfiguredAgent BuildEntity(
        Guid clientAccountId,
        UpsertConfiguredAgentRequest request) =>
        new()
        {
            Id = Guid.NewGuid(),
            ClientAccountId = clientAccountId,
            CatalogAgentId = request.CatalogAgentId,
            TemplateKey = request.TemplateKey,
            LibraryCategoryKey = request.LibraryCategoryKey,
            Name = request.Name,
            ClinicName = request.ClinicName,
            Description = request.Description,
            Status = request.Status,
            TagsCsv = string.Join(',', request.Tags),
            ChannelLabel = request.ChannelLabel,
            ProvisioningStatus = request.ProvisioningStatus,
            ProvisioningMessage = request.ProvisioningMessage,
            N8nFolderId = request.N8nFolderId,
            N8nProjectId = request.N8nProjectId,
            N8nWorkflowId = request.N8nWorkflowId,
            N8nWorkflowUrl = request.N8nWorkflowUrl,
            ConfigurationJson = request.ConfigurationJson,
            CreatedAtUtc = DateTime.UtcNow,
            UpdatedAtUtc = DateTime.UtcNow,
        };
}
