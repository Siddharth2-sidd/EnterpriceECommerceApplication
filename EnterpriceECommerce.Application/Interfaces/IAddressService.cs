using EnterpriceECommerce.Application.DTOs.Address;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IAddressService
    {
        Task<AddressResponseDto> CreateAsync(int userId, CreateAddressDto request);
        Task<AddressResponseDto> UpdateAsync(int userId, int addressId, UpdateAddressDto request);
        Task<List<AddressResponseDto>> GetMyAddressAsync(int userId);
        Task DeleteAsync(int userId, int addressId);
        Task SetDefaultAsync(int userId, int addressId);
    }
}
