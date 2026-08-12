import { useState } from "react";
import { useTranslation } from "react-i18next";
import farmBg from "../assets/farm-bg.jpg";

function Register({ onBack, onRegistered }) {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const register = () => {
    if (!name || !email || !phone || !password) {
      alert("Please fill all fields");
      return;
    }

    if (!/^\d{10}$/.test(phone.replace(/\s|-/g, ""))) {
      alert("Enter a valid 10-digit phone number");
      return;
    }
    localStorage.setItem("agri_user", JSON.stringify({ name, email, phone: phone.replace(/\s|-/g, ""), password, weatherAlerts: true }));
    alert("Registration successful. Use this registered phone number to log in and receive in-app weather alerts.");
    onRegistered?.();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${farmBg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: "420px",
          background: "rgba(255,255,255,0.95)",
          padding: "35px",
          borderRadius: "20px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            color: "#2e7d32",
            marginBottom: "20px",
          }}
        >
          🌱 Create Account
        </h1>

        <input
          type="text"
         placeholder={t("fullName")}
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="tel"
          placeholder={t("Phone Number")}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder={t("password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        <button
          onClick={register}
          style={buttonStyle}
        >
          Register
        </button>

        <button
          onClick={onBack}
          style={{
            ...buttonStyle,
            background: "#777",
            marginTop: "10px",
          }}
        >
          Back to Login
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
};

const buttonStyle = {
  width: "100%",
  padding: "15px",
  marginTop: "20px",
  border: "none",
  borderRadius: "10px",
  background: "#2e7d32",
  color: "white",
  fontSize: "16px",
  cursor: "pointer",
};

export default Register;
