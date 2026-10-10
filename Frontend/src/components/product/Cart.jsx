import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {getCart, updateCartItem, removeCartItem, clearCart,} from "../../api/cartApi";

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState("");

  const loadCart = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCart();

      // Supports an array or common wrapped API responses.
      const cartItems = Array.isArray(response)
        ? response
        : response?.items ??
          response?.cartItems ??
          response?.data?.items ??
          response?.data?.cartItems ??
          response?.data ??
          [];

      if (!Array.isArray(cartItems)) {
        throw new Error("Unexpected cart response.");
      }

      setItems(cartItems);
    } catch (err) {
      console.error("Failed to load cart:", err);

      if (err.response?.status === 401) {
        setError("Please log in to view your cart.");
      } else {
        setError("Unable to load your cart. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Support a cart item that contains a nested product,
  // or one that has product fields directly.
  const getProduct = (item) => item.product ?? item;

  const getCartItemId = (item) =>
    item.cartItemId ?? item.id;

  const getProductId = (item) => {
    const product = getProduct(item);
    return product.id ?? item.productId;
  };

  const getPrice = (item) => {
    const product = getProduct(item);

    const price =
      product.discountPrice != null &&
      Number(product.discountPrice) > 0 &&
      Number(product.discountPrice) < Number(product.price)
        ? product.discountPrice
        : product.price;

    return Number(price ?? item.unitPrice ?? 0);
  };

  const getQuantity = (item) =>
    Number(item.quantity ?? item.productQuantity ?? 1);

  const cartTotal = items.reduce((total, item) => {
    return total + getPrice(item) * getQuantity(item);
  }, 0);

  const totalQuantity = items.reduce((total, item) => {
    return total + getQuantity(item);
  }, 0);

  const changeQuantity = async (item, newQuantity) => {
    const cartItemId = getCartItemId(item);
    const product = getProduct(item);
    const stock = Number(
      product.stockQuantity ?? item.stockQuantity ?? Infinity
    );

    if (newQuantity < 1 || newQuantity > stock) {
      return;
    }

    if (cartItemId == null) {
      setError("Cart item ID is missing from the API response.");
      return;
    }

    try {
      setBusyId(cartItemId);
      setError("");

      await updateCartItem(cartItemId, newQuantity);
      await loadCart();
    } catch (err) {
      console.error("Failed to update cart:", err);
      setError(
        err.response?.data?.message ??
          "Unable to update quantity."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleRemove = async (item) => {
    const cartItemId = getCartItemId(item);

    if (cartItemId == null) {
      setError("Cart item ID is missing from the API response.");
      return;
    }

    try {
      setBusyId(cartItemId);
      setError("");

      await removeCartItem(cartItemId);
      await loadCart();
    } catch (err) {
      console.error("Failed to remove cart item:", err);
      setError(
        err.response?.data?.message ??
          "Unable to remove this product."
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleClearCart = async () => {
    if (!window.confirm("Remove all items from your cart?")) {
      return;
    }

    try {
      setClearing(true);
      setError("");

      await clearCart();
      setItems([]);
    } catch (err) {
      console.error("Failed to clear cart:", err);
      setError("Unable to clear your cart.");
    } finally {
      setClearing(false);
    }
  };

  if (loading) {
    return <div className="cart-message">Loading cart...</div>;
  }

  return (
    <div className="cart-page">
      <div className="cart-heading">
        <h1>Shopping Cart</h1>

        {items.length > 0 && (
          <button type="button" className="cart-clear-button" onClick={handleClearCart} disabled={clearing || busyId !== null} >
            {clearing ? "Clearing..." : "Clear Cart"}
          </button>
        )}
      </div>

      {error && (
        <div className="cart-error" role="alert">
          {error}
          {error.toLowerCase().includes("log in") && (
            <button type="button" onClick={() => navigate("/login")}>
              Log In
            </button>
          )}
        </div>
      )}

      {items.length === 0 ? (
        <div className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Browse products and add something you like.</p>

          <Link to="/products" className="cart-shop-button">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item, index) => {
              const product = getProduct(item);
              const cartItemId = getCartItemId(item);
              const productId = getProductId(item);
              const quantity = getQuantity(item);

              const imageUrl =
                product.images?.[0]?.imageUrl ||
                product.images?.[0]?.url ||
                product.productImages?.[0]?.imageUrl ||
                null;

              const price = getPrice(item);
              const busy = busyId === cartItemId;

              return (
                <article
                  className="cart-item"
                  key={cartItemId ?? `${productId}-${index}`}
                >
                  <Link
                    to={`/products/${productId}`}
                    className="cart-item-image"
                  >
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={product.name ?? "Product"}
                      />
                    ) : (
                      <div className="cart-image-placeholder">
                        No Image
                      </div>
                    )}
                  </Link>

                  <div className="cart-item-details">
                    <Link
                      to={`/products/${productId}`}
                      className="cart-item-name"
                    >
                      {product.name ?? "Product"}
                    </Link>

                    <p className="cart-item-price">
                      ₹{price.toFixed(2)} each
                    </p>

                    <div className="cart-quantity">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        disabled={busy || quantity <= 1}
                        onClick={() =>
                          changeQuantity(item, quantity - 1)
                        }
                      >
                        −
                      </button>

                      <span>{quantity}</span>

                      <button
                        type="button"
                        aria-label="Increase quantity"
                        disabled={
                          busy ||
                          quantity >= Number(
                            product.stockQuantity ??
                              item.stockQuantity ??
                              Infinity
                          )
                        }
                        onClick={() =>
                          changeQuantity(item, quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      type="button"
                      className="cart-remove-button"
                      disabled={busy}
                      onClick={() => handleRemove(item)}
                    >
                      {busy ? "Updating..." : "Remove"}
                    </button>
                  </div>

                  <div className="cart-line-total">
                    ₹{(price * quantity).toFixed(2)}
                  </div>
                </article>
              );
            })}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-summary-row">
              <span>Total Items</span>
              <span>{totalQuantity}</span>
            </div>

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>

            <div className="cart-summary-row cart-grand-total">
              <span>Estimated Total</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>

            <p className="cart-summary-note">
              Shipping, discounts, and final payable amount will
              be confirmed during checkout.
            </p>

            <button
              type="button"
              className="cart-checkout-button"
              onClick={() => navigate("/checkout")}
              disabled={items.length === 0}
            >
              Proceed to Checkout
            </button>

            <Link to="/products" className="cart-continue-link">
              Continue Shopping
            </Link>
          </aside>
        </>
      )}
    </div>
  );
};

export default Cart;
