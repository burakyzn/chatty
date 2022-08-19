import { createContext, useState, useEffect } from "react";
import { IntlProvider } from "react-intl";
import en from "lang/en.json";
import tr from "lang/tr.json";

export const LanguageContext = createContext();

const languageMessages = {
  en: en,
  tr: tr,
};

const defaultLocale = "en";

function LanguageProvider(props) {
  const [language, setLang] = useState(defaultLocale);

  useEffect(() => {
    let localLanguage = localStorage.getItem("language");
    localLanguage ? setLang(localLanguage) : setLang(defaultLocale);
  }, []);

  const setLanguage = (lang) => {
    setLang(lang);
    localStorage.setItem("language", lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      <IntlProvider messages={languageMessages[language]} locale={language}>
        {props.children}
      </IntlProvider>
    </LanguageContext.Provider>
  );
}

export default LanguageProvider;
