import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../../components/product/ProductCard";
import { getProducts } from "../../api/productApi";
import { getCategories } from "../../api/categoryApi";
import { getBrands } from "../../api/brandApi";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // URL filters
  const search = searchParams.get("search") || "";
  const categoryId = searchParams.get("categoryId") || "";
  const brandId = searchParams.get("brandId") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const isFeatured = searchParams.get("isFeatured") === "true";
  const pageNumber = Math.max(1, Number(searchParams.get("pageNumber")) || 1);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  // Form state
  const [searchInput, setSearchInput] = useState(search);
  const [categoryInput, setCategoryInput] = useState(categoryId);
  const [brandInput, setBrandInput] = useState(brandId);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const [featuredInput, setFeaturedInput] = useState(isFeatured);
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "Name");
  const [descending, setDescending] = useState(searchParams.get("descending") === "true");

  // Load categories and brands
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [categoryResponse, brandResponse] = await Promise.all([getCategories({PageNumber: 1, PageSize: 100,}),
            getBrands({PageNumber: 1, PageSize: 100,}),]);
        const categoryItems = categoryResponse.items || categoryResponse.data || categoryResponse.categories || categoryResponse;
        const brandItems = brandResponse.items || brandResponse.data || brandResponse.brands || brandResponse;
        setCategories(Array.isArray(categoryItems) ? categoryItems : []);
        setBrands(Array.isArray(brandItems) ? brandItems : []);
      } catch (error) {
        console.error("Filter options error:", error);
      }
    };
    loadFilterOptions();
  }, []);

  // Load products whenever URL filters change
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        setError("");

        const params = {
          PageNumber: pageNumber,
          PageSize: 12,
          SortBy: sortBy,
          Descending: descending,
        };

        if (search) params.Search = search;
        if (categoryId) params.CategoryId = Number(categoryId);
        if (brandId) params.BrandId = Number(brandId);
        if (minPrice !== "") params.MinPrice = Number(minPrice);
        if (maxPrice !== "") params.MaxPrice = Number(maxPrice);
        if (isFeatured) params.IsFeatured = true;

        const response = await getProducts(params);
        console.log("Filtered product response:", response);
        const items = response.items || response.data || response.products || response;
        setProducts(Array.isArray(items) ? items : []);

        if (response.totalPages) {
          setTotalPages(response.totalPages);
        } else if (response.totalCount) {
          setTotalPages(Math.ceil(response.totalCount / 12));
        } else {
          setTotalPages(1);
        }
      } catch (error) {
        console.error("Product loading error:", error);
        setError(error.response?.data?.message || "Failed to load products.");
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [search,categoryId,brandId,minPrice,maxPrice,isFeatured,pageNumber,sortBy,descending,]);

  // Apply filters to URL
  const handleApplyFilters = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    }
    if (categoryInput) {
      params.set("categoryId", categoryInput);
    }
    if (brandInput) {
      params.set("brandId", brandInput);
    }
    if (minPriceInput !== "") {
      params.set("minPrice", minPriceInput);
    }
    if (maxPriceInput !== "") {
      params.set("maxPrice", maxPriceInput);
    }
    if (featuredInput) {
      params.set("isFeatured", "true");
    }
    params.set("pageNumber", "1");
    params.set("sortBy", sortBy);
    params.set("descending", String(descending));

    setSearchParams(params);
  };

  const handleClearFilters = () => {
    setSearchInput("");
    setCategoryInput("");
    setBrandInput("");
    setMinPriceInput("");
    setMaxPriceInput("");
    setFeaturedInput(false);
    setSortBy("Name");
    setDescending(false);

    setSearchParams({});
  };

  const handleSortChange = (value) => {
    const [field, direction] = value.split("-");

    const nextSortBy = field === "price" ? "Price" : "Name";
    const nextDescending = direction === "desc";
    setSortBy(nextSortBy);
    setDescending(nextDescending);

    const params = new URLSearchParams(searchParams);

    params.set("sortBy", nextSortBy);
    params.set("descending", String(nextDescending));
    params.set("pageNumber", "1");

    setSearchParams(params);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams);
    params.set("pageNumber", String(newPage));
    setSearchParams(params);
  };

  return (
    <div className="page-container">
      <h1>Shop Products</h1>

      {/* Search and Filter */}
      <form className="product-filter-panel" onSubmit={handleApplyFilters}>
        <div className="filter-group">
          <label>Search Product</label>
          <input type="text" placeholder="Search products..." value={searchInput} onChange={(e) => setSearchInput(e.target.value)}/>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Category</label>
            <select  value={categoryInput}  onChange={(e) => setCategoryInput(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}> {category.name} </option>
              ))}
            </select>
          </div>

          <div className="filter-group">
            <label>Brand</label>
            <select value={brandInput}  onChange={(e) => setBrandInput(e.target.value)}>
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}> {brand.name} </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-group">
            <label>Minimum Price</label>
            <input  type="number"  min="0" placeholder="₹ Minimum" value={minPriceInput} onChange={(e) => setMinPriceInput(e.target.value)}/>
          </div>

          <div className="filter-group">
            <label>Maximum Price</label>
            <input type="number"  min="0" placeholder="₹ Maximum" value={maxPriceInput} onChange={(e) => setMaxPriceInput(e.target.value)} />
          </div>
        </div>

        <div className="filter-row filter-actions">
          <label className="featured-checkbox">
            <input type="checkbox" checked={featuredInput} onChange={(e) => setFeaturedInput(e.target.checked)}/>
            Featured Products Only
          </label>

          <div className="filter-group sort-group">
            <label>Sort By</label>
            <select value={`${sortBy.toLowerCase()}-${descending ? "desc" : "asc"}`} onChange={(e) => handleSortChange(e.target.value)}>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        <div className="filter-buttons">
          <button type="submit"> Apply Filters </button>
          <button type="button" className="clear-filter-button" onClick={handleClearFilters}> Clear Filters </button>
        </div>

      </form>
      {/* Product Results */}
      {loading && <p>Loading products...</p>}
      {error && (<div className="error-message"> {error} </div>)}
      {!loading && !error && products.length === 0 && (
        <div className="empty-message"> No products found matching your filters. </div>
      )}

      {!loading && products.length > 0 && (
        <>
          <div className="product-results-header">
            <h2>Products</h2>
            <span> Page {pageNumber} of {totalPages} </span>
          </div>

          <div className="product-grid">
            {products.map((product) => (<ProductCard key={product.id} product={product}/>))}
          </div>

          <div className="pagination">
            <button  disabled={pageNumber <= 1} onClick={() => handlePageChange(pageNumber - 1)}> Previous </button>
            <span> Page {pageNumber} of {totalPages} </span>
            <button disabled={pageNumber >= totalPages} onClick={() =>handlePageChange(pageNumber + 1)}> Next </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;