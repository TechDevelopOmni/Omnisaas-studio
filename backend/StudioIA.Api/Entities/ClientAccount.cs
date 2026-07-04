namespace StudioIA.Api.Entities;

public class ClientAccount
{
    public Guid Id { get; set; }
    public Guid UserAccountId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string CompanyName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string Document { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public string PaymentBrand { get; set; } = "Visa";
    public string PaymentHolderName { get; set; } = string.Empty;
    public string PaymentLast4 { get; set; } = string.Empty;
    public string PaymentExpiryMonth { get; set; } = string.Empty;
    public string PaymentExpiryYear { get; set; } = string.Empty;
    public string BillingEmail { get; set; } = string.Empty;
    public DateTime UpdatedAtUtc { get; set; }
    public UserAccount UserAccount { get; set; } = null!;
    public ICollection<DepartmentSubscription> Subscriptions { get; set; } =
        new List<DepartmentSubscription>();
    public ICollection<ConfiguredAgent> ConfiguredAgents { get; set; } =
        new List<ConfiguredAgent>();
}
