import { useEffect, useState } from "react";
import BrandCard from "../../components/product/BrandCard";
import { getBrands } from "../../api/brandApi";

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(8);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadBrands = async (searchValue = search) => {
    try {
      setLoading(true);
      setError("");
      const response = await getBrands({
        Search: searchValue,
        PageNumber: pageNumber,
        PageSize: pageSize,
        SortBy: "Name",
        Descending: false,
      });

      console.log("Brand response:", response);

      const items = response.items || response.data || response.brands ||  response;
      setBrands(Array.isArray(items) ? items : []);
      if (response.totalPages) {
        setTotalPages(response.totalPages);
      } else if (response.totalCount) {
        setTotalPages(Math.ceil(response.totalCount / pageSize));
      } else {
        setTotalPages(1);
      }
    } catch (error) {
      console.error("Brand API error:", error);

      setError(error.response?.data?.message || "Failed to load brands.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBrands();
  }, [pageNumber]);

  const handleSearch = async (e) => {
    e.preventDefault();

    setPageNumber(1);

    await loadBrands(search);
  };

  if (loading) {
    return (
      <div className="page-container">
        <h1>Brands</h1>
        <p>Loading brands...</p>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="brand-header">
        <h1>Brands</h1>
        <form className="brand-search" onSubmit={handleSearch}>
          <input  type="text" placeholder="Search brands..."   value={search}  onChange={(e) => setSearch(e.target.value)} />
          <button type="submit"> Search </button>
        </form>

      </div>
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {!error && brands.length === 0 && (
        <div className="empty-message">
          No brands found.
        </div>
      )}

      <div className="brand-grid">
        {brands.map((brand) => (
          <BrandCard
            key={brand.id}
            brand={brand}
          />
        ))}
      </div>

      {brands.length > 0 && (
        <div className="pagination">
          <button disabled={pageNumber <= 1} onClick={() => setPageNumber((previous) => previous - 1)}>
            Previous
          </button>
          <span>
            Page {pageNumber} of {totalPages}
          </span>
          <button disabled={pageNumber >= totalPages} onClick={() => setPageNumber((previous) => previous + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default BrandList;