using Microsoft.AspNetCore.Mvc;
using StudioIA.Api.Contracts.Auth;
using StudioIA.Api.Services;

namespace StudioIA.Api.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("sign-in")]
    [ProducesResponseType<SignInResponse>(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> SignIn(
        [FromBody] SignInRequest request,
        CancellationToken cancellationToken)
    {
        var response = await authService.SignInAsync(request, cancellationToken);

        if (response is null)
        {
            return Unauthorized(new { message = "Invalid email or password." });
        }

        return Ok(response);
    }
}
