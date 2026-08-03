using EnterpriceECommerce.Application.DTOs.Auth;
using EnterpriceECommerce.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace EnterpriceECommerce.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authservices;

        public AuthController(IAuthService services) { 
            _authservices = services;
        }
        [HttpPost("Register")]
        public async Task<IActionResult> Register(RegisterRequestDTO request)
        {
            await _authservices.RegisterAsync(request);
            return Ok(new { message = "Successfully Register" });
        }
        [HttpPost("Login")]
        public async Task<IActionResult> Login(LoginRequestDTO request) {
            var result = await _authservices.LoginAsync(request);
            return Ok(result);
        }
        [HttpPost("refresh-token")]
        public async Task<IActionResult> RefreshTokenAsync(RefreshTokenRequestDTO refreshrequest) {
            var result = await _authservices.RefreshTokenAsync(refreshrequest);
            return Ok(result);
        }
        [HttpPost("forget-password")]
        public async Task<IActionResult> ForgetPasswordAsync(ForgetPasswordRequestDTO request) {
            await _authservices.ForgetPasswordAsync(request);
            return Ok(new { message = "Reset Password Link Sent to your Email" });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPasswordAsync(ResetPasswordRequestDTO request) {
            await _authservices.ResetPasswordAsync(request);
            return Ok(new { message = "Password reset Successfully" });
        }
        [Authorize]
        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePasswordAsync(ChangePasswordRequestDTO request) {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
            await _authservices.ChangePasswordAsync(userId, request);
            return Ok(new { message = "Password changed Successfully" });
        }
        [HttpPost("verify-email")]
        public async Task<IActionResult> VerifyEmail(EmailVerificationRequestDTO request)
        {
            await _authservices.EmailVerificationAsync(request);
            return Ok(new{message="Email Verify Successfully"});
        }
        [HttpPost("resend-verification")]
        public async Task<IActionResult> ResendVerifivationEmail(string email)
        {
            await _authservices.ResendEmailVerificationAsync(email);
            return Ok(new{message= "Verification email sent successfully." });
        }
    }
}
