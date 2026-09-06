import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import {Link} from "react-router-dom";

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            setLoading(true);
            const data = await getProducts();
            setProducts(data);
        } catch (error) {
            console.error("Error loading products:", error);
            setError("Unable to load products.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (<h2>Loading products...</h2>);
    }

    if (error) {
        return (<h2 className="error">{error}</h2>);
    }

    return (
        <div className="products-page">
         <h1>Products</h1>
        {products.length === 0 ?(
            <p>No products found.</p>
        ):(        
           
            <div className="product-grid">
                {products.map((product) => (
                    <div className="product-card" key={product.id}>
                        <img src={product.imageUrl} alt={product.name}  className="product-image"/>
                        <h2> {product.name} </h2>
                        <p> {product.description} </p>
                        <h3> ₹{product.price} </h3>
                        <p>  Stock:{" "} {product.stockQuantity} </p>
                        <Link to={`/products/${product.id}`}> View Details </Link>
                    </div>
                ))}
            </div>
        )}        
        </div>
);
}


export default Products;