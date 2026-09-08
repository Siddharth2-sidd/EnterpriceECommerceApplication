import { createContext, useContext, useEffect, useState} from "react";

const CartContext = createContext();

export const CartProvider = ({ children })=>{
    const [cartItems, setCartItems] = useState(()=>{
        const savedCart = localStorage.getItem("cart");

        if(!savedCart){
            return [];
        }
       try {
            const parsedCart = JSON.parse(savedCart);

            return Array.isArray(parsedCart) ? parsedCart : [];
        } catch (error) {
            console.error("Invalid cart data:", error);
            return [];
        }

        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(()=>{
        localStorage.setItem("cart", JSON.stringify(cartItems));
    },[cartItems]);

    const addToCart = (product) => {
        setCartItems((currentItems) =>{
            const existingItem = currentItems.find(item => item.id === product.id);
            if (existingItem){
                return currentItems.map(item => item.id === product.id ? {...item, quantity: item.quantity+1} : item);
            }

            return [...currentItems, {...product, quantity:1}];
        });
    };

    const increaseQuantity = (id) =>{
        setCartItems((currentItems) =>{
            return currentItems.map(item => item.id === id ? {...item, quantity: item.quantity+1} : item);
        });
    };

    const decreaseQuantity = (id) =>{
        setCartItems((currentItems) => {
            return currentItems.map(item => item.id == id ? {...item, quantity: item.quantity - 1}: item).filter(item => item.quantity > 0);
        });
    };

    const removeFromCart = (id) =>{
        setCartItems((currentItems) => currentItems.filter(item => item.id !== id));
    };

    const clearCart = () =>{
        setCartItems([]);
    };

    const getCartTotal = () =>{
        return cartItems.reduce((total, item)=> total + item.price * item.quantity, 0); 
    };

    const getCartItemCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    return(
        <CartContext.Provider
            value={{cartItems, addToCart, increaseQuantity, decreaseQuantity, removeFromCart, clearCart, getCartTotal, getCartItemCount}}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = ()=>{
    return useContext(CartContext);
}