using Microsoft.EntityFrameworkCore;
using StudioIA.Api.Contracts.Auth;
using StudioIA.Api.Data;

namespace StudioIA.Api.Services;

public class AuthService(StudioIaDbContext dbContext) : IAuthService
{
    public async Task<SignInResponse?> SignInAsync(
        SignInRequest request,
        CancellationToken cancellationToken)
    {
        var user = await dbContext.UserAccounts
            .AsNoTracking()
            .FirstOrDefaultAsync(
                item =>
                    item.Email == request.Email &&
                    item.Password == request.Password,
                cancellationToken);

        if (user is null)
        {
            return null;
        }

        return new SignInResponse
        {
            Token = $"mock-token-{user.Id:N}",
            User = user.ToAuthUserResponse(),
        };
    }
}
