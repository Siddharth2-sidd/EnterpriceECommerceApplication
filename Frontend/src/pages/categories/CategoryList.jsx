
import { useEffect, useState } from "react";
import CategoryCard from "../../components/product/CategoryCard";
import { getCategories } from "../../api/categoryApi";

const PAGE_SIZE = 8;
const MAX_PAGES = 500;

const getResponseItems = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.items)) return response.items;
  if (Array.isArray(response?.categories)) return response.categories;
  if (Array.isArray(response?.data?.items)) return response.data.items;
  if (Array.isArray(response?.data?.categories)) return response.data.categories;
  if (Array.isArray(response?.data)) return response.data;

  return [];
};

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadAllCategories = async () => {
      try {
        setLoading(true);
        setError("");
        setCategories([]);

        const allCategories = [];
        const seenIds = new Set();

        for (
          let currentPage = 1;
          currentPage <= MAX_PAGES;
          currentPage++
        ) {
          const response = await getCategories({
            Search: appliedSearch.trim(),
            PageNumber: currentPage,
            PageSize: PAGE_SIZE,
            SortBy: "Name",
            Descending: false,
          });

          console.log(`Categories page ${currentPage}:`, response);

          const items = getResponseItems(response);

          // Stop when there are no more categories.
          if (items.length === 0) {
            break;
          }

          let addedCount = 0;

          for (const category of items) {
            const categoryId = category.id ?? category.categoryId;

            if (categoryId == null) {
              allCategories.push(category);
              addedCount++;
            } else if (!seenIds.has(String(categoryId))) {
              seenIds.add(String(categoryId));
              allCategories.push(category);
              addedCount++;
            }
          }

          // Prevent repeatedly fetching the same records.
          if (addedCount === 0) {
            console.warn(
              "Stopped loading because the API returned duplicate categories."
            );
            break;
          }

          // Stop after the last page containing fewer than PAGE_SIZE items.
          if (items.length < PAGE_SIZE) {
            break;
          }
        }

        if (!cancelled) {
          allCategories.sort((a, b) =>
            String(a.name ?? "").localeCompare(String(b.name ?? ""))
          );

          setCategories(allCategories);
        }
      } catch (err) {
        console.error("Category API error:", err);

        if (!cancelled) {
          setError(
            err.response?.data?.message ||
              "Failed to load categories."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadAllCategories();

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
      <div className="category-header">
        <h1>Categories</h1>

        <form
          onSubmit={handleSearch}
          className="category-search"
        >
          <input
            type="text"
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button type="submit">Search</button>

          <button type="button" onClick={handleClearSearch}>
            Clear
          </button>
        </form>
      </div>

      {loading && <p>Loading all categories...</p>}

      {error && (
        <div className="error-message">{error}</div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="empty-message">
          No categories found.
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <>
          <div className="category-results-header">
            <h2>All Categories</h2>
            <span>Total categories: {categories.length}</span>
          </div>

          <div className="category-grid">
            {categories.map((category, index) => (
              <CategoryCard
                key={category.id ?? category.categoryId ?? index}
                category={category}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default CategoryList;
