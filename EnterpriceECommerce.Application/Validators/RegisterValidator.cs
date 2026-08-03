using EnterpriceECommerce.Application.DTOs.Auth;
using FluentValidation;

namespace EnterpriceECommerce.Application.Validators
{
    public class RegisterValidator: AbstractValidator<RegisterRequestDTO>
    {
        public RegisterValidator() {
            RuleFor(x => x.FirstName).NotEmpty();
            RuleFor(x => x.LastName).NotEmpty();
            RuleFor(x => x.Email).NotEmpty().EmailAddress();
            RuleFor(x => x.Password).NotEmpty().MinimumLength(9);
            RuleFor(x => x.ConfirmPassword).Equal(x => x.Password);
        }
    }
}
