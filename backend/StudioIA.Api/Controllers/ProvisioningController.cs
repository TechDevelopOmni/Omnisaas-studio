using Microsoft.AspNetCore.Mvc;
using StudioIA.Api.Contracts.Agents;
using StudioIA.Api.Services;

namespace StudioIA.Api.Controllers;

[ApiController]
[Route("api/agents")]
public class ProvisioningController(IProvisioningService provisioningService)
    : ControllerBase
{
    [HttpPost("provision")]
    public async Task<ActionResult<ProvisionAgentResponse>> Provision(
        [FromBody] ProvisionAgentRequest request,
        CancellationToken cancellationToken) =>
        Ok(await provisioningService.ProvisionAsync(request, cancellationToken));
}
