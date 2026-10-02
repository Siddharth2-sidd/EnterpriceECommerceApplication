import { useEffect, useState } from "react";
import ProductCard from "../../components/product/ProductCard";
import { getProducts } from "../../api/productApi";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProducts({
        PageNumber: pageNumber,
        PageSize: pageSize,
        SortBy: "Name",
        Descending: false,
      });

      console.log("Product response:", response);

      const items = response.items || response.data || response.products || response;
      setProducts(Array.isArray(items) ? items : []);

      if (response.totalPages) {
        setTotalPages(response.totalPages);
      } else if (response.totalCount) {
        setTotalPages(Math.ceil(response.totalCount / pageSize));
      } else {
        setTotalPages(1);
      }

    } catch (error) {
      console.error("Product API error:", error);
      setError(error.response?.data?.message ||"Failed to load products.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, [pageNumber]);

  if (loading) {
    return (
      <div className="page-container">
        <h1>Products</h1>
        <p>Loading products...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="product-list-header">
        <h1>Products</h1>
      </div>

      {error && (
        <div className="error-message"> {error} </div>
      )}

      {!error && products.length === 0 && (
        <div className="empty-message"> No products found.</div>
      )}

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} product={product}/>
        ))}
      </div>

      {products.length > 0 && (
        <div className="pagination">
          <button disabled={pageNumber <= 1}  onClick={() => setPageNumber((previous) => previous - 1)}> Previous </button>
          <span> Page {pageNumber} of {totalPages} </span>
          <button disabled={ pageNumber >= totalPages} onClick={() => setPageNumber((previous) => previous + 1 )}>
            Next
          </button>
        </div>
      )}

    </div>
  );
};

export default ProductList;