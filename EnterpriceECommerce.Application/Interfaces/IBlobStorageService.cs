using Microsoft.AspNetCore.Http;

public interface IBlobStorageService
{
    Task<string> UploadAsync(IFormFile file);

    Task DeleteAsync(string fileUrl);
}