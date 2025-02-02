import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { langService } from "../../services/storage/Factory";
import ru from "../../locale/ru.json";
import kz from "../../locale/kk.json";
import en from "../../locale/en.json";

i18n.use(initReactI18next).init({
  resources: {
    kz: {
      translation: kz,
    },
    ru: {
      translation: ru,
    },
    en: {
      translation: en,
    },
  },
  lng: langService.hasValue() ? langService.getValue() : "ru",
  fallbackLng: "ru",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;