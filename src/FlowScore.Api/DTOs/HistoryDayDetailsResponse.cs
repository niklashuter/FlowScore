namespace FlowScore.Api.DTOs;

public class HistoryDayDetailsResponse
{
    public DateOnly Date { get; set; }
    public int FlowScore { get; set; }
    public int RecoveryScore { get; set; }
    public int NutritionScore { get; set; }
    public int TrainingScore { get; set; }
    public HistoryRecoveryResponse? Recovery { get; set; }
    public List<HistoryMealResponse> Meals { get; set; } = [];
    public List<HistoryTrainingResponse> TrainingSessions { get; set; } = [];
    public bool IsRestDay { get; set; }
}

public class HistoryRecoveryResponse
{
    public decimal SleepDurationHours { get; set; }
    public string SleepQuality { get; set; } = string.Empty;
    public string MorningFeeling { get; set; } = string.Empty;
}

public class HistoryMealResponse
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public TimeOnly Time { get; set; }
    public int? NutritionScore { get; set; }
}

public class HistoryTrainingResponse
{
    public int Id { get; set; }
    public string Type { get; set; } = string.Empty;
    public int DurationMinutes { get; set; }
    public string Intensity { get; set; } = string.Empty;
    public int Score { get; set; }
}