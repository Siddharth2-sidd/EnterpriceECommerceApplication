import {BrowserRouter, Routes, Route} from "react-router-dom";
import ProtectedRoute from "../routes/ProtectedRoute.jsx";


import Home from "../pages/Home.jsx";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import CheckOut from "../pages/CheckOut.jsx";
import MyOrder from "../pages/MyOrder";
import OrderDetail from "../pages/OrderDetail";
import MainLayout from "../layouts/MainLayout.jsx";

function AppRoutes(){
    return(
    <BrowserRouter>
        <Routes>
            
            <Route element={<MainLayout/>}>
            <Route path="/" element={<Home/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/products" element={<Products/>}/>
            <Route path="/products/:id" element={<ProductDetails/>}/>
            <Route element={<ProtectedRoute/>}>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/checkout" element={<CheckOut/>}/>
            <Route path="/orders" element={<MyOrder/>}/>
            <Route path="/orders/:id" element={<OrderDetail/>}/>
            </Route>
            </Route>
        </Routes>
    </BrowserRouter>
    )
}

export default AppRoutes;