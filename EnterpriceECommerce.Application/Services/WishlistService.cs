using EnterpriceECommerce.Application.DTOs.WishListItem;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;

namespace EnterpriceECommerce.Application.Services
{
    public class WishlistService : IWishlistService
    {
        private readonly IWishlistRepository _wishlistRepository;
        private readonly IProductRepository _productRepository;

        public WishlistService(IWishlistRepository wishlistRepository, IProductRepository productRepository)
        {
            _wishlistRepository = wishlistRepository;
            _productRepository = productRepository;
        }

        public async Task<WishlistItemResponseDto> AddAsync(int userId,int productId)
        {
            var product = await _productRepository.GetByIdAsync(productId);

            if (product == null)
            {
                throw new Exception("Product not found.");
            }
            if (!product.IsActive)
            {
                throw new Exception("Product is not available.");
            }

            var existing =  await _wishlistRepository.GetByUserAndProductAsync(userId,productId);
            if (existing != null)
            {
                throw new Exception("Product is already in wishlist.");
            }

            var item = new Domain.Entitites.WishListItem
            {
                UserId = userId,
                ProductId = productId
            };

            await _wishlistRepository.AddAsync(item);
            await _wishlistRepository.SaveChangesAsync();
            var saved = await _wishlistRepository.GetByIdAsync(item.Id);

            return Map(saved!);
        }
        public async Task<List<WishlistItemResponseDto>>GetMyWishlistAsync(int userId)
        {
            var items =  await _wishlistRepository.GetByUserIdAsync(userId);
            return items.Select(Map).ToList();
        }

        public async Task RemoveAsync(int userId,int productId)
        {
            var item =  await _wishlistRepository.GetByUserAndProductAsync(userId,productId);

            if (item == null)
            {
                throw new Exception("Product is not in wishlist.");
            }

            await _wishlistRepository.DeleteAsync(item);
            await _wishlistRepository.SaveChangesAsync();
        }

        public async Task<bool> IsInWishlistAsync(  int userId, int productId)
        {
            var item = await _wishlistRepository.GetByUserAndProductAsync( userId,  productId);

            return item != null;
        }

        private static WishlistItemResponseDto Map(Domain.Entitites.WishListItem item)
        {
            return new WishlistItemResponseDto
            {
                Id = item.Id,
                ProductId = item.ProductId,
                ProductName = item.Product.Name,
                Price = item.Product.Price,
                CreatedDate = item.CreatedDate
            };
        }

    }
    }
