import { useState } from "react";

function getSavedUser() {
  const savedUser = localStorage.getItem("user");

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch (error) {
    console.error("Failed to load user:", error);
    return null;
  }
}

function Navbar() {
  const [user] = useState(getSavedUser);

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