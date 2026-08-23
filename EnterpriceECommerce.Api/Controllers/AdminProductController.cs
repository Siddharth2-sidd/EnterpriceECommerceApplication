using EnterpriceECommerce.Application.DTOs.Product;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Comman;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EnterpriceECommerce.API.Controllers;

[Authorize(Roles = "Admin")]
[Route("api/admin/products")]
[ApiController]
public class AdminProductController : ControllerBase
{
    private readonly IProductServices _service;

    public AdminProductController(IProductServices service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(ProductFilterDTO filter)
    {
        var products =  await _service.GetAllAsync(filter);

        return Ok(products);
    }

    [HttpPost]
    public async Task<IActionResult> Create(AdminCreateProductDto request)
    {
        var product =   await _service.AdminCreateAsync(request);

        return Ok(product);
    }

    [HttpPut("{productId}")]
    public async Task<IActionResult> Update(int productId,AdminUpdateProductDto request)
    {
        var product =  await _service.AdminUpdateAsync(productId,request);

        return Ok(product);
    }

    [HttpPut("{productId}/stock")]
    public async Task<IActionResult> UpdateStock(int productId, UpdateStockDto request)
    {
        await _service.UpdateStockAsync( productId, request.StockQuantity);

        return Ok(new
        {
            Message = "Stock updated successfully."
        });
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> Delete(int productId)
    {
        await _service.AdminDeleteAsync(productId);

        return Ok(new
        {
            Message ="Product deactivated successfully."
        });
    }
}