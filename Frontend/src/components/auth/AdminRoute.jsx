import { Navigate } from "react-router-dom";
function getUserRole(user) {
  const rawRoles = user?.roles ?? user?.role;

  const roles = Array.isArray(rawRoles)
    ? rawRoles
    : rawRoles
      ? [rawRoles]
      : [];

  return roles
    .map((role) => {
      if (typeof role === "string") return role;
      return role?.name ?? role?.roleName ?? "";
    })
    .map((role) => role.toLowerCase());
}

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user") ?? "null");
  } catch {
    user = null;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const roles = getUserRole(user);

  if (!roles.includes("admin")) {
    return <Navigate to="/" replace />;
  }

  return children;
}
