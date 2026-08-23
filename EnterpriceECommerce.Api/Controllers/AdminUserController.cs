using EnterpriceECommerce.Application.DTOs.User;
using EnterpriceECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EnterpriceECommerce.API.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/admin/users")]
[ApiController]
public class AdminUserController : ControllerBase
{
    private readonly IAdminUserService _service;

    public AdminUserController(IAdminUserService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users =  await _service.GetAllAsync();

        return Ok(users);
    }

    [HttpGet("{userId}")]
    public async Task<IActionResult> GetById(int userId)
    {
        var user =  await _service.GetByIdAsync(userId);

        return Ok(user);
    }

    [HttpPut("{userId}/activate")]
    public async Task<IActionResult> Activate(int userId)
    {
        await _service.ActivateAsync(userId);

        return Ok(new
        {
            Message = "User activated successfully."
        });
    }

    [HttpPut("{userId}/deactivate")]
    public async Task<IActionResult> Deactivate(int userId)
    {
        await _service.DeactivateAsync(userId);

        return Ok(new
        {
            Message = "User deactivated successfully."
        });
    }

    [HttpPut("{userId}/role")]
    public async Task<IActionResult> ChangeRole(int userId, ChangeUserRoleDto request)
    {
        await _service.ChangeRoleAsync(userId,request);

        return Ok(new
        {
            Message = "User role updated successfully."
        });
    }
}