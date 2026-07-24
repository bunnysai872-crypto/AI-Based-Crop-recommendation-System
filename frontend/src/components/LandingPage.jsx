import React from "react";
import background from "../assets/background.jpg";


function LandingPage({ onStart }) {
  return (
    <div
  style={{
    minHeight: "100vh",
    backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), url(${background})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "white",
    padding: "30px",
  }}
>
      <div
        style={{
          textAlign: "center",
          maxWidth: "900px",
        }}
      >
        <h1
          style={{
            fontSize: "65px",
            fontWeight: "bold",
            marginBottom: "20px",
          }}
        >
          🌾 AI Smart Agriculture
        </h1>

        <h2
          style={{
            fontWeight: "400",
            marginBottom: "30px",
          }}
        >
          Smart Farming Powered by Artificial Intelligence
        </h2>

        <button
          onClick={onStart}
          style={{
            padding: "16px 45px",
            fontSize: "20px",
            border: "none",
            borderRadius: "12px",
            background: "#4CAF50",
            color: "white",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          🚀 Get Started
        </button>

        <div
          style={{
            marginTop: "70px",
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "25px",
          }}
        >
          <Feature icon="🌾" title="Crop Recommendation" />
          <Feature icon="🍃" title="Disease Detection" />
          <Feature icon="🌦️" title="Weather Forecast" />
          <Feature icon="🤖" title="AI Assistant" />
        </div>
      </div>
    </div>
  );
}

function Feature({ icon, title }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,.15)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        padding: "25px",
      }}
    >
      <div
        style={{
          fontSize: "50px",
        }}
      >
        {icon}
      </div>

      <h3>{title}</h3>
    </div>
  );
}

export default LandingPage;