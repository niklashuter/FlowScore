namespace FlowScore.Api.Contracts.Meals;

public class UpdateMealRequest
{
    public string Type { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public TimeOnly Time { get; set; }

    public DateOnly Date { get; set; }
}