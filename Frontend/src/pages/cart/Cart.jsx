import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart, updateCartItem, removeCartItem, clearCart,} from "../../api/cartApi";

// Get cart items from API response
function getCartItems(response) {
  if (Array.isArray(response?.items)) {
    return response.items;
  }

  // Also support Axios responses if the API helper returns them directly
  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }

  return [];
}

// Get cart item ID
function getItemId(item) {
  return item.id ?? item.cartItemId;
}

// Get quantity
function getQuantity(item) {
  return Number(item.quantity ?? 1);
}

// Get unit price
function getPrice(item) {
  return Number(
    item.unitPrice ??
    item.product?.discountPrice ??
    item.product?.price ??
    item.discountPrice ??
    item.price ??
    0
  );
}

// Get product name
function getProductName(item) {
  return (
    item.productName ??
    item.product?.name ??
    item.name ??
    "Product"
  );
}

// Get product image
function getImage(item) {
  const image =
    item.imageUrl ??
    item.product?.imageUrl ??
    item.product?.images?.[0] ??
    item.product?.productImages?.[0] ??
    "";

  if (typeof image === "string") {
    return image;
  }

  return image?.imageUrl ?? image?.url ?? "";
}

// Get stock if the API provides it
function getStock(item) {
  const stock = item.stockQuantity ?? item.product?.stockQuantity;

  return stock == null ? null : Number(stock);
}

function Cart() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCart = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getCart();
      setItems(getCartItems(response));
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "Unable to load your cart."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCart();
  }, [loadCart]);

  // Update quantity
  const handleUpdateQuantity = async (item, quantity) => {
    const itemId = getItemId(item);
    const stock = getStock(item);

    if (itemId == null) {
      setError("Could not identify this cart item.");
      return;
    }

    if (!Number.isInteger(quantity) || quantity < 1) {
      setError("Quantity must be at least 1.");
      return;
    }

    if (stock !== null && Number.isFinite(stock) && quantity > stock) {
      setError(`Only ${stock} units are available.`);
      return;
    }

    setBusyId(itemId);
    setError("");
    setMessage("");

    try {
      await updateCartItem(itemId, quantity);
      await loadCart();
      setMessage("Cart quantity updated.");
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "Could not update quantity."
      );
    } finally {
      setBusyId(null);
    }
  };

  // Remove an item
  const handleRemove = async (item) => {
    const itemId = getItemId(item);

    if (itemId == null) {
      setError("Could not identify this cart item.");
      return;
    }

    setBusyId(itemId);
    setError("");
    setMessage("");

    try {
      await removeCartItem(itemId);
      await loadCart();
      setMessage("Item removed from cart.");
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "Could not remove this item."
      );
    } finally {
      setBusyId(null);
    }
  };

  // Clear the cart
  const handleClearCart = async () => {
    if (items.length === 0) return;

    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmed) return;

    setBusyId("clear");
    setError("");
    setMessage("");

    try {
      await clearCart();
      setItems([]);
      setMessage("Cart cleared.");
    } catch (err) {
      setError(
        err.response?.data?.message ??
        "Could not clear your cart."
      );
    } finally {
      setBusyId(null);
    }
  };

  // Calculate totals
  const totalQuantity = items.reduce(
    (sum, item) => sum + getQuantity(item),
    0
  );

  const subtotal = items.reduce(
    (sum, item) => sum + getPrice(item) * getQuantity(item),
    0
  );

  if (loading) {
    return <div className="cart-page">Loading cart...</div>;
  }

  return (
    <main className="cart-page">
      <div className="cart-heading">
        <div>
          <h1>Shopping Cart</h1>
          <p>{totalQuantity} item(s) in your cart</p>
        </div>

        {items.length > 0 && (
          <button
            className="cart-clear-button"
            onClick={handleClearCart}
            disabled={busyId !== null}
          >
            Clear Cart
          </button>
        )}
      </div>

      {error && (
        <p className="cart-error" role="alert">
          {error}
        </p>
      )}

      {message && (
        <p className="cart-message" role="status">
          {message}
        </p>
      )}

      {items.length === 0 ? (
        <section className="cart-empty">
          <h2>Your cart is empty</h2>
          <p>Add products to see them here.</p>

          <Link to="/products" className="cart-primary-button">
            Browse Products
          </Link>
        </section>
      ) : (
        <div className="cart-layout">
          <section className="cart-items">
            {items.map((item) => {
              const itemId = getItemId(item);
              const quantity = getQuantity(item);
              const price = getPrice(item);
              const name = getProductName(item);
              const image = getImage(item);
              const stock = getStock(item);
              const isBusy = busyId === itemId;

              return (
                <article className="cart-item" key={itemId}>
                  {image ? (
                    <img
                      className="cart-item-image"
                      src={image}
                      alt={name}
                    />
                  ) : (
                    <div className="cart-item-image cart-image-placeholder">
                      No image
                    </div>
                  )}

                  <div className="cart-item-info">
                    <h2>{name}</h2>

                    <p className="cart-item-price">
                      ₹{price.toFixed(2)}
                    </p>

                    <div className="cart-quantity-control">
                      <button
                        aria-label="Decrease quantity"
                        disabled={isBusy || quantity <= 1 || busyId === "clear"}
                        onClick={() =>
                          handleUpdateQuantity(item, quantity - 1)
                        }
                      >
                        −
                      </button>

                      <span>{quantity}</span>

                      <button
                        aria-label="Increase quantity"
                        disabled={
                          isBusy ||
                          busyId === "clear" ||
                          (stock !== null &&
                            Number.isFinite(stock) &&
                            quantity >= stock)
                        }
                        onClick={() =>
                          handleUpdateQuantity(item, quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>

                    <button
                      className="cart-remove-button"
                      disabled={isBusy || busyId === "clear"}
                      onClick={() => handleRemove(item)}
                    >
                      {isBusy ? "Please wait..." : "Remove"}
                    </button>
                  </div>

                  <div className="cart-item-total">
                    ₹{(price * quantity).toFixed(2)}
                  </div>
                </article>
              );
            })}
          </section>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="cart-summary-row">
              <span>Items</span>
              <span>{totalQuantity}</span>
            </div>

            <div className="cart-summary-row">
              <span>Subtotal</span>
              <strong>₹{subtotal.toFixed(2)}</strong>
            </div>

            <p className="cart-summary-note">
              Shipping, discounts, taxes, and final totals
              are confirmed by the server during checkout.
            </p>

            <button
              className="cart-primary-button"
              onClick={() => navigate("/checkout")}
              disabled={busyId !== null}
            >
              Proceed to Checkout
            </button>

            <Link to="/products" className="cart-continue-link">
              Continue Shopping
            </Link>
          </aside>
        </div>
      )}
    </main>
  );
}

export default Cart;
