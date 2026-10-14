import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {getAdminOrders, getAdminProducts, getAdminUsers,} from "../../api/adminApi";


function unwrapResponse(response) {
  return response?.data ?? response;
}

function getList(response) {
  const data = unwrapResponse(response);

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.orders)) return data.orders;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.users)) return data.users;
  if (Array.isArray(data?.results)) return data.results;

  return [];
}

function getTotal(response, list) {
  const data = unwrapResponse(response);

  const total =
    data?.totalCount ??
    data?.totalItems ??
    data?.totalRecords ??
    data?.pagination?.totalCount;

  return Number.isFinite(Number(total))
    ? Number(total)
    : list.length;
}

function getOrderStatus(order) {
  return String(
    order?.status ??
      order?.orderStatus ??
      "Unknown"
  );
}

function getOrderId(order) {
  return (
    order?.orderId ??
    order?.id ??
    order?.orderNumber ??
    "—"
  );
}

function getOrderDate(order) {
  const value =
    order?.createdOn ??
    order?.orderDate ??
    order?.createdAt;

  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString();
}

function getOrderTotal(order) {
  const value =
    order?.totalAmount ??
    order?.total ??
    order?.grandTotal;

  const amount = Number(value);

  return Number.isFinite(amount)
    ? `₹${amount.toFixed(2)}`
    : "—";
}

function getOrderCustomer(order) {
  return (
    order?.user?.name ??
    order?.customerName ??
    order?.userName ??
    order?.user?.email ??
    "Customer"
  );
}

function isPending(order) {
  const status = getOrderStatus(order).toLowerCase();

  return [
    "pending",
    "placed",
    "processing",
    "confirmed",
  ].includes(status);
}

function StatCard({ title, value, description, icon }) {
  return (
    <article className="admin-stat-card">
      <div className="admin-stat-icon">{icon}</div>
      <p>{title}</p>
      <h2>{value}</h2>
      <span>{description}</span>
    </article>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);

  const [totals, setTotals] = useState({
    orders: 0,
    products: 0,
    users: 0,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      setLoading(true);
      setErrors({});

      const results = await Promise.allSettled([
        getAdminOrders({ PageNumber: 1, PageSize: 10 }),
        getAdminProducts({ PageNumber: 1, PageSize: 10 }),
        getAdminUsers({ PageNumber: 1, PageSize: 10 }),
      ]);

      if (!active) return;

      const [orderResult, productResult, userResult] = results;

      const nextErrors = {};

      let nextOrders = [];
      let nextProducts = [];
      let nextUsers = [];

      let orderTotal = 0;
      let productTotal = 0;
      let userTotal = 0;

      if (orderResult.status === "fulfilled") {
        nextOrders = getList(orderResult.value);
        orderTotal = getTotal(orderResult.value, nextOrders);
      } else {
        nextErrors.orders =
          orderResult.reason?.response?.data?.message ??
          "Could not load orders.";
      }

      if (productResult.status === "fulfilled") {
        nextProducts = getList(productResult.value);
        productTotal = getTotal(
          productResult.value,
          nextProducts
        );
      } else {
        nextErrors.products =
          productResult.reason?.response?.data?.message ??
          "Could not load products.";
      }

      if (userResult.status === "fulfilled") {
        nextUsers = getList(userResult.value);
        userTotal = getTotal(userResult.value, nextUsers);
      } else {
        nextErrors.users =
          userResult.reason?.response?.data?.message ??
          "Could not load users.";
      }

      setOrders(nextOrders);
      setProducts(nextProducts);
      setUsers(nextUsers);

      setTotals({
        orders: orderTotal,
        products: productTotal,
        users: userTotal,
      });

      setErrors(nextErrors);
      setLoading(false);
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const pendingOrders = orders.filter(isPending).length;
  const recentOrders = orders.slice(0, 5);

  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <p className="admin-eyebrow">STORE MANAGEMENT</p>
          <h1>Admin Dashboard</h1>
          <p>Overview of your e-commerce store.</p>
        </div>

        <button
          className="admin-refresh-button"
          onClick={() => window.location.reload()}
        >
          Refresh Dashboard
        </button>
      </header>

      {loading && (
        <p className="admin-info">Loading dashboard data...</p>
      )}

      <section className="admin-stats-grid">
        <StatCard
          title="Total Products"
          value={errors.products ? "—" : totals.products}
          description="Products in the catalog"
          icon="📦"
        />

        <StatCard
          title="Total Orders"
          value={errors.orders ? "—" : totals.orders}
          description="Orders recorded"
          icon="🛒"
        />

        <StatCard
          title="Total Users"
          value={errors.users ? "—" : totals.users}
          description="Registered users"
          icon="👥"
        />

        <StatCard
          title="Pending Orders"
          value={errors.orders ? "—" : pendingOrders}
          description="Pending in the loaded order list"
          icon="⏳"
        />
      </section>

      {Object.entries(errors).map(([section, message]) => (
        <p className="admin-error" key={section}>
          {section}: {message}
        </p>
      ))}

      <section className="admin-quick-links">
        <h2>Quick Actions</h2>

        <div className="admin-action-grid">
          <Link to="/admin/products">Manage Products</Link>
          <Link to="/admin/orders">Manage Orders</Link>
          <Link to="/admin/users">Manage Users</Link>
          <Link to="/admin/inventory">Manage Inventory</Link>
        </div>
      </section>

      <section className="admin-recent-section">
        <div className="admin-section-heading">
          <h2>Recent Orders</h2>
          <Link to="/admin/orders">View all orders</Link>
        </div>

        {errors.orders ? (
          <p className="admin-info">
            Recent orders are unavailable.
          </p>
        ) : recentOrders.length === 0 ? (
          <p className="admin-info">No orders found.</p>
        ) : (
          <div className="admin-table-wrapper">
            <table className="admin-orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.map((order, index) => (
                  <tr key={order.id ?? order.orderId ?? index}>
                    <td>{getOrderId(order)}</td>
                    <td>{getOrderCustomer(order)}</td>
                    <td>{getOrderDate(order)}</td>
                    <td>{getOrderTotal(order)}</td>
                    <td>
                      <span className="admin-order-status">
                        {getOrderStatus(order)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  );
}
