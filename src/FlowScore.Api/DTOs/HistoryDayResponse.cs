namespace FlowScore.Api.DTOs;

public class HistoryDayResponse
{
    public DateOnly Date { get; set; }

    public int? FlowScore { get; set; }

    public int? RecoveryScore { get; set; }

    public int? NutritionScore { get; set; }

    public int? TrainingScore { get; set; }

    public string BalanceValue { get; set; } = string.Empty;
}