
namespace EnterpriceECommerce.Application.DTOs.Review
{
    public class ReviewResponseDto
    {
        public int Id { get; set; }
        public int ProductId { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string Comment { get; set; }  = string.Empty;
        public DateTime CreatedOn { get; set; }
    }
}
