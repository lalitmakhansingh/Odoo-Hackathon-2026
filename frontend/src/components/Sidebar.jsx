import { NavLink } from 'react-router-dom'

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-title">
        StockSense
      </div>

      <nav>

        <NavLink to="/dashboard">
          📊 Dashboard
        </NavLink>

        <NavLink to="/products">
          📦 Products
        </NavLink>

        <div className="sidebar-section">
          Operations
        </div>

        <NavLink to="/operations/receipts">
          └ Receipts
        </NavLink>

        <NavLink to="/operations/deliveries">
          └ Deliveries
        </NavLink>

        <NavLink to="/operations/transfers">
          └ Internal Transfers
        </NavLink>

        <NavLink to="/operations/adjustments">
          └ Adjustments
        </NavLink>

        <NavLink to="/operations/move-history">
          └ Move History
        </NavLink>

        <div className="sidebar-section">
          Settings
        </div>

        <NavLink to="/settings/warehouse">
          🏭 Warehouse
        </NavLink>

        <NavLink to="/profile">
          👤 Profile
        </NavLink>

        <NavLink to="/login">
          🚪 Logout
        </NavLink>

      </nav>
    </aside>
  )
}

export default Sidebar