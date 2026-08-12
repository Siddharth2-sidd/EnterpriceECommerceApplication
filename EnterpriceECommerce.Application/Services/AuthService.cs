using EnterpriceECommerce.Application.DTOs.Auth;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Domain.Enums;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.Identity.Client;
namespace EnterpriceECommerce.Application.Services
{
    public class AuthService : IAuthService
    {
        private readonly IUserRepository _userRepository;
        private readonly IJwtTokenGenrator _jwtTokenGenrator;
        private readonly IPasswordHasher<User> _passwordHasher;
        private readonly IRefreshTokenGenerator _refreshTokenGenerator;
        private readonly IRefreshTokenRepository _refreshTokenRepository;
        private readonly IResetPasswordRepository _resetPasswordRepository;
        private readonly IEmailServices _emailServices;
        private readonly IEmailVerificationRepository _emailVerificationRepository;


        public AuthService(IUserRepository userRepository,IJwtTokenGenrator jwtTokenGenrator, 
            IRefreshTokenGenerator refreshTokenGenerator, IRefreshTokenRepository refreshTokenRepository, 
            IResetPasswordRepository resetPasswordRepository, IEmailServices emailServices, 
            IEmailVerificationRepository emailVerificationRepository)
        {
            _userRepository = userRepository;
            _jwtTokenGenrator = jwtTokenGenrator;
            _refreshTokenGenerator = refreshTokenGenerator;
            _refreshTokenRepository = refreshTokenRepository;
            _emailVerificationRepository = emailVerificationRepository;
            _resetPasswordRepository = resetPasswordRepository;
            _emailServices = emailServices;
            _passwordHasher = new PasswordHasher<User>();
        }

        public async Task RegisterAsync(RegisterRequestDTO request)
        {
            var userExits = await _userRepository.GetAllAsync();
            if (userExits.Count == 0)
            {
                var adminUser = new User 
                {
                    FirstName = "Master",
                    LastName = "Admin",
                    Email = "MasterAdmin@gmail.com",
                    PasswordHashed = string.Empty,
                    RoleId = (int)RoleEnum.Admin,
                    IsActive = true,
                    CreatedOn = DateTime.UtcNow,
                    IsEmailVerified = true
                };
                adminUser.PasswordHashed = _passwordHasher.HashPassword(adminUser, "MasterAdmin@12");
                await _userRepository.AddUserAsync(adminUser);
                await _userRepository.SaveChangesAsync();
            }
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
                Email = request.Email,
                PasswordHashed = string.Empty,
                RoleId = (int)RoleEnum.Customer,
                IsActive = true,
                CreatedOn = DateTime.UtcNow

            };
            user.PasswordHashed = _passwordHasher.HashPassword(user, request.Password);
            await _userRepository.AddUserAsync(user);
            await _userRepository.SaveChangesAsync();
            var verificationToken = Guid.NewGuid().ToString();
            await _emailVerificationRepository.AddAsync(
                new EmailVerificationToken
                {
                    Token = verificationToken,
                    UserId = user.Id,
                    ExpiryDate = DateTime.UtcNow.AddHours(24)
                });
            await _emailVerificationRepository.SaveChangeAsync();
            await _emailServices.SendEmailAsync(user.Email, "Verification Email", $"Verification Token: {verificationToken}");
            
            
        }
        public async Task AdminRegisterAsync(RegisterRequestDTO adminRequest)
        {
            var emailExist = await _userRepository.ExitByEmailAsync(adminRequest.Email);
            if (emailExist)
                throw new Exception("Email Already Register");
            if (adminRequest.Password != adminRequest.ConfirmPassword)
                throw new Exception("Password not Match");
            var adminUser = new User
            {
                FirstName = adminRequest.FirstName,
                LastName = adminRequest.LastName,
                Email = adminRequest.Email,
                PasswordHashed = string.Empty,
                RoleId = (int)RoleEnum.Admin,
                IsActive = true,
                CreatedOn = DateTime.UtcNow

            };
            adminUser.PasswordHashed = _passwordHasher.HashPassword(adminUser, adminRequest.Password);
            await _userRepository.AddUserAsync(adminUser);
            await _userRepository.SaveChangesAsync();
            var verificationToken = Guid.NewGuid().ToString();
            await _emailVerificationRepository.AddAsync(new EmailVerificationToken
            {
                Token = verificationToken,
                UserId = adminUser.Id,
                ExpiryDate = DateTime.UtcNow.AddMinutes(10)
            });
            await _emailVerificationRepository.SaveChangeAsync();
            await _emailServices.SendEmailAsync(adminUser.Email, "Verification Email", $"Verification Token: {verificationToken}");
        }

