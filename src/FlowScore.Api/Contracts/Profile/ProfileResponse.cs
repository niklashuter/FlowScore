namespace FlowScore.Api.Contracts.Profile;

public class ProfileResponse
{
    public string Name { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public DateOnly? DateOfBirth { get; set; }

    public int? HeightCm { get; set; }

    public decimal? WeightKg { get; set; }

    public string? Gender { get; set; }
}