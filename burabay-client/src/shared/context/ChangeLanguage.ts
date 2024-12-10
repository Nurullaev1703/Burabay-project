import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    kz: {
      translation: {
        
      },
    },
    ru: {
      translation: {
        "signin":"Вход",
        "welcome":"Добро пожаловать!",
        "mail": "Почта",
        "inputMail":"Введите адрес электронной почты",
        "signinWith": "Или войдите с помощью",
        "next":"Далее",
        "registerBusiness":"зарегистрировать организацию"
      },
    },
  },
  lng: "ru",
  fallbackLng: "ru",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
