using Microsoft.AspNetCore.Mvc;
using StudioIA.Api.Contracts.Agents;
using StudioIA.Api.Services;

namespace StudioIA.Api.Controllers;

[ApiController]
[Route("api/client-accounts/{clientAccountId:guid}/configured-agents")]
public class ConfiguredAgentsController(IConfiguredAgentService configuredAgentService)
    : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IReadOnlyList<ConfiguredAgentResponse>>> List(
        Guid clientAccountId,
        CancellationToken cancellationToken) =>
        Ok(await configuredAgentService.ListByClientAsync(clientAccountId, cancellationToken));

    [HttpPost]
    public async Task<ActionResult<ConfiguredAgentResponse>> Create(
        Guid clientAccountId,
        [FromBody] UpsertConfiguredAgentRequest request,
        CancellationToken cancellationToken)
    {
        var response = await configuredAgentService.CreateAsync(clientAccountId, request, cancellationToken);
        return response is null
            ? NotFound()
            : CreatedAtAction(nameof(List), new { clientAccountId }, response);
    }

    [HttpPut("{configuredAgentId:guid}")]
    public async Task<ActionResult<ConfiguredAgentResponse>> Update(
        Guid clientAccountId,
        Guid configuredAgentId,
        [FromBody] UpsertConfiguredAgentRequest request,
        CancellationToken cancellationToken)
    {
        var response = await configuredAgentService.UpdateAsync(
            clientAccountId,
            configuredAgentId,
            request,
            cancellationToken);

        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("{configuredAgentId:guid}")]
    public async Task<IActionResult> Delete(
        Guid clientAccountId,
        Guid configuredAgentId,
        CancellationToken cancellationToken) =>
        await configuredAgentService.DeleteAsync(clientAccountId, configuredAgentId, cancellationToken)
            ? NoContent()
            : NotFound();
}
