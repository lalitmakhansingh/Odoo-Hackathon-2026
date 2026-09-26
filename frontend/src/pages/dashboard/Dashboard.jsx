import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    documentType: "",
    status: "",
    warehouse: "",
    category: "",
  });

  const [refreshing, setRefreshing] = useState(false);

  const stats = [
    {
      title: "Total Products",
      value: "1,248",
      label: "Items in catalog",
      icon: "▦",
      className: "products",
    },
    {
      title: "Low Stock",
      value: "24",
      label: "Need replenishment",
      icon: "!",
      className: "warning",
    },
    {
      title: "Out of Stock",
      value: "8",
      label: "Currently unavailable",
      icon: "×",
      className: "danger",
    },
    {
      title: "Pending Receipts",
      value: "12",
      label: "Awaiting processing",
      icon: "↓",
      className: "receipts",
    },
    {
      title: "Pending Deliveries",
      value: "7",
      label: "Awaiting dispatch",
      icon: "↑",
      className: "deliveries",
    },
    {
      title: "Internal Transfers",
      value: "5",
      label: "Scheduled transfers",
      icon: "↔",
      className: "transfers",
    },
  ];

  const recentOperations = [
    {
      type: "Receipt",
      reference: "REC-00124",
      product: "Steel Rod",
      quantity: "+100",
      status: "Done",
      time: "12 min ago",
    },
    {
      type: "Delivery",
      reference: "DEL-00451",
      product: "Copper Wire",
      quantity: "-50",
      status: "Waiting",
      time: "28 min ago",
    },
    {
      type: "Transfer",
      reference: "TRF-00087",
      product: "Aluminium Sheet",
      quantity: "30",
      status: "Ready",
      time: "1 hr ago",
    },
    {
      type: "Adjustment",
      reference: "ADJ-00032",
      product: "Steel Plate",
      quantity: "-5",
      status: "Done",
      time: "2 hrs ago",
    },
  ];

  const stockAlerts = [
    {
      product: "Copper Wire",
      sku: "COP-001",
      stock: 5,
      reorder: 20,
      level: "critical",
    },
    {
      product: "Steel Plate",
      sku: "STL-023",
      stock: 3,
      reorder: 15,
      level: "critical",
    },
    {
      product: "Aluminium Sheet",
      sku: "ALU-010",
      stock: 0,
      reorder: 10,
      level: "out",
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      documentType: "",
      status: "",
      warehouse: "",
      category: "",
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  const hasFilters = Object.values(filters).some(
    (value) => value !== ""
  );

  return (
    <div className="dashboard dashboard-modern">
      {/* Header */}
      <section className="dashboard-topbar">
        <div>
          <div className="dashboard-eyebrow">
            INVENTORY OVERVIEW
          </div>

          <h1>Dashboard</h1>

          <p>
            Monitor stock levels, warehouse activity and
            daily operations.
          </p>
        </div>

        <button
          className="dashboard-refresh"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          <span className={refreshing ? "refresh-spin" : ""}>
            ↻
          </span>

          {refreshing ? "Refreshing" : "Refresh"}
        </button>
      </section>

      {/* KPI Cards */}
      <section className="dashboard-stats">
        {stats.map((stat) => (
          <div
            className="dashboard-stat"
            key={stat.title}
          >
            <div
              className={`dashboard-stat-icon ${stat.className}`}
            >
              {stat.icon}
            </div>

            <div className="dashboard-stat-content">
              <span>{stat.title}</span>

              <strong>{stat.value}</strong>

              <small>{stat.label}</small>
            </div>
          </div>
        ))}
      </section>

      {/* Filters */}
      <section className="dashboard-panel dashboard-filters">
        <div className="dashboard-panel-header">
          <div>
            <h2>Filter operations</h2>
            <p>
              Narrow down activity by document, status or
              location.
            </p>
          </div>

          {hasFilters && (
            <button
              className="dashboard-clear"
              onClick={clearFilters}
            >
              Clear filters
            </button>
          )}
        </div>

        <div className="dashboard-filter-grid">
          <div className="dashboard-filter">
            <label>Document type</label>

            <select
              name="documentType"
              value={filters.documentType}
              onChange={handleFilterChange}
            >
              <option value="">All documents</option>
              <option value="Receipt">Receipts</option>
              <option value="Delivery">Deliveries</option>
              <option value="Transfer">Transfers</option>
              <option value="Adjustment">
                Adjustments
              </option>
            </select>
          </div>

          <div className="dashboard-filter">
            <label>Status</label>

            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All statuses</option>
              <option value="Draft">Draft</option>
              <option value="Waiting">Waiting</option>
              <option value="Ready">Ready</option>
              <option value="Done">Done</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>

          <div className="dashboard-filter">
            <label>Warehouse</label>

            <select
              name="warehouse"
              value={filters.warehouse}
              onChange={handleFilterChange}
            >
              <option value="">All warehouses</option>
              <option value="Main Warehouse">
                Main Warehouse
              </option>
              <option value="Secondary Warehouse">
                Secondary Warehouse
              </option>
            </select>
          </div>

          <div className="dashboard-filter">
            <label>Category</label>

            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All categories</option>
              <option value="Raw Material">
                Raw Materials
              </option>
              <option value="Electronics">
                Electronics
              </option>
              <option value="Finished Goods">
                Finished Goods
              </option>
            </select>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="dashboard-main-grid">
        {/* Recent Operations */}
        <div className="dashboard-panel operations-panel">
          <div className="dashboard-panel-header">
            <div>
              <div className="dashboard-section-label">
                ACTIVITY
              </div>

              <h2>Recent operations</h2>

              <p>
                Latest inventory movements across your
                workspace.
              </p>
            </div>

            <button
              className="dashboard-link"
              onClick={() =>
                navigate("/operations/receipts")
              }
            >
              View all →
            </button>
          </div>

          <div className="operations-table-wrapper">
            <table className="operations-table">
              <thead>
                <tr>
                  <th>Operation</th>
                  <th>Reference</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>

              <tbody>
                {recentOperations.map((operation) => (
                  <tr key={operation.reference}>
                    <td>
                      <div className="operation-type">
                        <span
                          className={`operation-dot ${operation.type.toLowerCase()}`}
                        />

                        {operation.type}
                      </div>
                    </td>

                    <td>
                      <span className="operation-reference">
                        {operation.reference}
                      </span>
                    </td>

                    <td>
                      <span className="operation-product">
                        {operation.product}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          operation.quantity.startsWith("-")
                            ? "quantity-negative"
                            : "quantity-positive"
                        }
                      >
                        {operation.quantity}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`operation-status status-${operation.status.toLowerCase()}`}
                      >
                        {operation.status}
                      </span>
                    </td>

                    <td>
                      <span className="operation-time">
                        {operation.time}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="dashboard-panel alerts-panel">
          <div className="dashboard-panel-header">
            <div>
              <div className="dashboard-section-label">
                ATTENTION
              </div>

              <h2>Stock alerts</h2>

              <p>
                Products that need replenishment.
              </p>
            </div>

            <button
              className="dashboard-link"
              onClick={() => navigate("/products")}
            >
              Products →
            </button>
          </div>

          <div className="stock-alert-list">
            {stockAlerts.map((alert) => (
              <div
                className="stock-alert-item"
                key={alert.sku}
              >
                <div className="stock-alert-info">
                  <div
                    className={`stock-alert-indicator ${alert.level}`}
                  />

                  <div>
                    <strong>{alert.product}</strong>

                    <span>{alert.sku}</span>
                  </div>
                </div>

                <div className="stock-alert-values">
                  <strong>{alert.stock}</strong>

                  <span>
                    Min. {alert.reorder}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="stock-alert-footer">
            <span>
              {stockAlerts.length} products need attention
            </span>

            <button
              onClick={() => navigate("/products")}
            >
              Review stock
            </button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="dashboard-panel quick-actions-panel">
        <div className="dashboard-panel-header">
          <div>
            <div className="dashboard-section-label">
              SHORTCUTS
            </div>

            <h2>Quick actions</h2>

            <p>
              Start a common inventory workflow.
            </p>
          </div>
        </div>

        <div className="dashboard-actions">
          <button
            onClick={() =>
              navigate("/operations/receipts")
            }
          >
            <span className="action-icon receipt">
              ↓
            </span>

            <span>
              <strong>New receipt</strong>
              <small>Record incoming stock</small>
            </span>

            <b>→</b>
          </button>

          <button
            onClick={() =>
              navigate("/operations/deliveries")
            }
          >
            <span className="action-icon delivery">
              ↑
            </span>

            <span>
              <strong>New delivery</strong>
              <small>Process outgoing stock</small>
            </span>

            <b>→</b>
          </button>

          <button
            onClick={() =>
              navigate("/operations/transfers")
            }
          >
            <span className="action-icon transfer">
              ↔
            </span>

            <span>
              <strong>New transfer</strong>
              <small>Move stock internally</small>
            </span>

            <b>→</b>
          </button>

          <button
            onClick={() =>
              navigate("/operations/adjustments")
            }
          >
            <span className="action-icon adjustment">
              ±
            </span>

            <span>
              <strong>Stock adjustment</strong>
              <small>Correct inventory levels</small>
            </span>

            <b>→</b>
          </button>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;