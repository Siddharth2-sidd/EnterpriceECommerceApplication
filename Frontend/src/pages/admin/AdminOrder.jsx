import { useCallback, useEffect, useState } from "react";
import {cancelAdminOrder, getAdminOrders, updateAdminOrderStatus, updateAdminPaymentStatus,} from "../../api/adminOrderApi";

const ORDER_STATUSES = ["Pending", "Confirmed", "Processing", "Shipped","Delivered", "Cancelled",];
const PAYMENT_STATUSES = ["Pending", "Paid", "Failed","Refunded",];

function unwrapList(response) {
  if (Array.isArray(response)) return response;

  const candidates = [response?.items,response?.data, response?.orders,  response?.data?.items, response?.data?.orders,];
  return candidates.find(Array.isArray) ?? [];
}

function readValue(object, keys, fallback = "") {
  for (const key of keys) {
    if (object?.[key] !== undefined && object?.[key] !== null) {
      return object[key];
    }
  }

  return fallback;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime())? "—" : date.toLocaleString();
}

function formatCurrency(value) {
  const amount = Number(value);

  if (!Number.isFinite(amount)) return "—";

  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  });
}

function getOrderId(order) {
  return readValue(order, ["id", "orderId", "Id", "OrderId"]);
}

function getOrderStatus(order) {
  return readValue(order, ["status", "orderStatus", "Status", "OrderStatus"], "Pending");
}

function getPaymentStatus(order) {
  return readValue(order, ["paymentStatus", "PaymentStatus"], "Pending");
}

function getTotal(order) {
  return readValue(order,["totalAmount", "total", "grandTotal", "TotalAmount", "Total"], null);
}

