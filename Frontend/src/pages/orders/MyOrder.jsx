import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../../api/orderApi";


function unwrapOrderList(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.orders)) return response.orders;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.orders)) return response.data.orders;
  if (Array.isArray(response?.data)) return response.data;

  return [];
}

function getOrderId(order) {
  return order.orderId ?? order.id;
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatMoney(value) {
  const amount = Number(value);

  return Number.isFinite(amount)
    ? `₹${amount.toFixed(2)}`
    : "—";
}

function getOrderTotal(order) {
  return (
    order.totalAmount ??
    order.grandTotal ??
    order.total ??
    order.orderTotal
  );
}

function getOrderDate(order) {
  return (
    order.orderDate ??
    order.createdDate ??
    order.createdAt
  );
}

function getOrderStatus(order) {
  return order.orderStatus ?? order.status ?? "Unknown";
}

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await getOrders();
      setOrders(unwrapOrderList(response));
    } catch (err) {
      setError(err.response?.data?.message ?? "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  if (loading) {
    return <main className="orders-page">Loading your orders...</main>;
  }

  return (
    <main className="orders-page">
      <header className="orders-page-header">
        <div>
          <h1>My Orders</h1>
          <p>Track your purchases and order status.</p>
        </div>

        <Link to="/products" className="orders-secondary-link">
          Continue Shopping
        </Link>
      </header>

      {error && (
        <div className="orders-error" role="alert">
          <p>{error}</p>
          <button type="button" onClick={loadOrders}>
            Try Again
          </button>
        </div>
      )}

      {!error && orders.length === 0 && (
        <section className="orders-empty">
          <h2>No orders yet</h2>
          <p>Your completed checkouts will appear here.</p>
          <Link to="/products" className="orders-primary-button">
            Explore Products
          </Link>
        </section>
      )}

      {!error && orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order, index) => {
            const orderId = getOrderId(order);

            return (
              <article className="order-card" key={orderId ?? index}>
                <div className="order-card-header">
                  <div>
                    <span className="order-muted">Order number</span>
                    <h2>{order.orderNumber ?? orderId ?? "—"}</h2>
                  </div>

                  <span className="order-status"> {getOrderStatus(order)} </span>
                </div>

                <div className="order-card-details">
                  <div>
                    <span className="order-muted">Order date</span>
                    <strong>{formatDate(getOrderDate(order))}</strong>
                  </div>

                  <div>
                    <span className="order-muted">Total</span>
                    <strong>{formatMoney(getOrderTotal(order))}</strong>
                  </div>

                  <div>
                    <span className="order-muted">Payment</span>
                    <strong> {order.paymentStatus ?? "—"}</strong>
                  </div>
                </div>

                {orderId != null ? (
                  <Link to={`/orders/${orderId}`} className="orders-primary-button"> View Order Details</Link>
                ) : (
                  <p className="orders-error">
                    This order has no identifiable order ID.
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}

export default MyOrders;
