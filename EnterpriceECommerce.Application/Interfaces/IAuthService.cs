using EnterpriceECommerce.Application.DTOs.Auth;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterRequestDTO request);
        Task<AuthResponceDTO> LoginAsync(LoginRequestDTO login);
        Task<AuthResponceDTO> RefreshTokenAsync(RefreshTokenRequestDTO request);
        Task ForgetPasswordAsync(ForgetPasswordRequestDTO request);
        Task ResetPasswordAsync(ResetPasswordRequestDTO resetRequest);
        Task ChangePasswordAsync (int userId, ChangePasswordRequestDTO request);
        Task EmailVerificationAsync(EmailVerificationRequestDTO request);
        Task ResendEmailVerificationAsync(string email);

    }
}