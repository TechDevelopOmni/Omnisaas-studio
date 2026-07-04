using StudioIA.Api.Contracts.Agents;

namespace StudioIA.Api.Services;

public class ProvisioningService : IProvisioningService
{
    public Task<ProvisionAgentResponse> ProvisionAsync(
        ProvisionAgentRequest request,
        CancellationToken cancellationToken)
    {
        var workflowId = $"wf-{Guid.NewGuid():N}";

        return Task.FromResult(
            new ProvisionAgentResponse
            {
                WorkflowId = workflowId,
                WorkflowUrl = $"https://n8n.example.com/workflow/{workflowId}",
                Status = request.PublishOnCreate ? "provisioned" : "draft",
            });
    }
}
