using EnterpriceECommerce.Application.Interfaces;
using System.Security.Cryptography;

namespace EnterpriceECommerce.Infrastructure.Identity
{
    public class RefreshTokenGenerator : IRefreshTokenGenerator
    {
        public string GenerateRefreshToken()
        {
            return Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
        }
    }
}
