import firebase from "firebase/compat/app";
import "firebase/compat/messaging";

// Конфигурация Firebase
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGIGD_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

let messaging: firebase.messaging.Messaging | null = null;
let isInitialized = false;

/**
 * Инициализирует Firebase приложение и возвращает экземпляр messaging
 * Инициализация происходит только один раз
 */
export const initializeFirebase =
  async (): Promise<firebase.messaging.Messaging | null> => {
    // Если уже инициализирован, возвращаем существующий экземпляр
    if (isInitialized && messaging) {
      return messaging;
    }

    try {
      // Проверяем, не инициализирован ли уже Firebase
      if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
      }

      // Регистрируем Service Worker
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            { scope: "/" }
          );
          console.log("Service Worker зарегистрирован:", registration);
        } catch (error) {
          console.error("Ошибка регистрации Service Worker:", error);
          throw error;
        }
      } else {
        console.warn("Service Worker не поддерживается в этом браузере");
        return null;
      }

      // Получаем экземпляр messaging
      messaging = firebase.messaging();
      isInitialized = true;

      return messaging;
    } catch (error) {
      console.error("Ошибка инициализации Firebase:", error);
      return null;
    }
  };

/**
 * Проверяет, поддерживаются ли уведомления в текущем браузере
 */
export const isNotificationSupported = (): boolean => {
  return "Notification" in window && "serviceWorker" in navigator;
};

/**
 * Получает текущий статус разрешения на уведомления
 */
export const getNotificationPermission = (): NotificationPermission => {
  if (!isNotificationSupported()) {
    return "denied";
  }
  return Notification.permission;
};

/**
 * Проверяет, является ли устройство iOS
 */
export const isIOS = (): boolean => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

/**
 * Проверяет, является ли устройство iOS в режиме standalone (PWA)
 */
export const isIOSStandalone = (): boolean => {
  return isIOS() && (window.navigator as any).standalone === true;
};

/**
 * Запрашивает разрешение на уведомления и возвращает токен
 */
export const requestNotificationPermission = async (): Promise<{
  success: boolean;
  token?: string;
  error?: string;
}> => {
  try {
    // Проверка поддержки
    if (!isNotificationSupported()) {
      return {
        success: false,
        error: "Уведомления не поддерживаются в этом браузере",
      };
    }

    // Проверка текущего разрешения
    const currentPermission = getNotificationPermission();
    if (currentPermission === "denied") {
      return {
        success: false,
        error:
          "Разрешение на уведомления заблокировано. Пожалуйста, включите их в настройках браузера.",
      };
    }

    // Инициализация Firebase
    const messagingInstance = await initializeFirebase();
    if (!messagingInstance) {
      return {
        success: false,
        error: "Не удалось инициализировать систему уведомлений",
      };
    }

    // Запрос разрешения
    const permission = await Notification.requestPermission();

    if (permission !== "granted") {
      return {
        success: false,
        error: "Разрешение на уведомления не предоставлено",
      };
    }

    // Получение токена
    try {
      const token = await messagingInstance.getToken({
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });

      if (!token) {
        return {
          success: false,
          error: "Не удалось получить токен для уведомлений",
        };
      }

      return {
        success: true,
        token,
      };
    } catch (tokenError) {
      console.error("Ошибка получения токена:", tokenError);
      return {
        success: false,
        error: "Ошибка получения токена для уведомлений",
      };
    }
  } catch (error) {
    console.error("Ошибка запроса разрешения на уведомления:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Неизвестная ошибка",
    };
  }
};

/**
 * Сбрасывает состояние инициализации (для тестирования)
 */
export const resetFirebaseState = () => {
  isInitialized = false;
  messaging = null;
};