function getCustomer(order) {
  const customer = order?.user ?? order?.customer ?? order?.User;

  return (
    readValue(order, ["customerName", "userName", "CustomerName", "UserName", "email", "Email",]) ||
    readValue(customer, ["fullName", "name", "email", "FullName", "Name", "Email"]) || "Customer");
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [search, setSearch] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    setNotice("");

    try {
      const params = {
        PageNumber: pageNumber,
        PageSize: pageSize,
      };

      if (status) params.Status = status;
      if (paymentStatus) params.PaymentStatus = paymentStatus;
      if (fromDate) params.FromDate = fromDate;
      if (toDate) params.ToDate = toDate;

      const response = await getAdminOrders(params);
      const list = unwrapList(response);

      setOrders(list);

      const count = readValue(response, ["totalCount", "TotalCount", "totalRecords", "TotalRecords"],
        readValue(response?.data, ["totalCount","TotalCount","totalRecords","TotalRecords",], null)
      );

      setTotalCount(count === null ? null : Number(count));
    } catch (err) {
      setError( err.response?.data?.message ||  err.response?.data?.title || "Failed to load orders. Check the API endpoint and your admin access.");
    } finally {
      setLoading(false);
    }
  }, [pageNumber, pageSize, status, paymentStatus, fromDate, toDate]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleFilterSubmit = (event) => {
    event.preventDefault();
    setPageNumber(1);
    // Filter state changes trigger loadOrders automatically.
    // If the page was already 1, the existing filters still trigger it.
  };

  const handleOrderStatusChange = async (order, newStatus) => {
    const orderId = getOrderId(order);
    if (!orderId) {
      setError("Order ID was not found in the API response.");
      return;
    }

    const previousStatus = getOrderStatus(order);
    if (newStatus === previousStatus) return;
    if ( newStatus === "Cancelled" && !window.confirm(`Cancel order ${orderId}?`)) {
      return;
    }

    try {
      if (newStatus === "Cancelled") {
        await cancelAdminOrder(orderId, "Cancelled by admin");
      } else {
        await updateAdminOrderStatus(orderId, newStatus);
      }

      setNotice(`Order ${orderId} updated successfully.`);
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.message || "Could not update order status. Verify the request DTO in Swagger.");
    }
  };

  const handlePaymentStatusChange = async (order, newStatus) => {
    const orderId = getOrderId(order);
    if (!orderId) {
      setError("Order ID was not found in the API response.");
      return;
    }

    if (newStatus === getPaymentStatus(order)) return;

    if (!window.confirm(`Change payment status for order ${orderId} to ${newStatus}?`)) {
      return;
    }

    try {
      await updateAdminPaymentStatus(orderId, newStatus);
      setNotice(`Payment status for order ${orderId} updated.`);
      await loadOrders();
    } catch (err) {
      setError(err.response?.data?.message ||"Could not update payment status. Check the API request schema.");
    }
  };

  const visibleOrders = orders.filter((order) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;

    const orderId = String(getOrderId(order) ?? "").toLowerCase();
    const customer = getCustomer(order).toLowerCase();

    return orderId.includes(query) || customer.includes(query);
  });

  const canGoBack = pageNumber > 1;
  const canGoForward = totalCount !== null ? pageNumber * pageSize < totalCount : orders.length === pageSize;
  return (
    <main className="admin-orders-page">
      <header className="admin-orders-header">
        <div>
          <p className="admin-eyebrow">ADMINISTRATION</p>
          <h1>Order Management</h1>
          <p>Review customer orders and manage their statuses.</p>
        </div>
        <button className="admin-button admin-button-secondary" onClick={loadOrders} disabled={loading} type="button">
          {loading ? "Refreshing..." : "Refresh orders"}
        </button>
      </header>

      {error && (
        <div className="admin-alert admin-alert-error" role="alert">
          {error}
        </div>
      )}

      {notice && (
        <div className="admin-alert admin-alert-success" role="status">
          {notice}
        </div>
      )}

      <form className="admin-order-filters" onSubmit={handleFilterSubmit}>
        <label>
          Order status
          <select value={status} onChange={(event) => {setStatus(event.target.value); setPageNumber(1);}}>
            <option value="">All statuses</option>
            {ORDER_STATUSES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
        <label>
          Payment status
          <select value={paymentStatus} onChange={(event) => {setPaymentStatus(event.target.value); setPageNumber(1);}}>
            <option value="">All payments</option>
            {PAYMENT_STATUSES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>

        <label>
          From date
          <input type="date" value={fromDate} onChange={(event) => {setFromDate(event.target.value); setPageNumber(1);}} />
        </label>

        <label>
          To date
          <input
            type="date"
            value={toDate}
            min={fromDate || undefined}
            onChange={(event) => {
              setToDate(event.target.value);
              setPageNumber(1);
            }}
          />
        </label>

        <button className="admin-button" type="submit">
          Apply filters
        </button>
      </form>

      <div className="admin-order-toolbar">
        <label className="admin-order-search">
          <span>Search this page</span>
          <input
            type="search"
            placeholder="Order ID or customer"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </label>

        <span className="admin-muted">
          {totalCount === null
            ? `${orders.length} orders loaded`
            : `${totalCount} total orders`}
        </span>
      </div>

      <div className="admin-orders-table-wrap">
        <table className="admin-orders-table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Order date</th>
              <th>Total</th>
              <th>Order status</th>
              <th>Payment</th>
              <th>Details</th>
            </tr>
          </thead>

          <tbody>
            {loading && (
              <tr>
                <td colSpan="7" className="admin-table-message">
                  Loading orders...
                </td>
              </tr>
            )}

            {!loading && visibleOrders.length === 0 && (
              <tr>
                <td colSpan="7" className="admin-table-message">
                  No orders found.
                </td>
              </tr>
            )}

            {!loading && visibleOrders.map((order) => {
              const orderId = getOrderId(order);
              const currentStatus = getOrderStatus(order);
              const currentPaymentStatus = getPaymentStatus(order);

              return (
                <tr key={orderId}>
                  <td className="admin-order-id">
                    #{orderId ?? "—"}
                  </td>

                  <td>{getCustomer(order)}</td>

                  <td>
                    {formatDate(readValue(order, ["createdDate","orderDate","createdAt","CreatedOn","OrderDate",]))}S
                  </td>

                  <td>{formatCurrency(getTotal(order))}</td>

                  <td>
                    <select
                      aria-label={`Order status for ${orderId}`}
                      className="admin-status-select"
                      value={currentStatus}
                      onChange={(event) =>
                        handleOrderStatusChange(order, event.target.value)
                      }
                    >
                      {!ORDER_STATUSES.includes(currentStatus) && (
                        <option value={currentStatus}>{currentStatus}</option>
                      )}
                      {ORDER_STATUSES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <select
                      aria-label={`Payment status for ${orderId}`}
                      className="admin-status-select"
                      value={currentPaymentStatus}
                      onChange={(event) =>
                        handlePaymentStatusChange(order, event.target.value)
                      }
                    >
                      {!PAYMENT_STATUSES.includes(currentPaymentStatus) && (
                        <option value={currentPaymentStatus}>
                          {currentPaymentStatus}
                        </option>
                      )}
                      {PAYMENT_STATUSES.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                  </td>

                  <td>
                    <button
                      type="button"
                      className="admin-button admin-button-small admin-button-secondary"
                      onClick={() => setSelectedOrder(order)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <footer className="admin-order-pagination">
        <button
          type="button"
          className="admin-button admin-button-secondary"
          disabled={!canGoBack || loading}
          onClick={() => setPageNumber((page) => page - 1)}
        >
          Previous
        </button>

        <span>Page {pageNumber}</span>

        <button
          type="button"
          className="admin-button admin-button-secondary"
          disabled={!canGoForward || loading}
          onClick={() => setPageNumber((page) => page + 1)}
        >
          Next
        </button>
      </footer>

      {selectedOrder && (
        <div
          className="admin-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedOrder(null);
            }
          }}
        >
          <section
            className="admin-order-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-order-modal-title"
          >
            <div className="admin-modal-header">
              <h2 id="admin-order-modal-title">
                Order #{getOrderId(selectedOrder)}
              </h2>

              <button
                type="button"
                className="admin-modal-close"
                aria-label="Close order details"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>

            <dl className="admin-order-detail-list">
              <dt>Customer</dt>
              <dd>{getCustomer(selectedOrder)}</dd>

              <dt>Order date</dt>
              <dd>
                {formatDate(
                  readValue(selectedOrder, ["createdDate","orderDate","createdAt","CreatedOn","OrderDate",]))}
              </dd>

              <dt>Total</dt>
              <dd>{formatCurrency(getTotal(selectedOrder))}</dd>

              <dt>Order status</dt>
              <dd>{getOrderStatus(selectedOrder)}</dd>

              <dt>Payment status</dt>
              <dd>{getPaymentStatus(selectedOrder)}</dd>
            </dl>

            <h3>Order items</h3>
            {(() => {
              const items = readValue(
                selectedOrder,
                ["items", "orderItems", "orderDetails", "Items", "OrderItems"],
                []
              );

              if (!Array.isArray(items) || items.length === 0) {
                return (
                  <p className="admin-muted">
                    Item details were not included in the orders response.
                    Use an admin-specific order-details endpoint to load them.
                  </p>
                );
              }

              return (
                <ul className="admin-order-items">
                  {items.map((item, index) => (
                    <li key={item.id ?? item.productId ?? index}>
                      <span>
                        {readValue(item, [
                          "productName",
                          "name",
                          "ProductName",
                          "Name",
                        ], "Product")}
                        {" × "}
                        {readValue(item, [
                          "quantity",
                          "Quantity",
                        ], 1)}
                      </span>

                      <strong>
                        {formatCurrency(
                          readValue(item, [
                            "subTotal",
                            "subtotal",
                            "totalPrice",
                            "SubTotal",
                            "TotalPrice",
                          ], null)
                        )}
                      </strong>
                    </li>
                  ))}
                </ul>
              );
            })()}

            <button
              type="button"
              className="admin-button"
              onClick={() => setSelectedOrder(null)}
            >
              Close details
            </button>
          </section>
        </div>
      )}
    </main>
  );
}
