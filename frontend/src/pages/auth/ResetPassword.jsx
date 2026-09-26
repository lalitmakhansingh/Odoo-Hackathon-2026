import { Link } from "react-router-dom";

function ResetPassword() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>StockSense</h1>

        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              required
            />
          </div>

          <button type="submit">Reset Password</button>
        </form>

        <p>
          <Link to="/login">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;