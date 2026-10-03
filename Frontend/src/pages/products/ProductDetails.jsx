import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductsById } from "../../api/productApi";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");
        setProduct(null);

        const response = await getProductsById(id);

        // Supports a direct product response or { data: product }
        const productData = response?.data ?? response;

        if (!productData || !productData.id) {
          setError("Product not found.");
          return;
        }

        setProduct(productData);
      } catch (err) {
        console.error("Error fetching product:", err);

        if (err.response?.status === 404) {
          setError("Product not found.");
        } else {
          setError(err.response?.data?.message || "Unable to load product details.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const increaseQuantity = () => {
    if (quantity < (product?.stockQuantity ?? 1)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };
  if (loading) {
    return <div className="product-details-message">Loading product...</div>;
  }
  if (error) {
    return (
      <div className="product-details-message">
        <h2>{error}</h2>
        <Link to="/product">Back to Products</Link>
      </div>
    );
  }

  const imageUrl = product.images?.[0]?.imageUrl || product.images?.[0]?.url || product.productImages?.[0]?.imageUrl || null;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount? product.discountPrice : product.price;
  const inStock = (product.stockQuantity ?? 0) > 0;

  return (
    <div className="product-details-page">
      <Link to="/products" className="back-link"> ← Back to Products </Link>

      <div className="product-details-layout">
        {/* Product Image */}
        <div className="product-details-image">
          {imageUrl ? (
            <img src={imageUrl} alt={product.name} />
          ) : (
            <div className="product-details-placeholder">
              No Image Available
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="product-details-info">
          <p className="product-category"> {product.category?.name || "Product"} </p>
          <h1>{product.name}</h1>
          {product.brand?.name && (
            <p className="product-detail-brand"> Brand: {product.brand.name} </p>
          )}

          <div className="product-detail-price">
            <span className="detail-current-price"> ₹{displayPrice} </span>
            {hasDiscount && (
              <span className="detail-original-price"> ₹{product.price} </span>
            )}
          </div>

          {hasDiscount && (<p className="discount-label"> Discount Available </p>)}
          <div className="product-stock-status">
            {inStock ? (
              <span className="stock-available"> In Stock </span>
            ) : (
              <span className="stock-out"> Out of Stock </span>
            )}
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p> {product.description || "No description available."} </p>
          </div>

          {product.sku && (<p className="product-sku"> SKU: {product.sku} </p>)}
          {/* Quantity Selector */}
          {inStock && (
            <div className="quantity-section">
              <label>Quantity:</label>
              <div className="quantity-control">
                <button type="button" onClick={decreaseQuantity}  disabled={quantity <= 1} > - </button>
                <span>{quantity}</span>
                <button type="button" onClick={increaseQuantity} disabled={quantity >= product.stockQuantity}> + </button>
              </div>
            </div>
          )}

          <p className="detail-total"> Total: ₹{(displayPrice * quantity).toFixed(2)} </p>
          <button type="button" className="add-to-cart-button"  disabled={!inStock} title="Cart integration will be implemented in Step 21" >
            {inStock ? "Add to Cart — Step 21" : "Out of Stock"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;