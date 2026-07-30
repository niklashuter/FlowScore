namespace FlowScore.Api.Models;

public class TrainingDay
{
    public int Id { get; set; }

    public DateOnly Date { get; set; }

    public bool IsRestDay { get; set; }

    public string UserId { get; set; } = string.Empty;

    public ApplicationUser User { get; set; } = null!;
}