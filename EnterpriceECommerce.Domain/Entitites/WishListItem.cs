

namespace EnterpriceECommerce.Domain.Entitites
{
    public class WishListItem
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public int ProductId { get; set; }
        public Product Product { get; set; } = null!;
        public DateTime CreatedDate { get; set; }= DateTime.UtcNow;
    }
}
