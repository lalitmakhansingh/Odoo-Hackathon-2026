import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

function VerifyOTP() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");

  const [email, setEmail] = useState(
    sessionStorage.getItem("resetEmail") || ""
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await authService.verifyOTP({
        email,
        otp,
      });

      console.log(
        "Verify OTP response:",
        response.data
      );

      setSuccess(
        response.data?.message ||
        "OTP verified successfully."
      );

      sessionStorage.setItem(
        "resetOtp",
        otp
      );

      setTimeout(() => {
        navigate("/reset-password");
      }, 1000);

    } catch (err) {
      console.error(
        "Verify OTP error:",
        err
      );

      setError(
        err.response?.data?.message ||
        err.message ||
        "Invalid OTP."
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

        <h2>Verify OTP</h2>

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
          Enter the OTP sent to your email.
        </p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">

            <label>
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              required
            />

          </div>

          <div className="form-group">

            <label>
              OTP
            </label>

            <input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
              placeholder="Enter OTP"
              maxLength={6}
              required
            />

          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading
              ? "Verifying..."
              : "Verify OTP"}
          </button>

        </form>

        <p>
          <Link to="/forgot-password">
            Send OTP again
          </Link>
        </p>

      </div>

    </div>
  );
}

export default VerifyOTP;