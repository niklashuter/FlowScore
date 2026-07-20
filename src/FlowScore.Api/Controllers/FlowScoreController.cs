using FlowScore.Api.Models;
using FlowScore.Api.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace FlowScore.Api.Controllers;

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
    public async Task<ActionResult<FlowScoreResult>> GetTodayFlowScore()
    {
        var today = DateOnly.FromDateTime(DateTime.Today);

        var result = await _calculator.CalculateAsync(today);

        return Ok(result);
    }
}