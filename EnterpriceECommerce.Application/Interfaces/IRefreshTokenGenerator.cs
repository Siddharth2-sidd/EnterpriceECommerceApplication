using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IRefreshTokenGenerator
    {
        string GenerateRefreshToken();
    }
}
