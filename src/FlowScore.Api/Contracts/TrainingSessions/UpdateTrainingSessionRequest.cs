namespace FlowScore.Api.Contracts.TrainingSessions;

public class UpdateTrainingSessionRequest
{
    public string Type { get; set; } = string.Empty;

    public int DurationMinutes { get; set; }

    public string Intensity { get; set; } = string.Empty;

    public DateOnly Date { get; set; }
}