        public async Task SellerRegisterAsync(RegisterRequestDTO sellerRequest) 
        {
            var email = _userRepository.ExitByEmailAsync(sellerRequest.Email);

            if (email != null)
                throw new Exception("Email Already Exits");
            if (sellerRequest.Password != sellerRequest.ConfirmPassword)
                throw new Exception("Password not match with ConfirmPassword");
            var seller = new User 
            { 
                FirstName = sellerRequest.FirstName,
                LastName = sellerRequest.LastName,
                Email = sellerRequest.Email,
                PasswordHashed = string.Empty,
                IsActive = true,
                CreatedOn = DateTime.UtcNow
            };
            seller.PasswordHashed = _passwordHasher.HashPassword(seller, sellerRequest.Password);
            await _userRepository.AddUserAsync(seller);
            await _userRepository.SaveChangesAsync();

            var verificationToken = Guid.NewGuid().ToString();
            var emailVerification = new EmailVerificationToken
            {
                Token = verificationToken,
                ExpiryDate = DateTime.UtcNow.AddMinutes(10),
                UserId = seller.Id
            };
            await _emailVerificationRepository.AddAsync(emailVerification);
            await _emailVerificationRepository.SaveChangeAsync();
            await _emailServices.SendEmailAsync(seller.Email, "Verification Email", $"Verification Token: {verificationToken}");

        }

        public async Task<AuthResponceDTO> LoginAsync(LoginRequestDTO login)
        {
            var user = await _userRepository.GetByEmailAsync(login.Email);
            
            if(user == null) {
                throw new Exception("Invalid Email or Password");
            }
            if (!user.IsEmailVerified)
                throw new Exception("Please verify your email before logging in.");

            var result = _passwordHasher.VerifyHashedPassword(user,user.PasswordHashed, login.Password);
            if (result == PasswordVerificationResult.Failed) {
                throw new Exception("Invalid Email or Password");
            }

            var token = _jwtTokenGenrator.GenerateToken(user);
            var refreshToken = _refreshTokenGenerator.GenerateRefreshToken();
            var token1 = new RefreshToken
            {
                Token = refreshToken,
                ExpiryDate = DateTime.UtcNow.AddDays(7),
                UserId = user.Id,
            };
            await _refreshTokenRepository.AddAsync(token1);
            await _refreshTokenRepository.SaveChangesAsync();

            return new AuthResponceDTO
            {
                UserId = user.Id,
                FullName = $"{user.FirstName} {user.LastName}",
                Role = user.Role.Name,
                Email = user.Email,
                Token = token,
                RefreshToken = refreshToken

            };
        }
        
        public async Task<AuthResponceDTO> RefreshTokenAsync (RefreshTokenRequestDTO request)
        {
            var refreshToken = await _refreshTokenRepository.GetByTokenAsync(request.RefreshTokens);
            if (refreshToken == null )
            {
                throw new Exception("Invalid token");
            }
            if (refreshToken.ExpiryDate < DateTime.UtcNow) {
                throw new Exception("expired refresh token");
            }
            if (refreshToken.IsRevoked) {
                throw new Exception("Refresh token has been revoked");
            }
            refreshToken.IsRevoked = true;
            
            var jwtToken = _jwtTokenGenrator.GenerateToken(refreshToken.User);
            var newRefreshTokenGenerate = _refreshTokenGenerator.GenerateRefreshToken();
            // Update the existing refresh token
            var newrefreshToken = new RefreshToken
            {
                Token = newRefreshTokenGenerate,
                UserId = refreshToken.UserId,
                ExpiryDate = DateTime.UtcNow.AddDays(7)
            };
            
            await _refreshTokenRepository.AddAsync(newrefreshToken);
            await _refreshTokenRepository.SaveChangesAsync();
            return new AuthResponceDTO
            {
                UserId = refreshToken.User.Id,
                FullName = $"{refreshToken.User.FirstName} {refreshToken.User.LastName}",
                Role = refreshToken.User.Role.Name,
                Email = refreshToken.User.Email,
                Token = jwtToken,
                RefreshToken = newRefreshTokenGenerate
            };
        }

