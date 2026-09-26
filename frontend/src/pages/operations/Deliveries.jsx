import { useEffect, useState } from "react";

import {
  deliveryService,
} from "../../services/operationsService";

function Deliveries() {
  const [deliveries, setDeliveries] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadDeliveries();
  }, []);

  async function loadDeliveries() {
    try {
      setLoading(true);

      const response =
        await deliveryService.getAll();

      const data =
        response?.data ?? response;

      setDeliveries(
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

  async function validateDelivery(id) {
    try {
      await deliveryService.validate(id);

      await loadDeliveries();

    } catch (err) {
      console.error(err);

      alert(
        "Delivery validation failed."
      );
    }
  }

  if (loading) {
    return (
      <section className="page">
        <h1>Deliveries</h1>
        <p>Loading deliveries...</p>
      </section>
    );
  }

  return (
    <section className="page">

      <div className="page-header">

        <div>
          <h1>Deliveries</h1>

          <p>
            Manage outgoing stock orders.
          </p>
        </div>

        <button className="primary-btn">
          + Create Delivery
        </button>

      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Delivery</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>

            {deliveries.map(
              (delivery) => (

                <tr key={delivery.id}>

                  <td>
                    {delivery.reference ||
                      delivery.code ||
                      delivery.id}
                  </td>

                  <td>
                    {delivery.customer?.name ||
                      delivery.customerName ||
                      "-"}
                  </td>

                  <td>
                    {delivery.date ||
                      delivery.createdAt ||
                      "-"}
                  </td>

                  <td>
                    {delivery.status}
                  </td>

                  <td>

                    {delivery.status !==
                      "DONE" && (

                      <button
                        className="secondary-btn"
                        onClick={() =>
                          validateDelivery(
                            delivery.id
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

export default Deliveries;