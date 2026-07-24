import { useTranslation } from "react-i18next";

function Notifications() {
  const { t, i18n } = useTranslation();

  const notifications = {
    en: [
      "🌧 Heavy rain expected tomorrow.",
      "💹 Rice market price increased by ₹100.",
      "🏛 PM-KISAN installment released.",
      "🌱 Best season to cultivate paddy has started.",
    ],

    hi: [
      "🌧 कल भारी बारिश होने की संभावना है।",
      "💹 धान की कीमत ₹100 बढ़ गई है।",
      "🏛 पीएम-किसान की किस्त जारी हो गई है।",
      "🌱 धान की खेती का सर्वोत्तम मौसम शुरू हो गया है।",
    ],

    te: [
      "🌧 రేపు భారీ వర్షం వచ్చే అవకాశం ఉంది.",
      "💹 వరి ధర ₹100 పెరిగింది.",
      "🏛 పీఎం-కిసాన్ వాయిదా విడుదలైంది.",
      "🌱 వరి సాగుకు అనుకూల కాలం ప్రారంభమైంది.",
    ],

    ta: [
      "🌧 நாளை கனமழை பெய்ய வாய்ப்பு உள்ளது.",
      "💹 அரிசி விலை ₹100 உயர்ந்துள்ளது.",
      "🏛 PM-KISAN தொகை வழங்கப்பட்டுள்ளது.",
      "🌱 நெல் பயிரிட சிறந்த காலம் தொடங்கியுள்ளது.",
    ],
  };

  const currentNotifications =
    notifications[i18n.language] || notifications.en;

  return (
    <div>
      <h2>🔔 {t("notifications")}</h2>

      {currentNotifications.map((note, index) => (
        <div
          key={index}
          style={{
            background: "white",
            padding: "18px",
            marginTop: "15px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
            borderLeft: "5px solid #4caf50",
          }}
        >
          <p
            style={{
              fontSize: "16px",
              margin: 0,
            }}
          >
            {note}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Notifications;