import { useEffect, useMemo, useState } from "react";

import {
  productService,
} from "../../services/operationsService";

function Products() {
  const [products, setProducts] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("ALL");

  const [location, setLocation] =
    useState("ALL");

  useEffect(() => {
    loadProducts();
  }, []);

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const response =
        await productService.getAll();

      /*
       * Supports either:
       * response.data
       * or directly returned arrays
       */
      const data =
        response?.data ?? response;

      setProducts(
        Array.isArray(data)
          ? data
          : data?.content ?? []
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load products."
      );
    } finally {
      setLoading(false);
    }
  }

  const categories = useMemo(() => {
    const values = products
      .map((product) => product.category)
      .filter(Boolean);

    return [
      "ALL",
      ...new Set(values),
    ];
  }, [products]);

  const locations = useMemo(() => {
    const values = products
      .map((product) =>
        product.location ||
        product.locationName
      )
      .filter(Boolean);

    return [
      "ALL",
      ...new Set(values),
    ];
  }, [products]);

  const filteredProducts =
    products.filter((product) => {

      const name =
        product.name ?? "";

      const sku =
        product.sku ??
        product.code ??
        "";

      const productCategory =
        product.category ?? "";

      const productLocation =
        product.location ||
        product.locationName ||
        "";

      const text =
        search.toLowerCase();

      const matchesSearch =
        name
          .toLowerCase()
          .includes(text) ||
        sku
          .toLowerCase()
          .includes(text);

      const matchesCategory =
        category === "ALL" ||
        productCategory === category;

      const matchesLocation =
        location === "ALL" ||
        productLocation === location;

      return (
        matchesSearch &&
        matchesCategory &&
        matchesLocation
      );
    });

  if (loading) {
    return (
      <section className="page">
        <h1>Products</h1>
        <p>Loading products...</p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="page">
        <h1>Products</h1>

        <div className="error-state">
          {error}

          <button
            onClick={loadProducts}
          >
            Retry
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="page">

      <div className="page-header">

        <div>
          <h1>Products</h1>

          <p>
            Manage products, stock and
            reorder information.
          </p>
        </div>

        <button
          className="primary-btn"
        >
          + Create Product
        </button>

      </div>

      <div className="filters">

        <input
          type="text"
          placeholder="Search product or SKU..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
        >
          {categories.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item === "ALL"
                ? "All Categories"
                : item}
            </option>
          ))}
        </select>

        <select
          value={location}
          onChange={(event) =>
            setLocation(event.target.value)
          }
        >
          {locations.map((item) => (
            <option
              key={item}
              value={item}
            >
              {item === "ALL"
                ? "All Locations"
                : item}
            </option>
          ))}
        </select>

      </div>

      {filteredProducts.length === 0 ? (
        <div className="empty-state">
          No products found.
        </div>
      ) : (
        <div className="table-container">

          <table>

            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Stock</th>
                <th>Location</th>
                <th>Reorder Level</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.map(
                (product) => (

                  <tr
                    key={product.id}
                  >
                    <td>
                      {product.name}
                    </td>

                    <td>
                      {product.sku ??
                        product.code}
                    </td>

                    <td>
                      {product.category}
                    </td>

                    <td>
                      {product.unitOfMeasure ??
                        product.unit ??
                        "-"}
                    </td>

                    <td>
                      {product.stock ?? 0}
                    </td>

                    <td>
                      {product.location ||
                        product.locationName ||
                        "-"}
                    </td>

                    <td>
                      {product.reorderLevel ??
                        "-"}
                    </td>
                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>
      )}

    </section>
  );
}

export default Products;