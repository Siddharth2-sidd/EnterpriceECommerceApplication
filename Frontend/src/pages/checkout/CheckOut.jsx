
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCart } from "../../api/cartApi";
import { getAddresses } from "../../api/addressApi";
import { checkoutOrder } from "../../api/orderApi";


function getCartItems(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.cartItems)) return response.cartItems;
  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }
  if (Array.isArray(response?.data?.cartItems)) {
    return response.data.cartItems;
  }
  if (Array.isArray(response?.data)) return response.data;

  return [];
}

function getAddressList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.addresses)) return response.addresses;
  if (Array.isArray(response?.data?.items)) {
    return response.data.items;
  }
  if (Array.isArray(response?.data?.addresses)) {
    return response.data.addresses;
  }
  if (Array.isArray(response?.data)) return response.data;

  return [];
}

function getProduct(item) {
    console.log(item);
  return item.product ?? item;
}

function getQuantity(item) {
  return Number(item.quantity ?? item.productQuantity ?? 1);
}

function getPrice(item) {
  const product = getProduct(item);
  return Number(product.discountPrice ?? product.price ?? 0);
}

function getAddressId(address) {
  return address.addressId ?? address.id;
}

function getOrderId(response) {
  return (
    response?.orderId ??
    response?.id ??
    response?.data?.orderId ??
    response?.data?.id ??
    response?.order?.orderId ??
    response?.order?.id
  );
}

function Checkout() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");

  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");

  const loadCheckoutData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [cartResponse, addressResponse] = await Promise.all([getCart(), getAddresses()]);
      const cartItems = getCartItems(cartResponse);
      const addressItems = getAddressList(addressResponse);
      console.log(cartItems);

      setItems(cartItems);
      setAddresses(addressItems);

      const defaultAddress = addressItems.find((address) => address.isDefault);
      const initialAddress = defaultAddress ?? addressItems[0];

      setSelectedAddressId(initialAddress ? String(getAddressId(initialAddress)) : "");
    } catch (err) {
      setError(err.response?.data?.message ?? "Unable to load checkout information.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCheckoutData();
  }, [loadCheckoutData]);

  const subtotal = items.reduce((sum, item) => sum + getPrice(item) * getQuantity(item), 0);
  const selectedAddress = addresses.find((address) =>String(getAddressId(address)) === String(selectedAddressId));
  const handlePlaceOrder = async (event) => {
    event.preventDefault();

    if (items.length === 0) {
      setError("Your cart is empty. Add products before checkout.");
      return;
    }

    if (!selectedAddressId || !selectedAddress) {
      setError("Please select a delivery address.");
      return;
    }

    if (!paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    setPlacingOrder(true);
    setError("");

    try {
      const response = await checkoutOrder(selectedAddressId, paymentMethod);
      const orderId = getOrderId(response);

      if (orderId != null) {
        navigate(`/orders/${orderId}`, {
          state: { order: response },
          replace: true,
        });
      } else {
        // The order may have been created successfully even if
        // the API returns no order ID in its response.
        navigate("/orders", { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Checkout failed. Please review your cart and try again.");
    } finally {
      setPlacingOrder(false);
    }
  };

  if (loading) {
    return (
      <main className="checkout-page">
        <p>Loading checkout...</p>
      </main>
    );
  }

  return (
    
    <main className="checkout-page">
      <h1>Checkout</h1>

      {error && (
        <p className="checkout-error" role="alert">
          {error}
        </p>
      )}
    {console.log(items)}
      {items.length === 0 ? (
        <section className="checkout-empty">
          <h2>Your cart is empty</h2>
          <p>Add some products before placing an order.</p>
          <Link to="/products" className="checkout-primary-button">
            Browse Products
          </Link>
        </section>
      ) : (
        <form onSubmit={handlePlaceOrder}>
          <div className="checkout-layout">
            <div className="checkout-main">
              <section className="checkout-section">
                <div className="checkout-section-heading">
                  <h2>1. Delivery Address</h2>
                  <Link to="/addresses">Manage Addresses</Link>
                </div>

                {addresses.length === 0 ? (
                  <div className="checkout-empty-address">
                    <p>You have no saved delivery addresses.</p>
                    <Link to="/addresses">
                      Add a delivery address
                    </Link>
                  </div>
                ) : (
                  <div className="checkout-address-list">
                    {addresses.map((address) => {
                      const addressId = getAddressId(address);
                      const value = String(addressId);

                      return (
                        <label
                          className={`checkout-address-card ${
                            selectedAddressId === value
                              ? "checkout-address-selected"
                              : ""
                          }`}
                          key={addressId}
                        >
                          <input
                            type="radio"
                            name="deliveryAddress"
                            value={value}
                            checked={selectedAddressId === value}
                            onChange={() => setSelectedAddressId(value)}
                          />

                          <div>
                            <strong>{address.fullName}</strong>
                            {address.isDefault && (
                              <span className="checkout-default-label">
                                Default
                              </span>
                            )}

                            <p>{address.phoneNumber}</p>
                            <p>{address.addressLine1}</p>

                            {address.addressLine2 && (
                              <p>{address.addressLine2}</p>
                            )}

                            <p>
                              {address.city}, {address.state} -{" "}
                              {address.postalCode}
                            </p>
                            <p>{address.country}</p>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                )}
              </section>

              <section className="checkout-section">
                <h2>2. Order Items</h2>

                <div className="checkout-items">
                    
                  {items.map((item, index) => {
                    Console.log(item);
                    const product = getProduct(item);
                    const quantity = getQuantity(item);
                    const price = getPrice(item);
                    const itemId = item.cartItemId ?? item.id ?? product.id ?? index;

                    return (
                      <article className="checkout-item" key={itemId}>
                        <div>
                          <h3>{product.name ?? "Product"}</h3>
                          <p>Quantity: {quantity}</p>
                          <p>Unit price: ₹{price.toFixed(2)}</p>
                        </div>
                        <strong> ₹{(price * quantity).toFixed(2)} </strong>
                      </article>
                    );
                  })}
                </div>

                <Link to="/cart">Edit cart</Link>
              </section>

              <section className="checkout-section">
                <h2>3. Payment Method</h2>

                <label className="checkout-payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="CashOnDelivery"
                    checked={paymentMethod === "CashOnDelivery"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />
                  Cash on Delivery
                </label>

                <label className="checkout-payment-option">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="Online"
                    checked={paymentMethod === "Online"}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value)
                    }
                  />
                  Online Payment
                </label>

                <p className="checkout-note">
                  These values are examples. Match the payment method
                  values to the enum or validation rules in your API.
                  Selecting online payment here does not process a payment.
                </p>
              </section>
            </div>

            <aside className="checkout-summary">
              <h2>Order Summary</h2>

              <div className="checkout-summary-row">
                <span>Items</span>
                <span>
                  {items.reduce(
                    (sum, item) => sum + getQuantity(item),
                    0
                  )}
                </span>
              </div>

              <div className="checkout-summary-row">
                <span>Estimated subtotal</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>

              <p className="checkout-note">
                Final price, shipping, taxes, discounts, and stock
                availability must be confirmed by the server.
              </p>

              <button
                type="submit"
                className="checkout-primary-button"
                disabled={
                  placingOrder ||
                  items.length === 0 ||
                  addresses.length === 0
                }
              >
                {placingOrder ? "Placing Order..." : "Place Order"}
              </button>
            </aside>
          </div>
        </form>
      )}
    </main>
  );
}

export default Checkout;
