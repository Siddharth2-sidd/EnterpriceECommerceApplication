import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import ProtectedRoute from "../routes/ProtectedRoute";

const Home = () => {
  return (
    <div>
      <h1>Enterprise ECommerce</h1>
      <p>Home Page</p>
    </div>
  );
};

const Dashboard = () => {
  return (
    <div>
      <h1>Dashboard</h1>
      <p>This page requires authentication.</p>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}/>
      </Route>

    </Routes>
  );
}

export default AppRoutes;