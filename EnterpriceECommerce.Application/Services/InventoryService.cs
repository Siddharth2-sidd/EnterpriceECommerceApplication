using AutoMapper;
using EnterpriceECommerce.Application.DTOs.Inventory;
using EnterpriceECommerce.Application.Interfaces;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.Services
{
    public class InventoryService : IInventoryService
    {
        private readonly IInventoryRepository _inventoryRepository;
        private readonly IProductRepository _productRepository;
        private readonly IMapper _mapper;
        public InventoryService(IInventoryRepository inventoryRepository, IProductRepository productRepository, IMapper mapper)
        {
            _inventoryRepository = inventoryRepository;
            _productRepository = productRepository;
            _mapper = mapper;
        }
        public async Task AdjustStockAsync(AdjustStockRequestDto request)
        {
            var product = await _productRepository.GetByIdAsync(request.ProductId);
            if (product == null)
            {
                throw new Exception($"Product with ID {request.ProductId} not found.");
            }

            if(request.Quantity < 0)
            {
                throw new Exception("Quantity cannot be negative.");
            }
            var type = request.TransactionType.ToUpper();
            if(type != "IN" && type != "OUT")
            {
                throw new Exception("TransactionType must be either 'IN' or 'OUT'.");
            }
            if(type == "OUT" && product.StockQuantity < request.Quantity)
            {
                throw new Exception("Insufficient stock for the requested quantity.");
            }
            if(type == "IN")
            {
                product.StockQuantity = +request.Quantity;
            }
            else
            {
                product.StockQuantity = -request.Quantity;
            }

            var inventory = _mapper.Map<InventoryTransaction>(request);
            await _inventoryRepository.AddTransactionAsync(inventory);
            await _inventoryRepository.SaveChangesAsync();
            await _inventoryRepository.SaveChangesAsync();
        }
        public async Task<List<InventoryTransactionResponseDto>> GetHistoryAsync(int productId)
        {
            var productHistory = await _inventoryRepository.GetTransactionsByProductIdAsync(productId);
            if(productHistory == null)
            {
                throw new Exception("Product History is Empty");
            }

            return _mapper.Map<List<InventoryTransactionResponseDto>>(productHistory);
            
        }
    }
}
