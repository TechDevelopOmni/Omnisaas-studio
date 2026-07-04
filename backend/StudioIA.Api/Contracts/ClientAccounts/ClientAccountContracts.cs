namespace StudioIA.Api.Contracts.ClientAccounts;

public class ClientProfileResponse
{
    public string FullName { get; init; } = string.Empty;
    public string CompanyName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string Document { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
}

public class PaymentMethodResponse
{
    public string Brand { get; init; } = string.Empty;
    public string HolderName { get; init; } = string.Empty;
    public string Last4 { get; init; } = string.Empty;
    public string ExpiryMonth { get; init; } = string.Empty;
    public string ExpiryYear { get; init; } = string.Empty;
    public string BillingEmail { get; init; } = string.Empty;
}

public class SubscriptionResponse
{
    public Guid Id { get; init; }
    public string CategoryKey { get; init; } = string.Empty;
    public string CategoryLabel { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public decimal MonthlyPrice { get; init; }
    public DateTime? StartedAtUtc { get; init; }
}

public class ClientAccountSummaryResponse
{
    public Guid Id { get; init; }
    public Guid UserAccountId { get; init; }
    public string UserName { get; init; } = string.Empty;
    public string CompanyName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public int ActiveSubscriptionCount { get; init; }
    public int ConfiguredAgentCount { get; init; }
}

public class ClientAccountDetailsResponse
{
    public Guid Id { get; init; }
    public Guid UserAccountId { get; init; }
    public string UserName { get; init; } = string.Empty;
    public ClientProfileResponse Profile { get; init; } = new();
    public PaymentMethodResponse PaymentMethod { get; init; } = new();
    public SubscriptionResponse[] Subscriptions { get; init; } = Array.Empty<SubscriptionResponse>();
    public DateTime UpdatedAtUtc { get; init; }
}

public class UpdateClientProfileRequest
{
    public string FullName { get; init; } = string.Empty;
    public string CompanyName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string Document { get; init; } = string.Empty;
    public string Role { get; init; } = string.Empty;
}

public class UpdatePaymentMethodRequest
{
    public string Brand { get; init; } = "Visa";
    public string HolderName { get; init; } = string.Empty;
    public string Last4 { get; init; } = string.Empty;
    public string ExpiryMonth { get; init; } = string.Empty;
    public string ExpiryYear { get; init; } = string.Empty;
    public string BillingEmail { get; init; } = string.Empty;
}

public class UpdateSubscriptionRequest
{
    public string CategoryKey { get; init; } = string.Empty;
    public string Status { get; init; } = "active";
}
