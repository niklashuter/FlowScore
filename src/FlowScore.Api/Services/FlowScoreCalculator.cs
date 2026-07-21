using FlowScore.Api.Data;
using FlowScore.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FlowScore.Api.Services;

public class FlowScoreCalculator
{
    private readonly FlowScoreDbContext _dbContext;

    public FlowScoreCalculator(FlowScoreDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<FlowScoreResult> CalculateAsync(DateOnly date)
    {
        var recoveryEntry = await _dbContext.RecoveryEntries
            .SingleOrDefaultAsync(entry => entry.Date == date);

        var recoveryScore =
            CalculateRecoveryScore(recoveryEntry);

        var nutritionScore =
            await CalculateNutritionScoreAsync(date);

        var trainingScore =
            await CalculateTrainingScoreAsync(date);

        var flowScore = CalculateFlowScore(
            recoveryScore,
            nutritionScore,
            trainingScore
        );

        return new FlowScoreResult
        {
            RecoveryScore = recoveryScore,
            NutritionScore = nutritionScore,
            TrainingScore = trainingScore,
            FlowScore = flowScore
        };
    }

    private static int CalculateRecoveryScore(
        RecoveryEntry? recoveryEntry
    )
    {
        if (recoveryEntry is null)
        {
            return 0;
        }

        var sleepDurationScore =
            CalculateSleepDurationScore(
                recoveryEntry.SleepDurationHours
            );

        var sleepQualityScore =
            CalculateSleepQualityScore(
                recoveryEntry.SleepQuality
            );

        var morningFeelingScore =
            CalculateMorningFeelingScore(
                recoveryEntry.MorningFeeling
            );

        var recoveryScore =
            sleepDurationScore * 0.5 +
            sleepQualityScore * 0.25 +
            morningFeelingScore * 0.25;

        return (int)Math.Round(recoveryScore);
    }

    private static int CalculateSleepDurationScore(
        decimal sleepDurationHours
    )
    {
        if (sleepDurationHours >= 8m &&
            sleepDurationHours <= 9m)
        {
            return 100;
        }

        if (
            (sleepDurationHours >= 6.5m &&
            sleepDurationHours < 8m) ||
            (sleepDurationHours > 9m &&
            sleepDurationHours <= 10m)
        )
        {
            return 75;
        }

        if (
            (sleepDurationHours >= 5.5m &&
            sleepDurationHours < 6.5m) ||
            (sleepDurationHours > 10m &&
            sleepDurationHours <= 11m)
        )
        {
            return 50;
        }

        return 25;
    }

    private static int CalculateSleepQualityScore(
        string sleepQuality
    )
    {
        return sleepQuality.ToLowerInvariant() switch
        {
            "good" => 100,
            "okay" => 65,
            "poor" => 30,
            _ => 0
        };
    }

    private static int CalculateMorningFeelingScore(
        string morningFeeling
    )
    {
        return morningFeeling.ToLowerInvariant() switch
        {
            "rested" => 100,
            "neutral" => 65,
            "tired" => 30,
            _ => 0
        };
    }

    private async Task<int> CalculateNutritionScoreAsync(
        DateOnly date
    )
    {
        var meals = await _dbContext.Meals
            .Where(meal => meal.Date == date)
            .ToListAsync();

        var scoredMeals = meals
            .Where(meal => meal.NutritionScore.HasValue)
            .ToList();

        if (scoredMeals.Count == 0)
        {
            return 0;
        }

        var qualityScore =
            CalculateNutritionQualityScore(scoredMeals);

        var completenessFactor =
            CalculateNutritionCompletenessFactor(scoredMeals);

        var nutritionScore =
            qualityScore * completenessFactor;

        return (int)Math.Round(nutritionScore);
    }

    private static double CalculateNutritionQualityScore(
        List<Meal> meals
    )
    {
        var mealGroups = meals
            .GroupBy(
                meal => meal.Type.ToLowerInvariant()
            )
            .ToDictionary(
                group => group.Key,
                group => group.Average(
                    meal => meal.NutritionScore!.Value
                )
            );

        var mealWeights = new Dictionary<string, double>
        {
            ["breakfast"] = 0.25,
            ["lunch"] = 0.30,
            ["dinner"] = 0.35,
            ["snack"] = 0.10
        };

        double weightedScore = 0;
        double availableWeight = 0;

        foreach (var mealGroup in mealGroups)
        {
            if (!mealWeights.TryGetValue(
                mealGroup.Key,
                out var weight
            ))
            {
                continue;
            }

            weightedScore += mealGroup.Value * weight;
            availableWeight += weight;
        }

        if (availableWeight == 0)
        {
            return 0;
        }

        return weightedScore / availableWeight;
    }

    private static double CalculateNutritionCompletenessFactor(
        List<Meal> meals
    )
    {
        var mainMealTypes = new[]
        {
            "breakfast",
            "lunch",
            "dinner"
        };

        var existingMainMealCount = mainMealTypes.Count(
            mealType => meals.Any(
                meal => string.Equals(
                    meal.Type,
                    mealType,
                    StringComparison.OrdinalIgnoreCase
                )
            )
        );

        var baseFactor = existingMainMealCount switch
        {
            1 => 0.50,
            2 => 0.75,
            3 => 0.90,
            _ => 0.00
        };

        var snackCount = meals.Count(
            meal => string.Equals(
                meal.Type,
                "snack",
                StringComparison.OrdinalIgnoreCase
            )
        );

        var snackBonus = snackCount * 0.05;

        return Math.Min(baseFactor + snackBonus, 1.00);
    }

    private async Task<int> CalculateTrainingScoreAsync(
        DateOnly date
    )
    {
        var trainingDay = await _dbContext.TrainingDays
            .SingleOrDefaultAsync(day => day.Date == date);

        if (trainingDay?.IsRestDay == true)
        {
            return 80;
        }

        var trainingSessions = await _dbContext.TrainingSessions
            .Where(session => session.Date == date)
            .ToListAsync();

        if (trainingSessions.Count == 0)
        {
            return 0;
        }

        var sessionScores = trainingSessions
            .Select(CalculateTrainingSessionScore);

        return (int)Math.Round(sessionScores.Average());
    }

    private static int CalculateTrainingSessionScore(
        TrainingSession trainingSession
    )
    {
        var trainingLoadScore =
            CalculateTrainingLoadScore(
                trainingSession.DurationMinutes,
                trainingSession.Intensity
            );

        var typeScore =
            CalculateTrainingTypeScore(
                trainingSession.Type
            );

        var sessionScore =
            trainingLoadScore * 0.80 +
            typeScore * 0.20;

        return (int)Math.Round(sessionScore);
    }

    private static int CalculateTrainingLoadScore(
        int durationMinutes,
        string intensity
    )
    {
        return intensity.ToLowerInvariant() switch
        {
            // Training load score matrix:
            //            30   60   90   120  150  180+
            // Light      80   90   85    75   60   45
            // Moderate   70   95  100    95   80   60
            // Hard       70  100   95    75   55   35

            "light" => durationMinutes switch
            {
                <= 30 => 80,
                <= 60 => 90,
                <= 90 => 85,
                <= 120 => 75,
                <= 150 => 60,
                _ => 45
            },

            "moderate" => durationMinutes switch
            {
                <= 30 => 70,
                <= 60 => 95,
                <= 90 => 100,
                <= 120 => 95,
                <= 150 => 80,
                _ => 60
            },

            "hard" => durationMinutes switch
            {
                <= 30 => 70,
                <= 60 => 100,
                <= 90 => 95,
                <= 120 => 75,
                <= 150 => 55,
                _ => 35
            },
            
            _ => 0
        };
    }

    private static int CalculateTrainingTypeScore(
        string trainingType
    )
    {
        return trainingType.ToLowerInvariant() switch
        {
            "strength training" => 100,
            "running" => 100,
            "cycling" => 100,
            "swimming" => 100,
            "team sports" => 100,
            "hiit" => 100,
            "mobility" => 95,
            "yoga" => 95,
            "other" => 90,
            _ => 0
        };
    }

    private static int CalculateFlowScore(
        int recoveryScore,
        int nutritionScore,
        int trainingScore
    )
    {
        return 0;
    }
}