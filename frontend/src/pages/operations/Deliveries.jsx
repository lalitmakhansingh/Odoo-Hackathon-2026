import { useEffect, useMemo, useState } from "react";

import {
  deliveryService,
  productService,
  stockService,
} from "../../services/operationsService";

import "./operations.css";

function Deliveries() {
  const [deliveries, setDeliveries] = useState([]);
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formOpen, setFormOpen] = useState(false);

  const [customer, setCustomer] = useState("");
  const [productId, setProductId] = useState("");
  const [location, setLocation] = useState("Rack A");
  const [quantity, setQuantity] = useState("");

  async function loadData() {
    try {
      setLoading(true);

      const [
        deliveriesResponse,
        productsResponse,
        stockResponse,
      ] = await Promise.all([
        deliveryService.getAll(),
        productService.getAll(),
        stockService.getAll(),
      ]);

      setDeliveries(
        deliveriesResponse?.data?.data || []
      );

      setProducts(
        productsResponse?.data?.data || []
      );

      setStock(
        stockResponse?.data?.data || []
      );
    } catch (error) {
      console.error("Failed to load deliveries:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const locations = useMemo(() => {
    return [
      ...new Set(
        stock.map(
          (item) => item.locationName
        )
      ),
    ];
  }, [stock]);

  const selectedProduct = products.find(
    (product) =>
      String(product.id) ===
      String(productId)
  );

  const availableStock = useMemo(() => {
    if (!productId || !location) {
      return 0;
    }

    return stock
      .filter(
        (item) =>
          String(item.productId) ===
            String(productId) &&
          item.locationName === location
      )
      .reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );
  }, [productId, location, stock]);

  const requestedQuantity =
    Number(quantity || 0);

  const exceedsStock =
    requestedQuantity > availableStock;

  function resetForm() {
    setCustomer("");
    setProductId("");
    setLocation("Rack A");
    setQuantity("");
  }

  async function createDelivery(event) {
    event.preventDefault();

    if (!customer.trim()) {
      alert("Customer name is required.");
      return;
    }

    if (!productId) {
      alert("Please select a product.");
      return;
    }

    if (requestedQuantity <= 0) {
      alert("Quantity must be greater than 0.");
      return;
    }

    if (exceedsStock) {
      alert(
        `Insufficient stock. Available: ${availableStock}`
      );
      return;
    }

    try {
      setSaving(true);

      await deliveryService.create({
        customer: customer.trim(),
        location,
        items: [
          {
            productId: Number(productId),
            productName:
              selectedProduct?.name || "",
            quantity: requestedQuantity,
          },
        ],
      });

      resetForm();
      setFormOpen(false);

      await loadData();
    } catch (error) {
      console.error(
        "Failed to create delivery:",
        error
      );

      alert("Failed to create delivery.");
    } finally {
      setSaving(false);
    }
  }

  async function validateDelivery(delivery) {
    const item = delivery.items?.[0];

    if (!item) {
      alert("Delivery has no items.");
      return;
    }

    const currentAvailable = stock
      .filter(
        (stockItem) =>
          String(stockItem.productId) ===
            String(item.productId) &&
          stockItem.locationName ===
            delivery.location
      )
      .reduce(
        (total, stockItem) =>
          total +
          Number(stockItem.quantity || 0),
        0
      );

    if (
      Number(item.quantity) >
      currentAvailable
    ) {
      alert(
        `Cannot validate. Available stock: ${currentAvailable}`
      );
      return;
    }

    try {
      await deliveryService.validate(
        delivery.id
      );

      await loadData();
    } catch (error) {
      console.error(
        "Failed to validate delivery:",
        error
      );

      alert("Delivery validation failed.");
    }
  }

  return (
    <section className="operations-page">
      <div className="operation-header">
        <div>
          <h1>Deliveries</h1>

          <p>
            Manage outgoing stock and customer shipments.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setFormOpen(true)}
        >
          + Create Delivery
        </button>
      </div>

      {!loading && (
        <div className="operation-summary">
          <div className="summary-card">
            <span>Total Deliveries</span>
            <strong>{deliveries.length}</strong>
          </div>

          <div className="summary-card">
            <span>Ready</span>
            <strong>
              {
                deliveries.filter(
                  (item) =>
                    item.status === "READY"
                ).length
              }
            </strong>
          </div>

          <div className="summary-card">
            <span>Completed</span>
            <strong>
              {
                deliveries.filter(
                  (item) =>
                    item.status === "DONE"
                ).length
              }
            </strong>
          </div>
        </div>
      )}

      {loading ? (
        <div className="state-box">
          Loading deliveries...
        </div>
      ) : (
        <div className="operation-table-wrapper">
          <table className="operation-table">
            <thead>
              <tr>
                <th>Delivery</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Location</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {deliveries.map((delivery) => {
                const item =
                  delivery.items?.[0];

                return (
                  <tr key={delivery.id}>
                    <td>{delivery.id}</td>

                    <td>
                      {delivery.customer}
                    </td>

                    <td>
                      {item?.productName || "-"}
                    </td>

                    <td>
                      {delivery.location || "-"}
                    </td>

                    <td>
                      {item?.quantity || 0}
                    </td>

                    <td>
                      {delivery.date || "-"}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${String(
                          delivery.status
                        ).toLowerCase()}`}
                      >
                        {delivery.status}
                      </span>
                    </td>

                    <td>
                      {delivery.status !==
                        "DONE" && (
                        <button
                          className="secondary-btn"
                          onClick={() =>
                            validateDelivery(
                              delivery
                            )
                          }
                        >
                          Validate
                        </button>
                      )}

                      {delivery.status ===
                        "DONE" && (
                        <span className="completed-label">
                          Completed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {deliveries.length === 0 && (
            <div className="state-box">
              No deliveries found.
            </div>
          )}
        </div>
      )}

      {formOpen && (
        <div className="modal-backdrop">
          <div className="operation-modal">
            <div className="modal-header">
              <div>
                <h2>Create Delivery</h2>

                <p>
                  Create an outgoing stock order.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setFormOpen(false)
                }
              >
                ×
              </button>
            </div>

            <form
              className="operation-form"
              onSubmit={createDelivery}
            >
              <label>
                Customer

                <input
                  value={customer}
                  onChange={(event) =>
                    setCustomer(
                      event.target.value
                    )
                  }
                  placeholder="Enter customer name"
                />
              </label>

              <label>
                Product

                <select
                  value={productId}
                  onChange={(event) => {
                    setProductId(
                      event.target.value
                    );
                    setQuantity("");
                  }}
                >
                  <option value="">
                    Select product
                  </option>

                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                    >
                      {product.name} —{" "}
                      {product.sku}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Location

                <select
                  value={location}
                  onChange={(event) => {
                    setLocation(
                      event.target.value
                    );
                  }}
                >
                  {locations.map(
                    (locationName) => (
                      <option
                        key={locationName}
                        value={locationName}
                      >
                        {locationName}
                      </option>
                    )
                  )}
                </select>
              </label>

              {productId && (
                <div className="availability-card">
                  <span>
                    Available stock
                  </span>

                  <strong>
                    {availableStock}{" "}
                    {
                      selectedProduct
                        ?.unitOfMeasure?.code
                    }
                  </strong>
                </div>
              )}

              <label>
                Quantity

                <input
                  type="number"
                  min="1"
                  max={availableStock}
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      event.target.value
                    )
                  }
                />
              </label>

              {exceedsStock &&
                requestedQuantity > 0 && (
                  <div className="validation-error">
                    Requested quantity exceeds
                    available stock.
                  </div>
                )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    resetForm();
                    setFormOpen(false);
                  }}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={
                    saving || exceedsStock
                  }
                >
                  {saving
                    ? "Saving..."
                    : "Save Delivery"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Deliveries;