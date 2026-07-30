namespace FlowScore.Api.Contracts.Meals;

public class MealResponse
{
    public int Id { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public TimeOnly Time { get; set; }

    public DateOnly Date { get; set; }

    public int? NutritionScore { get; set; }

    public string? NutritionFeedback { get; set; }
}