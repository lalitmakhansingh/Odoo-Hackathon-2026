import { useState } from "react";
import "./login.css";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    /*
     * =====================================================
     * TEMPORARY DEMO LOGIN
     * REMOVE THIS BLOCK BEFORE FINAL SUBMISSION.
     * =====================================================
     */
    if (
      formData.email === "demo@stocksense.com" &&
      formData.password === "demo123"
    ) {
      localStorage.setItem(
        "token",
        "demo-token-remove-before-final"
      );

      localStorage.setItem(
        "user",
        JSON.stringify({
          id: 999,
          name: "Demo User",
          email: "demo@stocksense.com",
          role: "INVENTORY_MANAGER",
        })
      );

      navigate("/dashboard");
      setLoading(false);
      return;
    }

    /*
     * =====================================================
     * REAL BACKEND LOGIN
     * =====================================================
     */
    try {
      const response = await authService.login(formData);

      console.log("Login response:", response.data);

      const token = response.data?.data?.token;
      const user = response.data?.data?.user;

      if (!token) {
        throw new Error("Token not received from server");
      }

      localStorage.setItem("token", token);

      if (user) {
        localStorage.setItem(
          "user",
          JSON.stringify(user)
        );
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      {/* Mountain background */}
      <img
        className="login-background-image"
        src="/login-background.jpg"
        alt=""
      />

      {/* Dark overlay */}
      <div className="login-background-overlay"></div>

      <div className="auth-card">
        <h1>StockSense</h1>

        <p>Inventory Management System</p>

        <h2>Login</h2>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>
          <Link to="/forgot-password">
            Forgot Password?
          </Link>
        </p>

        <p>
          Don't have an account?{" "}
          <Link to="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;