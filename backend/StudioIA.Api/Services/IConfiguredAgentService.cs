using StudioIA.Api.Contracts.Agents;

namespace StudioIA.Api.Services;

public interface IConfiguredAgentService
{
    Task<IReadOnlyList<ConfiguredAgentResponse>> ListByClientAsync(Guid clientAccountId, CancellationToken cancellationToken);
    Task<ConfiguredAgentResponse?> CreateAsync(Guid clientAccountId, UpsertConfiguredAgentRequest request, CancellationToken cancellationToken);
    Task<ConfiguredAgentResponse?> UpdateAsync(Guid clientAccountId, Guid configuredAgentId, UpsertConfiguredAgentRequest request, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(Guid clientAccountId, Guid configuredAgentId, CancellationToken cancellationToken);
}
