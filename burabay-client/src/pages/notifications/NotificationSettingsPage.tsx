import { FC, useEffect, useState } from "react";
import { Header } from "../../components/Header";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import BackIcon from "../../app/icons/back-icon.svg";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { Button } from "../../shared/ui/Button";
import {
  getNotificationPermission,
  requestNotificationPermission,
  isNotificationSupported,
  isIOS,
} from "../../services/firebase/firebase-init";
import { apiService } from "../../services/api/ApiService";
import { notificationService } from "../../services/storage/Factory";

export const NotificationSettingsPage: FC =
  function NotificationSettingsPage() {
    const { t } = useTranslation();
    const [permission, setPermission] =
      useState<NotificationPermission>("default");
    const [isSupported, setIsSupported] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    useEffect(() => {
      setIsSupported(isNotificationSupported());
      if (isNotificationSupported()) {
        setPermission(getNotificationPermission());
      }
    }, []);

    const handleEnableNotifications = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      try {
        const result = await requestNotificationPermission();

        if (!result.success) {
          setError(result.error || t("notificationEnableError"));
          setPermission(getNotificationPermission());
          return;
        }

        if (result.token) {
          // Отправляем токен на сервер
          try {
            const response = await apiService.post({
              url: "/notification/pushToken",
              dto: {
                pushToken: result.token,
              },
            });

            if (response.status === 200 || response.status === 201) {
              notificationService.setValue(true);
              setPermission("granted");
              setSuccess(t("notificationEnabled"));
            } else {
              throw new Error("Ошибка сохранения токена");
            }
          } catch (apiError) {
            setError(t("notificationTokenSaveError"));
          }
        }
      } catch (error) {
        setError(t("notificationEnableError"));
      } finally {
        setIsLoading(false);
      }
    };

    const getStatusText = () => {
      if (!isSupported) {
        return t("notificationNotSupported");
      }

      switch (permission) {
        case "granted":
          return t("notificationEnabled");
        case "denied":
          return t("notificationBlocked");
        case "default":
          return t("notificationNotAsked");
        default:
          return t("notificationUnknown");
      }
    };

    const getStatusColor = () => {
      switch (permission) {
        case "granted":
          return "text-green-600";
        case "denied":
          return "text-red-600";
        default:
          return "text-gray-600";
      }
    };

    return (
      <div className="min-h-screen bg-almostWhite">
        <Header>
          <div className="flex justify-between items-center">
            <IconContainer align="start" action={() => history.back()}>
              <img src={BackIcon} alt="" />
            </IconContainer>
            <Typography size={18} weight={500} color={COLORS_TEXT.blue200}>
              {t("notificationSettings")}
            </Typography>
            <div className="w-10"></div>
          </div>
        </Header>

        <section className="p-4">
          <div className="bg-white rounded-lg p-4 mb-4">
            <Typography size={16} weight={500} className="mb-2">
              {t("notificationStatus")}
            </Typography>
            <Typography size={14} className={`mb-4 ${getStatusColor()}`}>
              {getStatusText()}
            </Typography>

            {!isSupported && (
              <div className="p-3 bg-yellow-100 border border-yellow-400 rounded mb-4">
                <Typography size={14} className="text-yellow-800">
                  {t("notificationNotSupportedDesc")}
                </Typography>
              </div>
            )}

            {isIOS() && (
              <div className="p-3 bg-blue-100 border border-blue-400 rounded mb-4">
                <Typography size={14} className="text-blue-800">
                  {t("iosNotificationInfo")}
                </Typography>
              </div>
            )}

            {permission === "denied" && (
              <div className="p-3 bg-red-100 border border-red-400 rounded mb-4">
                <Typography size={14} className="text-red-800">
                  {t("notificationBlockedDesc")}
                </Typography>
              </div>
            )}

            {success && (
              <div className="p-3 bg-green-100 border border-green-400 rounded mb-4">
                <Typography size={14} className="text-green-800">
                  {success}
                </Typography>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-100 border border-red-400 rounded mb-4">
                <Typography size={14} className="text-red-800">
                  {error}
                </Typography>
              </div>
            )}

            {permission !== "granted" && isSupported && (
              <Button
                onClick={handleEnableNotifications}
                disabled={isLoading || permission === "denied"}
                className="w-full"
              >
                {isLoading
                  ? t("loading")
                  : permission === "denied"
                    ? t("notificationBlockedButton")
                    : t("enableNotifications")}
              </Button>
            )}

            {permission === "granted" && (
              <div className="flex items-center justify-center text-green-600">
                <svg
                  className="w-6 h-6 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <Typography size={14}>
                  {t("notificationActivelyEnabled")}
                </Typography>
              </div>
            )}
          </div>

          <div className="bg-white rounded-lg p-4">
            <Typography size={16} weight={500} className="mb-2">
              {t("aboutNotifications")}
            </Typography>
            <Typography size={14} className="text-gray-600 leading-relaxed">
              {t("notificationDescription")}
            </Typography>
          </div>
        </section>
      </div>
    );
  };
