import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Forgetpassword from "../pages/auth/ForgetPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import ProtectedRoute from "../routes/ProtectedRoute";
import {useAuth} from "../context/AuthContext";

const Home = () => {
  return (
    <div>
      <h1>Enterprise ECommerce</h1>
      <p>Home Page</p>
    </div>
  );
};

const Dashboard = () => {
  const {user, logout} = useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      {user && <p>Welcome {user.firstName}</p>}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forget-password" element={<Forgetpassword/>} />
      <Route path="/reset-password" element={<ResetPassword/>}/>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />}/>
      </Route>

    </Routes>
  );
}

export default AppRoutes;