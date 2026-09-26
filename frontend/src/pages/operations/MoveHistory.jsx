import { useEffect, useMemo, useState } from "react";

import {
  moveHistoryService,
} from "../../services/operationsService";

import "./operations.css";

function MoveHistory() {
  const [moves, setMoves] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [typeFilter, setTypeFilter] =
    useState("ALL");

  async function loadMoves() {
    try {
      setLoading(true);

      const response =
        await moveHistoryService.getAll();

      setMoves(
        response?.data?.data || []
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadMoves();
  }, []);

  const filteredMoves =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return moves.filter((move) => {

        const matchesSearch =
          move.product
            .toLowerCase()
            .includes(query) ||
          move.reference
            .toLowerCase()
            .includes(query);

        const matchesType =
          typeFilter === "ALL" ||
          move.type === typeFilter;

        return (
          matchesSearch &&
          matchesType
        );
      });
    }, [moves, search, typeFilter]);

  return (
    <section className="operations-page">

      <div className="operation-header">

        <div>
          <h1>Move History</h1>

          <p>
            Complete inventory movement ledger.
          </p>
        </div>

      </div>

      <div className="operation-filters">

        <input
          placeholder="Search product or reference..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
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

        <button
          className="secondary-btn"
          onClick={loadMoves}
        >
          Refresh
        </button>

      </div>

      {loading ? (
        <div className="state-box">
          Loading move history...
        </div>
      ) : (
        <div className="operation-table-wrapper">

          <table className="operation-table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>Source</th>
                <th>Destination</th>
                <th>Quantity</th>
                <th>Movement</th>
                <th>Reference</th>
                <th>User</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>

              {filteredMoves.map(
                (move) => (

                  <tr key={move.id}>

                    <td>
                      {move.date}
                    </td>

                    <td>
                      {move.product}
                    </td>

                    <td>
                      {move.source}
                    </td>

                    <td>
                      {move.destination}
                    </td>

                    <td>
                      {move.quantity}
                    </td>

                    <td>
                      <span
                        className={`type-badge ${move.type.toLowerCase()}`}
                      >
                        {move.type}
                      </span>
                    </td>

                    <td>
                      {move.reference}
                    </td>

                    <td>
                      {move.user}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${move.status.toLowerCase()}`}
                      >
                        {move.status}
                      </span>
                    </td>

                  </tr>
                )
              )}

            </tbody>

          </table>

          {filteredMoves.length === 0 && (
            <div className="state-box">
              No movements found.
            </div>
          )}

        </div>
      )}

    </section>
  );
}

export default MoveHistory;