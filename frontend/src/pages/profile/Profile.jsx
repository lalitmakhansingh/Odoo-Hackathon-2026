import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();

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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="profile-page">

      <div className="profile-header">
        <div>
          <h1>My Profile</h1>

          <p>
            View your account information
          </p>
        </div>

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="profile-card">

        <div className="profile-avatar">
          {user?.name
            ?.charAt(0)
            ?.toUpperCase() || "U"}
        </div>

        <div className="profile-info">

          <div className="profile-field">
            <span>Name</span>

            <strong>
              {user?.name || "Not available"}
            </strong>
          </div>

          <div className="profile-field">
            <span>Email</span>

            <strong>
              {user?.email || "Not available"}
            </strong>
          </div>

          <div className="profile-field">
            <span>Role</span>

            <strong>
              {user?.role || "Not available"}
            </strong>
          </div>

        </div>
      </div>

    </div>
  );
}

export default Profile;