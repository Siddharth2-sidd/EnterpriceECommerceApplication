using EnterpriceECommerce.Application.DTOs.Auth;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.Interfaces
{
    public interface IAuthService
    {
        Task RegisterAsync(RegisterRequestDTO request);
        Task<AuthResponceDTO> LoginAsync(LoginRequestDTO login);

    }
}