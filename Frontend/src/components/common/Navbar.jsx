import { Link } from "react-router-dom";
import {useAuth} from "../../context/AuthContext";

function Navbar() {
    const {accessToken, logout} = useAuth();
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="logo"> EnterpriseECommerce</Link>

                <div className="nav-links">

                    <Link to="/">Home</Link>
                    <Link to="/products"> Products </Link>
                    <Link to="/cart"> Cart </Link>
                    {accessToken ? (
                    <>
                    <Link to="/orders"> My Orders </Link>
                    <button onClick={logout}> Logout </button>
                    </>
                    ):(
                    <>
                    <Link to="/login"> Login </Link>
                    <Link to="/register"> Register </Link>
                    </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;