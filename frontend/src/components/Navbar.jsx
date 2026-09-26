import { useEffect, useState } from "react";

function Navbar() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Failed to load user:", error);
      }
    }
  }, []);

  return (
    <header className="navbar">
      <div className="navbar-logo">
        StockSense
      </div>

      <div className="navbar-right">
        <span className="navbar-notification">
          🔔
        </span>

        <span className="navbar-user">
          {user?.name || "User"}
        </span>
      </div>
    </header>
  );
}

export default Navbar;