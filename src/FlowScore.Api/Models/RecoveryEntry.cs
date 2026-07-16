namespace FlowScore.Api.Models;

public class RecoveryEntry
{
    public int Id { get; set; }

    public decimal SleepDurationHours { get; set; }

    public string SleepQuality { get; set; } = string.Empty;

    public string MorningFeeling { get; set; } = string.Empty;

    public DateOnly Date { get; set; }
}