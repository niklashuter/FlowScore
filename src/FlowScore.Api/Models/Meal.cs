namespace FlowScore.Api.Models;

public class Meal
{
    public int Id { get; set; }

    public string Type { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public TimeOnly Time { get; set; }

    public DateOnly Date { get; set; }

    public int? NutritionScore { get; set; }

    public string? NutritionFeedback { get; set; }
}