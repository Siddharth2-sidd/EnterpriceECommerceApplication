import { Navigate } from "react-router-dom";
// function getUserRole(user) {
//   const rawRoles = user?.roles ?? user?.role;

//   const roles = Array.isArray(rawRoles)
//     ? rawRoles
//     : rawRoles
//       ? [rawRoles]
//       : [];

//   return roles
//     .map((role) => {
//       if (typeof role === "string") return role;
//       return role?.name ?? role?.roleName ?? "";
//     })
//     .map((role) => role);
// }
export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (role !== "Admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}