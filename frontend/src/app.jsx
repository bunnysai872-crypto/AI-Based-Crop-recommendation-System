
import { useState } from "react";
import axios from "axios";
import { jsPDF } from "jspdf";
import { useTranslation } from "react-i18next";
import { translateText } from "./utils/translate";
import FarmMachines from "./components/FarmMachines";
import MyMachines from "./components/MyMachines";




import Sidebar from "./components/Sidebar";
import DiseaseDetection from "./components/DiseaseDetection";
import MarketPrices from "./components/MarketPrices";
import Weather from "./components/Weather";
import VoiceAssistant from "./components/VoiceAssistant";
import GovtSchemes from "./components/GovtSchemes";
import Notifications from "./components/Notifications";
import Chatbot from "./components/Chatbot";
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const { t, i18n } = useTranslation();
  console.log("Current Language:", i18n.language);
  const showMessage = async (text) => {
  if (i18n.language === "en") {
    alert(text);
    return;
  }

  const translated = await translateText(text, i18n.language);
  alert(translated);
};
 const [language, setLanguage] = useState(i18n.language);
  const [loggedIn, setLoggedIn] = useState(() => Boolean(localStorage.getItem("agri_user")));
  const [authMode, setAuthMode] = useState("login");
  const [page, setPage] = useState("crop");

 const [soilType, setSoilType] = useState("");
 const [N, setN] = useState("");
const [P, setP] = useState("");
const [K, setK] = useState("");
const [ph, setPh] = useState("");
const [error, setError] = useState("");
  const [city, setCity] = useState("");
  const [temperature, setTemperature] = useState("");
const [currentLocation, setCurrentLocation] = useState("");
  const [cropInfo, setCropInfo] = useState(null);
  const [showLanding, setShowLanding] = useState(true);

  const [latitude, setLatitude] = useState(null);
const [longitude, setLongitude] = useState(null);
const [locationMode, setLocationMode] = useState("current");
// "current" or "manual"

 if (showLanding) {
  return (
    <LandingPage
      onStart={() => setShowLanding(false)}
    />
  );
}

