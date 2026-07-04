namespace StudioIA.Api.Entities;

public class CatalogCategory
{
    public Guid Id { get; set; }
    public string Key { get; set; } = string.Empty;
    public string Label { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string GroupId { get; set; } = "departamentos";
    public decimal MonthlyPrice { get; set; }
    public DateTime UpdatedAtUtc { get; set; }
    public ICollection<CatalogAgent> Agents { get; set; } = new List<CatalogAgent>();
}
