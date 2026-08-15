using EnterpriceECommerce.Application.DTOs.Inventory;
using EnterpriceECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EnterpriceECommerce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : Controller
    {
        private readonly IInventoryService _inventoryService;
        public InventoryController(IInventoryService inventoryService)
        {
            _inventoryService = inventoryService;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<IActionResult> AddInventory(AdjustStockRequestDto request)
        {
            await _inventoryService.AdjustStockAsync(request);
            return Ok(new
            {
                Message =
                "Stock updated successfully."
            });
        }
        [Authorize(Roles = "Admin")]
        [HttpGet("product/{productId}")]
        public async Task<IActionResult> GetHistory(int productId)
        {
            var history =  await _inventoryService.GetHistoryAsync(productId);

            return Ok(history);
        }

    }
}
