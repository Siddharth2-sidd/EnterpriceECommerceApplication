import { NavLink, Outlet, Link } from "react-router-dom";

const adminLinks = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: "▦",
    end: true,
  },
  {
    label: "Manage Users",
    path: "/admin/users",
    icon: "♙",
  },
  {
    label: "Manage Products",
    path: "/admin/products",
    icon: "□",
  },
  {
    label: "Manage Orders",
    path: "/admin/orders",
    icon: "▤",
  },
  {
    label: "Inventory",
    path: "/admin/inventory",
    icon: "▥",
  },
];

export default function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <Link to="/admin" className="admin-brand">
          <span className="admin-brand-icon">E</span>
          <span>
            <strong>Admin Panel</strong>
            <small>Enterprise E-Commerce</small>
          </span>
        </Link>

        <nav className="admin-navigation" aria-label="Admin navigation">
          <p className="admin-nav-heading">MANAGEMENT</p>

          {adminLinks.map((item) => (
            <NavLink key={item.path} to={item.path} end={item.end} className={({ isActive }) => `admin-nav-link ${isActive ? "active" : ""}`}>
              <span className="admin-nav-icon" aria-hidden="true">
                {item.icon}
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <Link to="/">← Back to Store</Link>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <span>Enterprise E-Commerce</span>
          <Link to="/">View Store ↗</Link>
        </header>

        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
