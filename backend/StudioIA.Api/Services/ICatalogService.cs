using StudioIA.Api.Contracts.Catalog;

namespace StudioIA.Api.Services;

public interface ICatalogService
{
    Task<IReadOnlyList<CatalogCategoryResponse>> GetCategoriesAsync(CancellationToken cancellationToken);
    Task<IReadOnlyList<CatalogAgentResponse>> GetAgentsAsync(CancellationToken cancellationToken);
    Task<CatalogCategoryResponse> CreateCategoryAsync(UpsertCatalogCategoryRequest request, CancellationToken cancellationToken);
    Task<CatalogCategoryResponse?> UpdateCategoryAsync(Guid categoryId, UpsertCatalogCategoryRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteCategoryAsync(Guid categoryId, CancellationToken cancellationToken);
    Task<CatalogAgentResponse> CreateAgentAsync(UpsertCatalogAgentRequest request, CancellationToken cancellationToken);
    Task<CatalogAgentResponse?> UpdateAgentAsync(Guid agentId, UpsertCatalogAgentRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAgentAsync(Guid agentId, CancellationToken cancellationToken);
}
