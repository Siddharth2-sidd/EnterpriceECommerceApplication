
import { useEffect, useState } from "react";
import { getProductSpecifications } from "../../api/productApi";

const ProductSpecifications = ({ productId }) => {
  const [specifications, setSpecifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    const fetchSpecifications = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await getProductSpecifications(productId);
        // Supports either an array or a common wrapped response.
        const items = Array.isArray(response) ? response : response?.data ?? response?.items ?? [];
        if (!Array.isArray(items)) {
          throw new Error("Unexpected specifications response.");
        }
        if (!cancelled) {
          setSpecifications(items);
        }
      } catch (err) {
        console.error("Error loading specifications:", err);
        if (!cancelled) {
          setError("Unable to load product specifications.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (productId) {
      fetchSpecifications();
    } else {
      setSpecifications([]);
      setLoading(false);
    }
    return () => {
      cancelled = true;
    };
  }, [productId]);


  if (loading) {
    return (
      <section className="specifications-section">
        <h2>Product Specifications</h2>
        <p>Loading specifications...</p>
      </section>
    );
  }
  if (error) {
    return (
      <section className="specifications-section">
        <h2>Product Specifications</h2>
        <p className="specifications-error">{error}</p>
      </section>
    );
  }

  return (
    <section className="specifications-section">
      <h2>Product Specifications</h2>
      {specifications.length === 0 ? (
        <p className="no-specifications"> No specifications available for this product. </p>
      ) : (
        <div className="specifications-table-wrapper">
          <table className="specifications-table">
            <thead>
              <tr>
                <th>Specification</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {specifications.map((specification, index) => (
                <tr key={specification.id ?? `${specification.specificationKey}-${index}`}>
                  <td> {specification.specificationKey} </td>
                  <td> {specification.specificationValue} </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default ProductSpecifications;
