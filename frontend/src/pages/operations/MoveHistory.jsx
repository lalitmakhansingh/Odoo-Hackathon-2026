import { useEffect, useState } from "react";

import {
  moveHistoryService,
} from "../../services/operationsService";

function MoveHistory() {
  const [moves, setMoves] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [product, setProduct] =
    useState("");

  const [movementType, setMovementType] =
    useState("ALL");

  useEffect(() => {
    loadMoves();
  }, []);

  async function loadMoves() {
    try {
      setLoading(true);

      const response =
        await moveHistoryService.getAll();

      const data =
        response?.data ?? response;

      setMoves(
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

  const filteredMoves =
    moves.filter((move) => {

      const moveProduct =
        move.product?.name ||
        move.productName ||
        "";

      const type =
        move.movementType ||
        move.type ||
        "";

      const matchesProduct =
        moveProduct
          .toLowerCase()
          .includes(
            product.toLowerCase()
          );

      const matchesType =
        movementType === "ALL" ||
        type === movementType;

      return (
        matchesProduct &&
        matchesType
      );
    });

  if (loading) {
    return (
      <section className="page">
        <h1>Move History</h1>
        <p>Loading stock ledger...</p>
      </section>
    );
  }

  return (
    <section className="page">

      <div className="page-header">

        <div>
          <h1>Move History</h1>

          <p>
            Complete stock movement ledger.
          </p>
        </div>

      </div>

      <div className="filters">

        <input
          type="text"
          placeholder="Search product..."
          value={product}
          onChange={(event) =>
            setProduct(event.target.value)
          }
        />

        <select
          value={movementType}
          onChange={(event) =>
            setMovementType(
              event.target.value
            )
          }
        >
          <option value="ALL">
            All Movement Types
          </option>

          <option value="RECEIPT">
            Receipt
          </option>

          <option value="DELIVERY">
            Delivery
          </option>

          <option value="TRANSFER">
            Transfer
          </option>

          <option value="ADJUSTMENT">
            Adjustment
          </option>
        </select>

      </div>

      <div className="table-container">

        <table>

          <thead>
            <tr>
              <th>Date</th>
              <th>Product</th>
              <th>Source</th>
              <th>Destination</th>
              <th>Quantity</th>
              <th>Movement Type</th>
              <th>Reference</th>
              <th>User</th>
            </tr>
          </thead>

          <tbody>

            {filteredMoves.map(
              (move) => (

                <tr key={move.id}>

                  <td>
                    {move.createdAt ||
                      move.date ||
                      "-"}
                  </td>

                  <td>
                    {move.product?.name ||
                      move.productName ||
                      "-"}
                  </td>

                  <td>
                    {move.sourceLocation?.name ||
                      move.sourceLocationName ||
                      "-"}
                  </td>

                  <td>
                    {move.destinationLocation?.name ||
                      move.destinationLocationName ||
                      "-"}
                  </td>

                  <td>
                    {move.quantity ?? "-"}
                  </td>

                  <td>
                    {move.movementType ||
                      move.type ||
                      "-"}
                  </td>

                  <td>
                    {move.reference ||
                      "-"}
                  </td>

                  <td>
                    {move.user?.name ||
                      move.username ||
                      "-"}
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

export default MoveHistory;