using EnterpriceECommerce.Application.DTOs.Brand;
using FluentValidation;

namespace EnterpriceECommerce.Application.Validators.BrandValidator
{
    public class CreateBrandValidator : AbstractValidator<CreateBrandRequestDTO>
    {
        public CreateBrandValidator() 
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);

            RuleFor(x => x.Description).MaximumLength(500);
        }
    }
}
