using Microsoft.AspNetCore.Mvc;

namespace StudioIA.Api.Controllers;

[ApiController]
[Route("api/health")]
public class HealthController : ControllerBase
{
    [HttpGet]
    public IActionResult Get() =>
        Ok(
            new
            {
                status = "ok",
                service = "studio.IA API",
                utcNow = DateTime.UtcNow,
            });
}
