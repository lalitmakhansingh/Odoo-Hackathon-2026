import { useEffect, useState } from "react";

import {
  receiptService,
} from "../../services/operationsService";

function Receipts() {
  const [receipts, setReceipts] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    loadReceipts();
  }, []);

  async function loadReceipts() {
    try {
      setLoading(true);

      const response =
        await receiptService.getAll();

      const data =
        response?.data ?? response;

      setReceipts(
        Array.isArray(data)
          ? data
          : data?.content ?? []
      );

    } catch (err) {
      console.error(err);

      setError(
        "Unable to load receipts."
      );
    } finally {
      setLoading(false);
    }
  }

  async function validateReceipt(id) {
    try {
      await receiptService.validate(id);

      await loadReceipts();

    } catch (err) {
      console.error(err);

      alert(
        "Receipt validation failed."
      );
    }
  }

  if (loading) {
    return (
      <section className="page">
        <h1>Receipts</h1>
        <p>Loading receipts...</p>
      </section>
    );
  }

  return (
    <section className="page">

      <div className="page-header">

        <div>
          <h1>Receipts</h1>

          <p>
            Manage incoming goods from suppliers.
          </p>
        </div>

        <button className="primary-btn">
          + Create Receipt
        </button>

      </div>

      {error && (
        <div className="error-state">
          {error}
        </div>
      )}

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Receipt</th>
              <th>Supplier</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {receipts.map((receipt) => (

              <tr key={receipt.id}>

                <td>
                  {receipt.reference ||
                    receipt.code ||
                    receipt.id}
                </td>

                <td>
                  {receipt.supplier?.name ||
                    receipt.supplierName ||
                    "-"}
                </td>

                <td>
                  {receipt.date ||
                    receipt.createdAt ||
                    "-"}
                </td>

                <td>
                  {receipt.status}
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

            ))}

          </tbody>

        </table>

      </div>

    </section>
  );
}

export default Receipts;