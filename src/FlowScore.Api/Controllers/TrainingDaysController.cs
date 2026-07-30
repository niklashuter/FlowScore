using FlowScore.Api.Data;
using FlowScore.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using FlowScore.Api.Contracts.TrainingDays;

namespace FlowScore.Api.Controllers;

[Authorize]
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
    public async Task<ActionResult<TrainingDayResponse>> GetTrainingDayByDate(
        DateOnly date)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var trainingDay = await _dbContext.TrainingDays
            .Where(day =>
                day.UserId == userId &&
                day.Date == date)
            .Select(day => new TrainingDayResponse
            {
                Id = day.Id,
                Date = day.Date,
                IsRestDay = day.IsRestDay
            })
            .SingleOrDefaultAsync();

        if (trainingDay is null)
        {
            return NotFound();
        }

        return Ok(trainingDay);
    }

    [HttpPut("by-date/{date}")]
    public async Task<ActionResult<TrainingDayResponse>> UpdateTrainingDay(
        DateOnly date,
        UpdateTrainingDayRequest request)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var trainingDay = await _dbContext.TrainingDays
            .SingleOrDefaultAsync(day =>
                day.UserId == userId &&
                day.Date == date);

        if (trainingDay is null)
        {
            trainingDay = new TrainingDay
            {
                UserId = userId,
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
                    .Where(session =>
                        session.UserId == userId &&
                        session.Date == date)
                    .ToListAsync();

            _dbContext.TrainingSessions.RemoveRange(
                existingTrainingSessions
            );
        }

        await _dbContext.SaveChangesAsync();

        var response = new TrainingDayResponse
        {
            Id = trainingDay.Id,
            Date = trainingDay.Date,
            IsRestDay = trainingDay.IsRestDay
        };

        return Ok(response);
    }
}