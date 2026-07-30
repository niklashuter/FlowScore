using FlowScore.Api.Data;
using FlowScore.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlowScore.Api.Services;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using FlowScore.Api.Contracts.Meals;

namespace FlowScore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class MealsController : ControllerBase
{
    private readonly FlowScoreDbContext _dbContext;
    private readonly MealNutritionAnalyzer _mealNutritionAnalyzer;

    public MealsController(
        FlowScoreDbContext context,
        MealNutritionAnalyzer mealNutritionAnalyzer
    )
    {
        _dbContext = context;
        _mealNutritionAnalyzer = mealNutritionAnalyzer;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<MealResponse>>> GetMeals()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return Unauthorized();
        }

        var meals = await _dbContext.Meals
            .Where(meal => meal.UserId == userId)
            .OrderByDescending(meal => meal.Date)
            .ThenByDescending(meal => meal.Time)
            .Select(meal => new MealResponse
            {
                Id = meal.Id,
                Type = meal.Type,
                Description = meal.Description,
                Time = meal.Time,
                Date = meal.Date,
                NutritionScore = meal.NutritionScore,
                NutritionFeedback = meal.NutritionFeedback
            })
            .ToListAsync();

        return Ok(meals);
    }

    [HttpGet("by-date/{date}")]
    public async Task<ActionResult<IEnumerable<Meal>>> GetMealsByDate(
        DateOnly date
    )
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return Unauthorized();
        }

        var meals = await _dbContext.Meals
            .Where(meal =>
                meal.UserId == userId &&
                meal.Date == date)
            .OrderBy(meal => meal.Time)
            .ToListAsync();

        return Ok(meals);
    }

    [HttpPost]
    public async Task<ActionResult<MealResponse>> CreateMeal(
        CreateMealRequest request)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var meal = new Meal
        {
            Type = request.Type,
            Description = request.Description,
            Time = request.Time,
            Date = request.Date,
            UserId = userId
        };

        var analysis = await _mealNutritionAnalyzer.AnalyzeMealAsync(
            request.Description,
            request.Type
        );

        meal.NutritionScore = analysis.NutritionScore;
        meal.NutritionFeedback = analysis.Feedback;

        _dbContext.Meals.Add(meal);

        await _dbContext.SaveChangesAsync();

        var response = new MealResponse
        {
            Id = meal.Id,
            Type = meal.Type,
            Description = meal.Description,
            Time = meal.Time,
            Date = meal.Date,
            NutritionScore = meal.NutritionScore,
            NutritionFeedback = meal.NutritionFeedback
        };

        return CreatedAtAction(
            nameof(GetMealById),
            new { id = meal.Id },
            response
        );
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<MealResponse>> GetMealById(int id)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (userId is null)
        {
            return Unauthorized();
        }

        var meal = await _dbContext.Meals
            .Where(meal => meal.Id == id && meal.UserId == userId)
            .Select(meal => new MealResponse
            {
                Id = meal.Id,
                Type = meal.Type,
                Description = meal.Description,
                Time = meal.Time,
                Date = meal.Date,
                NutritionScore = meal.NutritionScore,
                NutritionFeedback = meal.NutritionFeedback
            })
            .SingleOrDefaultAsync();

        if (meal is null)
        {
            return NotFound();
        }

        return Ok(meal);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMeal(
        int id,
        UpdateMealRequest request)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var meal = await _dbContext.Meals.SingleOrDefaultAsync(
            meal => meal.Id == id &&
                    meal.UserId == userId
        );

        if (meal is null)
        {
            return NotFound();
        }

        meal.Type = request.Type;
        meal.Description = request.Description;
        meal.Time = request.Time;
        meal.Date = request.Date;

        var analysis = await _mealNutritionAnalyzer.AnalyzeMealAsync(
            meal.Description,
            meal.Type
        );

        meal.NutritionScore = analysis.NutritionScore;
        meal.NutritionFeedback = analysis.Feedback;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMeal(int id)
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return Unauthorized();
        }

        var meal = await _dbContext.Meals.SingleOrDefaultAsync(
            meal => meal.Id == id &&
                    meal.UserId == userId
        );

        if (meal is null)
        {
            return NotFound();
        }

        _dbContext.Meals.Remove(meal);

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}