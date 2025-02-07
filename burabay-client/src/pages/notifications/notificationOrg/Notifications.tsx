import { FC } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import { NavMenuOrg } from "../../../shared/ui/NavMenuOrg";
import bacground from "../../../app/icons/announcements/bacground.png";
import reviews from "../../../app/icons/announcements/reviews.svg";
import { Notification, NotificationType } from "./model/notifications";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import {useNavigate } from "@tanstack/react-router";
import { Profile } from "../../profile/model/profile";


interface Props {
  notifications: Notification[];
  user: Profile
}

export const Notifications: FC<Props> = function Notifications({
  notifications,
  user,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  console.log("Текущий пользователь:", user.email);

  notifications.forEach((notif) => {
    console.log("Уведомление:", notif.title);
    console.log("Пользователи уведомления:", notif.users);
  });
  const userNotifications = notifications.filter(
    (notification) => notification.email === user.email
  );
  console.log("📌 Notifications:", notifications);
  console.log("Отфильтрованные уведомления:", userNotifications);
  const getColorByType = (type: string) => {
    const typeToColorMap: Record<string, string> = {
      [NotificationType.POSITIVE]: "bg-green-500",
      [NotificationType.NEGATIVE]: "bg-red",
      [NotificationType.NEUTRAL]: "bg-gray-400",
      [NotificationType.NONE]: "bg-transparent",
    };
    return typeToColorMap[type] || "bg-transparent";
  };

  return (
    <div className="min-h-screen relative">
      <img
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={bacground}
        alt=""
      />

      {userNotifications.length > 0 ? (
        <div className="relative z-10 min-h-screen py-4 px-4 mb-20">
          {/* Отображение даты */}
          <div className="flex justify-center items-center">
            <Typography
              size={14}
              weight={400}
              color={COLORS_TEXT.gray100}
              className="text-center font-medium mb-2 mt-20 rounded-full  w-[28%] px-3 bg-[#FFFFFF80]"
            >
              {new Date().toLocaleDateString("ru-RU", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })}
            </Typography>
          </div>

          {userNotifications.map((notification) => (
            <div
              key={notification.id}
              className="bg-[#FFFFFFBF] rounded-[18px] p-3 mt-2 flex items-start gap-3"
            >
              <div
                className={`w-0.5 h-[84px] ${getColorByType(notification.type)} rounded-full`}
              ></div>

              <div className="flex-1">
                <Typography
                  size={18}
                  weight={500}
                  color={COLORS_TEXT.totalBlack}
                  className="mb-2"
                >
                  {notification.title}
                </Typography>

                <Typography
                  size={14}
                  weight={400}
                  color={COLORS_TEXT.totalBlack}
                  className="leading-5 break-all whitespace-normal"
                >
                  {notification.message}
                  {notification.type === NotificationType.NEGATIVE && (
                    <Typography
                      size={14}
                      weight={600}
                      color={COLORS_TEXT.blue200}
                      onClick={() => navigate({
                        to: "/help/TermsOfUse"
                      })}
                      className="cursor-pointer"
                    >
                      {t("PolitikLearn")}
                    </Typography>
                  )}
                </Typography>

                <Typography
                  size={14}
                  weight={400}
                  color={COLORS_TEXT.gray100}
                  className="text-right"
                >
                  {new Date(notification.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <img
            className="absolute inset-0 w-full h-full object-cover z-0"
            src={bacground}
            alt=""
          />
          <div className="relative z-10 flex justify-center items-center min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-6 w-[90%] max-w-md mx-auto">
              <img src={reviews} className="w-40 h-40 mb-8 mx-auto" alt="" />
              <div className="flex flex-col justify-center items-center gap-2 mb-12">
                <Typography size={18} weight={500}>
                  {t("notificationsNav")}
                </Typography>
              </div>
            </div>
          </div>
        </>
      )}

      <NavMenuOrg />
    </div>
  );
};