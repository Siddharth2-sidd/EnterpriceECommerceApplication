

namespace EnterpriceECommerce.Application.DTOs.Review
{
    public class ProductRatingDto
    {
        public int ProductId { get; set; }
        public double AverageRating { get; set; }
        public int TotalReviews { get; set; }
    }
}
