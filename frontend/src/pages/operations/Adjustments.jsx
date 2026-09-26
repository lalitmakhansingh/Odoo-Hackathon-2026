import { useEffect, useState } from "react";

import {
  adjustmentService,
} from "../../services/operationsService";

import "./operations.css";

function Adjustments() {
  const [adjustments, setAdjustments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [formOpen, setFormOpen] =
    useState(false);

  const [product, setProduct] =
    useState("");

  const [location, setLocation] =
    useState("Main Warehouse / Rack A");

  const [recordedQuantity, setRecordedQuantity] =
    useState("");

  const [physicalQuantity, setPhysicalQuantity] =
    useState("");

  const [reason, setReason] =
    useState("");

  async function loadAdjustments() {
    try {
      setLoading(true);

      const response =
        await adjustmentService.getAll();

      setAdjustments(
        response?.data?.data || []
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAdjustments();
  }, []);

  const difference =
    Number(physicalQuantity || 0) -
    Number(recordedQuantity || 0);

  async function createAdjustment(event) {
    event.preventDefault();

    if (
      !product.trim() ||
      Number(recordedQuantity) < 0 ||
      Number(physicalQuantity) < 0 ||
      !reason.trim()
    ) {
      alert(
        "Please enter valid adjustment details."
      );
      return;
    }

    await adjustmentService.create({
      productName: product,
      location,
      recordedQuantity:
        Number(recordedQuantity),
      physicalQuantity:
        Number(physicalQuantity),
      difference,
      reason,
    });

    setProduct("");
    setRecordedQuantity("");
    setPhysicalQuantity("");
    setReason("");
    setFormOpen(false);

    await loadAdjustments();
  }

  async function validateAdjustment(id) {
    await adjustmentService.validate(id);
    await loadAdjustments();
  }

  return (
    <section className="operations-page">

      <div className="operation-header">

        <div>
          <h1>Inventory Adjustments</h1>

          <p>
            Reconcile recorded stock with physical stock.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setFormOpen(true)}
        >
          + New Adjustment
        </button>

      </div>

      {loading ? (
        <div className="state-box">
          Loading adjustments...
        </div>
      ) : (
        <div className="operation-table-wrapper">

          <table className="operation-table">

            <thead>
              <tr>
                <th>Adjustment</th>
                <th>Product</th>
                <th>Location</th>
                <th>Recorded</th>
                <th>Physical</th>
                <th>Difference</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {adjustments.map(
                (adjustment) => (

                  <tr key={adjustment.id}>

                    <td>
                      {adjustment.id}
                    </td>

                    <td>
                      {adjustment.productName}
                    </td>

                    <td>
                      {adjustment.location}
                    </td>

                    <td>
                      {adjustment.recordedQuantity}
                    </td>

                    <td>
                      {adjustment.physicalQuantity}
                    </td>

                    <td
                      className={
                        adjustment.difference < 0
                          ? "negative-value"
                          : adjustment.difference > 0
                          ? "positive-value"
                          : ""
                      }
                    >
                      {adjustment.difference}
                    </td>

                    <td>
                      {adjustment.reason}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${adjustment.status.toLowerCase()}`}
                      >
                        {adjustment.status}
                      </span>
                    </td>

                    <td>
                      {adjustment.status !==
                        "DONE" && (
                        <button
                          className="secondary-btn"
                          onClick={() =>
                            validateAdjustment(
                              adjustment.id
                            )
                          }
                        >
                          Validate
                        </button>
                      )}
                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>
      )}

      {formOpen && (
        <div className="modal-backdrop">

          <div className="operation-modal">

            <div className="modal-header">
              <h2>New Adjustment</h2>

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
              onSubmit={createAdjustment}
            >

              <label>
                Product
                <input
                  value={product}
                  onChange={(e) =>
                    setProduct(
                      e.target.value
                    )
                  }
                  placeholder="Product name"
                />
              </label>

              <label>
                Location
                <select
                  value={location}
                  onChange={(e) =>
                    setLocation(
                      e.target.value
                    )
                  }
                >
                  <option>
                    Main Warehouse / Rack A
                  </option>
                  <option>
                    Main Warehouse / Rack B
                  </option>
                  <option>
                    Production Rack
                  </option>
                </select>
              </label>

              <label>
                Recorded Quantity
                <input
                  type="number"
                  min="0"
                  value={recordedQuantity}
                  onChange={(e) =>
                    setRecordedQuantity(
                      e.target.value
                    )
                  }
                />
              </label>

              <label>
                Physical Quantity
                <input
                  type="number"
                  min="0"
                  value={physicalQuantity}
                  onChange={(e) =>
                    setPhysicalQuantity(
                      e.target.value
                    )
                  }
                />
              </label>

              <div className="difference-preview">
                Difference:
                <strong>
                  {difference}
                </strong>
              </div>

              <label>
                Reason
                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) =>
                    setReason(
                      e.target.value
                    )
                  }
                  placeholder="Reason for adjustment"
                />
              </label>

              <div className="modal-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setFormOpen(false)
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                >
                  Save Adjustment
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </section>
  );
}

export default Adjustments;