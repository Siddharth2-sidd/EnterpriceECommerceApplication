using EnterpriceECommerce.Domain.Entitites;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Persistence.Repositories.Interfaces
{
    public interface IEmailVerificationRepository
    {
        Task AddAsync(EmailVerificationToken token);
        Task<EmailVerificationToken> GetByTokenAsync(string token);
        Task UpdateAsync(EmailVerificationToken token);
        Task SaveChangeAsync();
    }
}
