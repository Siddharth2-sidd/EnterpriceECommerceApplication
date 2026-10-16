import { useCallback, useEffect, useMemo, useState } from "react";
import {getAdminProducts,createAdminProduct,updateAdminProduct, deleteAdminProduct,adjustProductStock} from "../../api/adminProductApi";
import { getCategories } from "../../api/categoryApi";
import { getBrands } from "../../api/brandApi";


const EMPTY_FORM = {name: "", description: "", price: "", discountPrice: "", sku: "", categoryId: "", brandId: "", stockQuantity: "", isFeatured: false,};

function unwrapResponse(response) {
  return response?.data ?? response;
}

function getList(response, keys = []) {
  const data = unwrapResponse(response);
  if (Array.isArray(data)) return data;
  for (const key of ["items", "data", "results", ...keys]) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

function getProductId(product) {
  return product?.id ?? product?.productId ?? null;
}

function getProductCategoryId(product) {
  return (product?.categoryId ?? product?.category?.id ?? product?.category?.categoryId ?? "");
}

function getProductBrandId(product) {
  return (product?.brandId ?? product?.brand?.id ?? product?.brand?.brandId ?? "");
}

function getProductStock(product) {
  return (product?.stockQuantity ?? product?.quantityInStock ?? product?.stock ?? 0);
}

function getErrorMessage(error) {
  const data = error?.response?.data;
  if (typeof data === "string") return data;
  if (data?.errors && typeof data.errors === "object") {
    return Object.values(data.errors).flat().join(" ");
  }
  return (data?.message ?? data?.title ?? error?.message ?? "Something went wrong.");
}

function ProductForm({initialProduct, categories, brands, saving, onCancel, onSave,}) {
  const [form, setForm] = useState(() => {
    if (!initialProduct) return { ...EMPTY_FORM };
    return {
      name: initialProduct.name ?? "",
      description: initialProduct.description ?? "",
      price: initialProduct.price ?? "",
      discountPrice: initialProduct.discountPrice ?? "",
      sku: initialProduct.sku ?? "",
      categoryId: getProductCategoryId(initialProduct),
      brandId: getProductBrandId(initialProduct),
      stockQuantity: getProductStock(initialProduct),
      isFeatured: Boolean(initialProduct.isFeatured),
    };
  });

  const [formError, setFormError] = useState("");
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({...current, [name]: type === "checkbox" ? checked : value,}));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.price || !form.categoryId || !form.brandId) {
      setFormError("Name, price, category, and brand are required.");
      return;
    }

    const price = Number(form.price);
    const stockQuantity = Number(form.stockQuantity);

    if (!Number.isFinite(price) || price < 0) {
      setFormError("Enter a valid non-negative price.");
      return;
    }

    if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
      setFormError("Stock quantity must be a non-negative integer.");
      return;
    }

    if (form.discountPrice !== "" && (!Number.isFinite(Number(form.discountPrice)) || Number(form.discountPrice) < 0)) {
      setFormError("Enter a valid discount price.");
      return;
    }

    // EXAMPLE PAYLOAD:
    // Rename fields to match your actual Create/Update DTOs.
    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price,
      discountPrice: form.discountPrice === "" ? null : Number(form.discountPrice),
      sku: form.sku.trim(),
      categoryId: Number(form.categoryId),
      brandId: Number(form.brandId),
      stockQuantity,
      isFeatured: form.isFeatured,
    };

    try {
      await onSave(payload);
    } catch (error) {
      setFormError(getErrorMessage(error));
    }
  };

  return (
    <form className="admin-product-form" onSubmit={handleSubmit}>
      <h2>{initialProduct ? "Edit Product" : "Create Product"}</h2>

      {formError && (<div className="admin-product-alert error"> {formError} </div>)}
      <label> Product Name * <input name="name" value={form.name} onChange={handleChange} maxLength={200} required/></label>
      <label> Description <textarea name="description" value={form.description} onChange={handleChange} rows={4}/></label>
      <div className="admin-product-form-grid">
        <label> Price * <input name="price" type="number" min="0" step="0.01" value={form.price} onChange={handleChange} required/></label>
        <label> Discount Price <input name="discountPrice" type="number" min="0" step="0.01" value={form.discountPrice} onChange={handleChange}/></label>
        <label> SKU <input name="sku" value={form.sku} onChange={handleChange}/></label>
        <label> Stock Quantity *  <input name="stockQuantity" type="number" min="0" step="1" value={form.stockQuantity}  onChange={handleChange} required/></label>
        <label> Category * <select name="categoryId" value={form.categoryId} onChange={handleChange} required>
            <option value="">Select category</option>
            {categories.map((category) => {
              const id = category.id ?? category.categoryId;
              return (
                <option key={id} value={id}> {category.name ?? category.categoryName} </option>
              );
            })}
          </select>
        </label>
        <label> Brand * <select name="brandId" value={form.brandId} onChange={handleChange} required>
            <option value="">Select brand</option>
            {brands.map((brand) => {
              const id = brand.id ?? brand.brandId;
              return (
                <option key={id} value={id}> {brand.name ?? brand.brandName} </option>
              );
            })}
          </select>
        </label>
      </div>

      <label className="admin-product-checkbox">
        <input name="isFeatured" type="checkbox" checked={form.isFeatured} onChange={handleChange}/> Featured product </label>
      <div className="admin-product-form-actions">
        <button type="button" className="secondary" onClick={onCancel}> Cancel </button>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : initialProduct? "Save Changes" : "Create Product"}
        </button>
      </div>
    </form>
  );
}

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const [productResponse, categoryResponse, brandResponse] = await Promise.all([getAdminProducts({ PageNumber: 1, PageSize: 100 }), getCategories({pageNumber:1}), getBrands({pageNumber:1}),]);
      setProducts(getList(productResponse, ["products"]));
      setCategories(getList(categoryResponse, ["categories"]));
      setBrands(getList(brandResponse, ["brands"]));
    } catch (error) {
      setPageError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredProducts = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    if (!searchText) return products;

    return products.filter((product) => {
      const name = String(product.name ?? "").toLowerCase();
      const sku = String(product.sku ?? "").toLowerCase();
      const brand = String(product.brand?.name ?? product.brandName ?? "").toLowerCase();

      return (name.includes(searchText) || sku.includes(searchText) || brand.includes(searchText));
    });
  }, [products, search]);

  const openCreateForm = () => {
    setEditingProduct(null);
    setShowForm(true);
    setMessage("");
  };

  const openEditForm = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    setMessage("");
  };

  const handleSave = async (payload) => {
    try {
      setSaving(true);
      setPageError("");
      setMessage("");

      if (editingProduct) {
        const productId = getProductId(editingProduct);

        if (productId == null) {
          throw new Error("Product ID is missing.");
        }

        await updateAdminProduct(productId, payload);
        setMessage("Product updated successfully.");
      } else {
        await createAdminProduct(payload);
        setMessage("Product created successfully.");
      }

      setShowForm(false);
      setEditingProduct(null);
      await loadData();
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (product) => {
    const productId = getProductId(product);

    if (productId == null) {
      setPageError("Product ID is missing.");
      return;
    }

    const confirmed = window.confirm(`Delete "${product.name}"? This action may affect product visibility and related records.`);
    if (!confirmed) return;

    try {
      setPageError("");
      setMessage("");
      await deleteAdminProduct(productId);
      setMessage("Product deleted successfully.");
      await loadData();
    } catch (error) {
      setPageError(getErrorMessage(error));
    }
  };

  
const handleAdjustStock = async (product) => {
  const productId = getProductId(product);
  const currentStock = getProductStock(product);
  const input = window.prompt(`Enter new stock quantity for ${product.name}:`, String(currentStock));
  if (input === null) return;

  const stockQuantity = Number(input);

  if (!Number.isInteger(stockQuantity) || stockQuantity < 0) {
    setPageError("Stock quantity must be a non-negative integer.");
    return;
  }

  try {
    setPageError("");
    setMessage("");

    await adjustProductStock(productId, { stockQuantity });

    setMessage("Product stock updated successfully.");
    await loadData();
  } catch (error) {
    setPageError(getErrorMessage(error));
  }
};


  return (
    <main className="admin-products-page">
      <header className="admin-products-header">
        <div>
          <p className="admin-products-eyebrow">CATALOG MANAGEMENT</p>
          <h1>Product Management</h1>
          <p>Create, update, and maintain store products.</p>
        </div>

        <button onClick={openCreateForm}>+ Add Product</button>
      </header>

      {pageError && (<div className="admin-product-alert error"> {pageError} </div>)}
      {message && (<div className="admin-product-alert success"> {message}
        </div>
      )}

      {showForm && (
        <ProductForm
          key={editingProduct ? getProductId(editingProduct) : "new"}
          initialProduct={editingProduct}
          categories={categories}
          brands={brands}
          saving={saving}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSave={handleSave}
        />
      )}

      <section className="admin-products-toolbar">
        <input type="search" placeholder="Search product name, SKU, or brand..." value={search} onChange={(event) => setSearch(event.target.value)}
          aria-label="Search products"
        />
        <button className="secondary" onClick={loadData} disabled={loading}> {loading ? "Loading..." : "Refresh"} </button>
      </section>

      {loading ? (<p className="admin-products-empty">Loading products...</p>) : filteredProducts.length === 0 ? (
        <p className="admin-products-empty">No products found.</p>
      ) : (
        <div className="admin-products-table-wrapper">
          <table className="admin-products-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Brand</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product, index) => {
                const productId = getProductId(product);
                const price = Number(product.price);

                return (
                  <tr key={productId ?? index}>
                    <td>
                      <strong>{product.name ?? "Unnamed product"}</strong>
                      {product.isFeatured && (
                        <span className="admin-featured-label">
                          Featured
                        </span>
                      )}
                    </td>
                    <td>{product.sku ?? "—"}</td>
                    <td>{product.category?.name ?? product.categoryName ?? "—"} </td>
                    <td>{product.brand?.name ?? product.brandName ?? "—"} </td>
                    <td> {Number.isFinite(price) ? `₹${price.toFixed(2)}`: "—"} </td>
                    <td>{getProductStock(product)}</td>
                    <td>
                      <div className="admin-product-row-actions">
                        <button className="secondary"  onClick={() => openEditForm(product)}> Edit </button>
                        <button className="danger"  onClick={() => handleDelete(product)}> Delete </button>
                        <button className="secondary" onClick={() => handleAdjustStock(product)}> Adjust Stock</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
