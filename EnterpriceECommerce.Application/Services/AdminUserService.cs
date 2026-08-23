using EnterpriceECommerce.Application.DTOs.User;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;

namespace EnterpriceECommerce.Application.Services;

public class AdminUserService : IAdminUserService
{
    private readonly IUserRepository _userRepository;

    public AdminUserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<AdminUserResponseDto>> GetAllAsync()
    {
        var users = await _userRepository.GetAllAsync();

        return users.Select(Map).ToList();
    }

    public async Task<AdminUserResponseDto>GetByIdAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user == null)
        {
            throw new Exception("User not found.");
        }

        return Map(user);
    }

    public async Task ActivateAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user == null)
        {
            throw new Exception("User not found.");
        }

        user.IsActive = true;

        await _userRepository.SaveChangesAsync();
    }

    public async Task DeactivateAsync(int userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);

        if (user == null)
        {
            throw new Exception("User not found.");
        }

        user.IsActive = false;
        await _userRepository.SaveChangesAsync();
    }

    public async Task ChangeRoleAsync(int userId, ChangeUserRoleDto request)
    {
        var user =  await _userRepository.GetByIdAsync(userId);

        if (user == null)
        {
            throw new Exception("User not found.");
        }

        var role = request.Role;

        //if (role != "User" && role != "Admin")
        //{
        //    throw new Exception("Invalid role.");
        //}

        user.Role = role;

        await _userRepository.SaveChangesAsync();
    }

    private static AdminUserResponseDto Map(User user)
    {
        return new AdminUserResponseDto
        {
            Id = user.Id,
            UserName = $"{user.FirstName} {user.LastName}",
            Email =  user.Email,
            Role = user.Role,
            IsActive = user.IsActive,
            CreatedDate =   user.CreatedOn
        };
    }
}