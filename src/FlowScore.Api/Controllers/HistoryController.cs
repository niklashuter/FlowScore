using FlowScore.Api.DTOs;
using FlowScore.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FlowScore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class HistoryController : ControllerBase
{
    private readonly HistoryService _historyService;

    public HistoryController(HistoryService historyService)
    {
        _historyService = historyService;
    }

    [HttpGet]
    public async Task<ActionResult<List<HistoryDayResponse>>> GetHistory(
        [FromQuery] int? days
    )
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        if (days.HasValue && days.Value <= 0)
        {
            return BadRequest(
                "Days must be greater than zero."
            );
        }

        var history = await _historyService.GetHistoryAsync(
            userId,
            days
        );

        return Ok(history);
    }

    [HttpGet("{date}")]
    public async Task<ActionResult<HistoryDayDetailsResponse>>
        GetHistoryDayDetails(DateOnly date)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var details =
            await _historyService.GetDayDetailsAsync(
                date,
                userId
            );

        if (details is null)
        {
            return NotFound(
                $"No history data was found for {date}."
            );
        }

        return Ok(details);
    }
}