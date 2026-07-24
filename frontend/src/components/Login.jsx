import { useState } from "react";
import { FaUserCircle, FaEye, FaEyeSlash } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import farmBg from "../assets/farm-bg.jpg";

function Login({ onLogin, onRegister }) {
  const { t, i18n } = useTranslation();

  const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [showPassword, setShowPassword] = useState(false);

  const login = () => {
    if (email && password) {
      onLogin();
    } else {
      alert("Please enter email and password");
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
  onChange={(e) =>
    i18n.changeLanguage(e.target.value)
  }
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
  <FaUserCircle
    size={80}
    color="#2e7d32"
  />
</div>
        {/* Title */}
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
          {t("login")}
        </p>

        {/* Email */}
        <input
          type="email"
          placeholder={t("email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        {/* Password */}
<div
  style={{
    position: "relative",
    marginTop: "15px",
  }}
>
  <input
    type={showPassword ? "text" : "password"}
    placeholder={t("password")}
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    style={inputStyle}
  />

  <span
    onClick={() => setShowPassword(!showPassword)}
    style={{
      position: "absolute",
      right: "15px",
      top: "18px",
      cursor: "pointer",
      color: "#555",
      fontSize: "18px",
    }}
  >
    {showPassword ? <FaEyeSlash /> : <FaEye />}
  </span>
</div>
         <div
  style={{
    textAlign: "right",
    marginTop: "12px",
    color: "#2e7d32",
    cursor: "pointer",
    fontSize: "14px",
  }}
>
  Forgot Password?
</div>
        {/* Login Button */}
        <button
          onClick={login}
          style={buttonStyle}
        >
          {t("login")}
        </button>
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
  transition: "0.3s",
};
export default Login;