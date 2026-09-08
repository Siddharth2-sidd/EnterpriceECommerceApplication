import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

function Cart() {

    const { cartItems, increaseQuantity, decreaseQuantity,   removeFromCart, getCartTotal} = useCart();
    const total = getCartTotal();

    if (cartItems.length === 0) {
        return (
            <div className="cart-page">
                <h1>Your Cart</h1>
                <p> Your cart is empty. </p>
                <Link to="/products"> Continue Shopping </Link>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <h1>Shopping Cart</h1>
            <div className="cart-items">
                {cartItems.map(item => (
                    <div className="cart-item"  key={item.id}>
                        <div>
                            <h2> {item.name} </h2>
                            <p>  ₹{item.price}  </p>
                        </div>

                        <div className="quantity-controls">
                            <button  onClick={() => decreaseQuantity(item.id)}> - </button>
                            <span> {item.quantity} </span>
                            <button   onClick={() => increaseQuantity(item.id)}> + </button>
                        </div>

                        <div>
                            <p> ₹{(item.price * item.quantity).toFixed(2)}</p>
                            <button  onClick={() => removeFromCart(item.id)}> Remove </button>
                        </div>

                    </div>

                ))}

            </div>
            <div className="cart-summary">                
                <h2> Total: ₹{total.toFixed(2)}</h2>
                <Link to="/checkout">
                    <button> Proceed to Checkout </button>
                </Link>
            </div>
        </div>
    );
}

export default Cart;