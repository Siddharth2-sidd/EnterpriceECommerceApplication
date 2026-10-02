import { Routes, Route } from "react-router-dom";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Forgotpassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";
import Home from "../pages/Home"
import Navbar from "../components/common/Navbar"
import ProtectedRoute from "../routes/ProtectedRoute";
import {useAuth} from "../context/AuthContext";
import CategoryList from "../pages/categories/CategoryList";
import BrandList from "../pages/brands/BrandList";
import Footer from "../components/common/Footer";
import ProductList from "../pages/products/ProductList";

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
    <>
    <Navbar/>
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />      
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<Forgotpassword/>} />
      <Route path="/reset-password" element={<ResetPassword/>}/>
      <Route path="/categories" element={<CategoryList/>} />
      <Route path="/brands" element={<BrandList/>}/>
      <Route path="/products" element={<ProductList/>}/>
      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}/>
      </Route>
    </Routes>
    <Footer />
    </>
  );
}

export default AppRoutes;