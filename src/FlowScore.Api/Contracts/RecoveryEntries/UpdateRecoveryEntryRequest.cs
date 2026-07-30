namespace FlowScore.Api.Contracts.RecoveryEntries;

public class UpdateRecoveryEntryRequest
{
    public decimal SleepDurationHours { get; set; }

    public string SleepQuality { get; set; } = string.Empty;

    public string MorningFeeling { get; set; } = string.Empty;

    public DateOnly Date { get; set; }
}