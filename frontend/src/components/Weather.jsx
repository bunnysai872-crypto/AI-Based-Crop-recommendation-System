import { useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

function Weather() {
  const { t, i18n } = useTranslation();

  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);

  const API_KEY = "f3cdb04b8e4b3c2de7d548df904f5d56";

const getWeather = async () => {
  if (!city) {
    alert("Please enter a city");
    return;
  }

  try {
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );

    setWeather({
      city: response.data.name,
      temperature: response.data.main.temp,
      humidity: response.data.main.humidity,
      wind: response.data.wind.speed,
      condition: response.data.weather[0].main,
    });

  } catch (error) {
    alert("City not found");
    console.error(error);
  }
};

const getCurrentLocationWeather = () => {

  navigator.geolocation.getCurrentPosition(

    async (position) => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      try {

        const response = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );

        setWeather({
          city: response.data.name,
          temperature: response.data.main.temp,
          humidity: response.data.main.humidity,
          wind: response.data.wind.speed,
          condition: response.data.weather[0].main,
        });

      } catch (error) {
        console.log(error);
      }

    },

    () => {
      alert("Location access denied");
    }

  );

};

  const translateCondition = () => {
    if (!weather) return "";

    if (i18n.language === "te") return "ఎండ";
    if (i18n.language === "hi") return "धूप";
    if (i18n.language === "ta") return "வெயில்";

    return weather.condition;
  };

  return (
    <div>
      <h2>🌦 {t("weather")}</h2>

      <input
        type="text"
        placeholder={
          i18n.language === "te"
            ? "నగరం నమోదు చేయండి"
            : i18n.language === "hi"
            ? "शहर दर्ज करें"
            : i18n.language === "ta"
            ? "நகரத்தை உள்ளிடவும்"
            : "Enter City"
        }
        value={city}
        onChange={(e) => setCity(e.target.value)}
        style={inputStyle}
      />

      <button
  onClick={getWeather}
  style={buttonStyle}
>
  {i18n.language === "te"
    ? "వాతావరణం పొందండి"
    : i18n.language === "hi"
    ? "मौसम प्राप्त करें"
    : i18n.language === "ta"
    ? "வானிலை பெறுக"
    : "Get Weather"}
</button>

<button
  onClick={getCurrentLocationWeather}
  style={{
    ...buttonStyle,
    marginTop: "10px",
    background: "#4CAF50",
  }}
>
  {i18n.language === "te"
    ? "📍 ప్రస్తుత స్థానం"
    : i18n.language === "hi"
    ? "📍 वर्तमान स्थान"
    : i18n.language === "ta"
    ? "📍 தற்போதைய இடம்"
    : "📍 Use Current Location"}
</button>
      {weather && (
        <div style={card}>
         <h3>
  📍 {weather.city}
</h3>

          <p>
            🌡️{" "}
            {i18n.language === "te"
              ? "ఉష్ణోగ్రత"
              : i18n.language === "hi"
              ? "तापमान"
              : i18n.language === "ta"
              ? "வெப்பநிலை"
              : "Temperature"}
            : {weather.temperature}°C
          </p>

          <p>
            💧{" "}
            {i18n.language === "te"
              ? "తేమ"
              : i18n.language === "hi"
              ? "आर्द्रता"
              : i18n.language === "ta"
              ? "ஈரப்பதம்"
              : "Humidity"}
            : {weather.humidity}%
          </p>

          <p>
            💨{" "}
            {i18n.language === "te"
              ? "గాలి"
              : i18n.language === "hi"
              ? "हवा"
              : i18n.language === "ta"
              ? "காற்று"
              : "Wind"}
            : {weather.wind} km/h
          </p>

          <p>
            ☀️{" "}
            {i18n.language === "te"
              ? "స్థితి"
              : i18n.language === "hi"
              ? "स्थिति"
              : i18n.language === "ta"
              ? "நிலை"
              : "Condition"}
            : {translateCondition()}
          </p>
        </div>
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "15px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  boxSizing: "border-box",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  marginTop: "20px",
  background: "#2196F3",
  color: "white",
  border: "none",
  borderRadius: "8px",
  cursor: "pointer",
  fontSize: "16px",
};

const card = {
  marginTop: "20px",
  background: "#ffffff",
  padding: "20px",
  borderRadius: "12px",
  boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
};

export default Weather;