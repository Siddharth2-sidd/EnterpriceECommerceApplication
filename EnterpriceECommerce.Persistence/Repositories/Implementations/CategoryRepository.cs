using EnterpriceECommerce.Domain.Comman;
using EnterpriceECommerce.Domain.Entitites;
using EnterpriceECommerce.Persistence.Context;
using EnterpriceECommerce.Persistence.Repositories.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Net.WebRequestMethods;

namespace EnterpriceECommerce.Persistence.Repositories.Implementations
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly AppDbContext _context;

        public CategoryRepository(AppDbContext context) {
            _context = context;
        }

        public async Task AddAsync(Category category) {
            await _context.Categories.AddAsync(category); 
        }

        public async Task<List<Category>> GetAllAsync(FilterDTO filterDTO) {
            var query =  _context.Categories.Where(x => !x.IsDeleted);

            if (!string.IsNullOrEmpty(filterDTO.Search)) {
                query = query.Where(x=>x.Name.Contains(filterDTO.Search));
            }
            if (filterDTO.SortBy == "Name")
            {
                query = filterDTO.Descending
                    ? query.OrderByDescending(x => x.Name)
                    : query.OrderBy(x => x.Name);
            }
            return await query.Skip((filterDTO.PageNumber - 1) * filterDTO.PageSize).Take(filterDTO.PageSize).ToListAsync();  
        }
        public async Task<Category?> GetByIdAsync(int id) {
            return await _context.Categories.FirstOrDefaultAsync(x => x.Id == id && !x.IsDeleted);
        }

        public async Task<bool> ExitsAsync(string name) {
            return await _context.Categories.AnyAsync(x => x.Name == name && !x.IsDeleted);
        }
        public  Task UpdateAsync(Category category) {
            _context.Categories.Update(category);
            return Task.CompletedTask;
        }
        public Task DeleteAsync(Category category) {
            category.IsDeleted = true;
            _context.Categories.Update(category);
            return Task.CompletedTask;
        }

        public async Task SaveChangesAsync() {
             await _context.SaveChangesAsync();
        }



    }
}
