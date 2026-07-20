using FlowScore.Api.Data;
using FlowScore.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FlowScore.Api.Services;

namespace FlowScore.Api.Controllers;

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
    public async Task<ActionResult<IEnumerable<Meal>>> GetMeals()
    {
        var meals = await _dbContext.Meals
            .OrderBy(meal => meal.Date)
            .ThenBy(meal => meal.Time)
            .ToListAsync();

        return Ok(meals);
    }

    [HttpGet("by-date/{date}")]
    public async Task<ActionResult<IEnumerable<Meal>>> GetMealsByDate(
        DateOnly date
    )
    {
        var meals = await _dbContext.Meals
            .Where(meal => meal.Date == date)
            .OrderBy(meal => meal.Time)
            .ToListAsync();

        return Ok(meals);
    }

    [HttpPost]
    public async Task<ActionResult<Meal>> CreateMeal(Meal meal)
    {
        var analysis = await _mealNutritionAnalyzer.AnalyzeMealAsync(
            meal.Description,
            meal.Type
        );

        meal.NutritionScore = analysis.NutritionScore;
        meal.NutritionFeedback = analysis.Feedback;

        _dbContext.Meals.Add(meal);
        await _dbContext.SaveChangesAsync();

        return CreatedAtAction(
            nameof(GetMealById),
            new { id = meal.Id },
            meal
        );
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<Meal>> GetMealById(int id)
    {
        var meal = await _dbContext.Meals.FindAsync(id);

        if (meal is null)
        {
            return NotFound();
        }

        return Ok(meal);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateMeal(int id, Meal updatedMeal)
    {
        var existingMeal = await _dbContext.Meals.FindAsync(id);

        if (existingMeal is null)
        {
            return NotFound();
        }

        var descriptionChanged =
            !string.Equals(
                existingMeal.Description,
                updatedMeal.Description,
                StringComparison.Ordinal
            );

        var typeChanged =
            !string.Equals(
                existingMeal.Type,
                updatedMeal.Type,
                StringComparison.Ordinal
            );

        if (descriptionChanged || typeChanged)
        {
            var analysis = await _mealNutritionAnalyzer.AnalyzeMealAsync(
                updatedMeal.Description,
                updatedMeal.Type
            );

            existingMeal.NutritionScore = analysis.NutritionScore;
            existingMeal.NutritionFeedback = analysis.Feedback;
        }

        existingMeal.Type = updatedMeal.Type;
        existingMeal.Description = updatedMeal.Description;
        existingMeal.Time = updatedMeal.Time;
        existingMeal.Date = updatedMeal.Date;

        await _dbContext.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteMeal(int id)
    {
        var meal = await _dbContext.Meals.FindAsync(id);

        if (meal is null)
        {
            return NotFound();
        }

        _dbContext.Meals.Remove(meal);
        await _dbContext.SaveChangesAsync();

        return NoContent();
    }
}