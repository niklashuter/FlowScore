using FlowScore.Api.DTOs;
using FlowScore.Api.Data;
using Microsoft.EntityFrameworkCore;

namespace FlowScore.Api.Services;

public class HistoryService
{
    private readonly FlowScoreDbContext _dbContext;
    private readonly FlowScoreCalculator _flowScoreCalculator;

    public HistoryService(
        FlowScoreDbContext dbContext,
        FlowScoreCalculator flowScoreCalculator)
    {
        _dbContext = dbContext;
        _flowScoreCalculator = flowScoreCalculator;
    }

    public async Task<List<HistoryDayResponse>> GetHistoryAsync(
        string userId,
        int? days = null,
        DateOnly? endDate = null
    )
    {
        var recoveryDates = await _dbContext.RecoveryEntries
            .Where(entry => entry.UserId == userId)
            .Select(entry => entry.Date)
            .ToListAsync();

        var mealDates = await _dbContext.Meals
            .Where(meal => meal.UserId == userId)
            .Select(meal => meal.Date)
            .ToListAsync();

        var trainingSessionDates = await _dbContext.TrainingSessions
            .Where(session => session.UserId == userId)
            .Select(session => session.Date)
            .ToListAsync();

        var trainingDayDates = await _dbContext.TrainingDays
            .Where(trainingDay =>
                trainingDay.UserId == userId)
            .Select(trainingDay => trainingDay.Date)
            .ToListAsync();

        var dates = recoveryDates
            .Concat(mealDates)
            .Concat(trainingSessionDates)
            .Concat(trainingDayDates)
            .Distinct()
            .OrderByDescending(date => date)
            .ToList();
        
        if (days.HasValue)
        {
            var today = endDate ?? DateOnly.FromDateTime(DateTime.Today);
            var startDate = today.AddDays(-(days.Value - 1));

            dates = dates
                .Where(date => date >= startDate && date <= today)
                .ToList();
        }

        var history = new List<HistoryDayResponse>();

        foreach (var date in dates)
        {
            var flowScore =
                await _flowScoreCalculator.CalculateAsync(
                    date,
                    userId
                );

            history.Add(new HistoryDayResponse
            {
                Date = date,
                FlowScore = flowScore.FlowScore,
                RecoveryScore = flowScore.RecoveryScore,
                NutritionScore = flowScore.NutritionScore,
                TrainingScore = flowScore.TrainingScore,
                BalanceValue = flowScore.BalanceValue
            });
        }

        return history;
    }

    public async Task<HistoryDayDetailsResponse?> GetDayDetailsAsync(
        DateOnly date,
        string userId
    )
    {
        var recoveryEntry = await _dbContext.RecoveryEntries
            .SingleOrDefaultAsync(entry =>
                entry.UserId == userId &&
                entry.Date == date);

        var meals = await _dbContext.Meals
            .Where(meal =>
                meal.UserId == userId &&
                meal.Date == date)
            .OrderBy(meal => meal.Time)
            .ToListAsync();

        var trainingSessions = await _dbContext.TrainingSessions
            .Where(session =>
                session.UserId == userId &&
                session.Date == date)
            .ToListAsync();

        var trainingDay = await _dbContext.TrainingDays
            .SingleOrDefaultAsync(day =>
                day.UserId == userId &&
                day.Date == date);

        var hasData =
            recoveryEntry is not null ||
            meals.Count > 0 ||
            trainingSessions.Count > 0 ||
            trainingDay is not null;

        if (!hasData)
        {
            return null;
        }

        var flowScore =
            await _flowScoreCalculator.CalculateAsync(
                date,
                userId
            );

        return new HistoryDayDetailsResponse
        {
            Date = date,
            FlowScore = flowScore.FlowScore,
            RecoveryScore = flowScore.RecoveryScore,
            NutritionScore = flowScore.NutritionScore,
            TrainingScore = flowScore.TrainingScore,

            Recovery = recoveryEntry is null
                ? null
                : new HistoryRecoveryResponse
                {
                    SleepDurationHours =
                        recoveryEntry.SleepDurationHours,

                    SleepQuality =
                        recoveryEntry.SleepQuality,

                    MorningFeeling =
                        recoveryEntry.MorningFeeling
                },

            Meals = meals
                .Select(meal => new HistoryMealResponse
                {
                    Id = meal.Id,
                    Type = meal.Type,
                    Description = meal.Description,
                    Time = meal.Time,
                    NutritionScore = meal.NutritionScore
                })
                .ToList(),

            TrainingSessions = trainingSessions
                .Select(session => new HistoryTrainingResponse
                {
                    Id = session.Id,
                    Type = session.Type,
                    DurationMinutes = session.DurationMinutes,
                    Intensity = session.Intensity,
                    Score =
                        FlowScoreCalculator
                            .CalculateTrainingSessionScore(session)
                })
                .ToList(),

            IsRestDay = trainingDay?.IsRestDay ?? false
        };
    }
}