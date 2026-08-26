import {BrowserRouter, Routes, Route} from "react-router-dom";


import Home from "../pages/Home.jsx";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Products from "../pages/Products";
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import CheckOut from "../pages/CheckOut.jsx";
import MyOrder from "../pages/MyOrder";
import OrderDetail from "../pages/OrderDetail";

function AppRoutes(){
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/products" element={<Products/>}/>
            <Route path="/product/:id" element={<ProductDetails/>}/>
            <Route path="/cart" element={<Cart/>}/>
            <Route path="/checkout" element={<CheckOut/>}/>
            <Route path="/orders" element={<MyOrder/>}/>
            <Route path="/orders/:id" element={<OrderDetail/>}/>
        </Routes>
    </BrowserRouter>
}

export default AppRoutes;