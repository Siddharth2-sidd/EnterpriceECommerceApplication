import { useEffect, useState } from "react";

const ProductImageGallery = ({ images = [], productName = "Product" }) => {
  const [selectedImage, setSelectedImage] = useState("");

  // Normalize image URLs from API response
  const imageUrls = images.map((image) => {
      if (typeof image === "string") {
        return image;
      }
      return (image.imageUrl || image.url || image.image || image.fileUrl ||  "");
    }).filter(Boolean);

  useEffect(() => {
    setSelectedImage(imageUrls[0] || "");
  }, [images]);

  if (imageUrls.length === 0) {
    return (
      <div className="gallery-container">
        <div className="gallery-main-image gallery-placeholder"> No Image Available </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      {/* Main Image */}
      <div className="gallery-main-image">
        <img src={selectedImage} alt={productName} onError={(event) => {event.currentTarget.style.display = "none";}} />
      </div>

      {/* Thumbnail Images */}
      {imageUrls.length > 1 && (
        <div className="gallery-thumbnails">
          {imageUrls.map((imageUrl, index) => (
            <button type="button" key={`${imageUrl}-${index}`} className={`gallery-thumbnail ${selectedImage === imageUrl ? "active" : ""}`}
              onClick={() => setSelectedImage(imageUrl)}
              aria-label={`View image ${index + 1}`}
              aria-pressed={selectedImage === imageUrl}
            >
            <img  src={imageUrl}  alt={`${productName} view ${index + 1}`}/>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;