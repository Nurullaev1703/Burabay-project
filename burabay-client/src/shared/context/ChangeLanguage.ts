import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { langService } from "../../services/storage/Factory";

i18n.use(initReactI18next).init({
  resources: {
    kz: {
      translation: {
        // auth
        signin: "Кіру",
        welcome: "Қош келдіңіз!",
        mail: "Пошта",
        inputMail: "Электрондық поштаны енгізіңіз",
        signinWith: "Немесе көмегімен кіріңіз",
        next: "Келесі",
        registerBusiness: "Ұйымды тіркеу",

        // new profile
        account: "Аккаунт",
        appLanguage: "Қосымшаның тілі",
        aboutService: "Қызмет туралы",
        help: "Көмек",
        estimateService: "Қызметті бағалау",
        safety: "Қауіпсіздік",
        logoutFromAccount: "Аккаунттан шығу",
        fillProfile: "Тез брондау үшін профиліңізді толтырыңыз",
        fill: "Толтыру",
        accountConfirm:
          "Аккаунтты растау үшін деректерді толықтыру немесе өзгерту қажет!",
        details: "Толығырақ",
        notFiled: "Толтырылмаған",
        accountWaiting: "Деректер жіберілді, растауды күтіңіз",
        organizationName: "Ұйымның атауы",
        organizationAbout: "Ұйым туралы",
        emailToLogin: "Аккаунтқа кіру үшін мекенжай",
        phone: "Байланыс үшін телефон нөмірі",
        phoneV2: "Телефон",
        site: "Сайт",
        accountSettings: "Аккаунт баптаулары",
        requiredField: "Бұл өріс міндетті",
        invalidEmail: "Электрондық пошта пішімі дұрыс емес",
        name: "Аты",
        email: "Пошта",
        invalidNumber: "Телефон нөмірі дұрыс емес",
        saved: "Сақталған",
        save: "Сақтау",
      },
    },
    ru: {
      translation: {
        // auth
        signin: "Вход",
        welcome: "Добро пожаловать!",
        mail: "Почта",
        inputMail: "Введите адрес электронной почты",
        signinWith: "Или войдите с помощью",
        next: "Далее",
        registerBusiness: "зарегистрировать организацию",

        // new profile
        account: "Аккаунт",
        appLanguage: "Язык приложения",
        aboutService: "О сервисе",
        help: "Помощь",
        estimateService: "Оценить сервис",
        safety: "Безопасность",
        logoutFromAccount: "Выйти из аккаунта",
        fillProfile: "Заполните свой профиль что бы бронировать быстрее",
        fill: "Заполнить",
        accountConfirm:
          "Для подтверждения аккаунта нужно дополнить или изменить данные!",
        details: "Подробнее",
        notFiled: "Не заполнено",
        accountWaiting: "Данные отправлены, ожидайте подтверждение",
        organizationName: "Название организации",
        organizationAbout: "Об организации",
        emailToLogin: "Адрес для входа в в аккаунт",
        phone: "Номер телефона для связи с вами",
        phoneV2: "Телефон",
        site: "Сайт",
        accountSettings: "Настройки аккаунта",
        requiredField: "Это поле обязательно",
        invalidEmail: "Неверный формат почты",
        name: "Имя",
        email: "Почта",
        invalidNumber: "Некорректный номер телефона",
        saved: "Сохраненное",
        save: "Сохранить",
      },
    },
    en: {
      translation: {
        // auth
        signin: "Sign In",
        welcome: "Welcome!",
        mail: "Email",
        inputMail: "Enter your email address",
        signinWith: "Or sign in with",
        next: "Next",
        registerBusiness: "Register an organization",

        // new profile
        account: "Account",
        appLanguage: "Application Language",
        aboutService: "About the Service",
        help: "Help",
        estimateService: "Rate the Service",
        safety: "Safety",
        logoutFromAccount: "Log Out",
        fillProfile: "Complete your profile to book faster",
        fill: "Complete",
        accountConfirm:
          "To confirm your account, you need to complete or update the data!",
        details: "More details",
        notFiled: "Not filled",
        accountWaiting: "Data sent, awaiting confirmation",
        organizationName: "Organization Name",
        organizationAbout: "About the Organization",
        emailToLogin: "Email address for logging into the account",
        phone: "Phone number for contacting you",
        phoneV2: "Phone",
        site: "Website",
        accountSettings: "Account Settings",
        requiredField: "This field is required",
        invalidEmail: "Invalid email format",
        name: "Name",
        email: "Email",
        invalidNumber: "Invalid phone number",
        saved: "Saved",
        save: "Save",
      },
    },
  },
  lng: langService.hasValue() ? langService.getValue() : "ru",
  fallbackLng: "ru",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
