import { useEffect, useState } from "react";

import {
  transferService,
} from "../../services/operationsService";

function Transfers() {
  const [transfers, setTransfers] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadTransfers();
  }, []);

  async function loadTransfers() {
    try {
      setLoading(true);

      const response =
        await transferService.getAll();

      const data =
        response?.data ?? response;

      setTransfers(
        Array.isArray(data)
          ? data
          : data?.content ?? []
      );

    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function validateTransfer(id) {
    try {
      await transferService.validate(id);

      await loadTransfers();

    } catch (err) {
      console.error(err);

      alert(
        "Transfer validation failed."
      );
    }
  }

  if (loading) {
    return (
      <section className="page">
        <h1>Internal Transfers</h1>
        <p>Loading transfers...</p>
      </section>
    );
  }

  return (
    <section className="page">

      <div className="page-header">

        <div>
          <h1>Internal Transfers</h1>

          <p>
            Move stock between locations.
          </p>
        </div>

        <button className="primary-btn">
          + Create Transfer
        </button>

      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Reference</th>
              <th>Product</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Quantity</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {transfers.map(
              (transfer) => (

                <tr key={transfer.id}>

                  <td>
                    {transfer.reference ||
                      transfer.code ||
                      transfer.id}
                  </td>

                  <td>
                    {transfer.product?.name ||
                      "-"}
                  </td>

                  <td>
                    {transfer.sourceLocation?.name ||
                      transfer.sourceLocationName ||
                      "-"}
                  </td>

                  <td>
                    {transfer.destinationLocation?.name ||
                      transfer.destinationLocationName ||
                      "-"}
                  </td>

                  <td>
                    {transfer.quantity ?? "-"}
                  </td>

                  <td>
                    {transfer.status}
                  </td>

                  <td>

                    {transfer.status !==
                      "DONE" && (

                      <button
                        className="secondary-btn"
                        onClick={() =>
                          validateTransfer(
                            transfer.id
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

    </section>
  );
}

export default Transfers;