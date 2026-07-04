using StudioIA.Api.Contracts.Agents;

namespace StudioIA.Api.Services;

public interface IProvisioningService
{
    Task<ProvisionAgentResponse> ProvisionAsync(ProvisionAgentRequest request, CancellationToken cancellationToken);
}
