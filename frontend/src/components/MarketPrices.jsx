import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { translateText } from "../utils/translate";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function MarketPrices() {
  const { t, i18n } = useTranslation();

  const [prices, setPrices] = useState([]);
const [selectedState, setSelectedState] = useState("");
const [selectedCrop, setSelectedCrop] = useState("");

 const [translatedStates, setTranslatedStates] = useState([]);
  const [translatedCrops, setTranslatedCrops] = useState([]);

  useEffect(() => {
  async function translateOptions() {
    if (i18n.language === "en") {
      setTranslatedStates(states);
      setTranslatedCrops(crops);
      return;
    }

    const stateNames = await Promise.all(
      states.map((s) => translateText(s, i18n.language))
    );

    const cropNames = await Promise.all(
      crops.map((c) => translateText(c, i18n.language))
    );

    setTranslatedStates(stateNames);
    setTranslatedCrops(cropNames);
  }

  translateOptions();
}, [i18n.language]);
const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  background: "#ff9800",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

const tableStyle = {
  width: "100%",
  marginTop: "20px",
  borderCollapse: "collapse",
};

const thStyle = {
  background: "#4CAF50",
  color: "white",
  padding: "15px",
};

const tdStyle = {
  border: "1px solid #ddd",
  padding: "12px",
  textAlign: "center",
};


  console.log("Prices State:", prices);

 const getPrices = async () => {
  console.log("Button clicked");

  try {
    const response = await fetch(
      `http://127.0.0.1:5000/market-prices?state=${encodeURIComponent(selectedState)}&crop=${encodeURIComponent(selectedCrop)}`
    );

    const data = await response.json();

    console.log(data);

    if (!data.success) {
      alert(data.message);
      return;
    }

    // English → no translation
    if (i18n.language === "en") {
      setPrices(data.prices);
      return;
    }

    // Automatically translate every row
    const translatedPrices = await Promise.all(
      data.prices.map(async (item) => ({
        ...item,
        crop: await translateText(item.crop, i18n.language),
        market: await translateText(item.market, i18n.language),
        district: await translateText(item.district, i18n.language),
        state: await translateText(item.state, i18n.language),
      }))
    );

    setPrices(translatedPrices);

  } catch (err) {
  console.error(err);

  if (err.response) {
    console.log(err.response.data);
  }

  alert(err.message);
}
};

  const chartData = {
    labels: prices.map((item) => item.crop),

    datasets: [
      {
        label:
          i18n.language === "te"
            ? "ధరలు"
            : i18n.language === "hi"
            ? "मूल्य"
            : i18n.language === "ta"
            ? "விலை"
            : "Prices",

       data: prices.map((item)=>item.modal_price),

        backgroundColor: [
          "#4CAF50",
          "#2196F3",
          "#FF9800",
          "#9C27B0",
          "#E91E63",
        ],
      },
    ],
  };

  return (
    <div>
      <h2>💹 {t("market")}</h2>
<div style={{ marginTop: "20px" }}>

<select
    value={selectedState}
    onChange={(e) => setSelectedState(e.target.value)}

style={{
width:"100%",
padding:"10px",
marginBottom:"15px"
}}
>

<option value="">{t("selectState")}</option>

{translatedStates.map((state, index) => (
  <option key={index} value={states[index]}>
    {state}
  </option>
))}

<option>Andhra Pradesh</option>
<option>Arunachal Pradesh</option>
<option>Assam</option>
<option>Bihar</option>
<option>Chhattisgarh</option>
<option>Goa</option>
<option>Gujarat</option>
<option>Haryana</option>
<option>Himachal Pradesh</option>
<option>Jharkhand</option>
<option>Karnataka</option>
<option>Keralam</option>
<option>Madhya Pradesh</option>
<option>Maharashtra</option>
<option>Odisha</option>
<option>Punjab</option>
<option>Rajasthan</option>
<option>Tamil Nadu</option>
<option>Telangana</option>
<option>Uttar Pradesh</option>
<option>West Bengal</option>

</select>


<select
value={selectedCrop}
onChange={(e)=>setSelectedCrop(e.target.value)}
style={{
width:"100%",
padding:"10px",
marginBottom:"15px"
}}
>


<option value="">{t("selectCrop")}</option>

{translatedCrops.map((crop, index) => (
  <option key={index} value={crops[index]}>
    {crop}
  </option>
))}

<option value="">Select Crop</option>
<option value="Rice">Rice</option>
<option value="Wheat">Wheat</option>
<option value="Maize">Maize</option>
<option value="Jowar">Jowar</option>
<option value="Bajra">Bajra</option>
<option value="Ragi">Ragi</option>
<option value="Barley">Barley</option>
<option value="Gram">Gram</option>
<option value="Banana">Banana</option>
<option value="Green Gram">Green Gram</option>
<option value="Black Gram">Black Gram</option>
<option value="Red Gram">Red Gram</option>
<option value="Lentil">Lentil</option>
<option value="Groundnut">Groundnut</option>
<option value="Soyabean">Soyabean</option>
<option value="Mustard">Mustard</option>
<option value="Sesamum">Sesamum</option>
<option value="Sunflower">Sunflower</option>
<option value="Cotton">Cotton</option>
<option value="Sugarcane">Sugarcane</option>
<option value="Potato">Potato</option>
<option value="Onion">Onion</option>
<option value="Tomato">Tomato</option>
<option value="Brinjal">Brinjal</option>
<option value="Cabbage">Cabbage</option>
<option value="Cauliflower">Cauliflower</option>
<option value="Carrot">Carrot</option>
<option value="Beans">Beans</option>
<option value="Peas">Peas</option>
<option value="Cucumber">Cucumber</option>
<option value="Bottle gourd">Bottle gourd</option>
<option value="Bitter gourd">Bitter gourd</option>
<option value="Ashgourd">Ashgourd</option>
<option value="Pumpkin">Pumpkin</option>
<option value="Ladies Finger">Ladies Finger</option>
<option value="Chilli">Chilli</option>
<option value="Capsicum">Capsicum</option>
<option value="Garlic">Garlic</option>
<option value="Ginger(Green)">Ginger(Green)</option>
<option value="Turmeric">Turmeric</option>
<option value="Banana">Banana</option>
<option value="Mango">Mango</option>
<option value="Apple">Apple</option>
<option value="Orange">Orange</option>
<option value="Papaya">Papaya</option>
<option value="Pomegranate">Pomegranate</option>
<option value="Grapes">Grapes</option>
<option value="Guava">Guava</option>
<option value="Pineapple">Pineapple</option>
<option value="Coconut">Coconut</option>
<option value="Lemon">Lemon</option>
<option value="Watermelon">Watermelon</option>
<option value="Muskmelon">Muskmelon</option>
<option value="Arecanut">Arecanut</option>
<option value="Cashewnuts">Cashewnuts</option>
<option value="Coffee">Coffee</option>
<option value="Tea">Tea</option>
<option value="Tobacco">Tobacco</option>
<option value="Coriander">Coriander</option>
<option value="Cumin">Cumin</option>
<option value="Fenugreek">Fenugreek</option>
<option value="Black Pepper">Black Pepper</option>
<option value="Cardamom">Cardamom</option>

</select>

</div>
      <button
        onClick={getPrices}
        style={buttonStyle}
      >
        {i18n.language === "te"
          ? "మార్కెట్ ధరలు చూడండి"
          : i18n.language === "hi"
          ? "बाजार मूल्य देखें"
          : i18n.language === "ta"
          ? "சந்தை விலைகளை பார்க்கவும்"
          : "Get Market Prices"}
      </button>
<h3>
{t("totalRecords")}: {prices.length}
</h3>
      {prices.length > 0 && (
        <>
          {/* Table */}
          <table style={tableStyle}>
          <thead>
<tr>
<th style={thStyle}>{t("crop")}</th>
<th style={thStyle}>{t("market")}</th>
<th style={thStyle}>{t("district")}</th>
<th style={thStyle}>{t("state")}</th>
<th style={thStyle}>{t("minPrice")}</th>
<th style={thStyle}>{t("maxPrice")}</th>
<th style={thStyle}>{t("modalPrice")}</th>
</tr>
</thead>

         <tbody>
  {prices.map((item, index) => (
    <tr key={index}>
      <td style={tdStyle}>
        {item.crop}
      </td>

      <td style={tdStyle}>
        {item.market}
      </td>

      <td style={tdStyle}>
        {item.district}
      </td>

      <td style={tdStyle}>
        {item.state}
      </td>

      <td style={tdStyle}>
        ₹{item.min_price}
      </td>

      <td style={tdStyle}>
        ₹{item.max_price}
      </td>

      <td style={tdStyle}>
        ₹{item.modal_price}
      </td>
    </tr>
  ))}
</tbody>
          </table>

          {/* Chart */}
          <div
            style={{
              marginTop: "40px",
              background: "white",
              padding: "20px",
              borderRadius: "15px",
              boxShadow:
                "0 5px 15px rgba(0,0,0,0.1)",
            }}
          >
            <h3>
              📊{" "}
              {i18n.language === "te"
                ? "మార్కెట్ విశ్లేషణ"
                : i18n.language === "hi"
                ? "बाजार विश्लेषण"
                : i18n.language === "ta"
                ? "சந்தை பகுப்பாய்வு"
                : "Market Analysis"}
            </h3>

            <Bar data={chartData} />
          </div>
        </>
      )}
    </div>
  );
}
const states = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Tamil Nadu",
  "Telangana",
  "Uttar Pradesh",
  "West Bengal"
];

