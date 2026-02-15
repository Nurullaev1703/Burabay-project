import { useEffect, useState } from "react";
import React from "react";
import { Typography } from "../../../shared/ui/Typography";
import { Button } from "../../../shared/ui/Button";
import { apiService } from "../../../services/api/ApiService";
import {
  notificationService,
  roleService,
} from "../../../services/storage/Factory";
import { useTranslation } from "react-i18next";
import { ROLE_TYPE } from "../../auth/model/auth-model";
import {
  requestNotificationPermission,
  isNotificationSupported,
  getNotificationPermission,
  isIOS,
  isIOSStandalone,
} from "../../../services/firebase/firebase-init";

interface NotificationModalProps {}

export const NotificationModal: React.FC<NotificationModalProps> = ({}) => {
  const [_pushToken, setPushToken] = useState<string | null>(null);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useTranslation();

  useEffect(() => {
    // Проверяем роль пользователя - администраторам уведомления не нужны
    if (roleService.hasValue() && roleService.getValue() === ROLE_TYPE.ADMIN) {
      console.log("Администратор не получает уведомления");
      notificationService.setValue(false);
      return;
    }

    // Проверяем, поддерживаются ли уведомления
    if (!isNotificationSupported()) {
      console.warn("Уведомления не поддерживаются в этом браузере");
      // Сохраняем статус, чтобы не показывать модалку снова
      notificationService.setValue(false);
      return;
    }

    // Проверяем текущий статус разрешения
    const currentPermission = getNotificationPermission();

    // Если уже есть разрешение, не показываем модалку
    if (currentPermission === "granted") {
      console.log("Разрешение на уведомления уже предоставлено");
      notificationService.setValue(true);
      return;
    }

    // Если разрешение заблокировано, не показываем модалку
    if (currentPermission === "denied") {
      console.log("Разрешение на уведомления заблокировано пользователем");
      notificationService.setValue(false);
      return;
    }

    // Показываем модальное окно только если статус "default" (не спрашивали)
    setShowNotificationModal(true);
  }, []);

  const handleAllowNotifications = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Запрашиваем разрешение и получаем токен
      const result = await requestNotificationPermission();

      if (!result.success) {
        setError(result.error || t("notificationEnableError"));
        console.error("Ошибка получения разрешения:", result.error);
        return;
      }

      if (result.token) {
        setPushToken(result.token);
        console.log(
          "Токен успешно получен:",
          result.token.substring(0, 20) + "..."
        );

        // Отправляем токен на сервер
        try {
          const response = await apiService.post({
            url: "/notification/pushToken",
            dto: {
              pushToken: result.token,
            },
          });

          if (response.status === 200 || response.status === 201) {
            console.log("Токен успешно сохранен на сервере");
            // Сохраняем статус ТОЛЬКО после успешной отправки токена
            notificationService.setValue(true);
            setShowNotificationModal(false);
          } else {
            throw new Error(`Ошибка сохранения токена: ${response.status}`);
          }
        } catch (apiError) {
          console.error("Ошибка отправки токена на сервер:", apiError);
          setError(t("notificationTokenSaveError"));
          // НЕ сохраняем статус, если токен не отправлен
        }
      }
    } catch (error) {
      console.error("Непредвиденная ошибка:", error);
      setError(t("notificationEnableError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDenyNotifications = () => {
    console.log("Пользователь отказался от уведомлений");
    setShowNotificationModal(false);
    // Сохраняем отказ, чтобы не показывать модалку снова
    notificationService.setValue(false);
  };

  // Не показываем модалку, если она не должна быть видна
  if (!showNotificationModal) {
    return null;
  }

  return (
    <div className="fixed top-0 h-screen left-0 flex justify-center items-center w-full bg-black bg-opacity-70 z-50">
      <div className="border-white w-header rounded-lg bg-white p-4 max-w-[90%]">
        <Typography className="mb-2" align="center" size={16} weight={700}>
          {t("aproveNoti")}
        </Typography>
        <Typography
          className="leading-none"
          align="center"
          size={14}
          weight={400}
        >
          {t("withoutNotiAprove")}
        </Typography>

        {/* Показываем ошибку, если есть */}
        {error && (
          <div className="mt-3 p-2 bg-red-100 border border-red-400 rounded">
            <Typography align="center" size={12} className="text-red-700">
              {error}
            </Typography>
          </div>
        )}

        {/* Специальное сообщение для iOS */}
        {isIOS() && !isIOSStandalone() && (
          <div className="mt-3 p-2 bg-blue-100 border border-blue-400 rounded">
            <Typography align="center" size={12} className="text-blue-700">
              {t("iosNotificationHint")}
            </Typography>
          </div>
        )}

        <div className="justify-center flex flex-col items-center">
          <Button
            onClick={handleAllowNotifications}
            className="mb-2 mt-4"
            disabled={isLoading}
          >
            {isLoading ? t("loading") : t("aprove")}
          </Button>
          <Button
            mode="red"
            onClick={handleDenyNotifications}
            className="border-red border-2"
            disabled={isLoading}
          >
            {t("denied")}
          </Button>
        </div>
      </div>
    </div>
  );
};
