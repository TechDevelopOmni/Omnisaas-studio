namespace StudioIA.Api.Entities;

public class UserAccount
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string Avatar { get; set; } = string.Empty;
    public string AuthorityCsv { get; set; } = string.Empty;
    public ClientAccount? ClientAccount { get; set; }
}
