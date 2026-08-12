import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import farmBg from "../assets/farm-bg.jpg";

function Login({ onLogin, onRegister }) {
  const { t, i18n } = useTranslation();

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

    const sendOtp = () => {
    if (phone.length >= 10) {
      alert("OTP Sent Successfully");
      setOtpSent(true);

      // Backend API Call
      // fetch("http://localhost:5000/send-otp")
    } else {
      alert("Enter Valid Phone Number");
    }
  };

  const verifyOtp = () => {
    const account = JSON.parse(localStorage.getItem("agri_user") || "null");
    if (!account || account.phone !== phone.replace(/\s|-/g, "") || account.name.trim().toLowerCase() !== name.trim().toLowerCase() || account.password !== password) {
      alert("Use the registered name, phone number, and password, or create an account first.");
      return;
    }
    if (otp.length === 6) {
      onLogin(phone);

      // Backend API Verification
      // fetch("http://localhost:5000/verify-otp")
    } else {
      alert("Enter Valid OTP");
    }
  };

     return (
  <div
    style={{
      minHeight: "100vh",
      backgroundImage: `url(${farmBg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      backgroundRepeat: "no-repeat",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
    }}
  >
    {/* Overlay */}
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.45)",
      }}
    />

    {/* Login Card */}
    <div
      style={{
        position: "relative",
        width: "400px",
        background: "rgba(255,255,255,0.95)",
        padding: "40px",
        borderRadius: "20px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Language Selector */}
      <div style={{ textAlign: "right" }}>
        <select
          value={i18n.language}
          onChange={(e) => i18n.changeLanguage(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "8px",
          }}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="te">Telugu</option>
          <option value="ta">Tamil</option>
        </select>
      </div>

      <div
        style={{
          textAlign: "center",
          marginBottom: "20px",
        }}
      >
        <FaUserCircle size={80} color="#2e7d32" />
      </div>

      <h1
        style={{
          textAlign: "center",
          color: "#2e7d32",
          marginTop: "10px",
        }}
      >
        🌱 {t("title")}
      </h1>

      <h3
        style={{
          textAlign: "center",
          color: "#444",
          marginBottom: "5px",
        }}
      >
        Welcome Back 👋
      </h3>

      <p
        style={{
          textAlign: "center",
          color: "#666",
          marginBottom: "25px",
        }}
      >
        Login Using OTP
      </p>

      <input
        type="text"
        placeholder="Registered Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={inputStyle}
      />

      <input
        type="tel"
        placeholder="Enter Phone Number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={inputStyle}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={inputStyle}
      />

      {otpSent && (
        <input
          type="text"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={inputStyle}
        />
      )}

      {!otpSent ? (
        <button
          onClick={sendOtp}
          style={buttonStyle}
        >
          Get OTP
        </button>
      ) : (
        <button
          onClick={verifyOtp}
          style={buttonStyle}
        >
          Verify OTP
        </button>
      )}

      <button
        onClick={onRegister}
        style={{
          width: "100%",
          padding: "14px",
          marginTop: "15px",
          background: "transparent",
          border: "2px solid #2e7d32",
          borderRadius: "12px",
          color: "#2e7d32",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Create New Account
      </button>
    </div>
  </div>
);
}
const inputStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
  fontSize: "16px",
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "25px",
  background:
    "linear-gradient(90deg,#2e7d32,#66bb6a)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  cursor: "pointer",
  fontSize: "17px",
  fontWeight: "bold",
};

export default Login;
