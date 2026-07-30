using FlowScore.Api.Models;
using FlowScore.Api.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace FlowScore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FlowScoreController : ControllerBase
{
    private readonly FlowScoreCalculator _calculator;

    public FlowScoreController(
        FlowScoreCalculator calculator
    )
    {
        _calculator = calculator;
    }

    [HttpGet("today")]
    public async Task<ActionResult<FlowScoreResult>>
        GetTodayFlowScore()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var today = DateOnly.FromDateTime(
            DateTime.Today
        );

        var result = await _calculator.CalculateAsync(
            today,
            userId
        );

        return Ok(result);
    }

    [HttpGet("{date}")]
    public async Task<ActionResult<FlowScoreResult>> GetFlowScore(
        DateOnly date
    )
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var result = await _calculator.CalculateAsync(
            date,
            userId
        );

        return Ok(result);
    }
}