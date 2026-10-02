import { Link, useNavigate } from "react-router-dom";
import {useAuth} from "../../context/AuthContext";


function Navbar() {
    const {user, isAuthenticated, logout} = useAuth();
    const navigate = useNavigate();
    const handleLogout = ()=>{
        logout();
        navigate("/login")
    };

    return(
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo"> EnterpriseECommerce</Link>
                <div className="nav-links">
                    <Link to="/">Home</Link>                    
                    <Link to="/products"> Products </Link>
                    <Link to="/brands"> Brands </Link>
                    {isAuthenticated && (
                    <>
                        <Link to="/categories">Categories</Link>
                        <Link to="/wishlist"> Wishlist </Link>
                        <Link to="/cart"> Cart </Link>
                        <Link to="/orders"> Orders </Link>      
                    </>)}
                </div>
                    {/* User Section */}
                <div className="navbar-user">
                    {isAuthenticated ? (
                    <>
                        <span> Hello, {user} </span>
                        <button onClick={handleLogout}> Logout </button>
                    </> ) : (
                    <>
                        <Link to="/login"> Login </Link>
                        <Link to="/register"> Register </Link>
                    </>
                        )}
        </div>
      </div>
    </nav>
);}

export default Navbar;