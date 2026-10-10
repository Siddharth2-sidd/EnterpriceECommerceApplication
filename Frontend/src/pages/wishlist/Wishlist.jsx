
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getWishlist, removeFromWishlist } from "../../api/wishlistApi";

const Wishlist = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getWishlist();
      const data = Array.isArray(response) ? response : response?.data ?? response?.items ?? [];

      if (!Array.isArray(data)) {
        throw new Error("Unexpected wishlist response.");
      }
      setItems(data);
    } catch (err) {
      console.error("Failed to load wishlist:", err);
      setError(err.response?.status === 401 ? "Please log in to view your wishlist.": "Unable to load your wishlist.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      setRemovingId(productId);
      setError("");
      await removeFromWishlist(productId);
      setItems((currentItems) =>
        currentItems.filter((item) => {
          const id = item.productId ?? item.product?.id ?? item.id;
          return id !== productId;
        })
      );
    } catch (err) {
      console.error("Failed to remove wishlist item:", err);
      setError("Unable to remove this product. Please try again.");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return <div className="wishlist-message">Loading wishlist...</div>;
  }

  return (
    <div className="wishlist-page">
      <h1>My Wishlist</h1>

      {error && (
        <div className="wishlist-error" role="alert">{error} </div>
      )}

      {items.length === 0 ? (
        <div className="wishlist-empty">
          <h2>Your wishlist is empty</h2>
          <p>Save products here to find them easily later.</p>
          <Link to="/products" className="wishlist-shop-button"> Browse Products </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {items.map((item, index) => {
            // Supports either a wishlist item containing a nested
            // product or a product object returned directly by the API.
            const product = item.product ?? item;
            const productId = product.id ?? item.productId;

            const imageUrl = product.images?.[0]?.imageUrl || product.images?.[0]?.url || product.productImages?.[0]?.imageUrl || null;
            return (
              <article className="wishlist-card" key={item.id ?? productId ?? index}>
                <Link to={`/products/${productId}`} className="wishlist-image-link">
                  {imageUrl ? (
                    <img src={imageUrl} alt={product.name ?? "Product"} className="wishlist-image"/>
                  ) : (
                    <div className="wishlist-image-placeholder"> No Image </div>
                  )}
                </Link>

                <div className="wishlist-card-content">
                  <h3>{product.name ?? "Product"}</h3>
                  {product.price != null && (
                    <p className="wishlist-price">₹{product.price} </p>
                  )}

                  <Link to={`/products/${productId}`} className="wishlist-view-button"> View Product </Link>
                  <button type="button" className="wishlist-remove-button" disabled={removingId === productId} onClick={() => handleRemove(productId)}>
                    {removingId === productId ? "Removing..." : "Remove"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
