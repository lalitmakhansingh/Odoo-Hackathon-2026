import { Link } from "react-router-dom";

function ForgotPassword() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("OTP requested");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>StockSense</h1>
        <p>Reset your password</p>

        <h2>Forgot Password?</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <button type="submit">Send OTP</button>
        </form>

        <p>
          Remember your password?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;