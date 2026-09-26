import { Link } from "react-router-dom";

function VerifyOTP() {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("OTP verified");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>StockSense</h1>

        <h2>Verify OTP</h2>

        <p>Enter the OTP sent to your email.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>OTP</label>
            <input
              type="text"
              placeholder="Enter OTP"
              maxLength="6"
              required
            />
          </div>

          <button type="submit">Verify OTP</button>
        </form>

        <p>
          <Link to="/forgot-password">Back</Link>
        </p>
      </div>
    </div>
  );
}

export default VerifyOTP;