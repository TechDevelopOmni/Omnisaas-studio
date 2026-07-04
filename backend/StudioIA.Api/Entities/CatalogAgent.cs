namespace StudioIA.Api.Entities;

public class CatalogAgent
{
    public Guid Id { get; set; }
    public Guid CatalogCategoryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string HighlightsCsv { get; set; } = string.Empty;
    public string Route { get; set; } = "/criaragente";
    public bool Available { get; set; }
    public string Accent { get; set; } = "#22d3ee";
    public string Glow { get; set; } = "#0e7490";
    public string Panel { get; set; } = "#0b1c23";
    public string Symbol { get; set; } = "AG";
    public CatalogCategory CatalogCategory { get; set; } = null!;
}
