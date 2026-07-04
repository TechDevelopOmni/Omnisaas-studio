namespace StudioIA.Api.Contracts.Catalog;

public class CatalogCategoryResponse
{
    public Guid Id { get; init; }
    public string Key { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string GroupId { get; init; } = string.Empty;
    public decimal MonthlyPrice { get; init; }
}

public class UpsertCatalogCategoryRequest
{
    public string Key { get; init; } = string.Empty;
    public string Label { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string GroupId { get; init; } = "departamentos";
    public decimal MonthlyPrice { get; init; } = 299;
}

public class CatalogVisualResponse
{
    public string Accent { get; init; } = string.Empty;
    public string Glow { get; init; } = string.Empty;
    public string Panel { get; init; } = string.Empty;
    public string Symbol { get; init; } = string.Empty;
}

public class CatalogAgentResponse
{
    public Guid Id { get; init; }
    public Guid CatalogCategoryId { get; init; }
    public string CategoryKey { get; init; } = string.Empty;
    public string Title { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string[] Highlights { get; init; } = Array.Empty<string>();
    public string Route { get; init; } = string.Empty;
    public bool Available { get; init; }
    public CatalogVisualResponse Visual { get; init; } = new();
}

public class UpsertCatalogAgentRequest
{
    public Guid CatalogCategoryId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
    public string Description { get; init; } = string.Empty;
    public string[] Highlights { get; init; } = Array.Empty<string>();
    public string Route { get; init; } = "/criaragente";
    public bool Available { get; init; }
    public CatalogVisualResponse Visual { get; init; } = new();
}
