using EnterpriceECommerce.Application.DTOs.Brand;
using FluentValidation;

public class UpdateBrandValidator : AbstractValidator<UpdateBrandRequestDTO>
{
    public UpdateBrandValidator()
    {
        RuleFor(x => x.Id).GreaterThan(0);

        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.Description)
            .MaximumLength(500);
    }
}