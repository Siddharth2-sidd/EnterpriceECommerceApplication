using FluentValidation;
using EnterpriceECommerce.Application.DTOs.Category;
namespace EnterpriceECommerce.Application.Validators
{
    public class CreateCategoryValidator : AbstractValidator<CreateCategoryRequestDTOs>
    {
        public CreateCategoryValidator() 
        {
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Description).MaximumLength(500);
            RuleFor(x => x.Image);
        }
    }
}
