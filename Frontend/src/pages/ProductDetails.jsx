import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductsById } from "../services/productService";
import {useCart} from "../context/CartContext";

function ProductDetails() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
    const {addToCart} = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProduct();
    }, [id]);

    const loadProduct = async () => {
        try {
            setLoading(true);
            setError("");
            const data = await getProductsById(id);
            setProduct(data);

        } catch (error) {
            console.error( "Error loading product:", error);
            setError( "Unable to load product." );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return ( <h2>Loading product...</h2>);
    }

    if (error) {
        return (<h2 className="error">{error}</h2>);
    }

    if (!product) {
        return (<h2>Product not found.</h2>);
    }

    return (
        <div className="product-details">
            <div className="product-details-card">
                <div className="product-details-info">
                    <img src={`${API_URL}/product/images/${product.images?.[0]?.imageUrl}`} alt={product.name}  className="product-image"/>
                    <h1>{product.name}</h1>
                    <p>{product.description}</p>
                    <h2>₹{product.price}</h2>
                    <p>Stock Available:{" "} {product.stockQuantity}</p>
                    <button onClick={() => addToCart(product)}  disabled ={product.stockQuantity <= 0}> {product.stockQuantity > 0 ? "Add to Cart" : "Out of Stock"} </button>
                    <br />
                    <Link to="/products"> ← Back to Products </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;