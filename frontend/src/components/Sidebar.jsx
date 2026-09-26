import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

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

        <button
          className="sidebar-logout"
          onClick={handleLogout}
        >
          🚪 Logout
        </button>
      </nav>
    </aside>
  );
}

export default Sidebar;