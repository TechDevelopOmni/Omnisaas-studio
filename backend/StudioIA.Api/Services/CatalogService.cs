using Microsoft.EntityFrameworkCore;
using StudioIA.Api.Contracts.Catalog;
using StudioIA.Api.Data;
using StudioIA.Api.Entities;

namespace StudioIA.Api.Services;

public class CatalogService(StudioIaDbContext dbContext) : ICatalogService
{
    public async Task<IReadOnlyList<CatalogCategoryResponse>> GetCategoriesAsync(
        CancellationToken cancellationToken)
    {
        var entities = await dbContext.CatalogCategories
            .AsNoTracking()
            .OrderBy(item => item.GroupId)
            .ThenBy(item => item.Label)
            .ToListAsync(cancellationToken);

        return entities.Select(item => item.ToResponse()).ToList();
    }

    public async Task<IReadOnlyList<CatalogAgentResponse>> GetAgentsAsync(
        CancellationToken cancellationToken)
    {
        var entities = await dbContext.CatalogAgents
            .AsNoTracking()
            .Include(item => item.CatalogCategory)
            .OrderBy(item => item.CatalogCategory.Label)
            .ThenBy(item => item.Title)
            .ToListAsync(cancellationToken);
        return entities.Select(item => item.ToResponse()).ToList();
    }

    public async Task<CatalogCategoryResponse> CreateCategoryAsync(
        UpsertCatalogCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var entity = new CatalogCategory
        {
            Id = Guid.NewGuid(),
            Key = request.Key,
            Label = request.Label,
            Description = request.Description,
            GroupId = request.GroupId,
            MonthlyPrice = request.MonthlyPrice,
            UpdatedAtUtc = DateTime.UtcNow,
        };

        dbContext.CatalogCategories.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return entity.ToResponse();
    }

    public async Task<CatalogCategoryResponse?> UpdateCategoryAsync(
        Guid categoryId,
        UpsertCatalogCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var entity = await dbContext.CatalogCategories.FirstOrDefaultAsync(
            item => item.Id == categoryId,
            cancellationToken);

        if (entity is null)
        {
            return null;
        }

        entity.Key = request.Key;
        entity.Label = request.Label;
        entity.Description = request.Description;
        entity.GroupId = request.GroupId;
        entity.MonthlyPrice = request.MonthlyPrice;
        entity.UpdatedAtUtc = DateTime.UtcNow;

        await dbContext.SaveChangesAsync(cancellationToken);
        return entity.ToResponse();
    }

    public async Task<bool> DeleteCategoryAsync(
        Guid categoryId,
        CancellationToken cancellationToken)
    {
        var entity = await dbContext.CatalogCategories.FirstOrDefaultAsync(
            item => item.Id == categoryId,
            cancellationToken);

        if (entity is null)
        {
            return false;
        }

        dbContext.CatalogCategories.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }

    public async Task<CatalogAgentResponse> CreateAgentAsync(
        UpsertCatalogAgentRequest request,
        CancellationToken cancellationToken)
    {
        var entity = new CatalogAgent
        {
            Id = Guid.NewGuid(),
            CatalogCategoryId = request.CatalogCategoryId,
            Title = request.Title,
            Role = request.Role,
            Description = request.Description,
            HighlightsCsv = string.Join(',', request.Highlights),
            Route = request.Route,
            Available = request.Available,
            Accent = request.Visual.Accent,
            Glow = request.Visual.Glow,
            Panel = request.Visual.Panel,
            Symbol = request.Visual.Symbol,
        };

        dbContext.CatalogAgents.Add(entity);
        await dbContext.SaveChangesAsync(cancellationToken);

        entity.CatalogCategory = await dbContext.CatalogCategories
            .AsNoTracking()
            .FirstAsync(item => item.Id == entity.CatalogCategoryId, cancellationToken);

        return entity.ToResponse();
    }

    public async Task<CatalogAgentResponse?> UpdateAgentAsync(
        Guid agentId,
        UpsertCatalogAgentRequest request,
        CancellationToken cancellationToken)
    {
        var entity = await dbContext.CatalogAgents
            .Include(item => item.CatalogCategory)
            .FirstOrDefaultAsync(item => item.Id == agentId, cancellationToken);

        if (entity is null)
        {
            return null;
        }

        entity.CatalogCategoryId = request.CatalogCategoryId;
        entity.Title = request.Title;
        entity.Role = request.Role;
        entity.Description = request.Description;
        entity.HighlightsCsv = string.Join(',', request.Highlights);
        entity.Route = request.Route;
        entity.Available = request.Available;
        entity.Accent = request.Visual.Accent;
        entity.Glow = request.Visual.Glow;
        entity.Panel = request.Visual.Panel;
        entity.Symbol = request.Visual.Symbol;

        await dbContext.SaveChangesAsync(cancellationToken);

        entity.CatalogCategory = await dbContext.CatalogCategories
            .AsNoTracking()
            .FirstAsync(item => item.Id == entity.CatalogCategoryId, cancellationToken);

        return entity.ToResponse();
    }

    public async Task<bool> DeleteAgentAsync(
        Guid agentId,
        CancellationToken cancellationToken)
    {
        var entity = await dbContext.CatalogAgents.FirstOrDefaultAsync(
            item => item.Id == agentId,
            cancellationToken);

        if (entity is null)
        {
            return false;
        }

        dbContext.CatalogAgents.Remove(entity);
        await dbContext.SaveChangesAsync(cancellationToken);
        return true;
    }
}
