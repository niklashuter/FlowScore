using Microsoft.AspNetCore.Identity;

namespace FlowScore.Api.Models;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; } = string.Empty;
}