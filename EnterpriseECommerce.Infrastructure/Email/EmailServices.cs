using EnterpriceECommerce.Application.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Infrastructure.Email
{
    public class EmailServices : IEmailServices
    {
        public Task SendEmailAsync(string to, string subject, string body) {
            // Implemetation
            return Task.CompletedTask;
        }
    }
}
