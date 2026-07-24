import { useState } from "react";
import { useTranslation } from "react-i18next";
import RegisterMachine from "./RegisterMachine";
import RentMachine from "./RentMachine";


function FarmMachines() {
  const { t } = useTranslation();

  const [tab, setTab] = useState("rent");

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>
        🚜 {t("farmMachines")}
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={() => {
  console.log("Rent button clicked");
  setTab("rent");
}}
          style={{
            padding: "12px 25px",
            borderRadius: "10px",
            border: "none",
            background: "#2e7d32",
            color: "white",
            cursor: "pointer",
          }}
        >
          🚜 {t("rentMachine")}
        </button>

        <button
          onClick={() => setTab("register")}
          style={{
            padding: "12px 25px",
            borderRadius: "10px",
            border: "none",
            background: "#1565c0",
            color: "white",
            cursor: "pointer",
          }}
        >
          📝 {t("registerMachine")}
        </button>
      </div>

      {tab === "rent" ? (
        <RentMachine />
      ) : (
        <RegisterMachine />
      )}
    </div>
  );
}

export default FarmMachines;