
import { useEffect, useState } from "react";
import BrandCard from "../../components/product/BrandCard";
import { getBrands } from "../../api/brandApi";

const PAGE_SIZE = 12;
const MAX_PAGES = 500;

const getResponseItems = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.brands)) return response.brands;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.brands)) return response.data.brands;
  if (Array.isArray(response?.data)) return response.data;

  return [];
};

const BrandList = () => {
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadAllBrands = async () => {
      try {
        setLoading(true);
        setError("");
        setBrands([]);

        const allBrands = [];
        const seenIds = new Set();

        for (
          let currentPage = 1;
          currentPage <= MAX_PAGES;
          currentPage++
        ) {
          const response = await getBrands({
            Search: appliedSearch.trim(),
            PageNumber: currentPage,
            PageSize: PAGE_SIZE,
            SortBy: "Name",
            Descending: false,
          });

          console.log(`Brands page ${currentPage}:`, response);

          const items = getResponseItems(response);

          // Stop when the API returns no more brands.
          if (items.length === 0) {
            break;
          }

          let addedCount = 0;

          for (const brand of items) {
            const brandId = brand.id ?? brand.brandId;

            if (brandId == null) {
              allBrands.push(brand);
              addedCount++;
            } else if (!seenIds.has(String(brandId))) {
              seenIds.add(String(brandId));
              allBrands.push(brand);
              addedCount++;
            }
          }

          // Prevent an infinite loop if the API repeats a page.
          if (addedCount === 0) {
            console.warn(
              "Stopped loading because the API returned duplicate brands."
            );
            break;
          }

          // Stop after the last partial page.
          if (items.length < PAGE_SIZE) {
            break;
          }
        }

        if (!cancelled) {
          allBrands.sort((a, b) =>
            String(a.name ?? "").localeCompare(
              String(b.name ?? "")
            )
          );

          setBrands(allBrands);
        }
      } catch (err) {
        console.error("Brand API error:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message || "Failed to load brands."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAllBrands();

    return () => {
      cancelled = true;
    };
  }, [appliedSearch]);

  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedSearch(search.trim());
  };

  const handleClearSearch = () => {
    setSearch("");
    setAppliedSearch("");
  };

  return (
    <div className="page-container">
      <div className="brand-header">
        <h1>Brands</h1>

        <form className="brand-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search brands..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">Search</button>

          <button type="button" onClick={handleClearSearch}>
            Clear
          </button>
        </form>
      </div>

      {loading && <p>Loading all brands...</p>}

      {error && (
        <div className="error-message">{error}</div>
      )}

      {!loading && !error && brands.length === 0 && (
        <div className="empty-message">
          No brands found.
        </div>
      )}

      {!loading && !error && brands.length > 0 && (
        <>
          <div className="brand-results-header">
            <h2>All Brands</h2>
            <span>Total brands: {brands.length}</span>
          </div>

          <div className="brand-grid">
            {brands.map((brand, index) => (
              <BrandCard
                key={brand.id ?? brand.brandId ?? index}
                brand={brand}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default BrandList;
