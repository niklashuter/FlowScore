using FlowScore.Api.DTOs;
using FlowScore.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace FlowScore.Api.Controllers;

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
        if (days.HasValue && days.Value <= 0)
        {
            return BadRequest(
                "Days must be greater than zero."
            );
        }

        var history = await _historyService.GetHistoryAsync(days);

        return Ok(history);
    }

    [HttpGet("{date}")]
    public async Task<ActionResult<HistoryDayDetailsResponse>>
        GetHistoryDayDetails(DateOnly date)
    {
        var details =
            await _historyService.GetDayDetailsAsync(date);

        if (details is null)
        {
            return NotFound(
                $"No history data was found for {date}."
            );
        }

        return Ok(details);
    }
    }