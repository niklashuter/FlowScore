namespace FlowScore.Api.Dtos.Auth;

public class LoginResponse
{
    public string Token { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }
}