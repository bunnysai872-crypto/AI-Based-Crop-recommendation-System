import { useState } from "react";
import { useTranslation } from "react-i18next";

function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);

  const detectDisease = async () => {
  if (!image) {
    alert("Please upload a leaf image first.");
    return;
  }

  const formData = new FormData();
  formData.append("image", image);

  try {
    const response = await fetch("http://127.0.0.1:5000/detect-disease", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      setResult(data);
    } else {
      alert(data.message);
    }
  } catch (error) {
    alert("Server Error");
    console.error(error);
  }
};

  return (
    <div
      style={{
        background: "white",
        padding: "30px",
        borderRadius: "20px",
        boxShadow:
          "0 5px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2>📷 Disease Detection</h2>

      <input
        type="file"
        onChange={(e) =>
          setImage(e.target.files[0])
        }
        style={{
          marginTop: "20px",
        }}
      />

      <button
        onClick={detectDisease}
        style={{
          width: "100%",
          marginTop: "20px",
          padding: "12px",
          background: "#2e7d32",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
        }}
      >
        Detect Disease
      </button>

      {result && (
        <div
          style={{
            marginTop: "30px",
            background: "#f1f8e9",
            padding: "25px",
            borderRadius: "15px",
          }}
        >
          <h2>
            🦠 Disease:
            {" "}
            {result.disease}
          </h2>

          <h3>
            🎯 Confidence:
            {" "}
            {result.confidence}
          </h3>

          <p>
            💊 Medicine:
            {" "}
            <b>
              {result.medicine}
            </b>
          </p>

          <p>
            🧪 Dosage:
            {" "}
            {result.dosage}
          </p>

          <p>
            🌱 Prevention:
            {" "}
            {result.prevention}
          </p>

          <button
            style={{
              marginTop: "15px",
              background: "#1976d2",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "10px",
            }}
          >
            📄 Download Report
          </button>
        </div>
      )}
    </div>
  );
}

export default DiseaseDetection;