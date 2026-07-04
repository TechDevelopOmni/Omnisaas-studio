using StudioIA.Api.Contracts.Agents;
using StudioIA.Api.Contracts.Auth;
using StudioIA.Api.Contracts.Catalog;
using StudioIA.Api.Contracts.ClientAccounts;
using StudioIA.Api.Contracts.PlatformSettings;
using StudioIA.Api.Entities;

namespace StudioIA.Api.Services;

internal static class Mappers
{
    public static AuthUserResponse ToAuthUserResponse(this UserAccount entity) =>
        new()
        {
            UserId = entity.Id,
            UserName = entity.UserName,
            Email = entity.Email,
            Avatar = entity.Avatar,
            Authority = SplitCsv(entity.AuthorityCsv),
        };

    public static CatalogCategoryResponse ToResponse(this CatalogCategory entity) =>
        new()
        {
            Id = entity.Id,
            Key = entity.Key,
            Label = entity.Label,
            Description = entity.Description,
            GroupId = entity.GroupId,
            MonthlyPrice = entity.MonthlyPrice,
        };

    public static CatalogAgentResponse ToResponse(this CatalogAgent entity) =>
        new()
        {
            Id = entity.Id,
            CatalogCategoryId = entity.CatalogCategoryId,
            CategoryKey = entity.CatalogCategory.Key,
            Title = entity.Title,
            Role = entity.Role,
            Description = entity.Description,
            Highlights = SplitCsv(entity.HighlightsCsv),
            Route = entity.Route,
            Available = entity.Available,
            Visual = new CatalogVisualResponse
            {
                Accent = entity.Accent,
                Glow = entity.Glow,
                Panel = entity.Panel,
                Symbol = entity.Symbol,
            },
        };

    public static ClientAccountSummaryResponse ToSummaryResponse(this ClientAccount entity) =>
        new()
        {
            Id = entity.Id,
            UserAccountId = entity.UserAccountId,
            UserName = entity.UserAccount.UserName,
            CompanyName = entity.CompanyName,
            Email = entity.Email,
            ActiveSubscriptionCount = entity.Subscriptions.Count(item => item.Status == "active"),
            ConfiguredAgentCount = entity.ConfiguredAgents.Count,
        };

    public static ClientAccountDetailsResponse ToDetailsResponse(this ClientAccount entity) =>
        new()
        {
            Id = entity.Id,
            UserAccountId = entity.UserAccountId,
            UserName = entity.UserAccount.UserName,
            Profile = new ClientProfileResponse
            {
                FullName = entity.FullName,
                CompanyName = entity.CompanyName,
                Email = entity.Email,
                Phone = entity.Phone,
                Document = entity.Document,
                Role = entity.Role,
            },
            PaymentMethod = new PaymentMethodResponse
            {
                Brand = entity.PaymentBrand,
                HolderName = entity.PaymentHolderName,
                Last4 = entity.PaymentLast4,
                ExpiryMonth = entity.PaymentExpiryMonth,
                ExpiryYear = entity.PaymentExpiryYear,
                BillingEmail = entity.BillingEmail,
            },
            Subscriptions = entity.Subscriptions
                .OrderBy(item => item.CategoryLabel)
                .Select(item => item.ToResponse())
                .ToArray(),
            UpdatedAtUtc = entity.UpdatedAtUtc,
        };

    public static SubscriptionResponse ToResponse(this DepartmentSubscription entity) =>
        new()
        {
            Id = entity.Id,
            CategoryKey = entity.CategoryKey,
            CategoryLabel = entity.CategoryLabel,
            Status = entity.Status,
            MonthlyPrice = entity.MonthlyPrice,
            StartedAtUtc = entity.StartedAtUtc,
        };

    public static ConfiguredAgentResponse ToResponse(this ConfiguredAgent entity) =>
        new()
        {
            Id = entity.Id,
            ClientAccountId = entity.ClientAccountId,
            CatalogAgentId = entity.CatalogAgentId,
            TemplateKey = entity.TemplateKey,
            LibraryCategoryKey = entity.LibraryCategoryKey,
            Name = entity.Name,
            ClinicName = entity.ClinicName,
            Description = entity.Description,
            Status = entity.Status,
            Tags = SplitCsv(entity.TagsCsv),
            ChannelLabel = entity.ChannelLabel,
            ProvisioningStatus = entity.ProvisioningStatus,
            ProvisioningMessage = entity.ProvisioningMessage,
            N8nFolderId = entity.N8nFolderId,
            N8nProjectId = entity.N8nProjectId,
            N8nWorkflowId = entity.N8nWorkflowId,
            N8nWorkflowUrl = entity.N8nWorkflowUrl,
            ConfigurationJson = entity.ConfigurationJson,
            CreatedAtUtc = entity.CreatedAtUtc,
            UpdatedAtUtc = entity.UpdatedAtUtc,
        };

    public static PlatformSettingsResponse ToResponse(this PlatformSetting entity) =>
        new()
        {
            Id = entity.Id,
            N8nFolderId = entity.N8nFolderId,
            N8nProjectId = entity.N8nProjectId,
            N8nGuideWorkflowId = entity.N8nGuideWorkflowId,
            PublishOnCreate = entity.PublishOnCreate,
            OpenAiCredentialId = entity.OpenAiCredentialId,
            OpenAiCredentialName = entity.OpenAiCredentialName,
            RedisCredentialId = entity.RedisCredentialId,
            RedisCredentialName = entity.RedisCredentialName,
            WebhookPrefix = entity.WebhookPrefix,
            UpdatedAtUtc = entity.UpdatedAtUtc,
        };

    public static string[] SplitCsv(string value) =>
        value
            .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
}
