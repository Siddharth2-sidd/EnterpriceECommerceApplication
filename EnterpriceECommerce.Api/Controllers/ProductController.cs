using EnterpriceECommerce.Application.DTOs.Product;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Application.Services;
using EnterpriceECommerce.Domain.Comman;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EnterpriceECommerce.API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly IProductServices _service;
    private readonly IProductImageService _imageService;

    public ProductController(IProductServices service, IProductImageService imageService)
    {
        _service = service;
        _imageService = imageService;
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create(
        CreateProductRequestDTO request)
    {
        await _service.CreateAsync(request);

        return Ok(new
        {
            Message = "Product created successfully."
        });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] ProductFilterDTO filter)
    {
        var products =
            await _service.GetAllAsync(filter);

        return Ok(products);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var product =
            await _service.GetByIdAsync(id);

        return Ok(product);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut]
    public async Task<IActionResult> Update(
        UpdateProductRequestDTO request)
    {
        await _service.UpdateAsync(request);

        return Ok(new
        {
            Message = "Product updated successfully."
        });
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        await _service.DeleteAsync(id);

        return Ok(new
        {
            Message = "Product deleted successfully."
        });
    }
    [Authorize(Roles = "Admin")]
    [HttpPost("images")]
    public async Task<IActionResult> AddImages(
    [FromForm] AddProductImagesRequestDTO request)
    {
        await _imageService.AddAsync(request);

        return Ok(new
        {
            Message = "Product images uploaded successfully."
        });
    }
    [Authorize(Roles = "Admin")]
    [HttpDelete("images/{imageId}")]
    public async Task<IActionResult> DeleteImage(
    int imageId)
    {
        await _imageService.DeleteAsync(imageId);

        return Ok(new
        {
            Message = "Product image deleted successfully."
        });
    }
}