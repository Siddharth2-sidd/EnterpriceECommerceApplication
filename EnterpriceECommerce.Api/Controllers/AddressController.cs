using EnterpriceECommerce.Application.DTOs.Address;
using EnterpriceECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EnterpriceECommerce.Api.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AddressController : Controller
    {
        private readonly IAddressService _services;
        public AddressController(IAddressService services) 
        {
            _services = services;
        }

        private int GetUserId()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (!int.TryParse(userId, out var id))
                throw new UnauthorizedAccessException();
            return id;
        }

        [HttpPost]
        public async Task<IActionResult> Create(CreateAddressDto request)
        {
            var userId = GetUserId();
            var result = await _services.CreateAsync(userId, request);
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetMyAddresses()
        {
            var userId = GetUserId();
            var result = await _services.GetMyAddressAsync(userId);
            return Ok(result);
        }

        [HttpPut("{addressId}")]
        public async Task<IActionResult> Update(int addressId,UpdateAddressDto request)
        {
            var userId = GetUserId();
            var result = await _services.UpdateAsync(userId,addressId,request);
            return Ok(result);
        }

        [HttpDelete("{addressId}")]
        public async Task<IActionResult> Delete(int addressId)
        {
            var userId = GetUserId();

            await _services.DeleteAsync(userId,addressId);
            return Ok(new
            {
                Message ="Address deleted successfully."
            });
        }

        [HttpPut("{addressId}/default")]
        public async Task<IActionResult> SetDefault(int addressId)
        {
            var userId = GetUserId();
            await _services.SetDefaultAsync(userId,addressId);
            return Ok(new
            {
                Message ="Default address updated successfully."
            });
        }

    }
}
