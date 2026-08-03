namespace EnterpriceECommerce.Domain.Comman
{
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string Message { get; set; } = string.Empty;
        public  T? Date { get; set; }
    }

    
}
