using FlowScore.Api.Data;
using FlowScore.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using FlowScore.Api.Contracts.TrainingSessions;

namespace FlowScore.Api.Controllers;

[Authorize]
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
    public async Task<ActionResult<IEnumerable<TrainingSessionResponse>>> GetTrainingSessions()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return Unauthorized();
        }

        var trainingSessions = await _dbContext.TrainingSessions
            .Where(session => session.UserId == userId)
            .OrderByDescending(session => session.Date)
            .Select(session => new TrainingSessionResponse
            {
                Id = session.Id,
                Type = session.Type,
                DurationMinutes = session.DurationMinutes,
                Intensity = session.Intensity,
                Date = session.Date
            })
            .ToListAsync();

        return Ok(trainingSessions);
    }

    [HttpGet("by-date/{date}")]
    public async Task<ActionResult<IEnumerable<TrainingSessionResponse>>>
        GetTrainingSessionsByDate(DateOnly date)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var trainingSessions = await _dbContext.TrainingSessions
            .Where(session =>
                session.UserId == userId &&
                session.Date == date)
            .Select(session => new TrainingSessionResponse
            {
                Id = session.Id,
                Type = session.Type,
                DurationMinutes = session.DurationMinutes,
                Intensity = session.Intensity,
                Date = session.Date
            })
            .ToListAsync();

        return Ok(trainingSessions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<TrainingSessionResponse>> GetTrainingSessionById(int id)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var trainingSession = await _dbContext.TrainingSessions
            .Where(session =>
                session.Id == id &&
                session.UserId == userId)
            .Select(session => new TrainingSessionResponse
            {
                Id = session.Id,
                Type = session.Type,
                DurationMinutes = session.DurationMinutes,
                Intensity = session.Intensity,
                Date = session.Date
            })
            .SingleOrDefaultAsync();

        if (trainingSession is null)
        {
            return NotFound();
        }

        return Ok(trainingSession);
    }

    [HttpPost]
    public async Task<ActionResult<TrainingSessionResponse>> CreateTrainingSession(
        CreateTrainingSessionRequest request)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var trainingSession = new TrainingSession
        {
            Type = request.Type,
            DurationMinutes = request.DurationMinutes,
            Intensity = request.Intensity,
            Date = request.Date,
            UserId = userId
        };

        var trainingDay = await _dbContext.TrainingDays
            .SingleOrDefaultAsync(day =>
                day.UserId == userId &&
                day.Date == request.Date);

        if (trainingDay?.IsRestDay == true)
        {
            return BadRequest(
                "A training session cannot be added to a rest day."
            );
        }

        _dbContext.TrainingSessions.Add(trainingSession);

        await _dbContext.SaveChangesAsync();

        var response = new TrainingSessionResponse
        {
            Id = trainingSession.Id,
            Type = trainingSession.Type,
            DurationMinutes = trainingSession.DurationMinutes,
            Intensity = trainingSession.Intensity,
            Date = trainingSession.Date
        };

        return CreatedAtAction(
            nameof(GetTrainingSessionById),
            new { id = trainingSession.Id },
            response
        );
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTrainingSession(
        int id,
        UpdateTrainingSessionRequest request)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var trainingSession = await _dbContext.TrainingSessions
            .SingleOrDefaultAsync(session =>
                session.Id == id &&
                session.UserId == userId);

        if (trainingSession is null)
        {
            return NotFound();
        }

        var trainingDay = await _dbContext.TrainingDays
            .SingleOrDefaultAsync(day =>
                day.UserId == userId &&
                day.Date == request.Date);

        if (trainingDay?.IsRestDay == true)
        {
            return BadRequest(
                "A training session cannot be moved to a rest day."
            );
        }

        trainingSession.Type = request.Type;
        trainingSession.DurationMinutes = request.DurationMinutes;
        trainingSession.Intensity = request.Intensity;
        trainingSession.Date = request.Date;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTrainingSession(int id)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var trainingSession = await _dbContext.TrainingSessions
            .SingleOrDefaultAsync(session =>
                session.Id == id &&
                session.UserId == userId);

        if (trainingSession is null)
        {
            return NotFound();
        }

        _dbContext.TrainingSessions.Remove(trainingSession);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}