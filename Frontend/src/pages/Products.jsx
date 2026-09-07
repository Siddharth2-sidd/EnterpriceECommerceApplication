import { useEffect, useState } from "react";
import { getProducts } from "../services/productService";
import {Link} from "react-router-dom";

function Products() {
    const API_URL = import.meta.env.VITE_API_URL;
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [sort, setSort] = useState("");
    

    useEffect(() => {
        loadProducts();
    }, []);

    const filteredProducts =  products.filter((product) => {
        const matchesSearch =    product.name.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =  category === "" ||  product.categoryName === category;

        return ( matchesSearch && matchesCategory);
    });    

    const categories = [...new Set(products.map(product => product.categoryName))];

    const sortedProducts = [...filteredProducts].sort((a,b) => {
        if(sort == "priceLow")
            return a.price - b.price;
        if(sort == "priceHigh")
            return b.price - a.price; 
        if(sort == "name")
            return a.name.localeCompare(b.name);
        return 0;
    });

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
            <div className="product-filters">
                <input type="text" placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} />            
                <select value={category} onChange={(e) => setCategory(e.target.value) }>
                    <option value=""> All Categories </option>
                    {categories.map((categoryName) => (<option key={categoryName} value={categoryName}> {categoryName} </option>))}
                </select>
                <select value={sort}  onChange={(e) => setSort(e.target.value)}>
                    <option value=""> Sort By </option>
                    <option value="priceLow"> Price: Low to High </option>
                    <option value="priceHigh">  Price: High to Low </option>
                    <option value="name"> Name: A-Z </option>
                </select>
            </div>
         <h1>Products</h1>
        {sortedProducts.length === 0 ?(
            <p>No products found.</p>
        ):(            
            <div className="product-grid">
                {sortedProducts.map((product) => (
                    <div className="product-card" key={product.id}>
                        {console.log(product.images?.[0]?.imageUrl)}
                        <img src={`${API_URL}/product/images/${product.images?.[0]?.imageUrl}`} alt={product.name}  className="product-image"/>
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