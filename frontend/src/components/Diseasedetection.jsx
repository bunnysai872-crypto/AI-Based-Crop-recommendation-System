import { useState } from "react";

function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const detectDisease = async () => {
    if (!selectedImage) {
      alert("Please upload a leaf image");
      return;
    }

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:5000/detect-disease",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      console.log("BACKEND RESPONSE:", data);

      setResult(data);

    } catch (error) {
      console.log(error);
      alert("Backend server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>🌿 AI Plant Disease Detection</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleImage}
      />

      {preview && (
        <div>
          <h3>Uploaded Image</h3>

          <img
            src={preview}
            alt="leaf"
            width="250"
          />
        </div>
      )}

      <br />

      <button
        style={{
          width: "100%",
          background: "blue",
          color: "white",
          padding: "14px",
          border: "none",
          borderRadius: "8px"
        }}
        onClick={detectDisease}
      >
        {loading ? "Analyzing..." : "Detect Disease"}
      </button>

      {result && (
  <div
    style={{
      marginTop: "20px",
      padding: "20px",
      border: "1px solid #ccc",
      borderRadius: "10px",
      whiteSpace: "pre-wrap"
    }}
  >
    <h2>🌿 Gemini Disease Analysis</h2>

    {result.analysis || result.message}
  </div>
)}
    </div>
  );
}

export default DiseaseDetection;