const crops = [
  "Rice",
  "Wheat",
  "Maize",
  "Jowar",
  "Bajra",
  "Ragi",
  "Barley",
  "Gram",
  "Banana",
  "Green Gram",
  "Black Gram",
  "Red Gram",
  "Lentil",
  "Groundnut",
  "Soyabean",
  "Mustard",
  "Sesamum",
  "Sunflower",
  "Cotton",
  "Sugarcane",
  "Potato",
  "Onion",
  "Tomato",
  "Brinjal",
  "Cabbage",
  "Cauliflower",
  "Carrot",
  "Beans",
  "Peas",
  "Cucumber",
  "Bottle gourd",
  "Bitter gourd",
  "Ashgourd",
  "Pumpkin",
  "Ladies Finger",
  "Chilli",
  "Capsicum",
  "Garlic",
  "Turmeric",
  "Mango",
  "Apple",
  "Orange",
  "Papaya",
  "Pomegranate",
  "Grapes",
  "Guava",
  "Pineapple",
  "Coconut",
  "Lemon",
  "Watermelon",
  "Muskmelon",
  "Arecanut",
  "Cashewnuts",
  "Coffee",
  "Tea",
  "Tobacco",
  "Coriander",
  "Cumin",
  "Fenugreek",
  "Black Pepper",
  "Cardamom"
];

export default MarketPrices;