if (!loggedIn) {
  return authMode === "register" ? (
    <Register onBack={() => setAuthMode("login")} onRegistered={() => setAuthMode("login")} />
  ) : (
    <Login onLogin={() => setLoggedIn(true)} onRegister={() => setAuthMode("register")} />
  );
}


  // Simulated weather API
  const getWeather = async (cityName, lat, lon) => {
  const API_KEY = "f3cdb04b8e4b3c2de7d548df904f5d56";

  let response;

  if (cityName) {
    // Manual city selection
    response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName},IN&units=metric&appid=${API_KEY}`
    );
  } else {
    // Current location
    response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
    );
  }

  return {
    temperature: response.data.main.temp,
    humidity: response.data.main.humidity,
    rainfall:
      response.data.rain?.["1h"] ||
      response.data.rain?.["3h"] ||
      0,
  };
};

   const getCurrentLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (position) => {
     const latitude = position.coords.latitude;
const longitude = position.coords.longitude;

setLatitude(latitude);
setLongitude(longitude);
      console.log("Latitude:", latitude);
      console.log("Longitude:", longitude);

      try {
       const response = await axios.post(
  "http://127.0.0.1:5000/current-location",
  {
    latitude,
    longitude,
    language: i18n.language,
  }
);

console.log(
  "Selected Language:",
  i18n.language
);

console.log(
  "Detected City:",
  response.data.city
);

const cityName = response.data.city;

setCity(cityName);

        
      } catch (error) {
        console.log(error);

        if (error.response) {
          alert(
            JSON.stringify(
              error.response.data
            )
          );
        } else {
          alert(error.message);
        }
      }
    },

    (error) => {
      alert(error.message);
    }
  );
};
const validateInputs = () => {
  if (!N || !P || !K || !ph) {
    alert("Please enter N, P, K and pH values");
    return false;
  }

  if (Number(N) <= 0 || Number(N) > 140) {
    alert("Nitrogen must be between 1 and 140");
    return false;
  }

  if (Number(P) <= 0 || Number(P) > 145) {
    alert("Phosphorus must be between 1 and 145");
    return false;
  }

  if (Number(K) <= 0 || Number(K) > 205) {
    alert("Potassium must be between 1 and 205");
    return false;
  }

  if (Number(ph) < 3.5 || Number(ph) > 10) {
    alert("pH must be between 3.5 and 10");
    return false;
  }

  return true;
};
  const getRecommendation = async () => {
    if (!validateInputs()) {
  return;
}
  try {
    if (!soilType) {
     await showMessage("Please select Soil Type");
      return;
    }
if (
  locationMode === "current" &&
  (latitude === null || longitude === null)
) {
 await showMessage("Please click 'Use Current Location' first.");
  return;
}

if (
  locationMode === "manual" &&
  !city
) {
 await showMessage("Please select a city.");
  return;
}
    // Get live weather
    let weather;
    if (locationMode === "current") {
  weather = await getWeather(null, latitude, longitude);
} else {

  if (city === "Hyderabad") {
    weather = {
      temperature: 32,
      humidity: 55,
      rainfall: 80,
    };
  }

  else if (city === "Bangalore") {
    weather = {
      temperature: 24,
      humidity: 75,
      rainfall: 150,
    };
  }

  else if (city === "Chennai") {
    weather = {
      temperature: 34,
      humidity: 85,
      rainfall: 220,
    };
  }

  else if (city === "Delhi") {
    weather = {
      temperature: 38,
      humidity: 30,
      rainfall: 20,
    };
  }

  else if (city === "Mumbai") {
    weather = {
      temperature: 29,
      humidity: 90,
      rainfall: 300,
    };
  }

  else if (city === "Anantapur") {
    weather = {
      temperature: 37,
      humidity: 25,
      rainfall: 15,
    };
  }

}

console.log("Weather:", weather);



    const temp = weather.temperature;
    const humidity = weather.humidity;
    const rainfall = weather.rainfall;

    setTemperature(temp);

    // Soil values
    const soilValues = {
  "Black Soil": {
    N: 90,
    P: 42,
    K: 43,
    ph: 6.5
  },

  "Red Soil": {
    N: 20,
    P: 20,
    K: 20,
    ph: 5.5
  },

  "Sandy Soil": {
    N: 5,
    P: 5,
    K: 5,
    ph: 4.8
  },

  "Clay Soil": {
    N: 120,
    P: 80,
    K: 80,
    ph: 7.8
  },

  "Loamy Soil": {
    N: 70,
    P: 35,
    K: 35,
    ph: 6.8
  },

  "Laterite Soil": {
    N: 35,
    P: 15,
    K: 15,
    ph: 5.2
  },

  "Alluvial Soil": {
    N: 110,
    P: 55,
    K: 55,
    ph: 7.0
  },

  "Peaty Soil": {
    N: 140,
    P: 90,
    K: 90,
    ph: 4.5
  }
};

    const soil = soilValues[soilType];

    if (!soil) {
      await showMessage("Invalid Soil Type");
      return;
    }
    console.log("Sending to backend:", {
  soilType,
  city,
  N: soil.N,
  P: soil.P,
  K: soil.K,
  temperature: temp,
  humidity,
  ph: soil.ph,
  rainfall,
});
  const response = await axios.post(
  "http://127.0.0.1:5000/predict",
  {
    soiltype: soilType,

    N: Number(N),
    P: Number(P),
    K: Number(K),

    temperature: temp,
    humidity: humidity,

    ph: Number(ph),

    rainfall: rainfall,
  }
);
console.log("PREDICTION RESPONSE:", response.data);
 const predictedCrop =
(
  response.data.recommended_crop ||
  response.data.result
)?.toLowerCase();


if (!predictedCrop) {
  await showMessage("Crop prediction failed");
  return;
}

if (!predictedCrop) {
  await showMessage("Crop prediction failed");
  return;
}

const translatedCrop =
  i18n.language === "en"
    ? predictedCrop
    : await translateText(predictedCrop, i18n.language);

const confidence = response.data.confidence || 90;

const top3 = response.data.top3 || [
  {
    crop: predictedCrop,
    confidence: confidence
  }
];
let cropDetails = {
  rice: {
    water: "Very High",
    season: "Kharif",
    duration: "120-150 days",
    consequences: "Flood damage",
    precautions: "Maintain drainage"
  },

  wheat: {
    water: "Medium",
    season: "Rabi",
    duration: "120-140 days",
    consequences: "Heat stress",
    precautions: "Provide irrigation"
  },

  maize: {
    water: "Medium",
    season: "Kharif",
    duration: "90-110 days",
    consequences: "Drought stress",
    precautions: "Use drip irrigation"
  },   // <-- COMMA REQUIRED

  chickpea: {
    water: "Low",
    season: "Rabi",
    duration: "90-120 days",
    consequences: "Root rot disease",
    precautions: "Avoid waterlogging"
  },
  kidneybeans: {
  water: "Medium",
  season: "Rabi",
  duration: "100-120 days",
  consequences: "Leaf spot disease",
  precautions: "Use disease-resistant varieties"
},

pigeonpeas: {
  water: "Low",
  season: "Kharif",
  duration: "150-180 days",
  consequences: "Wilt disease",
  precautions: "Practice crop rotation"
},

mothbeans: {
  water: "Very Low",
  season: "Kharif",
  duration: "75-90 days",
  consequences: "Poor germination",
  precautions: "Use certified seeds"
},

mungbean: {
  water: "Low",
  season: "Summer/Kharif",
  duration: "60-75 days",
  consequences: "Yellow Mosaic Virus",
  precautions: "Control whiteflies"
},

blackgram: {
  water: "Low",
  season: "Kharif",
  duration: "80-100 days",
  consequences: "Powdery mildew",
  precautions: "Timely fungicide spray"
},

lentil: {
  water: "Low",
  season: "Rabi",
  duration: "100-120 days",
  consequences: "Rust disease",
  precautions: "Monitor disease regularly"
},
banana: {
  water: "Very High",
  season: "Year Round",
  duration: "10-12 months",
  consequences: "Root rot",
  precautions: "Ensure proper drainage"
},

mango: {
  water: "Medium",
  season: "Summer",
  duration: "3-5 years",
  consequences: "Fruit fly attack",
  precautions: "Regular orchard monitoring"
},

grapes: {
  water: "Medium",
  season: "Winter",
  duration: "120-150 days",
  consequences: "Powdery mildew",
  precautions: "Proper pruning and spraying"
},

watermelon: {
  water: "Medium",
  season: "Summer",
  duration: "80-100 days",
  consequences: "Fruit cracking",
  precautions: "Maintain consistent irrigation"
},

orange: {
  water: "Medium",
  season: "Year Round",
  duration: "3-4 years",
  consequences: "Citrus canker",
  precautions: "Prune infected branches"
},

papaya: {
  water: "Medium",
  season: "Year Round",
  duration: "8-10 months",
  consequences: "Papaya ring spot virus",
  precautions: "Use healthy seedlings"
},

coconut: {
  water: "High",
  season: "Year Round",
  duration: "5-7 years",
  consequences: "Bud rot disease",
  precautions: "Maintain field sanitation"
},

apple: {
  water: "Medium",
  season: "Winter",
  duration: "4-5 years",
  consequences: "Apple scab",
  precautions: "Regular fungicide application"
},

pomegranate: {
  water: "Low",
  season: "Year Round",
  duration: "5-6 months",
  consequences: "Fruit borer attack",
  precautions: "Monitor orchard frequently"
},

jute: {
  water: "High",
  season: "Kharif",
  duration: "120-150 days",
  consequences: "Stem rot disease",
  precautions: "Use certified seeds"
},

coffee: {
  water: "Medium",
  season: "Year Round",
  duration: "3-4 years",
  consequences: "Coffee leaf rust",
  precautions: "Shade management and fungicides"
}
  
  
};


const details =
  cropDetails[predictedCrop.toLowerCase()] ||
  {
    water:"medium",
    season:"kharif",
    duration:"90 to 120 days",
    consequences:"Climate risk",
    precautions:"Monitor crop regularly"
  };

   setCropInfo({
  name: predictedCrop.toLowerCase(),
  translatedName: translatedCrop,

  confidence: confidence,
  modelAccuracy: response.data.model_accuracy,
  modelAlgorithm: response.data.model_algorithm,

 top3: await Promise.all(
  top3.map(async (item) => ({
    ...item,
    translatedCrop:
      i18n.language === "en"
        ? item.crop
        : await translateText(item.crop, i18n.language),
  }))
),

  rating: "⭐⭐⭐⭐⭐",

  city:
  i18n.language === "en"
    ? city
    : await translateText(city, i18n.language),

soilType: soilType,
  temperature: temp,

  rainfall: rainfall,

 profit:
  response.data.profit,

demand:
  response.data.market_demand,

marketPrice:
  response.data.market_price,
  

  water:
  i18n.language === "en"
    ? details.water
    : await translateText(details.water, i18n.language),





season:
  i18n.language === "en"
    ? details.season
    : await translateText(details.season, i18n.language),


duration:
  i18n.language === "en"
    ? details.duration
    : await translateText(details.duration, i18n.language),


consequences:
  i18n.language === "en"
    ? details.consequences
    : await translateText(details.consequences, i18n.language),


precautions:
  i18n.language === "en"
    ? details.precautions
    : await translateText(details.precautions, i18n.language),
 
});
  } catch (error) {
    console.log(error);

    if (error.response) {
     await showMessage(
  "Server Error: " +
  JSON.stringify(error.response.data)
);
    } else {
      await showMessage(error.message);
    }
  }
};

  const downloadReport = async () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text(
      "AI Crop Recommendation Report",
      20,
      20
    );

    doc.setFontSize(14);

    doc.text("City: " + city, 20, 40);
    doc.text(
  "Soil Type: " + soilType,
  20,
  55
);
    doc.text(
      "Temperature: " + temperature,
      20,
      70
    );

    if (cropInfo) {
      doc.text(
        "Recommended Crop: " +
          cropInfo.name,
        20,
        85
      );

      doc.text(
        "Profit: " +
          cropInfo.profit,
        20,
        100
      );

      doc.text(
        "Water: " +
          cropInfo.water,
        20,
        115
      );
    }

    doc.save("Crop_Report.pdf");
  };

  return (
    <div
      style={{
        display: "flex",
        background: "#f4f7fc",
        minHeight: "100vh",
      }}
    >
      <Sidebar setPage={setPage} />

      <div
        style={{
          marginLeft: "270px",
          width: "100%",
          padding: "30px",
        }}
      >
        {/* Header */}
        <div
          style={{
            background:
              "linear-gradient(135deg,#4CAF50,#2196F3)",
            color: "white",
            padding: "30px",
            borderRadius: "20px",
            marginBottom: "30px",
             position: "relative",
          }}
        >
          <h1>🌱 {t("title")}</h1>
          <button
  onClick={() => setPage("voice")}
  style={{
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "50px",
    height: "50px",
    borderRadius: "50%",
    border: "none",
    background: "rgba(255,255,255,0.2)",
    color: "white",
    fontSize: "22px",
    cursor: "pointer",
  }}
>
  🎤
</button>

          <p>{t("smart")}</p>

         <select
  value={language}
  onChange={(e) => {
  const lang = e.target.value;

  console.log("Changing to:", lang);

  setLanguage(lang);

  i18n.changeLanguage(lang).then(() => {
    console.log("Language Changed:", i18n.language);
  });
}}
  style={{
    marginTop: "15px",
    padding: "10px",
    borderRadius: "8px",
    border: "none",
  }}
>
  <option value="en">English</option>
  <option value="te">Telugu (తెలుగు)</option>
  <option value="hi">Hindi (हिन्दी)</option>
  <option value="ta">Tamil (தமிழ்)</option>
  <option value="kn">Kannada (ಕನ್ನಡ)</option>
  <option value="ml">Malayalam (മലയാളം)</option>
  <option value="mr">Marathi (मराठी)</option>
  <option value="gu">Gujarati (ગુજરાતી)</option>
  <option value="bn">Bengali (বাংলা)</option>
  <option value="pa">Punjabi (ਪੰਜਾਬੀ)</option>
  <option value="or">Odia (ଓଡ଼ିଆ)</option>
  <option value="as">Assamese (অসমীয়া)</option>
  <option value="ur">Urdu (اردو)</option>
  <option value="ks">Kashmiri (कॉशुर)</option>
  <option value="kok">Konkani (कोंकणी)</option>
  <option value="mai">Maithili (मैथिली)</option>
  <option value="mni">Manipuri (ꯃꯤꯇꯩꯂꯣꯟ)</option>
  <option value="ne">Nepali (नेपाली)</option>
  <option value="sa">Sanskrit (संस्कृतम्)</option>
  <option value="sd">Sindhi (سنڌي)</option>
  <option value="doi">Dogri (डोगरी)</option>
  <option value="brx">Bodo (बर')</option>
  <option value="sat">Santali (ᱥᱟᱱᱛᱟᱲᱤ)</option>
  <option value="fr">French</option>
  <option value="de">German</option>
  <option value="es">Spanish</option>
  <option value="it">Italian</option>
  <option value="pt">Portuguese</option>
  <option value="ru">Russian</option>
  <option value="ja">Japanese</option>
  <option value="ko">Korean</option>
  <option value="zh-CN">Chinese</option>
  <option value="ar">Arabic</option>
  <option value="tr">Turkish</option>
  <option value="nl">Dutch</option>
  <option value="pl">Polish</option>
  <option value="uk">Ukrainian</option>
  <option value="vi">Vietnamese</option>
  <option value="th">Thai</option>
  <option value="ms">Malay</option>
  <option value="id">Indonesian</option>
  <option value="bn">Bengali</option>
  <option value="gu">Gujarati</option>
  <option value="mr">Marathi</option>
  <option value="kn">Kannada</option>
  <option value="ml">Malayalam</option>
  <option value="pa">Punjabi</option>
  <option value="ur">Urdu</option>
  <option value="or">Odia</option>
  <option value="ne">Nepali</option>
  <option value="si">Sinhala</option>
  <option value="fa">Persian</option>
  <option value="he">Hebrew</option>
  <option value="sw">Swahili</option>
  <option value="sv">Swedish</option>
  <option value="no">Norwegian</option>
  <option value="fi">Finnish</option>
  <option value="da">Danish</option>
  <option value="cs">Czech</option>
  <option value="hu">Hungarian</option>
  <option value="el">Greek</option>
  <option value="ro">Romanian</option>
  <option value="bg">Bulgarian</option>
  <option value="sr">Serbian</option>
  <option value="sk">Slovak</option>
  <option value="sl">Slovenian</option>
  <option value="hr">Croatian</option>
  <option value="lt">Lithuanian</option>
  <option value="lv">Latvian</option>
  <option value="et">Estonian</option>
</select>
        </div>

        {/* Dashboard */}
<div
  style={{
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "30px",
  }}
>
  <div
    style={{ ...dashboardCard, cursor: "pointer" }}
    onClick={() => setPage("crop")}
  >
    <h1>🌾</h1>
    <h3>{t("cropAI")}</h3>
  </div>

  <div
    style={{ ...dashboardCard, cursor: "pointer" }}
    onClick={() => setPage("disease")}
  >
    <h1>📷</h1>
    <h3>{t("diseaseAI")}</h3>
  </div>

  <div
    style={{ ...dashboardCard, cursor: "pointer" }}
    onClick={() => setPage("weather")}
  >
    <h1>🌦</h1>
    <h3>{t("weatherAI")}</h3>
  </div>

  <div
    style={{ ...dashboardCard, cursor: "pointer" }}
    onClick={() => setPage("market")}
  >
    <h1>💹</h1>
    <h3>{t("marketAI")}</h3>
  </div>
</div>

        {/* Crop */}
        {page === "crop" && (
          <div style={card}>
            <h2>
              🌾 {t("crop")}
            </h2>
          <div
  style={{
    background: "#fff3cd",
    color: "#856404",
    border: "1px solid #ffeeba",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "20px",
    fontSize: "14px",
    lineHeight: "1.6",
  }}
>
  <h4>{t("disclaimerTitle")}</h4>

  <p>{t("disclaimerText")}</p>
</div>
            <select
  value={soilType}
  onChange={(e) => setSoilType(e.target.value)}
  style={inputStyle}
>
  <option value="">
    {t("selectSoil")}
  </option>

  <option value="Black Soil">
    {t("Black Soil")}
  </option>

  <option value="Red Soil">
    {t("Red Soil")}
  </option>

  <option value="Alluvial Soil">
    {t("Alluvial Soil")}
  </option>

  <option value="Clay Soil">
    {t("Clay Soil")}
  </option>

  <option value="Sandy Soil">
    {t("Sandy Soil")}
  </option>

  <option value="Loamy Soil">
    {t("Loamy Soil")}
  </option>

  <option value="Laterite Soil">
    {t("Laterite Soil")}
  </option>

  <option value="Peaty Soil">
    {t("Peaty Soil")}
  </option>
</select>
<input
  type="number"
  placeholder="Nitrogen (N)"
  value={N}
  min="1"
  max="140"
  onChange={(e) => setN(e.target.value)}
  style={inputStyle}
/>

<input
  type="number"
  placeholder="Phosphorus (P)"
  value={P}
  min="1"
  max="145"
  onChange={(e) => setP(e.target.value)}
  style={inputStyle}
/>

<input
  type="number"
  placeholder="Potassium (K)"
  value={K}
  min="1"
  max="205"
  onChange={(e) => setK(e.target.value)}
  style={inputStyle}
/>

<input
  type="number"
  placeholder="pH"
  value={ph}
  min="3.5"
  max="10"
  step="0.1"
  onChange={(e) => setPh(e.target.value)}
  style={inputStyle}
/>
    <select
  value={city}
 onChange={(e) => {
  setLocationMode("manual");
  setCity(e.target.value);
}}
  style={inputStyle}
>
  <option value="">
    {t("city")}
  </option>

  {city &&
    city !== "Anantapur" &&
    city !== "Hyderabad" &&
    city !== "Chennai" &&
    city !== "Delhi" &&
    city !== "Mumbai" &&
    city !== "Bangalore" && (
      <option value={city}>
        {city}
      </option>
    )}

  <option value="Anantapur">
    {t("Anantapur")}
  </option>

  <option value="Hyderabad">
    {t("Hyderabad")}
  </option>

  <option value="Chennai">
    {t("Chennai")}
  </option>

  <option value="Delhi">
    {t("Delhi")}
  </option>

  <option value="Mumbai">
    {t("Mumbai")}
  </option>

  <option value="Bangalore">
    {t("Bangalore")}
  </option>
</select>

<button
  onClick={() => {
    setLocationMode("current");
    getCurrentLocation();
  }}
  style={btnStyle}
>
  📍 {t("useCurrentLocation")}
</button>
           <button
  onClick={getRecommendation}
  style={btnStyle}
>
  {t("getRecommendation")}
</button>

            {cropInfo && (
              <div
                style={{
                  
                  marginTop: "30px",
                  background:
                    "linear-gradient(135deg,#ffffff,#f1f8e9)",
                  padding: "30px",
                  borderRadius: "20px",
                  boxShadow:
                    "0 10px 20px rgba(0,0,0,0.1)",
                }}
              >
                <h1
                  style={{
                    color:
                      "#2e7d32",
                  }}
                >
                🌾 {t(cropInfo.name)}
                </h1>

                <h3>
                  {cropInfo.rating}
                </h3>
<p>
  🤖 {t("confidence")}: {cropInfo.confidence}%
</p>
{cropInfo.modelAccuracy && (
  <p>
    📊 Model accuracy: {cropInfo.modelAccuracy}% {cropInfo.modelAlgorithm ? `(${cropInfo.modelAlgorithm})` : ""}
  </p>
)}

<h3>
  🌾 {t("top3Recommendations")}
</h3>

{cropInfo.top3 && (
  <ol>
    {cropInfo.top3.map((item, index) => (
    <li key={index}>
  {item.crop} ({item.confidence}%)
</li>
    ))}
  </ol>
)}             
    <p>
  📍 {t("location")}:
  {cropInfo.city}
</p>
   
                <p>
  💧 {t("water")}:
  {" "}
💧 {t(cropInfo.water)}
</p>

<p>
  🌱 {t("soilType")}: 🌱 {t(cropInfo.soilType)}
</p>
<p>
  ⚠️ {t("consequences")}:
  ⚠️ {t(cropInfo.consequences)}
</p>
<p>
  🛡️ {t("precautions")}:
  🛡️ {t(cropInfo.precautions)}
</p>
<p>
  📈 {t("demand")}:
  {cropInfo.demand}
</p>
<p>
  🏷 Market Price:
  ₹{cropInfo.marketPrice}/quintal
</p>

<p>
  🌦 {t("season")}:
  {" "}
🌦 {t(cropInfo.season)}
</p>

<p>
  ⏳ {t("duration")}:
 {t(cropInfo.duration)}
</p>
<p>
  🌡 {t("temperature")}: {cropInfo.temperature}°C
</p>

<p>
  🌧 {t("rainfall")}: {cropInfo.rainfall} mm
</p>
<p>
  💰 {t("profit")}:
  ₹{Number(cropInfo.profit).toLocaleString()}/acre
</p>
                <button
                  onClick={
                    downloadReport
                  }
                  style={{
                    ...btnStyle,
                    background:
                      "#1976d2",
                  }}
                >
                  📄 Download
                  Report
                </button>
              </div>
            )}
          </div>
        )}

        {page === "disease" && (
          <div style={card}>
            <DiseaseDetection language={language} />
          </div>
        )}

        {page === "market" && (
          <div style={card}>
            <MarketPrices language={language} />
          </div>
        )}

        {page === "weather" && (
          <div style={card}>
            <Weather language={language}/>
          </div>
        )}

       {page === "voice" && (
  <div style={card}>
    <VoiceAssistant setPage={setPage} />
  </div>
)}
        {page === "schemes" && (
          <div style={card}>
            <GovtSchemes language={language}/>
          </div>
        )}
 {page === "machines" && (
  <div style={card}>
    <FarmMachines />
  </div>
)}
{page === "myMachines" && (
  <MyMachines />
)}
        {page === "alerts" && (
          <div style={card}>
            <Notifications language={language}/>
          </div>
        )}

        {page === "chat" && (
          <div style={card}>
            <Chatbot language={language} />
          </div>
        )}
      </div>
    </div>
  );
}

const dashboardCard = {
  background: "white",
  padding: "25px",
  borderRadius: "15px",
  textAlign: "center",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  transition: "0.3s",
};

const card = {
  background: "white",
  padding: "30px",
  borderRadius: "15px",
  boxShadow:
    "0 5px 15px rgba(0,0,0,0.1)",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const btnStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  background: "#2e7d32",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

export default App;
