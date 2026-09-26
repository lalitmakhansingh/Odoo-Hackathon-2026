import { useEffect, useMemo, useState } from "react";

import {
  transferService,
  productService,
  stockService,
} from "../../services/operationsService";

import "./operations.css";

function Transfers() {
  const [transfers, setTransfers] = useState([]);
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  const [productId, setProductId] = useState("");
  const [sourceLocation, setSourceLocation] = useState("");
  const [destinationLocation, setDestinationLocation] =
    useState("");
  const [quantity, setQuantity] = useState("");

  async function loadData() {
    try {
      setLoading(true);

      const [
        transfersResponse,
        productsResponse,
        stockResponse,
      ] = await Promise.all([
        transferService.getAll(),
        productService.getAll(),
        stockService.getAll(),
      ]);

      setTransfers(
        transfersResponse?.data?.data || []
      );

      setProducts(
        productsResponse?.data?.data || []
      );

      setStock(
        stockResponse?.data?.data || []
      );

      // Set sensible default locations
      const availableLocations = [
        ...new Set(
          (stockResponse?.data?.data || []).map(
            (item) => item.locationName
          )
        ),
      ];

      if (
        availableLocations.length > 0 &&
        !sourceLocation
      ) {
        setSourceLocation(
          availableLocations[0]
        );
      }

      if (
        availableLocations.length > 1 &&
        !destinationLocation
      ) {
        setDestinationLocation(
          availableLocations[1]
        );
      }
    } catch (error) {
      console.error(
        "Failed to load transfer data:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  let active = true;

  async function initialize() {
    try {
      setLoading(true);

      const [
        transfersResponse,
        productsResponse,
        stockResponse,
      ] = await Promise.all([
        transferService.getAll(),
        productService.getAll(),
        stockService.getAll(),
      ]);

      if (!active) return;

      const transferData =
        transfersResponse?.data?.data || [];

      const productData =
        productsResponse?.data?.data || [];

      const stockData =
        stockResponse?.data?.data || [];

      setTransfers(transferData);
      setProducts(productData);
      setStock(stockData);

      const availableLocations = [
        ...new Set(
          stockData.map(
            (item) => item.locationName
          )
        ),
      ];

      if (
        availableLocations.length > 0
      ) {
        setSourceLocation(
          availableLocations[0]
        );
      }

      if (
        availableLocations.length > 1
      ) {
        setDestinationLocation(
          availableLocations[1]
        );
      }
    } catch (error) {
      if (!active) return;

      console.error(
        "Failed to load transfer data:",
        error
      );
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  initialize();

  return () => {
    active = false;
  };
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

  const availableSourceStock = useMemo(() => {
    if (!productId || !sourceLocation) {
      return 0;
    }

    return stock
      .filter(
        (item) =>
          String(item.productId) ===
            String(productId) &&
          item.locationName ===
            sourceLocation
      )
      .reduce(
        (total, item) =>
          total + Number(item.quantity || 0),
        0
      );
  }, [
    productId,
    sourceLocation,
    stock,
  ]);

  const requestedQuantity =
    Number(quantity || 0);

  const insufficientStock =
    requestedQuantity >
    availableSourceStock;

  function resetForm() {
    setProductId("");
    setQuantity("");

    if (locations.length > 0) {
      setSourceLocation(locations[0]);
    }

    if (locations.length > 1) {
      setDestinationLocation(locations[1]);
    }
  }

  async function createTransfer(event) {
    event.preventDefault();

    if (!productId) {
      alert("Please select a product.");
      return;
    }

    if (!sourceLocation) {
      alert("Please select a source location.");
      return;
    }

    if (!destinationLocation) {
      alert(
        "Please select a destination location."
      );
      return;
    }

    if (
      sourceLocation ===
      destinationLocation
    ) {
      alert(
        "Source and destination must be different."
      );
      return;
    }

    if (requestedQuantity <= 0) {
      alert(
        "Quantity must be greater than 0."
      );
      return;
    }

    if (insufficientStock) {
      alert(
        `Insufficient stock. Available: ${availableSourceStock}`
      );
      return;
    }

    try {
      setSaving(true);

      await transferService.create({
        productId: Number(productId),
        productName:
          selectedProduct?.name || "",
        sourceLocation,
        destinationLocation,
        quantity: requestedQuantity,
      });

      resetForm();
      setFormOpen(false);

      await loadData();
    } catch (error) {
      console.error(
        "Failed to create transfer:",
        error
      );

      alert("Failed to create transfer.");
    } finally {
      setSaving(false);
    }
  }

  async function validateTransfer(transfer) {
    try {
      await transferService.validate(
        transfer.id
      );

      await loadData();
    } catch (error) {
      console.error(
        "Transfer validation failed:",
        error
      );

      alert(
        error?.message ||
          "Transfer validation failed."
      );
    }
  }

  return (
    <section className="operations-page">
      <div className="operation-header">
        <div>
          <h1>Internal Transfers</h1>
          <p>
            Move stock between warehouses and
            locations.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setFormOpen(true)}
        >
          + Create Transfer
        </button>
      </div>

      {!loading && (
        <div className="operation-summary">
          <div className="summary-card">
            <span>Total Transfers</span>
            <strong>
              {transfers.length}
            </strong>
          </div>

          <div className="summary-card">
            <span>Pending</span>
            <strong>
              {
                transfers.filter(
                  (item) =>
                    item.status !== "DONE"
                ).length
              }
            </strong>
          </div>

          <div className="summary-card">
            <span>Completed</span>
            <strong>
              {
                transfers.filter(
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
          Loading transfers...
        </div>
      ) : (
        <div className="operation-table-wrapper">
          <table className="operation-table">
            <thead>
              <tr>
                <th>Transfer</th>
                <th>Product</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {transfers.map((transfer) => (
                <tr key={transfer.id}>
                  <td>{transfer.id}</td>

                  <td>
                    {transfer.productName}
                  </td>

                  <td>
                    {transfer.sourceLocation}
                  </td>

                  <td>
                    {transfer.destinationLocation}
                  </td>

                  <td>
                    {transfer.quantity}
                  </td>

                  <td>
                    {transfer.date || "-"}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${String(
                        transfer.status
                      ).toLowerCase()}`}
                    >
                      {transfer.status}
                    </span>
                  </td>

                  <td>
                    {transfer.status !==
                      "DONE" && (
                      <button
                        className="secondary-btn"
                        onClick={() =>
                          validateTransfer(
                            transfer
                          )
                        }
                      >
                        Validate
                      </button>
                    )}

                    {transfer.status ===
                      "DONE" && (
                      <span className="completed-label">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {transfers.length === 0 && (
            <div className="state-box">
              No transfers found.
            </div>
          )}
        </div>
      )}

      {formOpen && (
        <div className="modal-backdrop">
          <div className="operation-modal">
            <div className="modal-header">
              <div>
                <h2>Create Transfer</h2>
                <p>
                  Move available stock to another
                  location.
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
              onSubmit={createTransfer}
            >
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
                Source Location

                <select
                  value={sourceLocation}
                  onChange={(event) =>
                    setSourceLocation(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select source
                  </option>

                  {locations.map(
                    (location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label>
                Destination Location

                <select
                  value={destinationLocation}
                  onChange={(event) =>
                    setDestinationLocation(
                      event.target.value
                    )
                  }
                >
                  <option value="">
                    Select destination
                  </option>

                  {locations.map(
                    (location) => (
                      <option
                        key={location}
                        value={location}
                      >
                        {location}
                      </option>
                    )
                  )}
                </select>
              </label>

              {productId &&
                sourceLocation && (
                  <div className="availability-card">
                    <span>
                      Available at source
                    </span>

                    <strong>
                      {availableSourceStock}{" "}
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
                  max={
                    availableSourceStock
                  }
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      event.target.value
                    )
                  }
                />
              </label>

              {insufficientStock &&
                requestedQuantity > 0 && (
                  <div className="validation-error">
                    Transfer quantity exceeds
                    stock available at the
                    source location.
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
                    saving ||
                    insufficientStock
                  }
                >
                  {saving
                    ? "Saving..."
                    : "Save Transfer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Transfers;