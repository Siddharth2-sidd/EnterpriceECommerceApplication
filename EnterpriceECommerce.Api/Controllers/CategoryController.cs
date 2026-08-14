using EnterpriceECommerce.Application.DTOs.Category;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Comman;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EnterpriceECommerce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : Controller
    {
        private readonly ICategoryService _categoryService;

        public CategoryController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddCategoryAsync([FromForm] CreateCategoryRequestDTOs request)
        {
            await _categoryService.CreateAsync(request);
            return Ok(new
            {
                Message = "Category Created SuccessFully"
            });
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllCategoryAsync([FromQuery] FilterDTO filter)
        {
            var categories = await _categoryService.GetAllAsync(filter);
            if (categories == null)
                throw new Exception("category is Empty");
            return Ok(categories);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetByIdAsync(int id) 
        {
            var category = await _categoryService.GetByIdAsync(id);
            return Ok(category);
        }
        [Authorize(Roles = "Admin")]
        [HttpPut]
        public async Task<IActionResult> UpdateAsync([FromForm] UpdateCategoryRequestDTOs request) 
        {
            await _categoryService.UpdateAsync(request);
            return Ok(new
            {
                Message = "Category SuccessFully Updated"
            });
        }
        [Authorize(Roles ="Admin")]
        [HttpDelete]
        public async Task<IActionResult> DeleteAsync(int id) 
        {
            await _categoryService.DeleteAsync(id);
            return Ok(new
            {
                Message = "Category SuccessFully Deleted"
            });
        }
    }
}
