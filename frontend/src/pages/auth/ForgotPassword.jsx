import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authService.sendOTP({
        email,
      });

      console.log("Send OTP response:", response.data);

      setSuccess(
        response.data?.message ||
        "OTP sent successfully."
      );

      sessionStorage.setItem(
        "resetEmail",
        email
      );

      setTimeout(() => {
        navigate("/verify-otp");
      }, 1000);

    } catch (err) {
      console.error("Send OTP error:", err);

      setError(
        err.response?.data?.message ||
        err.message ||
        "Unable to send OTP."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        <h1>StockSense</h1>

        <p>
          Inventory Management System
        </p>

        <h2>Forgot Password</h2>

        {error && (
          <div className="auth-error">
            {error}
          </div>
        )}

        {success && (
          <div className="auth-success">
            {success}
          </div>
        )}

        <p>
          Enter your email address and we will
          send you an OTP.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Sending OTP..."
              : "Send OTP"}
          </button>

        </form>

        <p>
          <Link to="/login">
            Back to Login
          </Link>
        </p>

      </div>

    </div>
  );
}

export default ForgotPassword;