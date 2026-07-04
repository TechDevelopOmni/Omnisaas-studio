namespace StudioIA.Api.Contracts.Auth;

public record SignInRequest(string Email, string Password);

public class AuthUserResponse
{
    public Guid UserId { get; init; }
    public string UserName { get; init; } = string.Empty;
    public string Email { get; init; } = string.Empty;
    public string Avatar { get; init; } = string.Empty;
    public string[] Authority { get; init; } = Array.Empty<string>();
}

public class SignInResponse
{
    public string Token { get; init; } = string.Empty;
    public AuthUserResponse User { get; init; } = new();
}
