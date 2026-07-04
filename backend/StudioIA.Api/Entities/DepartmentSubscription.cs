namespace StudioIA.Api.Entities;

public class DepartmentSubscription
{
    public Guid Id { get; set; }
    public Guid ClientAccountId { get; set; }
    public string CategoryKey { get; set; } = string.Empty;
    public string CategoryLabel { get; set; } = string.Empty;
    public string Status { get; set; } = "inactive";
    public decimal MonthlyPrice { get; set; }
    public DateTime? StartedAtUtc { get; set; }
    public ClientAccount ClientAccount { get; set; } = null!;
}
