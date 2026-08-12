import { useState } from "react";

const API = "http://127.0.0.1:5000";

function DiseaseDetection() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState(null);
  const [care, setCare] = useState(null);
  const [loading, setLoading] = useState(false);
  const [acres, setAcres] = useState(1);

  const handleImage = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setCare(null);
  };

  const loadCare = async (crop) => {
    if (!crop) return;
    const response = await fetch(`${API}/crop-care`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ crop, acres: Number(acres) || 1 }),
    });
    setCare(await response.json());
  };

  const detectDisease = async () => {
    if (!selectedImage) return alert("Please upload a clear leaf image.");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
      const response = await fetch(`${API}/detect-disease`, { method: "POST", body: formData });
      const data = await response.json();
      setResult(data);
      if (data.success && data.crop) await loadCare(data.crop);
    } catch {
      alert("Unable to reach the disease-analysis service.");
    } finally { setLoading(false); }
  };

  const card = { background: "#f6fbf6", border: "1px solid #d7ead7", borderRadius: 12, padding: 16, marginTop: 16 };
  return <div>
    <h2>🌿 Crop Disease Detection & Advisory</h2>
    <p>Upload one well-lit leaf image. Recommendations are advisory—confirm severe disease with a local agricultural officer.</p>
    <input type="file" accept="image/*" onChange={handleImage} />
    {preview && <img src={preview} alt="Selected crop leaf" style={{ display: "block", width: 260, maxWidth: "100%", borderRadius: 10, marginTop: 14 }} />}
    <label style={{ display: "block", marginTop: 14 }}>Farm area (acres)
      <input type="number" min="0.1" step="0.1" value={acres} onChange={(e) => setAcres(e.target.value)} style={{ marginLeft: 10, padding: 8, width: 90 }} />
    </label>
    <button onClick={detectDisease} disabled={loading} style={{ width: "100%", marginTop: 16, padding: 14, border: 0, borderRadius: 8, background: "#1976d2", color: "white", cursor: "pointer" }}>
      {loading ? "Analyzing crop…" : "Detect disease and show advisory"}
    </button>

    {result && !result.success && <section style={{ ...card, borderColor: "#e5a3a3", background: "#fff7f7" }}><h3>Image could not be analysed</h3><p>{result.message}</p></section>}
    {result?.success && <>
      <section style={card}>
        <h3>Image detection result</h3>
        <p><b>Detected crop:</b> {result.crop}</p>
        <p><b>Detected disease:</b> {result.disease}</p>
        {Number.isFinite(Number(result.confidence)) && <p><b>Model confidence:</b> {result.confidence}%</p>}
        <p><b>Suggested action:</b> {result.treatment}</p>
        {result.precautions?.length > 0 && <><b>Precautions:</b><ul>{result.precautions.map((item) => <li key={item}>{item}</li>)}</ul></>}
      </section>
      {result.insights && <section style={card}>
        <h3>Common disease pattern for {result.crop}</h3>
        <p><b>Common diseases:</b> {result.insights.diseases.join(" • ")}</p>
        <p><b>Common areas:</b> {result.insights.areas.join(", ")}</p>
        <p><b>Typical period:</b> {result.insights.period}</p>
      </section>}
    </>}
    {care?.success && <section style={card}>
      <h3>Fertilizer & pesticide recommendation</h3>
      <p><b>{care.fertilizer.product}</b> — {care.fertilizer.quantity_kg} kg total ({care.fertilizer.rate_kg_per_acre} kg/acre)</p>
      <p><b>Soil-nutrient match:</b> {care.fertilizer.nutrient_match_percent}%</p>
      <p><b>Crop protection:</b> {care.pesticide.recommendation}</p>
      <small>{care.pesticide.safety}</small>
    </section>}
  </div>;
}

export default DiseaseDetection;
