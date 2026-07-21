using FlowScore.Api.Data;
using FlowScore.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlowScore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrainingDaysController : ControllerBase
{
    private readonly FlowScoreDbContext _dbContext;

    public TrainingDaysController(FlowScoreDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet("by-date/{date}")]
    public async Task<ActionResult<TrainingDay>> GetTrainingDayByDate(
        DateOnly date
    )
    {
        var trainingDay = await _dbContext.TrainingDays
            .SingleOrDefaultAsync(day => day.Date == date);

        if (trainingDay is null)
        {
            return NotFound();
        }

        return Ok(trainingDay);
    }

    [HttpPut("by-date/{date}")]
    public async Task<ActionResult<TrainingDay>> UpdateTrainingDay(
        DateOnly date,
        UpdateTrainingDayRequest request
    )
    {
        var trainingDay = await _dbContext.TrainingDays
            .SingleOrDefaultAsync(day => day.Date == date);

        if (trainingDay is null)
        {
            trainingDay = new TrainingDay
            {
                Date = date,
                IsRestDay = request.IsRestDay
            };

            _dbContext.TrainingDays.Add(trainingDay);
        }
        else
        {
            trainingDay.IsRestDay = request.IsRestDay;
        }

        if (request.IsRestDay)
        {
            var existingTrainingSessions =
                await _dbContext.TrainingSessions
                    .Where(session => session.Date == date)
                    .ToListAsync();

            _dbContext.TrainingSessions.RemoveRange(
                existingTrainingSessions
            );
        }

        await _dbContext.SaveChangesAsync();

        return Ok(trainingDay);
    }
}