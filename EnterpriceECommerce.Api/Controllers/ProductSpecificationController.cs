using EnterpriceECommerce.Application.DTOs.Product;
using EnterpriceECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EnterpriceECommerce.API.Controllers;

[Route("api/product-specifications")]
[ApiController]
public class ProductSpecificationController : ControllerBase
{
    private readonly IProductSpecificationService  _service;

    public ProductSpecificationController(IProductSpecificationService service)
    {
        _service = service;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Add(AddProductSpecificationRequestDto request)
    {
        await _service.AddAsync(request);

        return Ok(new
        {
            Message = "Product specification added successfully."
        });
    }

    [HttpGet("product/{productId}")]
    public async Task<IActionResult> GetByProductId(int productId)
    {
        var specifications = await _service.GetByProductIdAsync(productId);

        return Ok(specifications);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<IActionResult> Update(UpdateProductSpecificationRequestDto request)
    {
        await _service.UpdateAsync(request);

        return Ok(new
        {
            Message = "Product specification updated successfully."
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);

        return Ok(new
        {
            Message = "Product specification deleted successfully."
        });
    }
}