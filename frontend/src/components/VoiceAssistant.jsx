import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";

function VoiceAssistant({ setPage }) {
  const { t, i18n } = useTranslation();

  const [text, setText] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert(
        i18n.language === "te"
          ? "మీ బ్రౌజర్ వాయిస్‌ను సపోర్ట్ చేయదు"
          : i18n.language === "hi"
          ? "आपका ब्राउज़र वॉइस सपोर्ट नहीं करता"
          : i18n.language === "ta"
          ? "உங்கள் உலாவி குரலை ஆதரிக்காது"
          : "Your browser does not support voice recognition"
      );
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang =
      i18n.language === "te"
        ? "te-IN"
        : i18n.language === "hi"
        ? "hi-IN"
        : i18n.language === "ta"
        ? "ta-IN"
        : "en-US";

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.start();

    recognition.onresult = (event) => {
      const speech =
        event.results[0][0].transcript;

      setText(speech);

      const command =
        speech.toLowerCase();

      // English
      if (
        command.includes("crop")
      ) {
        setPage("crop");
      }

      else if (
        command.includes("disease")
      ) {
        setPage("disease");
      }

      else if (
        command.includes("weather")
      ) {
        setPage("weather");
      }

      else if (
        command.includes("market")
      ) {
        setPage("market");
      }

      else if (
        command.includes("voice")
      ) {
        setPage("voice");
      }

      else if (
        command.includes("scheme")
      ) {
        setPage("schemes");
      }

      else if (
        command.includes("chat")
      ) {
        setPage("chat");
      }

      else if (
        command.includes("notification")
      ) {
        setPage("alerts");
      }

      // Telugu
      else if (
        command.includes("పంట")
      ) {
        setPage("crop");
      }

      else if (
        command.includes("వ్యాధి")
      ) {
        setPage("disease");
      }

      else if (
        command.includes("వాతావరణం")
      ) {
        setPage("weather");
      }

      else if (
        command.includes("మార్కెట్")
      ) {
        setPage("market");
      }

      else if (
        command.includes("పథకాలు")
      ) {
        setPage("schemes");
      }

      else if (
        command.includes("చాట్")
      ) {
        setPage("chat");
      }

      else if (
        command.includes("నోటిఫికేషన్")
      ) {
        setPage("alerts");
      }

      // Hindi
      else if (
        command.includes("फसल")
      ) {
        setPage("crop");
      }

      else if (
        command.includes("रोग")
      ) {
        setPage("disease");
      }

      else if (
        command.includes("मौसम")
      ) {
        setPage("weather");
      }

      else if (
        command.includes("बाजार")
      ) {
        setPage("market");
      }

      else if (
        command.includes("योजना")
      ) {
        setPage("schemes");
      }

      else if (
        command.includes("चैट")
      ) {
        setPage("chat");
      }

      else if (
        command.includes("सूचना")
      ) {
        setPage("alerts");
      }

      // Tamil
      else if (
        command.includes("பயிர்")
      ) {
        setPage("crop");
      }

      else if (
        command.includes("நோய்")
      ) {
        setPage("disease");
      }

      else if (
        command.includes("வானிலை")
      ) {
        setPage("weather");
      }

      else if (
        command.includes("சந்தை")
      ) {
        setPage("market");
      }

      else if (
        command.includes("திட்டம்")
      ) {
        setPage("schemes");
      }

      else if (
        command.includes("சாட்")
      ) {
        setPage("chat");
      }

      else if (
        command.includes("அறிவிப்பு")
      ) {
        setPage("alerts");
      }
    };

    recognition.onerror = () => {
      alert(
        i18n.language === "te"
          ? "వాయిస్ గుర్తింపు విఫలమైంది"
          : i18n.language === "hi"
          ? "वॉइस पहचान विफल"
          : i18n.language === "ta"
          ? "குரல் அடையாளம் தோல்வியடைந்தது"
          : "Voice recognition failed"
      );
    };
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    window.speechSynthesis?.cancel();
    setListening(false);
  };

  return (
    <div>
      <h2>
        🎤 {t("voice")}
      </h2>

      <button
        onClick={startListening}
        style={buttonStyle}
      >
        {i18n.language === "te"
          ? "మాట్లాడటం ప్రారంభించండి"
          : i18n.language === "hi"
          ? "बोलना शुरू करें"
          : i18n.language === "ta"
          ? "பேச தொடங்கவும்"
          : listening ? "Listening…" : "Start Speaking"}
      </button>

      <button onClick={stopListening} style={{ ...buttonStyle, background: "#b54434", marginTop: "10px" }}>
        Stop Voice
      </button>

      {text && (
        <div style={cardStyle}>
          <h3>
            {i18n.language === "te"
              ? "మీరు చెప్పింది"
              : i18n.language === "hi"
              ? "आपने कहा"
              : i18n.language === "ta"
              ? "நீங்கள் கூறியது"
              : "You Said"}
          </h3>

          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

const buttonStyle = {
  width: "100%",
  padding: "14px",
  marginTop: "20px",
  background: "#9c27b0",
  color: "white",
  border: "none",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "16px",
};

const cardStyle = {
  marginTop: "20px",
  background: "#f3e5f5",
  padding: "20px",
  borderRadius: "12px",
  boxShadow:
    "0 5px 15px rgba(0,0,0,0.1)",
};

export default VoiceAssistant;
