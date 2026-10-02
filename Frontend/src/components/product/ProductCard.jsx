import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const imageUrl = product.images?.[0]?.imageUrl || null;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice : product.price;

  return (
    <div className="product-card">
      <div className="product-image-container">
        {imageUrl ? (
          <img src={imageUrl} alt={product.name} className="product-image"/>
        ) : (
          <div className="product-image-placeholder"> No Image </div>
        )}
      </div>

      <div className="product-content">
        <h3 className="product-name"> {product.name} </h3>
        {product.brand?.name && (
          <p className="product-brand"> {product.brand.name} </p>
        )}

        <div className="product-price">
          <span className="current-price"> ₹{displayPrice} </span>
          {hasDiscount && (
            <span className="original-price"> ₹{product.price} </span>
          )}
        </div>

        {product.stockQuantity > 0 ? (
          <p className="stock-available"> In Stock </p>
        ) : (
          <p className="stock-out"> Out of Stock </p>
        )}

        <Link to={`/products/${product.id}`} className="product-button"> View Details </Link>
      </div>
    </div>
  );
};

export default ProductCard;