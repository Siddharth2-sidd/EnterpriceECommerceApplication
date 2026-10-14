import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {getOrderById,cancelOrder,} from "../../api/orderApi";

function unwrapOrder(response) {
  return response?.data?.order ??
    response?.order ??
    response?.data ??
    response;
}

function getOrderId(order) {
  return order?.orderId ?? order?.id;
}

function getOrderItems(order) {
  const candidates = [
    order?.orderItems,
    order?.items,
    order?.orderDetails,
    order?.data?.items,
  ];

  return candidates.find(Array.isArray) ?? [];
}

function getProduct(item) {
  return item.product ?? item;
}

function getItemQuantity(item) {
  return Number(item.quantity ?? item.productQuantity ?? 1);
}

function getItemPrice(item) {
  const product = getProduct(item);

  return Number(
    item.unitPrice ??
    item.price ??
    product.unitPrice ??
    product.price ??
    0
  );
}

function getOrderTotal(order) {
  return Number(
    order?.totalAmount ??
    order?.grandTotal ??
    order?.total ??
    order?.orderTotal ??
    0
  );
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleString("en-IN");
}

function formatMoney(value) {
  return `₹${Number(value).toFixed(2)}`;
}

function normalizeStatus(value) {
  return String(value ?? "").replace(/[\s_-]/g, "").toLowerCase();
}

function canRequestCancellation(status) {
  const normalized = normalizeStatus(status);

  return ![
    "cancelled",
    "canceled",
    "delivered",
    "completed",
    "refunded",
  ].includes(normalized);
}

function OrderDetails() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadOrder = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getOrderById(orderId);
      const result = unwrapOrder(response);

      if (!result || getOrderId(result) == null) {
        setOrder(null);
        setError("The order response was not in the expected format.");
      } else {
        setOrder(result);
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Unable to load order details.");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  const handleCancelOrder = async (event) => {
    event.preventDefault();

    if (!cancelReason.trim()) {
      setError("Please enter a cancellation reason.");
      return;
    }

    if (!window.confirm("Do you want to request cancellation?")) {
      return;
    }

    setCancelling(true);
    setError("");
    setMessage("");

    try {
      await cancelOrder(orderId, cancelReason.trim());

      setMessage("Cancellation request submitted successfully.");
      setCancelReason("");

      await loadOrder();
    } catch (err) {
      setError(err.response?.data?.message ?? "The order could not be cancelled.");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <main className="orders-page">
        Loading order details...
      </main>
    );
  }

  if (!order) {
    return (
      <main className="orders-page">
        <h1>Order Details</h1>
        {error && <p className="orders-error" role="alert">{error}</p>}
        <button type="button" onClick={loadOrder}>
          Try Again
        </button>
        <p><Link to="/orders">Back to My Orders</Link></p>
      </main>
    );
  }

  const status = order.orderStatus ?? order.status ?? "Unknown";
  const items = getOrderItems(order);

  const address = order.address ?? order.shippingAddress ?? order.deliveryAddress;

  return (
    <main className="orders-page">
      <p><Link to="/orders">← Back to My Orders</Link></p>

      <header className="order-details-header">
        <div>
          <h1>Order Details</h1>
          <p>
            Order #{order.orderNumber ?? getOrderId(order)}
          </p>
          <p className="order-muted">
            Placed: {formatDate(
              order.orderDate ?? order.createdOn ?? order.createdAt
            )}
          </p>
        </div>

        <span className="order-status">{status}</span>
      </header>

      {error && <p className="orders-error" role="alert">{error}</p>}
      {message && <p className="orders-message" role="status">{message}</p>}

      <section className="order-details-section">
        <h2>Items Ordered</h2>

        {items.length === 0 ? (
          <p>No items were found in the order response.</p>
        ) : (
          <div className="order-details-items">
            {items.map((item, index) => {
              const product = getProduct(item);
              const quantity = getItemQuantity(item);
              const price = getItemPrice(item);
              const key = item.orderItemId ?? item.id ?? index;

              return (
                <article className="order-detail-item" key={key}>
                  <div>
                    <h3>{product.name ?? item.productName ?? "Product"}</h3>
                    <p>Quantity: {quantity}</p>
                    <p>Unit price: {formatMoney(price)}</p>
                  </div>

                  <strong>
                    {formatMoney(
                      item.lineTotal ?? item.totalPrice ?? price * quantity
                    )}
                  </strong>
                </article>
              );
            })}
          </div>
        )}

        <div className="order-total-row">
          <span>Order Total</span>
          <strong>{formatMoney(getOrderTotal(order))}</strong>
        </div>
      </section>

      <section className="order-details-section">
        <h2>Delivery Address</h2>
        {console.log(address)}
        
{address ? (
  <div>
    {(() => {
      const parts = (typeof address === "string" ? address : address.shippingAddress ?? address.address ?? "").split(",").map((part) => part.trim());
      const [fullName, phoneNumber, ...addressParts] = parts;
      const country = addressParts.pop();
      const postalCode = addressParts.pop();
      const state = addressParts.pop();
      const city = addressParts.pop();

      return (
        <>
          <strong>{fullName}</strong>
          <p>{phoneNumber}</p>
          <p>{addressParts.join(", ")}</p>
          <p>{[city, state, postalCode].filter(Boolean).join(", ")} </p>
          <p>{country}</p>
        </>
      );
    })()}
  </div>
  ) : (
      <p>No delivery address available.</p>
      )}
      </section>

      <section className="order-details-section">
        <h2>Payment & Status</h2>
        <p>
          Payment status: {order.paymentStatus ?? "—"}
        </p>
        <p>
          Payment method: {order.paymentMethod ?? "—"}
        </p>
      </section>

      {canRequestCancellation(status) && (
        <section className="order-details-section">
          <h2>Cancel Order</h2>
          <p>
            Cancellation is subject to your store's order policy.
          </p>

          <form onSubmit={handleCancelOrder}>
            <label className="cancel-reason-label">
              Reason for cancellation
              <textarea
                rows={3}
                value={cancelReason}
                onChange={(event) => setCancelReason(event.target.value)}
                maxLength={500}
                placeholder="Please tell us why you want to cancel."
                required
              />
            </label>

            <button type="submit" className="orders-danger-button" disabled={cancelling}>
              {cancelling ? "Submitting..." : "Request Cancellation"}
            </button>
          </form>
        </section>
      )}

      <button type="button" className="orders-secondary-button" onClick={() => navigate("/orders")}>
        Back to My Orders
      </button>
    </main>
  );
}

export default OrderDetails;
