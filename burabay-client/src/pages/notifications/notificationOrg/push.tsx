import { useEffect, useState } from "react";
import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/messaging';
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { apiService } from "../../../services/api/ApiService";
import { notificationService } from "../../../services/storage/Factory";
import { useTranslation } from "react-i18next";


interface NotificationModalProps {

}

export const NotificationModal: React.FC<NotificationModalProps> = ({ }) => {
    const [_pushToken, setPushToken] = useState<string | null>(null)
    const [showNotificationModal, setShowNotificationModal] = useState(false)
    const {t} = useTranslation()
        // Инициализация Firebase
        const firebaseConfig = {
            apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
            authDomain: import.meta.env.VITE_AUTH_DOMAIN,
            projectId: import.meta.env.VITE_PROJECT_ID,
            storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
            messagingSenderId: import.meta.env.VITE_MESSAGIGD_SENDER_ID,
            appId: import.meta.env.VITE_APP_ID,
            measurementId: import.meta.env.VITE_MEASUREMENT_ID
        };
    
        useEffect(() => {
            // Инициализация Firebase приложения с конфигурацией
            firebase.initializeApp(firebaseConfig);
    
            // Регистрация Service Worker для обработки push-уведомлений
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker
                    .register('/firebase-messaging-sw.js')
                    .then((registration) => {
                        console.log('Service Worker registered with scope:', registration.scope);
                    })
                    .catch((error) => {
                        console.error('Service Worker registration failed:', error);
                    });
            }
    
            // Показать модальное окно для запроса разрешения на уведомления
            setShowNotificationModal(true);
        }, []);

        
        const handleAllowNotifications = () => {
            // Получение экземпляра Firebase Cloud Messaging
            const messaging = firebase.messaging();
            setShowNotificationModal(false);
            // Запрос разрешения на отправку уведомлений
            Notification.requestPermission()
                .then((permission) => {
                    if (permission === 'granted') {
                        // Получение токена для push-уведомлений
                        return messaging.getToken();
                    } else {
                        console.error('Permission not granted');
                        return null;
                    }
                })
                .then(async(token: string | null) => {
                    if (token) {
                        console.log('Push token:', token);
                        setPushToken(token);
                        // Отправка токена на сервер для сохранения
                        await apiService.post({
                            url: "/notification/pushToken",
                            dto: {
                                pushToken: token
                            }
                        }) 
                    }
                })
                .catch((error: any) => {
                    console.error('Error getting push token:', error);
                })
                .finally(() => {
                    // Скрыть модальное окно после обработки разрешения

                    notificationService.setValue(true)
                });
        };
    
        const handleDenyNotifications = () => {
            // Скрыть модальное окно, если пользователь отказался от уведомлений
            setShowNotificationModal(false);
            notificationService.setValue(false)
        };

  return (
      <div className={`fixed  top-0 h-screen left-0 flex justify-center items-center w-full bg-black bg-opacity-70 z-50 ${showNotificationModal ? "" : "hidden"}`} >
      <div className="border-white w-header rounded-lg bg-white p-4">
        <Typography className="mb-2" align="center" size={16} weight={700}>{t("aproveNoti")}</Typography>
        <Typography className="leading-none" align="center" size={14} weight={400}>{t("withoutNotiAprove")}</Typography>
        <div className="justify-center flex flex-col items-center">
          <Button onClick={handleAllowNotifications} className="mb-2 mt-4 ">{t("aprove")}</Button>
          <Button mode="red" onClick={handleDenyNotifications} className="border-red border-2">{t("denied")}</Button>
        </div>
      </div>
    </div>
  );
};
