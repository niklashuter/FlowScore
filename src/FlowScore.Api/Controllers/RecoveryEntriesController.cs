using FlowScore.Api.Data;
using FlowScore.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FlowScore.Api.Controllers;

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
    public async Task<ActionResult<IEnumerable<RecoveryEntry>>> GetRecoveryEntries()
    {
        var recoveryEntries = await _dbContext.RecoveryEntries
            .OrderBy(entry => entry.Date)
            .ToListAsync();

        return Ok(recoveryEntries);
    }

    [HttpGet("by-date/{date}")]
    public async Task<ActionResult<RecoveryEntry>> GetRecoveryEntryByDate(
        DateOnly date
    )
    {
        var recoveryEntry = await _dbContext.RecoveryEntries
            .SingleOrDefaultAsync(entry => entry.Date == date);

        if (recoveryEntry is null)
        {
            return NotFound();
        }

        return Ok(recoveryEntry);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<RecoveryEntry>> GetRecoveryEntryById(int id)
    {
        var recoveryEntry = await _dbContext.RecoveryEntries.FindAsync(id);

        if (recoveryEntry is null)
        {
            return NotFound();
        }

        return Ok(recoveryEntry);
    }

    [HttpPost]
    public async Task<ActionResult<RecoveryEntry>> CreateRecoveryEntry(
        RecoveryEntry recoveryEntry
    )
    {
        var entryForDateAlreadyExists =
            await _dbContext.RecoveryEntries.AnyAsync(
                entry => entry.Date == recoveryEntry.Date
            );

        if (entryForDateAlreadyExists)
        {
            return Conflict(
                "A recovery entry already exists for this date."
            );
        }

        _dbContext.RecoveryEntries.Add(recoveryEntry);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetRecoveryEntryById),
            new { id = recoveryEntry.Id },
            recoveryEntry
        );
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateRecoveryEntry(
        int id,
        RecoveryEntry updatedRecoveryEntry
    )
    {
        var existingRecoveryEntry =
            await _dbContext.RecoveryEntries.FindAsync(id);

        if (existingRecoveryEntry is null)
        {
            return NotFound();
        }

        existingRecoveryEntry.SleepDurationHours =
            updatedRecoveryEntry.SleepDurationHours;
        existingRecoveryEntry.SleepQuality =
            updatedRecoveryEntry.SleepQuality;
        existingRecoveryEntry.MorningFeeling =
            updatedRecoveryEntry.MorningFeeling;
        existingRecoveryEntry.Date =
            updatedRecoveryEntry.Date;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteRecoveryEntry(int id)
    {
        var recoveryEntry =
            await _dbContext.RecoveryEntries.FindAsync(id);

        if (recoveryEntry is null)
        {
            return NotFound();
        }

        _dbContext.RecoveryEntries.Remove(recoveryEntry);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}