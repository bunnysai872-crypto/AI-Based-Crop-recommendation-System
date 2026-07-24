import { useTranslation } from "react-i18next";

function GovtSchemes() {
  const { t, i18n } = useTranslation();

  const schemes = {
    en: [
  {
    name: "PM-KISAN",
    benefit: "₹6000 per year financial support",
    link: "https://pmkisan.gov.in",
  },
  {
    name: "PMFBY",
    benefit: "Crop insurance for farmers",
    link: "https://pmfby.gov.in",
  },
  {
    name: "Soil Health Card",
    benefit: "Free soil testing services",
    link: "https://soilhealth.dac.gov.in",
  },
  {
    name: "e-NAM",
    benefit: "Online agriculture market",
    link: "https://enam.gov.in",
  },
  {
    name: "PM Krishi Sinchai Yojana",
    benefit: "Irrigation support",
    link: "https://pmksy.gov.in",
  },
  {
    name: "Kisan Credit Card",
    benefit: "Low-interest agricultural loans",
    link: "https://services.india.gov.in",
  },
  {
    name: "Agriculture Infrastructure Fund",
    benefit: "Loans for farm infrastructure",
    link: "https://agriinfra.dac.gov.in",
  },
  {
    name: "National Horticulture Mission",
    benefit: "Support for fruits and vegetables",
    link: "https://nhm.gov.in",
  },
  {
    name: "RKVY",
    benefit: "State agriculture development scheme",
    link: "https://rkvy.nic.in",
  },
  {
    name: "Paramparagat Krishi Vikas Yojana",
    benefit: "Organic farming support",
    link: "https://pgsindia-ncof.gov.in",
  },
  {
    name: "National Food Security Mission",
    benefit: "Increase food crop production",
    link: "https://nfsm.gov.in",
  },
  {
    name: "Farmer Portal",
    benefit: "Agriculture information & services",
    link: "https://farmer.gov.in",
  },
],

    hi: [
  {
    name: "पीएम-किसान",
    benefit: "₹6000 वार्षिक वित्तीय सहायता",
    link: "https://pmkisan.gov.in",
  },
  {
    name: "पीएम फसल बीमा योजना",
    benefit: "फसल बीमा",
    link: "https://pmfby.gov.in",
  },
  {
    name: "मृदा स्वास्थ्य कार्ड",
    benefit: "निःशुल्क मिट्टी परीक्षण",
    link: "https://soilhealth.dac.gov.in",
  },
  {
    name: "ई-नाम",
    benefit: "ऑनलाइन कृषि बाजार",
    link: "https://enam.gov.in",
  },
  {
    name: "किसान क्रेडिट कार्ड",
    benefit: "कम ब्याज पर कृषि ऋण",
    link: "https://services.india.gov.in",
  },
  {
    name: "पीएम कृषि सिंचाई योजना",
    benefit: "सिंचाई सहायता",
    link: "https://pmksy.gov.in",
  },
],

    te: [
  {
    name: "పీఎం-కిసాన్",
    benefit: "సంవత్సరానికి ₹6000 ఆర్థిక సహాయం",
    link: "https://pmkisan.gov.in",
  },
  {
    name: "పీఎం ఫసల్ బీమా యోజన",
    benefit: "రైతులకు పంట బీమా",
    link: "https://pmfby.gov.in",
  },
  {
    name: "సాయిల్ హెల్త్ కార్డ్",
    benefit: "ఉచిత నేల పరీక్షలు",
    link: "https://soilhealth.dac.gov.in",
  },
  {
    name: "ఈ-నామ్",
    benefit: "ఆన్‌లైన్ వ్యవసాయ మార్కెట్",
    link: "https://enam.gov.in",
  },
  {
    name: "పీఎం కృషి సించాయీ యోజన",
    benefit: "నీటిపారుదల సహాయం",
    link: "https://pmksy.gov.in",
  },
  {
    name: "కిసాన్ క్రెడిట్ కార్డ్",
    benefit: "తక్కువ వడ్డీ వ్యవసాయ రుణాలు",
    link: "https://services.india.gov.in",
  },
  {
    name: "వ్యవసాయ మౌలిక వసతుల నిధి",
    benefit: "వ్యవసాయ మౌలిక వసతులకు రుణాలు",
    link: "https://agriinfra.dac.gov.in",
  },
],

    ta: [
  {
    name: "பிஎம்-கிசான்",
    benefit: "வருடத்திற்கு ₹6000 நிதி உதவி",
    link: "https://pmkisan.gov.in",
  },
  {
    name: "பிஎம் பயிர் காப்பீட்டு திட்டம்",
    benefit: "பயிர் காப்பீடு",
    link: "https://pmfby.gov.in",
  },
  {
    name: "மண் ஆரோக்கிய அட்டை",
    benefit: "இலவச மண் பரிசோதனை",
    link: "https://soilhealth.dac.gov.in",
  },
  {
    name: "இ-நாம்",
    benefit: "ஆன்லைன் வேளாண் சந்தை",
    link: "https://enam.gov.in",
  },
  {
    name: "கிசான் கிரெடிட் கார்டு",
    benefit: "குறைந்த வட்டி விவசாயக் கடன்",
    link: "https://services.india.gov.in",
  },
  {
    name: "பிஎம் கிருஷி சின்சாய் திட்டம்",
    benefit: "நீர்ப்பாசன உதவி",
    link: "https://pmksy.gov.in",
  },
],
  };

  const currentSchemes = schemes[i18n.language] || schemes.en;

  return (
    <div>
      <h2>🏛 {t("schemes")}</h2>

      {currentSchemes.map((scheme, index) => (
        <div
          key={index}
          style={{
            background: "white",
            padding: "20px",
            marginTop: "20px",
            borderRadius: "12px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
          }}
        >
          <h3>📋 {scheme.name}</h3>

          <p>{scheme.benefit}</p>

          <button
            onClick={() => window.open(scheme.link, "_blank")}
            style={{
              marginTop: "10px",
              padding: "10px 20px",
              background: "#2e7d32",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            📝 Apply Now
          </button>
        </div>
      ))}
    </div>
  );
}

export default GovtSchemes;