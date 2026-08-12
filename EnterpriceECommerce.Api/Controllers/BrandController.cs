using EnterpriceECommerce.Application.DTOs.Brand;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Comman;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EnterpriceECommerce.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BrandController : ControllerBase
{
    private readonly IBrandService _service;

    public BrandController(IBrandService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(CreateBrandRequestDTO request)
    {
        await _service.CreateAsync(request);

        return Ok(new { Message = "Brand created successfully." });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll([FromQuery] FilterDTO filter)
    {
        return Ok(await _service.GetAllAsync(filter));
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        return Ok(await _service.GetByIdAsync(id));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<IActionResult> Update(UpdateBrandRequestDTO request)
    {
        await _service.UpdateAsync(request);

        return Ok(new { Message = "Brand updated successfully." });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);

        return Ok(new { Message = "Brand deleted successfully." });
    }
}