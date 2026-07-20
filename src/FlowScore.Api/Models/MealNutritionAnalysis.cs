namespace FlowScore.Api.Models;

public class MealNutritionAnalysis
{
    public int NutritionScore { get; set; }
    public int ProteinScore { get; set; }

    public int CarbohydrateScore { get; set; }

    public int HealthyFatScore { get; set; }

    public int MicronutrientScore { get; set; }

    public int ProcessingScore { get; set; }

    public string Feedback { get; set; } = string.Empty;
}