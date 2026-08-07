import { useState } from "react";
import { useTranslation } from "react-i18next";

function Sidebar({ setPage }) {
  const { t } = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
 

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.reload();
};

  const menu = {
    width: "100%",
    padding: "15px",
    marginBottom: "12px",
    border: "none",
    borderRadius: "15px",
    background: "rgba(255,255,255,0.12)",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "left",
    transition: "0.3s",
    backdropFilter: "blur(10px)",
  };

  return (
    <div
      style={{
        width: "260px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        background:
          "linear-gradient(180deg,#1b5e20,#2e7d32,#4caf50)",
        color: "white",
        padding: "25px",
        overflowY: "auto",
        boxShadow: "5px 0 25px rgba(58, 43, 43, 0.3)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <h1>🌱</h1>

        <h2 style={{ margin: 0 }}>
          AgriAI
        </h2>

        <p style={{ opacity: 0.8 }}>
          {t("smart")}
        </p>
      </div>

       



      {/* Menu */}
      <button
        style={menu}
        onClick={() => setPage("dashboard")}
      >
        🏠 {t("dashboard")}
      </button>

      <button
        style={menu}
        onClick={() => setPage("crop")}
      >
        🌾 {t("crop")}
      </button>

      <button
        style={menu}
        onClick={() => setPage("disease")}
      >
        📷 {t("disease")}
      </button>

      <button
        style={menu}
        onClick={() => setPage("weather")}
      >
        🌦 {t("weather")}
      </button>

      <button
        style={menu}
        onClick={() => setPage("market")}
      >
        📈 {t("market")}
      </button>

      

      <button
        style={menu}
        onClick={() => setPage("schemes")}
      >
        🏛 {t("schemes")}
      </button>
 <button
  style={menu}
  onClick={() => setPage("machines")}
>
  🚜 {t("machines")}
</button>
<button
  style={menu}
  onClick={() => setPage("myMachines")}
>
  👨 {t("myMachines")}
</button>
     <button
  style={menu}
  onClick={() => setPage("chat")}
>
  🤖 {t("chatbot")}
</button>

      <button
        style={menu}
        onClick={() => setPage("alerts")}
      >
        🔔 {t("notifications")}
      </button>

    <div
  style={{
    padding: "18px",
    background: "rgba(255,255,255,0.12)",
    borderRadius: "15px",
    textAlign: "center",
    marginTop: "20px",
    marginBottom: "12px",
    backdropFilter: "blur(10px)",
  }}
>

  <p
    style={{
      fontSize: "14px",
      lineHeight: "1.6",
      fontStyle: "italic",
      color: "#fff",
      margin: 0,
    }}
  >
    {t("quote")}
  </p>
</div>
   <button
  onClick={handleLogout}
  style={{
    width: "100%",
    padding: "15px",
    marginTop: "20px",
    border: "none",
    borderRadius: "15px",
    background: "#9c4034",
    color: "white",
    fontSize: "16px",
    cursor: "pointer",
    fontWeight: "bold",
  }}
>
  🚪 Logout
</button>
    </div>
  );
}

export default Sidebar;