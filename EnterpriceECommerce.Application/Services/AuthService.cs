using EnterpriceECommerce.Application.DTOs.Auth;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Domain.Enums;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.AspNetCore.Identity;
namespace EnterpriceECommerce.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenGenrator _jwtTokenGenrator;
        private readonly IPasswordHasher<User> _passwordHasher;

        public AuthService(IUserRepository userRepository,IJwtTokenGenrator jwtTokenGenrator)
        {
            _userRepository = userRepository;
            _jwtTokenGenrator = jwtTokenGenrator;
            _passwordHasher = new PasswordHasher<User>();
        }

        public async Task RegisterAsync(RegisterRequestDTO request)
        {
            if (await _userRepository.ExitByEmailAsync(request.Email)){
                throw new Exception("Email Already Exits");
            }

            if (request.Password != request.ConfirmPassword) {
                throw new Exception("Confirm Password is not matched with password");
            }

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                PasswordHashed = string.Empty,
                RoleId = (int)RoleEnum.Customer,
                IsActive = true,
                CreatedOn = DateTime.UtcNow

            };
            user.PasswordHashed = _passwordHasher.HashPassword(user, request.Password);
            await _userRepository.AddUserAsync(user);
            await _userRepository.SaveChangesAsync();
        }

        public async Task<AuthResponceDTO> LoginAsync(LoginRequestDTO login)
        {
            var user = await _userRepository.GetByEmailAsync(login.Email);
            
            if(user == null) {
                throw new Exception("Invalid Email or Password");
            }
            var result = _passwordHasher.VerifyHashedPassword(user,user.PasswordHashed, login.Password);
            if (result == PasswordVerificationResult.Failed) {
                throw new Exception("Invalid Email or Password");
            }

            var token = _jwtTokenGenrator.GenerateToken(user);

            return new AuthResponceDTO
            {
                UserId = user.Id,
                FullName = $"{user.FirstName} {user.LastName}",
                Role = user.Role.Name,
                Email = user.Email,
                Token = token
            };
        }
    }
}
