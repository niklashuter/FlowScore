using System.Security.Claims;
using FlowScore.Api.Contracts.RecoveryEntries;
using FlowScore.Api.Data;
using FlowScore.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlowScore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class RecoveryEntriesController : ControllerBase
{
    private readonly FlowScoreDbContext _dbContext;

    public RecoveryEntriesController(FlowScoreDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<RecoveryEntryResponse>>>
        GetRecoveryEntries()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return Unauthorized();
        }

        var recoveryEntries = await _dbContext.RecoveryEntries
            .Where(entry => entry.UserId == userId)
            .OrderBy(entry => entry.Date)
            .Select(entry => new RecoveryEntryResponse
            {
                Id = entry.Id,
                SleepDurationHours = entry.SleepDurationHours,
                SleepQuality = entry.SleepQuality,
                MorningFeeling = entry.MorningFeeling,
                Date = entry.Date
            })
            .ToListAsync();

        return Ok(recoveryEntries);
    }

    [HttpGet("by-date/{date}")]
    public async Task<ActionResult<RecoveryEntryResponse>>
        GetRecoveryEntryByDate(DateOnly date)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return Unauthorized();
        }

        var recoveryEntry = await _dbContext.RecoveryEntries
            .Where(entry =>
                entry.UserId == userId &&
                entry.Date == date)
            .Select(entry => new RecoveryEntryResponse
            {
                Id = entry.Id,
                SleepDurationHours = entry.SleepDurationHours,
                SleepQuality = entry.SleepQuality,
                MorningFeeling = entry.MorningFeeling,
                Date = entry.Date
            })
            .SingleOrDefaultAsync();

        if (recoveryEntry is null)
        {
            return NotFound();
        }

        return Ok(recoveryEntry);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<RecoveryEntryResponse>>
        GetRecoveryEntryById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return Unauthorized();
        }

        var recoveryEntry = await _dbContext.RecoveryEntries
            .Where(entry =>
                entry.Id == id &&
                entry.UserId == userId)
            .Select(entry => new RecoveryEntryResponse
            {
                Id = entry.Id,
                SleepDurationHours = entry.SleepDurationHours,
                SleepQuality = entry.SleepQuality,
                MorningFeeling = entry.MorningFeeling,
                Date = entry.Date
            })
            .SingleOrDefaultAsync();

        if (recoveryEntry is null)
        {
            return NotFound();
        }

        return Ok(recoveryEntry);
    }

    [HttpPost]
    public async Task<ActionResult<RecoveryEntryResponse>>
    CreateRecoveryEntry(CreateRecoveryEntryRequest request)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return Unauthorized();
        }

        var entryForDateAlreadyExists =
            await _dbContext.RecoveryEntries.AnyAsync(entry =>
                entry.UserId == userId &&
                entry.Date == request.Date);

        if (entryForDateAlreadyExists)
        {
            return Conflict(
                "A recovery entry already exists for this date."
            );
        }

        var recoveryEntry = new RecoveryEntry
        {
            SleepDurationHours = request.SleepDurationHours,
            SleepQuality = request.SleepQuality,
            MorningFeeling = request.MorningFeeling,
            Date = request.Date,
            UserId = userId
        };

        _dbContext.RecoveryEntries.Add(recoveryEntry);

        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            var entryForDateNowExists =
                await _dbContext.RecoveryEntries.AnyAsync(entry =>
                    entry.UserId == userId &&
                    entry.Date == request.Date);

            if (entryForDateNowExists)
            {
                return Conflict(
                    "A recovery entry already exists for this date."
                );
            }

            throw;
        }

        var response = MapToResponse(recoveryEntry);

        return CreatedAtAction(
            nameof(GetRecoveryEntryById),
            new { id = recoveryEntry.Id },
            response
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateRecoveryEntry(
        int id,
        UpdateRecoveryEntryRequest request
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return Unauthorized();
        }

        var existingRecoveryEntry =
            await _dbContext.RecoveryEntries
                .SingleOrDefaultAsync(entry =>
                    entry.Id == id &&
                    entry.UserId == userId);

        if (existingRecoveryEntry is null)
        {
            return NotFound();
        }

        existingRecoveryEntry.SleepDurationHours =
            request.SleepDurationHours;
        existingRecoveryEntry.SleepQuality =
            request.SleepQuality;
        existingRecoveryEntry.MorningFeeling =
            request.MorningFeeling;
        existingRecoveryEntry.Date =
            request.Date;

        try
        {
            await _dbContext.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            var entryForDateAlreadyExists =
                await _dbContext.RecoveryEntries.AnyAsync(entry =>
                    entry.UserId == userId &&
                    entry.Date == request.Date &&
                    entry.Id != id);

            if (entryForDateAlreadyExists)
            {
                return Conflict(
                    "A recovery entry already exists for this date."
                );
            }

            throw;
        }

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteRecoveryEntry(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return Unauthorized();
        }

        var recoveryEntry =
            await _dbContext.RecoveryEntries
                .SingleOrDefaultAsync(entry =>
                    entry.Id == id &&
                    entry.UserId == userId);

        if (recoveryEntry is null)
        {
            return NotFound();
        }

        _dbContext.RecoveryEntries.Remove(recoveryEntry);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    private static RecoveryEntryResponse MapToResponse(
        RecoveryEntry recoveryEntry
    )
    {
        return new RecoveryEntryResponse
        {
            Id = recoveryEntry.Id,
            SleepDurationHours = recoveryEntry.SleepDurationHours,
            SleepQuality = recoveryEntry.SleepQuality,
            MorningFeeling = recoveryEntry.MorningFeeling,
            Date = recoveryEntry.Date
        };
    }
}