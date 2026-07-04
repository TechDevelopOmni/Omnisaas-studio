using Microsoft.AspNetCore.Mvc;
using StudioIA.Api.Contracts.Catalog;
using StudioIA.Api.Services;

namespace StudioIA.Api.Controllers;

[ApiController]
[Route("api/admin/catalog")]
public class CatalogController(ICatalogService catalogService) : ControllerBase
{
    [HttpGet("categories")]
    public async Task<ActionResult<IReadOnlyList<CatalogCategoryResponse>>> GetCategories(
        CancellationToken cancellationToken) =>
        Ok(await catalogService.GetCategoriesAsync(cancellationToken));

    [HttpPost("categories")]
    public async Task<ActionResult<CatalogCategoryResponse>> CreateCategory(
        [FromBody] UpsertCatalogCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var response = await catalogService.CreateCategoryAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetCategories), new { id = response.Id }, response);
    }

    [HttpPut("categories/{categoryId:guid}")]
    public async Task<ActionResult<CatalogCategoryResponse>> UpdateCategory(
        Guid categoryId,
        [FromBody] UpsertCatalogCategoryRequest request,
        CancellationToken cancellationToken)
    {
        var response = await catalogService.UpdateCategoryAsync(categoryId, request, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("categories/{categoryId:guid}")]
    public async Task<IActionResult> DeleteCategory(
        Guid categoryId,
        CancellationToken cancellationToken) =>
        await catalogService.DeleteCategoryAsync(categoryId, cancellationToken)
            ? NoContent()
            : NotFound();

    [HttpGet("agents")]
    public async Task<ActionResult<IReadOnlyList<CatalogAgentResponse>>> GetAgents(
        CancellationToken cancellationToken) =>
        Ok(await catalogService.GetAgentsAsync(cancellationToken));

    [HttpPost("agents")]
    public async Task<ActionResult<CatalogAgentResponse>> CreateAgent(
        [FromBody] UpsertCatalogAgentRequest request,
        CancellationToken cancellationToken)
    {
        var response = await catalogService.CreateAgentAsync(request, cancellationToken);
        return CreatedAtAction(nameof(GetAgents), new { id = response.Id }, response);
    }

    [HttpPut("agents/{agentId:guid}")]
    public async Task<ActionResult<CatalogAgentResponse>> UpdateAgent(
        Guid agentId,
        [FromBody] UpsertCatalogAgentRequest request,
        CancellationToken cancellationToken)
    {
        var response = await catalogService.UpdateAgentAsync(agentId, request, cancellationToken);
        return response is null ? NotFound() : Ok(response);
    }

    [HttpDelete("agents/{agentId:guid}")]
    public async Task<IActionResult> DeleteAgent(
        Guid agentId,
        CancellationToken cancellationToken) =>
        await catalogService.DeleteAgentAsync(agentId, cancellationToken)
            ? NoContent()
            : NotFound();
}
