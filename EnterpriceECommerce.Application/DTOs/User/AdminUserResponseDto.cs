
using EnterpriceECommerce.Domain.Entitites;

namespace EnterpriceECommerce.Application.DTOs.User
{
    public class AdminUserResponseDto
    {
        public int Id { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
    }
}
