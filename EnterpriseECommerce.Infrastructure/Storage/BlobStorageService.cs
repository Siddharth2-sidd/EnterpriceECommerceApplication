using Azure.Storage.Blobs;
using EnterpriceECommerce.Domain.Comman;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;


namespace EnterpriceECommerce.Infrastructure.Storage
{
    public class BlobStorageService : IBlobStorageService
    {
        private readonly AzureBlobStorageSettings _settings;

        public BlobStorageService(IOptions<AzureBlobStorageSettings> options)
        {
            _settings = options.Value;
        }

        public async Task<string> UploadAsync(IFormFile file)
        {
            var container = new BlobContainerClient(_settings.ConnectionString, _settings.ContainerName);

            await container.CreateIfNotExistsAsync();

            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";

            var blob = container.GetBlobClient(fileName);

            using var stream = file.OpenReadStream();

            await blob.UploadAsync(stream, overwrite: true);

            return blob.Uri.ToString();
        }

        public async Task DeleteAsync(string fileUrl)
        {
            if (string.IsNullOrWhiteSpace(fileUrl))
                return;

            var fileName = Path.GetFileName(fileUrl);

            var container = new BlobContainerClient(_settings.ConnectionString, _settings.ContainerName);

            var blob = container.GetBlobClient(fileName);

            await blob.DeleteIfExistsAsync();
        }
    }
}
