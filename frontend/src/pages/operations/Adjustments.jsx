import { useEffect, useState } from "react";

import {
  adjustmentService,
} from "../../services/operationsService";

function Adjustments() {
  const [adjustments, setAdjustments] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadAdjustments();
  }, []);

  async function loadAdjustments() {
    try {
      setLoading(true);

      const response =
        await adjustmentService.getAll();

      const data =
        response?.data ?? response;

      setAdjustments(
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

  async function validateAdjustment(id) {
    try {
      await adjustmentService.validate(id);

      await loadAdjustments();

    } catch (err) {
      console.error(err);

      alert(
        "Adjustment validation failed."
      );
    }
  }

  if (loading) {
    return (
      <section className="page">
        <h1>Inventory Adjustments</h1>
        <p>Loading adjustments...</p>
      </section>
    );
  }

  return (
    <section className="page">

      <div className="page-header">

        <div>
          <h1>Inventory Adjustments</h1>

          <p>
            Reconcile recorded and physical stock.
          </p>
        </div>

        <button className="primary-btn">
          + New Adjustment
        </button>

      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Reference</th>
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
                    {adjustment.reference ||
                      adjustment.code ||
                      adjustment.id}
                  </td>

                  <td>
                    {adjustment.product?.name ||
                      "-"}
                  </td>

                  <td>
                    {adjustment.location?.name ||
                      adjustment.locationName ||
                      "-"}
                  </td>

                  <td>
                    {adjustment.recordedQuantity ??
                      0}
                  </td>

                  <td>
                    {adjustment.physicalQuantity ??
                      0}
                  </td>

                  <td>
                    {adjustment.difference ??
                      ((adjustment.physicalQuantity ??
                        0) -
                        (adjustment.recordedQuantity ??
                          0))}
                  </td>

                  <td>
                    {adjustment.reason ||
                      "-"}
                  </td>

                  <td>
                    {adjustment.status}
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

    </section>
  );
}

export default Adjustments;