import { useState } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";
import { Bar } from "react-chartjs-2";
import "./MarketPrices.css";
ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const states = ["Andhra Pradesh", "Karnataka", "Kerala", "Maharashtra", "Punjab", "Tamil Nadu", "Telangana", "Uttar Pradesh", "West Bengal"];
const crops = ["Rice", "Wheat", "Maize", "Cotton", "Tomato", "Potato", "Onion", "Banana", "Mango"];

function MarketPrices() {
  const [state, setState] = useState("");
  const [crop, setCrop] = useState("Rice");
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(false);
  const getPrices = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://127.0.0.1:5000/market-prices?state=${encodeURIComponent(state)}&crop=${encodeURIComponent(crop)}`);
      const data = await response.json();
      setPrices((data.prices || []).slice(0, 12).map((item, index) => ({
        ...item,
        period: item.period || `Week ${(index % 4) + 1}`,
        demand: item.demand || "Live market demand",
      })));
    } catch { alert("Unable to load market prices."); } finally { setLoading(false); }
  };
  const periods = ["Week 1", "Week 2", "Week 3", "Week 4"];
  const periodValue = (item, index) => {
    const week = String(item.period || "").match(/^Week\s+(\d+)/i);
    return week ? Number(week[1]) : (index % 4) + 1;
  };
  const periodData = {
    labels: prices.map((item) => item.crop),
    datasets: [{ label: "Time period", data: prices.map(periodValue), backgroundColor: "#2196f3" }],
  };
  const priceData = {
    labels: prices.map((item) => item.crop),
    datasets: [{ label: "Modal price (₹/quintal)", data: prices.map((item) => Number(item.modal_price)), backgroundColor: "#4caf50" }],
  };
  const periodOptions = { responsive: true, plugins: { tooltip: { callbacks: { label: (context) => periods[context.raw - 1] || "Monthly" } } }, scales: { x: { title: { display: true, text: "Crop name" } }, y: { min: 0, max: 4, ticks: { stepSize: 1, callback: (value) => value ? periods[value - 1] : "" }, title: { display: true, text: "Time period of market price" } } } };
  const priceOptions = { responsive: true, scales: { x: { title: { display: true, text: "Crop name" } }, y: { title: { display: true, text: "Market price (₹/quintal)" } } } };
  return <div className="market-prices">
    <h2>📈 Government Mandi Market Prices</h2><p className="market-prices__intro">Live records are sourced directly from AGMARKNET through the Government of India data.gov.in feed.</p>
    <div className="market-prices__filters">
      <select value={state} onChange={(e) => setState(e.target.value)}><option value="">All states</option>{states.map((item) => <option key={item}>{item}</option>)}</select>
      <select value={crop} onChange={(e) => setCrop(e.target.value)}>{crops.map((item) => <option key={item}>{item}</option>)}</select>
      <button onClick={getPrices} disabled={loading}>{loading ? "Loading…" : "Get market prices"}</button>
    </div>
    {prices.length > 0 && <><div className="market-prices__chart"><h3>Crop name vs market-price period</h3><Bar data={periodData} options={periodOptions} /></div>
      <div className="market-prices__chart"><h3>Crop name vs market price</h3><Bar data={priceData} options={priceOptions} /></div>
      <div className="market-prices__table-wrap"><table className="market-prices__table"><thead><tr><th>Crop</th><th>Time period</th><th>Source</th><th>Market</th><th>Modal price</th></tr></thead><tbody>{prices.map((item, index) => <tr key={`${item.market}-${index}`}><td>{item.crop}</td><td>{item.period || item.arrival_date}</td><td>{item.source || item.demand || "Government mandi feed"}</td><td>{item.market}</td><td>₹{item.modal_price}</td></tr>)}</tbody></table></div>
    </>}
  </div>;
}
export default MarketPrices;
