import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      icon: "📦",
    },
    {
      title: "Low Stock",
      value: "24",
      icon: "⚠️",
    },
    {
      title: "Out of Stock",
      value: "8",
      icon: "❌",
    },
    {
      title: "Pending Receipts",
      value: "12",
      icon: "📥",
    },
    {
      title: "Pending Deliveries",
      value: "7",
      icon: "📤",
    },
    {
      title: "Internal Transfers",
      value: "5",
      icon: "🔄",
    },
  ];

  const recentOperations = [
    {
      type: "Receipt",
      reference: "REC-00124",
      product: "Steel Rod",
      quantity: "100",
      status: "Done",
    },
    {
      type: "Delivery",
      reference: "DEL-00451",
      product: "Copper Wire",
      quantity: "50",
      status: "Waiting",
    },
    {
      type: "Transfer",
      reference: "TRF-00087",
      product: "Aluminium Sheet",
      quantity: "30",
      status: "Ready",
    },
    {
      type: "Adjustment",
      reference: "ADJ-00032",
      product: "Steel Plate",
      quantity: "-5",
      status: "Done",
    },
  ];

  const stockAlerts = [
    {
      product: "Copper Wire",
      sku: "COP-001",
      stock: "5",
      reorder: "20",
    },
    {
      product: "Steel Plate",
      sku: "STL-023",
      stock: "3",
      reorder: "15",
    },
    {
      product: "Aluminium Sheet",
      sku: "ALU-010",
      stock: "0",
      reorder: "10",
    },
  ];

  const handleFilterChange = (e) => {
    const { name, value } = e.target;

    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  const clearFilters = () => {
    setFilters({
      documentType: "",
      status: "",
      warehouse: "",
      category: "",
    });
  };

  const handleQuickAction = (path) => {
    navigate(path);
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your inventory operations</p>
        </div>

        <button
          className="refresh-button"
          onClick={handleRefresh}
          disabled={refreshing}
        >
          {refreshing ? "⟳ Refreshing..." : "🔄 Refresh"}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="stats-grid">
        {stats.map((stat) => (
          <div className="stat-card" key={stat.title}>
            <div className="stat-icon">
              {stat.icon}
            </div>

            <div>
              <p>{stat.title}</p>
              <h2>{stat.value}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="dashboard-card filters-card">
        <div className="card-header">
          <div>
            <h2>Filters</h2>
            <p>Filter inventory operations</p>
          </div>

          <button
            className="clear-filter-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>

        <div className="filters-grid">
          <select
            name="documentType"
            value={filters.documentType}
            onChange={handleFilterChange}
          >
            <option value="">Document Type</option>
            <option value="Receipt">Receipt</option>
            <option value="Delivery">Delivery</option>
            <option value="Transfer">Transfer</option>
            <option value="Adjustment">Adjustment</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Status</option>
            <option value="Draft">Draft</option>
            <option value="Waiting">Waiting</option>
            <option value="Ready">Ready</option>
            <option value="Done">Done</option>
            <option value="Canceled">Canceled</option>
          </select>

          <select
            name="warehouse"
            value={filters.warehouse}
            onChange={handleFilterChange}
          >
            <option value="">Warehouse</option>
            <option value="Main Warehouse">
              Main Warehouse
            </option>
            <option value="Secondary Warehouse">
              Secondary Warehouse
            </option>
          </select>

          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            <option value="">Category</option>
            <option value="Raw Material">
              Raw Material
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

      {/* Dashboard Columns */}
      <div className="dashboard-columns">
        {/* Recent Operations */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Recent Operations</h2>
              <p>Latest inventory activities</p>
            </div>

            <button
              className="view-all-button"
              onClick={() =>
                navigate("/operations/receipts")
              }
            >
              View All
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Reference</th>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {recentOperations.map((operation) => (
                  <tr key={operation.reference}>
                    <td>{operation.type}</td>

                    <td>
                      <strong>
                        {operation.reference}
                      </strong>
                    </td>

                    <td>{operation.product}</td>

                    <td>{operation.quantity}</td>

                    <td>
                      <span
                        className={`status-badge status-${operation.status.toLowerCase()}`}
                      >
                        {operation.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="dashboard-card">
          <div className="card-header">
            <div>
              <h2>Stock Alerts</h2>
              <p>Products requiring attention</p>
            </div>

            <button
              className="view-all-button"
              onClick={() => navigate("/products")}
            >
              View All
            </button>
          </div>

          <div className="alerts-list">
            {stockAlerts.map((alert) => (
              <div
                className="stock-alert"
                key={alert.sku}
              >
                <div>
                  <strong>{alert.product}</strong>
                  <small>{alert.sku}</small>
                </div>

                <div className="stock-alert-right">
                  <strong>{alert.stock}</strong>
                  <small>
                    Reorder: {alert.reorder}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="dashboard-card">
        <div className="card-header">
          <div>
            <h2>Quick Actions</h2>
            <p>Create a new inventory operation</p>
          </div>
        </div>

        <div className="quick-actions">
          <button
            onClick={() =>
              handleQuickAction(
                "/operations/receipts"
              )
            }
          >
            📥 New Receipt
          </button>

          <button
            onClick={() =>
              handleQuickAction(
                "/operations/deliveries"
              )
            }
          >
            📤 New Delivery
          </button>

          <button
            onClick={() =>
              handleQuickAction(
                "/operations/transfers"
              )
            }
          >
            🔄 New Transfer
          </button>

          <button
            onClick={() =>
              handleQuickAction(
                "/operations/adjustments"
              )
            }
          >
            📝 Stock Adjustment
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;