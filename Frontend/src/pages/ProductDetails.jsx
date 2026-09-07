import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProductsById } from "../services/productService";

function ProductDetails() {
    const API_URL = import.meta.env.VITE_API_URL;
    const { id } = useParams();
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
                    <button> Add to Cart</button>
                    <br />
                    <Link to="/products"> ← Back to Products </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;