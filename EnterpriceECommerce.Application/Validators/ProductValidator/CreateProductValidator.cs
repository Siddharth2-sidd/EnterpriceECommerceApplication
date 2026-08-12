using EnterpriceECommerce.Application.DTOs.Product;
using FluentValidation;

namespace EnterpriceECommerce.Application.Validators.Product;

public class CreateProductValidator : AbstractValidator<CreateProductRequestDTO>
{
    public CreateProductValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty()
            .MaximumLength(200);

        RuleFor(x => x.Description)
            .MaximumLength(2000);

        RuleFor(x => x.Price)
            .GreaterThan(0);

        RuleFor(x => x.DiscountPrice)
            .GreaterThanOrEqualTo(0)
            .LessThanOrEqualTo(x => x.Price);

        RuleFor(x => x.StockQuantity)
            .GreaterThanOrEqualTo(0);

        RuleFor(x => x.SKU)
            .NotEmpty()
            .MaximumLength(100);

        RuleFor(x => x.CategoryId)
            .GreaterThan(0);

        RuleFor(x => x.BrandId)
            .GreaterThan(0);
    }
}