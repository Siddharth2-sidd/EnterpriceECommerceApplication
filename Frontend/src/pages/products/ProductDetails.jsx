import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getProductsById } from "../../api/productApi";
import ProductImageGallery from "../../components/product/ProductImageGallary";
import ProductSpecifications from "../../components/product/ProductSpecifications";
import {addToWishlist, removeFromWishlist, isProductInWishlist,} from "../../api/wishlistApi";
import ProductReviews from "../../components/product/ProductReview";
import { addToCart } from "../../api/cartApi";


const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const navigate =  useNavigate();
  const [inWishlist, setInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [wishlistChecked, setWishlistChecked] = useState(false);
  const [wishlistError, setWishlistError] = useState("");
  const [addingToCart, setAddingToCart] = useState(false);
  const [cartMessage, setCartMessage] = useState("");
  const [cartError, setCartError] = useState("");

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

  useEffect(() => {
  if (!product?.id) return;
  let cancelled = false;
  const checkWishlist = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setWishlistChecked(true);
      return;
    }
    try {
      const response = await isProductInWishlist(product.id);
      const exists = typeof response === "boolean" ? response : response?.exists ?? response?.isInWishlist ?? false;
      if (!cancelled) {
        setInWishlist(exists);
      }
    } catch (err) {
      console.error("Failed to check wishlist:", err);
    } finally {
      if (!cancelled) {
        setWishlistChecked(true);
      }
    }
  };
  setWishlistChecked(false);
  checkWishlist();
  return () => { cancelled = true;
  };
}, [product?.id]);

  const increaseQuantity = () => {
    if (quantity < (product?.stockQuantity ?? 1)) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleWishlistClick = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }
  try {
    setWishlistLoading(true);
    setWishlistError("");

    if (inWishlist) {
      await removeFromWishlist(product.id);
      setInWishlist(false);
    } else {
      await addToWishlist(product.id);
      setInWishlist(true);
    }
  } catch (err) {
    console.error("Wishlist action failed:", err);
    setWishlistError(err.response?.data?.message || "Unable to update wishlist. Please try again.");
  } finally {
    setWishlistLoading(false);
  }
};

const handleAddToCart = async () => {
  const token = localStorage.getItem("token");
  if (!token) {
    navigate("/login");
    return;
  }
  if (!product?.id) {
    setCartError("Product details are not available.");
    return;
  }
  const quantityToAdd = Number(quantity);
  const stock = Number(product.stockQuantity);

  if (!Number.isInteger(quantityToAdd) || quantityToAdd < 1) {
    setCartError("Please enter a valid quantity.");
    return;
  }

  if (!Number.isFinite(stock) || stock < quantityToAdd) {
    setCartError("The requested quantity is unavailable.");
    return;
  }

  setAddingToCart(true);
  setCartError("");
  setCartMessage("");

  try {
    await addToCart(product.id, quantityToAdd);
    setCartMessage("Product added to your cart.");
  } catch (err) {
    setCartError( err.response?.data?.message ?? "Could not add this product to your cart.");
  } finally {
    setAddingToCart(false);
  }
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
        <ProductImageGallery images={product.images || product.productImages || []} productName={product.name}/>

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
          <button type="button" className="add-to-cart-button" onClick={handleAddToCart} disabled={addingToCart || !inStock || quantity < 1 || quantity > product.stockQuantity}>
            {addingToCart ? "Adding..." : inStock ? "Add to Cart" : "Out of Stock"}
          </button>
          {cartMessage && (<p role="status" className="cart-action-message">{cartMessage}</p>)}
          {cartError && (<p role="alert" className="cart-error"> {cartError}</p>)}
          <button type="button" className="wishlist-toggle-button" onClick={handleWishlistClick} disabled={wishlistLoading || !wishlistChecked}>
            {wishlistLoading ? "Updating..." : inWishlist ? "♥ Remove from Wishlist" : "♡ Add to Wishlist"}
          </button>

        {wishlistError && (<p className="wishlist-error" role="alert"> {wishlistError}</p>)}
        </div>
        <ProductSpecifications productId={product.id} />
        <ProductReviews productId={product.id} />
      </div>
    </div>
  );
};

export default ProductDetails;