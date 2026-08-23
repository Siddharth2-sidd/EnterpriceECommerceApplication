using EnterpriceECommerce.Application.DTOs.User;

namespace EnterpriceECommerce.Application.Interfaces;

public interface IAdminUserService
{
    Task<List<AdminUserResponseDto>> GetAllAsync();
    Task<AdminUserResponseDto> GetByIdAsync( int userId);
    Task ActivateAsync(int userId);
    Task DeactivateAsync(int userId);
    Task ChangeRoleAsync(int userId, ChangeUserRoleDto request);
}