using EnterpriceECommerce.Application.DTOs.Category;
using FluentValidation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EnterpriceECommerce.Application.Validators
{
    public class UpdateCategoryValidator : AbstractValidator<UpdateCategoryRequestDTOs>
    {
        public UpdateCategoryValidator() 
        {
            RuleFor(x => x.Id).NotEmpty().GreaterThan(0);
            RuleFor(x => x.Name).NotEmpty().MaximumLength(100);
            RuleFor(x => x.Description).MaximumLength(500);
            RuleFor(x => x.ImageUrl).MaximumLength(500);
        }
    }
}