        public async Task ForgetPasswordAsync(ForgetPasswordRequestDTO request) {
            var user = await _userRepository.GetByEmailAsync(request.Email);
            if(user == null)
                throw new Exception("User not found");
            var token = Guid.NewGuid().ToString();
            var resetToken = new PasswordResetToken
            {
                Token = token,
                UserId = user.Id,
                ExpiryDate = DateTime.UtcNow.AddMinutes(30)
            };
            await _resetPasswordRepository.AddAsync(resetToken);
            await _resetPasswordRepository.SaveChangesAsync();

            var body = $"your password reset token {token}";
            await _emailServices.SendEmailAsync(user.Email, "Password Reset", body);
        }

        public async Task ResetPasswordAsync(ResetPasswordRequestDTO request) 
        {
            if (request.NewPassword != request.ConfirmPassword) {
                throw new Exception("Password do not match");
            }
            var resetToken = await _resetPasswordRepository.GetByTokenAsync(request.Token);

            if (resetToken == null) {
                throw new Exception("ResetToken is invalid");
            }
            if (resetToken.IsUsed)
                throw new Exception("ResetToken AlreadyUsed");
            if (resetToken.ExpiryDate < DateTime.UtcNow)
                throw new Exception("ResetToken Expired");

            var user = resetToken.User;
            user.PasswordHashed = _passwordHasher.HashPassword(user, request.NewPassword);
            resetToken.IsUsed = true;
            await _resetPasswordRepository.UpdateAsync(resetToken);
            await _resetPasswordRepository.SaveChangesAsync();
        }

        public async Task ChangePasswordAsync(int userId, ChangePasswordRequestDTO request) {
            var user = await _userRepository.GetByIdAsync(userId);
            if (user == null)
                throw new Exception("User not found");
            if (request.NewPassword != request.ConfirmNewPassword)
                throw new Exception("Password Mismatch");
            var verifyResult = _passwordHasher.VerifyHashedPassword(user, user.PasswordHashed, request.CurrentPassword);

            if (verifyResult == PasswordVerificationResult.Failed)
                throw new Exception("Current Password is Incorrect");
            user.PasswordHashed = _passwordHasher.HashPassword(user, request.NewPassword);
            await _userRepository.UpdateAsync(user);
            await _userRepository.SaveChangesAsync();
        }

        public async Task EmailVerificationAsync(EmailVerificationRequestDTO request) {
            var token = await _emailVerificationRepository.GetByTokenAsync(request.Token);
            if (token == null)
                throw new Exception("Invalid verification token.");

            if (token.IsUsed)
                throw new Exception("Verification token already used.");

            if (token.ExpiryDate < DateTime.UtcNow)
                throw new Exception("Verification token expired.");

            token.User.IsEmailVerified = true;

            token.IsUsed = true;
            await _emailVerificationRepository.UpdateAsync(token);
            await _emailVerificationRepository.SaveChangeAsync();
        }
        public async Task ResendEmailVerificationAsync(string email)
        {
            var user = await _userRepository.GetByEmailAsync(email);
            if (user == null)
                throw new Exception("Email is Invalid");
            if (user.IsEmailVerified)
                throw new Exception("Email already verified");
            var token = Guid.NewGuid().ToString();
            await _emailVerificationRepository.AddAsync(
                new EmailVerificationToken
                {
                    Token = token,
                    UserId = user.Id,
                    ExpiryDate = DateTime.UtcNow.AddHours(24)
                });
            await _emailVerificationRepository.SaveChangeAsync();
            await _emailServices.SendEmailAsync(user.Email, "Verify Email", $"Verification Token:{token}");
        }
    }
}
