import { useTranslation } from "react-i18next";

function Sidebar({ setPage }) {
  const { t } = useTranslation();

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

      {/* Profile */}
      <div
        style={{
          background: "rgba(255,255,255,0.1)",
          padding: "20px",
          borderRadius: "20px",
          textAlign: "center",
          marginBottom: "25px",
        }}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/512/4140/4140048.png"
          alt=""
          style={{
            width: "70px",
            height: "70px",
            borderRadius: "50%",
          }}
        />

        <h3>👨‍🌾 {t("farmer")}</h3>
        <p>{t("welcome")}</p>
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
  👨 My Machines
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

      {/* Footer */}
      <div
        style={{
          marginTop: "40px",
          padding: "15px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "15px",
          textAlign: "center",
        }}
      >
        <h4>{t("title")}</h4>
        <p>{t("version")}</p>
      </div>
    </div>
  );
}

export default Sidebar;