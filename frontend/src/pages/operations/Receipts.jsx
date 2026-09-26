import { useEffect, useState } from "react";

import {
  receiptService,
} from "../../services/operationsService";

import "./operations.css";

function Receipts() {
  const [receipts, setReceipts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [formOpen, setFormOpen] =
    useState(false);

  const [supplier, setSupplier] =
    useState("");

  const [product, setProduct] =
    useState("");

  const [quantity, setQuantity] =
    useState("");

  async function loadReceipts() {
    try {
      setLoading(true);

      const response =
        await receiptService.getAll();

      setReceipts(
        response?.data?.data || []
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadReceipts();
  }, []);

  async function createReceipt(
    event
  ) {
    event.preventDefault();

    if (
      !supplier.trim() ||
      !product.trim() ||
      Number(quantity) <= 0
    ) {
      alert("Please enter valid receipt details.");
      return;
    }

    await receiptService.create({
      supplier,
      items: [
        {
          productName: product,
          quantity: Number(quantity),
        },
      ],
    });

    setSupplier("");
    setProduct("");
    setQuantity("");
    setFormOpen(false);

    await loadReceipts();
  }

  async function validateReceipt(id) {
    await receiptService.validate(id);
    await loadReceipts();
  }

  return (
    <section className="operations-page">

      <div className="operation-header">
        <div>
          <h1>Receipts</h1>
          <p>
            Manage incoming stock from suppliers.
          </p>
        </div>

        <button
          className="primary-btn"
          onClick={() => setFormOpen(true)}
        >
          + Create Receipt
        </button>
      </div>

      {loading ? (
        <div className="state-box">
          Loading receipts...
        </div>
      ) : (
        <div className="operation-table-wrapper">

          <table className="operation-table">
            <thead>
              <tr>
                <th>Receipt</th>
                <th>Supplier</th>
                <th>Items</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {receipts.map(
                (receipt) => (
                  <tr key={receipt.id}>

                    <td>
                      {receipt.id}
                    </td>

                    <td>
                      {receipt.supplier}
                    </td>

                    <td>
                      {receipt.items?.length || 0}
                    </td>

                    <td>
                      {receipt.date}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${receipt.status.toLowerCase()}`}
                      >
                        {receipt.status}
                      </span>
                    </td>

                    <td>
                      {receipt.status !==
                        "DONE" && (
                        <button
                          className="secondary-btn"
                          onClick={() =>
                            validateReceipt(
                              receipt.id
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
              <h2>Create Receipt</h2>

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
              onSubmit={createReceipt}
            >

              <label>
                Supplier
                <input
                  value={supplier}
                  onChange={(e) =>
                    setSupplier(
                      e.target.value
                    )
                  }
                  placeholder="Supplier name"
                />
              </label>

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
                Quantity
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) =>
                    setQuantity(
                      e.target.value
                    )
                  }
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
                  Save Receipt
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </section>
  );
}

export default Receipts;