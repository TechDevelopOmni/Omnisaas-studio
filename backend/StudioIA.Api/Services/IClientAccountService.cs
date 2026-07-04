using StudioIA.Api.Contracts.ClientAccounts;

namespace StudioIA.Api.Services;

public interface IClientAccountService
{
    Task<IReadOnlyList<ClientAccountSummaryResponse>> ListAsync(CancellationToken cancellationToken);
    Task<ClientAccountDetailsResponse?> GetByIdAsync(Guid clientAccountId, CancellationToken cancellationToken);
    Task<ClientAccountDetailsResponse?> GetByUserKeyAsync(string userKey, CancellationToken cancellationToken);
    Task<ClientAccountDetailsResponse?> UpdateProfileAsync(Guid clientAccountId, UpdateClientProfileRequest request, CancellationToken cancellationToken);
    Task<ClientAccountDetailsResponse?> UpdatePaymentMethodAsync(Guid clientAccountId, UpdatePaymentMethodRequest request, CancellationToken cancellationToken);
    Task<ClientAccountDetailsResponse?> SetSubscriptionAsync(Guid clientAccountId, UpdateSubscriptionRequest request, CancellationToken cancellationToken);
}
