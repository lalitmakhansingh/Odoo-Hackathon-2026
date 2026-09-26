import { useEffect, useMemo, useState } from "react";

import {
  productService,
  categoryService,
  uomService,
} from "../../services/operationsService";

import "./products.css";

const EMPTY_FORM = {
  name: "",
  sku: "",
  categoryId: "",
  unitOfMeasureId: "",
  description: "",
};

function Products() {
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [uoms, setUoms] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] =
    useState("ALL");

  const [isModalOpen, setIsModalOpen] =
    useState(false);

  const [editingProduct, setEditingProduct] =
    useState(null);

  const [form, setForm] =
    useState(EMPTY_FORM);

  useEffect(() => {
    loadInitialData();
  }, []);

  async function loadInitialData() {
    try {
      setLoading(true);
      setError("");

      const [
        productsResponse,
        categoriesResponse,
        uomResponse,
      ] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
        uomService.getAll(),
      ]);

      setProducts(
        extractList(productsResponse)
      );

      setCategories(
        extractList(categoriesResponse)
      );

      setUoms(
        extractList(uomResponse)
      );
    } catch (err) {
      console.error(err);

      setError(
        "Unable to load product information."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Narender's common response format:
   *
   * {
   *   success: true,
   *   message: "...",
   *   data: ...
   * }
   *
   * This helper handles:
   * response.data
   * response.data.data
   * response.data.content
   */

  function extractList(response) {
    const body = response?.data;

    if (Array.isArray(body)) {
      return body;
    }

    if (Array.isArray(body?.data)) {
      return body.data;
    }

    if (Array.isArray(body?.content)) {
      return body.content;
    }

    return [];
  }

  function extractObject(response) {
    const body = response?.data;

    if (body?.data) {
      return body.data;
    }

    return body;
  }

  const filteredProducts = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return products.filter((product) => {
      const name =
        String(product.name ?? "");

      const sku =
        String(product.sku ?? "");

      const category =
        product.category?.name ?? "";

      const matchesSearch =
        name.toLowerCase().includes(query) ||
        sku.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "ALL" ||
        String(product.category?.id) ===
          String(categoryFilter);

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [
    products,
    search,
    categoryFilter,
  ]);

  function openCreateModal() {
    setEditingProduct(null);
    setForm(EMPTY_FORM);
    setError("");
    setSuccess("");
    setIsModalOpen(true);
  }

  function openEditModal(product) {
    setEditingProduct(product);

    setForm({
      name: product.name ?? "",
      sku: product.sku ?? "",
      categoryId:
        product.category?.id ?? "",
      unitOfMeasureId:
        product.unitOfMeasure?.id ?? "",
      description:
        product.description ?? "",
    });

    setError("");
    setSuccess("");
    setIsModalOpen(true);
  }

  function closeModal() {
    if (saving) return;

    setIsModalOpen(false);
    setEditingProduct(null);
    setForm(EMPTY_FORM);
  }

  function handleChange(event) {
    const { name, value } =
      event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function validateForm() {
    if (!form.name.trim()) {
      return "Product name is required.";
    }

    if (!form.sku.trim()) {
      return "SKU is required.";
    }

    if (!form.categoryId) {
      return "Please select a category.";
    }

    if (!form.unitOfMeasureId) {
      return "Please select a unit of measure.";
    }

    return null;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const validationError =
      validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      /*
       * EXACT backend request structure
       * provided by Narender.
       */

      const payload = {
        name: form.name.trim(),

        sku: form.sku.trim(),

        category: {
          id: Number(form.categoryId),
        },

        unitOfMeasure: {
          id: Number(
            form.unitOfMeasureId
          ),
        },

        description:
          form.description.trim(),
      };

      if (editingProduct) {
        await productService.update(
          editingProduct.id,
          payload
        );

        setSuccess(
          "Product updated successfully."
        );
      } else {
        await productService.create(
          payload
        );

        setSuccess(
          "Product created successfully."
        );
      }

      await loadProductsOnly();

      closeModal();

    } catch (err) {
      console.error(
        "Product save error:",
        err
      );

      const message =
        err?.response?.data?.message;

      setError(
        message ||
          "Unable to save product."
      );
    } finally {
      setSaving(false);
    }
  }

  async function loadProductsOnly() {
    const response =
      await productService.getAll();

    setProducts(
      extractList(response)
    );
  }

  async function handleDelete(product) {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"? This action cannot be undone.`
      );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await productService.remove(
        product.id
      );

      setProducts((previous) =>
        previous.filter(
          (item) =>
            item.id !== product.id
        )
      );

      setSuccess(
        "Product deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete product error:",
        err
      );

      const message =
        err?.response?.data?.message;

      setError(
        message ||
          "Unable to delete product."
      );
    }
  }

  if (loading) {
    return (
      <section className="products-page">
        <div className="products-state">
          Loading products...
        </div>
      </section>
    );
  }

  return (
    <section className="products-page">

      {/* ================= HEADER ================= */}

      <div className="page-header">

        <div>
          <h1>Products</h1>

          <p>
            Manage products, categories and units
            of measure.
          </p>
        </div>

        <button
          type="button"
          className="primary-btn"
          onClick={openCreateModal}
        >
          + Create Product
        </button>

      </div>

      {/* ================= MESSAGES ================= */}

      {error && (
        <div className="products-error">
          {error}
        </div>
      )}

      {success && (
        <div className="products-success">
          {success}
        </div>
      )}

      {/* ================= FILTERS ================= */}

      <div className="product-filters">

        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
        />

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(
              event.target.value
            )
          }
        >
          <option value="ALL">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.id}
            >
              {category.name}
            </option>
          ))}
        </select>

        <button
          type="button"
          className="secondary-btn"
          onClick={loadProductsOnly}
        >
          Refresh
        </button>

      </div>

      {/* ================= TABLE ================= */}

      {filteredProducts.length === 0 ? (
        <div className="products-state">
          No products found.
        </div>
      ) : (
        <div className="products-table-wrapper">

          <table className="products-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Unit</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.map(
                (product) => (

                  <tr key={product.id}>

                    <td className="product-name">
                      {product.name}
                    </td>

                    <td>
                      {product.sku}
                    </td>

                    <td>
                      {product.category?.name ??
                        "-"}
                    </td>

                    <td>
                      {product.unitOfMeasure?.name ??
                        "-"}
                    </td>

                    <td>
                      {product.description ||
                        "-"}
                    </td>

                    <td>
                      <div className="product-actions">

                        <button
                          type="button"
                          className="secondary-btn"
                          onClick={() =>
                            openEditModal(
                              product
                            )
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="danger-btn"
                          onClick={() =>
                            handleDelete(
                              product
                            )
                          }
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>
      )}

      {/* ================= PRODUCT MODAL ================= */}

      {isModalOpen && (
        <div className="modal-backdrop">

          <div className="product-modal">

            <div className="modal-header">

              <div>
                <h2>
                  {editingProduct
                    ? "Edit Product"
                    : "Create Product"}
                </h2>

                <p>
                  Enter the product information.
                </p>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="product-form"
            >

              <div className="form-group">

                <label>
                  Product Name
                </label>

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Steel Rods"
                  disabled={saving}
                />

              </div>

              <div className="form-group">

                <label>
                  SKU
                </label>

                <input
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="e.g. STEEL-ROD-01"
                  disabled={
                    saving ||
                    Boolean(editingProduct)
                  }
                />

                {editingProduct && (
                  <small>
                    SKU cannot be changed during
                    product update according to
                    the current backend contract.
                  </small>
                )}

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Category
                  </label>

                  <select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="">
                      Select category
                    </option>

                    {categories.map(
                      (category) => (
                        <option
                          key={category.id}
                          value={category.id}
                        >
                          {category.name}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Unit of Measure
                  </label>

                  <select
                    name="unitOfMeasureId"
                    value={
                      form.unitOfMeasureId
                    }
                    onChange={handleChange}
                    disabled={saving}
                  >
                    <option value="">
                      Select unit
                    </option>

                    {uoms.map((uom) => (
                      <option
                        key={uom.id}
                        value={uom.id}
                      >
                        {uom.name} ({uom.code})
                      </option>
                    ))}

                  </select>

                </div>

              </div>

              <div className="form-group">

                <label>
                  Description
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Product description..."
                  rows="4"
                  disabled={saving}
                />

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingProduct
                    ? "Update Product"
                    : "Create Product"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </section>
  );
}

export default Products;