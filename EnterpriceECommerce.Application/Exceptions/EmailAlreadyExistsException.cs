
namespace EnterpriceECommerce.Application.Exceptions
{
    public class EmailAlreadyExistsException : Exception
    {
           public EmailAlreadyExistsException() : base("Email Already Exits") { }
    }
}
