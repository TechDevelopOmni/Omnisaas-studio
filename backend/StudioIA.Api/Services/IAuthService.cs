using StudioIA.Api.Contracts.Auth;

namespace StudioIA.Api.Services;

public interface IAuthService
{
    Task<SignInResponse?> SignInAsync(SignInRequest request, CancellationToken cancellationToken);
}
