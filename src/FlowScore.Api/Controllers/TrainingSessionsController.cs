using FlowScore.Api.Data;
using FlowScore.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlowScore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrainingSessionsController : ControllerBase
{
    private readonly FlowScoreDbContext _dbContext;

    public TrainingSessionsController(FlowScoreDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<TrainingSession>>> GetTrainingSessions()
    {
        var trainingSessions = await _dbContext.TrainingSessions
            .OrderBy(session => session.Date)
            .ToListAsync();

        return Ok(trainingSessions);
    }

    [HttpGet("by-date/{date}")]
    public async Task<ActionResult<IEnumerable<TrainingSession>>>
        GetTrainingSessionsByDate(DateOnly date)
    {
        var trainingSessions = await _dbContext.TrainingSessions
            .Where(session => session.Date == date)
            .ToListAsync();

        return Ok(trainingSessions);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TrainingSession>> GetTrainingSessionById(
        int id
    )
    {
        var trainingSession =
            await _dbContext.TrainingSessions.FindAsync(id);

        if (trainingSession is null)
        {
            return NotFound();
        }

        return Ok(trainingSession);
    }

    [HttpPost]
    public async Task<ActionResult<TrainingSession>> CreateTrainingSession(
        TrainingSession trainingSession
    )
    {
        var isRestDay = await _dbContext.TrainingDays
            .AnyAsync(
                day =>
                    day.Date == trainingSession.Date &&
                    day.IsRestDay
            );

        if (isRestDay)
        {
            return Conflict(
                "A training session cannot be added on a rest day."
            );
        }

        _dbContext.TrainingSessions.Add(trainingSession);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetTrainingSessionById),
            new { id = trainingSession.Id },
            trainingSession
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTrainingSession(
        int id,
        TrainingSession updatedTrainingSession
    )
    {
        var existingTrainingSession =
            await _dbContext.TrainingSessions.FindAsync(id);

        if (existingTrainingSession is null)
        {
            return NotFound();
        }

        var isRestDay = await _dbContext.TrainingDays
            .AnyAsync(
                day =>
                    day.Date == updatedTrainingSession.Date &&
                    day.IsRestDay
            );

        if (isRestDay)
        {
            return Conflict(
                "A training session cannot be added on a rest day."
            );
        }

        existingTrainingSession.Type = updatedTrainingSession.Type;
        existingTrainingSession.DurationMinutes =
            updatedTrainingSession.DurationMinutes;
        existingTrainingSession.Intensity =
            updatedTrainingSession.Intensity;
        existingTrainingSession.Date = updatedTrainingSession.Date;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTrainingSession(int id)
    {
        var trainingSession =
            await _dbContext.TrainingSessions.FindAsync(id);

        if (trainingSession is null)
        {
            return NotFound();
        }

        _dbContext.TrainingSessions.Remove(trainingSession);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}