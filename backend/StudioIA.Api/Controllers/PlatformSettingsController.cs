using Microsoft.AspNetCore.Mvc;
using StudioIA.Api.Contracts.PlatformSettings;
using StudioIA.Api.Services;

namespace StudioIA.Api.Controllers;

[ApiController]
[Route("api/admin/platform-settings")]
public class PlatformSettingsController(IPlatformSettingsService platformSettingsService)
    : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<PlatformSettingsResponse>> Get(
        CancellationToken cancellationToken) =>
        Ok(await platformSettingsService.GetAsync(cancellationToken));

    [HttpPut]
    public async Task<ActionResult<PlatformSettingsResponse>> Update(
        [FromBody] UpdatePlatformSettingsRequest request,
        CancellationToken cancellationToken) =>
        Ok(await platformSettingsService.UpdateAsync(request, cancellationToken));
}
