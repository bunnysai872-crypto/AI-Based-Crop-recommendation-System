import { useRef, useState } from "react";
import "./Chatbot.css";

const languageNames = { en: "English", hi: "Hindi", te: "Telugu", ta: "Tamil", kn: "Kannada", ml: "Malayalam", mr: "Marathi", gu: "Gujarati", bn: "Bengali", pa: "Punjabi", or: "Odia", as: "Assamese", ur: "Urdu", ne: "Nepali", sa: "Sanskrit", sd: "Sindhi", kok: "Konkani", mai: "Maithili", mni: "Manipuri", doi: "Dogri", brx: "Bodo", sat: "Santali", ks: "Kashmiri" };
const speechLocales = Object.fromEntries(Object.keys(languageNames).map((code) => [code, `${code}-IN`]));

function Chatbot({ language = "en" }) {
  const [messages, setMessages] = useState([{ sender: "bot", text: "Hello! Ask about crops, disease, fertilizer, weather, or market prices." }]);
  const [input, setInput] = useState("");
  const [voiceLanguage, setVoiceLanguage] = useState(language);
  const [listening, setListening] = useState(false);
  const recognition = useRef(null);
  const speak = (text) => {
    if (!window.speechSynthesis) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLocales[voiceLanguage] || "en-IN";
    window.speechSynthesis.cancel(); window.speechSynthesis.speak(utterance);
  };
  const send = async (message = input) => {
    if (!message.trim()) return;
    setMessages((current) => [...current, { sender: "user", text: message }, { sender: "bot", text: "Thinking…", pending: true }]);
    setInput("");
    try {
      const response = await fetch("http://127.0.0.1:5000/farmgpt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message }) });
      const data = await response.json(); const reply = data.reply || "I could not generate a response.";
      setMessages((current) => [...current.filter((item) => !item.pending), { sender: "bot", text: reply }]); speak(reply);
    } catch { setMessages((current) => [...current.filter((item) => !item.pending), { sender: "bot", text: "Unable to connect to the AI service." }]); }
  };
  const startListening = () => {
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) return alert("Voice input is supported in Chrome and compatible browsers.");
    recognition.current = new Recognition(); recognition.current.lang = speechLocales[voiceLanguage] || "en-IN"; recognition.current.interimResults = false;
    recognition.current.onstart = () => setListening(true);
    recognition.current.onend = () => setListening(false);
    recognition.current.onresult = (event) => { const text = event.results[0][0].transcript; setInput(text); };
    recognition.current.start();
  };
  const stopVoice = () => {
    recognition.current?.stop();
    window.speechSynthesis?.cancel();
    setListening(false);
  };
  return <div className="agri-chatbot">
    <h2>🤖 AgriAI voice chatbot</h2><p>Voice input and spoken answers support the listed Indian regional languages when available in your browser.</p>
    <label>Chat language <select value={voiceLanguage} onChange={(e) => setVoiceLanguage(e.target.value)}>{Object.entries(languageNames).map(([code, name]) => <option value={code} key={code}>{name}</option>)}</select></label>
    <div className="agri-chatbot__messages">{messages.map((message, index) => <div key={index} className={`agri-chatbot__message agri-chatbot__message--${message.sender}`}>{message.text}</div>)}</div>
    <div className="agri-chatbot__controls"><input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ask your farming question…" /><button onClick={startListening}>{listening ? "Listening…" : "🎙 Speak"}</button><button onClick={stopVoice} className="agri-chatbot__stop">Stop voice</button><button onClick={() => send()}>Send</button></div>
  </div>;
}
export default Chatbot;
