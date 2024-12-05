import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

export const LS_KEY = "lang";

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        lng: localStorage.getItem(LS_KEY) || "en",
        debug: false,
        interpolation: { escapeValue: false },
    });
