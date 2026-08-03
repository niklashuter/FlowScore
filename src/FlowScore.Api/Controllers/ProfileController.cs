using System.Security.Claims;

using FlowScore.Api.Contracts.Profile;
using FlowScore.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace FlowScore.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class ProfileController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;

    public ProfileController(
        UserManager<ApplicationUser> userManager)
    {
        _userManager = userManager;
    }

    private async Task<ApplicationUser?> GetCurrentUserAsync()
    {
        var userId = User.FindFirstValue(
            ClaimTypes.NameIdentifier
        );

        if (userId is null)
        {
            return null;
        }

        return await _userManager.FindByIdAsync(userId);
    }

    [HttpGet]
    public async Task<ActionResult<ProfileResponse>> GetProfile()
    {
        var user = await GetCurrentUserAsync();

        if (user is null)
        {
            return Unauthorized();
        }

        var response = new ProfileResponse
        {
            Name = user.Name,
            Email = user.Email ?? string.Empty,
            DateOfBirth = user.DateOfBirth,
            HeightCm = user.HeightCm,
            WeightKg = user.WeightKg,
            Gender = user.Gender
        };

        return Ok(response);
    }

    [HttpPut]
    public async Task<ActionResult<ProfileResponse>> UpdateProfile(
        UpdateProfileRequest request)
    {
        var user = await GetCurrentUserAsync();

        if (user is null)
        {
            return Unauthorized();
        }

        user.Name = request.Name.Trim();
        user.DateOfBirth = request.DateOfBirth;
        user.HeightCm = request.HeightCm;
        user.WeightKg = request.WeightKg;
        user.Gender = request.Gender;

        var result = await _userManager.UpdateAsync(user);

        if (!result.Succeeded)
        {
            return BadRequest(result.Errors);
        }

        var response = new ProfileResponse
        {
            Name = user.Name,
            Email = user.Email ?? string.Empty,
            DateOfBirth = user.DateOfBirth,
            HeightCm = user.HeightCm,
            WeightKg = user.WeightKg,
            Gender = user.Gender
        };

        return Ok(response);
    }
}