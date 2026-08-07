import { useState } from "react";


function Chatbot() {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Welcome Farmer! Tell me about your farm or use a quick action below.",
    },
  ]);

  const [input, setInput] = useState("");

  const quickReply = (type) => {
    let response = "";

    switch (type) {
      case "crop":
        response =
          "🌾 Recommended Crops:\n\nCotton (96%)\nGroundnut (92%)\nMaize (89%)\n\n💰 Profit: ₹2.3 Lakhs\n💧 Water: Medium";
        break;

      case "weather":
        response =
          "🌦 Weather Forecast:\nTemperature: 31°C\nHumidity: 68%\nRainfall: Moderate";
        break;

      case "water":
        response =
          "💧 Water Requirement:\nCurrent soil moisture is sufficient for 3 days.";
        break;

      case "fertilizer":
        response =
          "🌱 Fertilizer Recommendation:\nApply NPK (20:20:20) fertilizer.";
        break;

      case "market":
        response =
          "📈 Market Prices:\nCotton ₹7200/qtl\nRice ₹2400/qtl";
        break;

      case "scheme":
        response =
          "🏛 Government Schemes:\nPM-KISAN\nCrop Insurance\nSolar Pump Subsidy";
        break;

      default:
        response = "Please ask another question.";
    }

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: type },
      { sender: "bot", text: response },
    ]);
  };

  const sendMessage = async () => {
  if (!input.trim()) return;

  const userMessage = input;

  // Show user's message
  setMessages((prev) => [
    ...prev,
    {
      sender: "user",
      text: userMessage,
    },
  ]);

  setInput("");

  // Show temporary loading message
  setMessages((prev) => [
    ...prev,
    {
      sender: "bot",
      text: "⏳ Thinking...",
    },
  ]);

  try {
    const response = await fetch("http://127.0.0.1:5000/farmgpt", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
      }),
    });

    const data = await response.json();

    // Remove "Thinking..."
    setMessages((prev) => prev.slice(0, -1));

    let reply = data.reply;

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: reply,
      },
    ]);
  } catch (error) {
    setMessages((prev) => prev.slice(0, -1));

    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "❌ Unable to connect to the AI server.",
      },
    ]);

    console.log(error);
  }
};

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "auto",
        background: "white",
        borderRadius: "20px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
        overflow: "hidden",
      }}
    >
      {/* Top */}
      <div
        style={{
          background:
            "linear-gradient(135deg,#2e7d32,#4caf50)",
          color: "white",
          padding: "15px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <h3>🤖 AgriAI</h3>
          <small>Online</small>
        </div>

        <div>
          🎤 🌐
        </div>
      </div>

      {/* Chat */}
      <div
        style={{
          height: "450px",
          overflowY: "auto",
          background: "#f6fbf5",
          padding: "15px",
        }}
      >
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              background:
                msg.sender === "bot"
                  ? "#e8f5e9"
                  : "#c8e6c9",
              padding: "12px",
              borderRadius: "15px",
              marginBottom: "15px",
              maxWidth: "75%",
              marginLeft:
                msg.sender === "user"
                  ? "auto"
                  : "0",
              whiteSpace: "pre-line",
            }}
          >
            {msg.text}
          </div>
        ))}

        {/* Quick Actions */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <button
            onClick={() => quickReply("crop")}
            style={chip}
          >
            🌾 Crop
          </button>

          <button
            onClick={() => quickReply("weather")}
            style={chip}
          >
            🌦 Weather
          </button>

          <button
            onClick={() => quickReply("water")}
            style={chip}
          >
            💧 Water
          </button>

          <button
            onClick={() =>
              quickReply("fertilizer")
            }
            style={chip}
          >
            🌱 Fertilizer
          </button>

          <button
            onClick={() => quickReply("market")}
            style={chip}
          >
            📈 Market
          </button>

          <button
            onClick={() => quickReply("scheme")}
            style={chip}
          >
            🏛 Schemes
          </button>
        </div>
      </div>

      {/* Input */}
      <div
        style={{
          display: "flex",
          padding: "15px",
          borderTop: "1px solid #ddd",
        }}
      >
        <input
  value={input}
  onChange={(e) => setInput(e.target.value)}
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  }}
  placeholder="Ask your farming question..."
  style={{
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #ccc",
  }}
/>

        <button
          onClick={sendMessage}
          style={{
            marginLeft: "10px",
            background: "#2e7d32",
            color: "white",
            border: "none",
            borderRadius: "10px",
            padding: "12px",
            cursor: "pointer",
          }}
        >
          ➤
        </button>
      </div>
    </div>
  );
}

const chip = {
  background: "#dcedc8",
  border: "none",
  borderRadius: "20px",
  padding: "10px 15px",
  cursor: "pointer",
};

export default Chatbot;