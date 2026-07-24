import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { translateText } from "../utils/translate";

function TranslatedText({ text }) {
  const { i18n } = useTranslation();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    async function load() {
      if (i18n.language === "en") {
        setTranslated(text);
      } else {
        const t = await translateText(text, i18n.language);
        setTranslated(t);
      }
    }

    load();
  }, [text, i18n.language]);

  return translated;
}

export default TranslatedText;