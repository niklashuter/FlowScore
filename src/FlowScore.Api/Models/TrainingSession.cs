namespace FlowScore.Api.Models;

public class TrainingSession
{
    public int Id { get; set; }

    public string Type { get; set; } = string.Empty;

    public int DurationMinutes { get; set; }

    public string Intensity { get; set; } = string.Empty;

    public DateOnly Date { get; set; }
}