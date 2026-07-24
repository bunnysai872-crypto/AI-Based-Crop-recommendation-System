const cache = {};

export async function translateText(text, language) {
  if (!text) return "";

  if (language === "en") return text;

  const key = language + "_" + text;

  if (cache[key]) {
    return cache[key];
  }

  try {
    const response = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${language}`
    );

    const data = await response.json();

    const translated = data.responseData?.translatedText || "";

    // Ignore MyMemory limit message
    if (
      translated.toUpperCase().includes("MYMEMORY WARNING") ||
      translated.toUpperCase().includes("YOU USED ALL AVAILABLE FREE TRANSLATIONS")
    ) {
      return text;
    }

    cache[key] = translated;

    return translated;
  } catch (error) {
    console.log(error);
    return text;
  }
}