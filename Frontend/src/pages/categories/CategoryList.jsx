import { useEffect, useState } from "react";
import CategoryCard from "../../components/product/CategoryCard";
import { getCategories } from "../../api/categoryApi";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getCategories({ Search: search,PageNumber: pageNumber,PageSize: pageSize,SortBy: "Name",Descending: false,});
      console.log("Category response:", response);
      const items = response.items || response.data || response.categories || response;
      setCategories(Array.isArray(items) ? items : []);

      const total = response.totalPages || response.totalCount || 0;

      if (response.totalPages) {
        setTotalPages(response.totalPages);
      } else if (total > 0) {
        setTotalPages(Math.ceil(total / pageSize));
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Category API error:", error);
      setError(error.response?.data?.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, [pageNumber]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNumber(1);
    loadCategories();
  };

  if (loading) {
    return (
      <div className="page-container">
        <h2>Categories</h2>
        <p>Loading categories...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="category-header">
        <h1>Categories</h1>

        <form onSubmit={handleSearch} className="category-search">
          <input type="text" placeholder="Search categories..." value={search} onChange={(e) => setSearch(e.target.value)}/>
          <button type="submit"> Search </button>
        </form>
      </div>

      {error && ( <div className="error-message"> {error} </div>)}
      {!error && categories.length === 0 && ( <div className="empty-message"> No categories found. </div>)}

      <div className="category-grid">
        {categories.map((category) => (<CategoryCard key={category.id} category={category} /> ))}
      </div>

      {categories.length > 0 && (
        <div className="pagination">
          <button disabled={pageNumber <= 1} onClick={() => setPageNumber((previous) => previous - 1)}> Previous </button>
          <span> Page {pageNumber} of {totalPages} </span>
          <button  disabled={pageNumber >= totalPages} onClick={() =>setPageNumber((previous) => previous + 1)}> Next </button>
        </div>
      )}
    </div>
  );
};

export default CategoryList;