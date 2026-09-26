function Dashboard() {
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

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Overview of your inventory operations</p>
        </div>

        <button className="refresh-button">
          🔄 Refresh
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
        <h2>Filters</h2>

        <div className="filters-grid">
          <select>
            <option value="">Document Type</option>
            <option>Receipt</option>
            <option>Delivery</option>
            <option>Transfer</option>
            <option>Adjustment</option>
          </select>

          <select>
            <option value="">Status</option>
            <option>Draft</option>
            <option>Waiting</option>
            <option>Ready</option>
            <option>Done</option>
            <option>Canceled</option>
          </select>

          <select>
            <option value="">Warehouse</option>
            <option>Main Warehouse</option>
            <option>Secondary Warehouse</option>
          </select>

          <select>
            <option value="">Category</option>
            <option>Raw Material</option>
            <option>Electronics</option>
            <option>Finished Goods</option>
          </select>
        </div>
      </div>

      <div className="dashboard-columns">

        {/* Recent Operations */}
        <div className="dashboard-card">
          <div className="card-header">
            <h2>Recent Operations</h2>
            <span>View All</span>
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
                    <td>{operation.reference}</td>
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
            <h2>Stock Alerts</h2>
            <span>View All</span>
          </div>

          <div className="alerts-list">
            {stockAlerts.map((alert) => (
              <div className="stock-alert" key={alert.sku}>
                <div>
                  <strong>{alert.product}</strong>
                  <small>{alert.sku}</small>
                </div>

                <div className="stock-alert-right">
                  <strong>{alert.stock}</strong>
                  <small>Reorder: {alert.reorder}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Quick Actions */}
      <div className="dashboard-card">
        <h2>Quick Actions</h2>

        <div className="quick-actions">
          <button>📥 New Receipt</button>
          <button>📤 New Delivery</button>
          <button>🔄 New Transfer</button>
          <button>📝 Stock Adjustment</button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;