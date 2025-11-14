import { FC, useEffect, useRef, useState } from "react";
import { Typography } from "../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import { NavMenuOrg } from "../../../shared/ui/NavMenuOrg";
import bacground from "../../../app/icons/announcements/bacground.png";
import reviews from "../../../app/icons/announcements/reviews.svg";
import { Notification, NotificationType } from "./model/notifications";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import { useNavigate } from "@tanstack/react-router";
import { Profile } from "../../profile/model/profile";
import { apiService } from "../../../services/api/ApiService";

interface Props {
  notifications: Notification[];
  user: Profile;
}

export const Notifications: FC<Props> = function Notifications({
  notifications,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [readNotifications, setReadNotifications] = useState<Set<string>>(new Set());

  // Прокручиваем вниз при загрузке компонента
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  // Используем Intersection Observer для отметки видимых уведомлений как прочитанных
  useEffect(() => {
    const observer = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const notificationId = entry.target.getAttribute("data-notification-id");
            if (notificationId && !readNotifications.has(notificationId)) {
              // Найдём уведомление в массиве
              const notification = notifications.find(n => n.id === notificationId);
              
              // Отправляем PATCH только если уведомление не прочитано
              if (notification && !notification.isRead) {
                try {
                  await apiService.patch({
                    url: `/notification/${notificationId}`,
                    dto: { isRead: true },
                  });
                  setReadNotifications(prev => new Set([...prev, notificationId]));
                } catch (error) {
                  console.error(`Error marking notification ${notificationId} as read:`, error);
                }
              }
            }
          }
        }
      },
      { threshold: 0.5 } // Срабатывает когда 50% элемента видимо
    );

    // Наблюдаем за всеми уведомлениями
    const notificationElements = document.querySelectorAll("[data-notification-id]");
    notificationElements.forEach(el => observer.observe(el));

    return () => {
      notificationElements.forEach(el => observer.unobserve(el));
      observer.disconnect();
    };
  }, [notifications, readNotifications]);

  const getColorByType = (type: string) => {
    const typeToColorMap: Record<string, string> = {
      [NotificationType.POSITIVE]: "bg-green-500",
      [NotificationType.NEGATIVE]: "bg-red",
      [NotificationType.NEUTRAL]: "bg-gray-400",
      [NotificationType.NONE]: "bg-transparent",
    };
    return typeToColorMap[type] || "bg-transparent";
  };
  // Функция для форматирования даты в "дд.мм.гггг"
  const formatDate = (dateString: string | Date) => {
    const date =
      typeof dateString === "string" ? new Date(dateString) : dateString;
    return date.toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  // Группируем уведомления по дате
  const groupNotificationsByDate = (notifications: Notification[]) => {
    return notifications.reduce<Record<string, Notification[]>>(
      (acc, notification) => {
        const dateKey = formatDate(notification.createdAt);
        if (!acc[dateKey]) {
          acc[dateKey] = [];
        }
        acc[dateKey].push(notification);
        return acc;
      },
      {}
    );
  };
  const groupedNotifications = groupNotificationsByDate(notifications);

  // Сортируем даты в прямом порядке (старые вверху, новые внизу)
  const sortedDates = Object.keys(groupedNotifications).sort((a, b) => {
    const [dayA, monthA, yearA] = a.split(".").map(Number);
    const [dayB, monthB, yearB] = b.split(".").map(Number);
    const dateA = new Date(yearA, monthA - 1, dayA);
    const dateB = new Date(yearB, monthB - 1, dayB);
    return dateA.getTime() - dateB.getTime(); // старые даты первыми
  });

  return (
    <div className="min-h-screen relative">
      <img
        className="fixed inset-0 w-full h-screen object-cover z-0"
        src={bacground}
        alt=""
      />

      {notifications.length > 0 ? (
        <div className="relative z-10 min-h-screen py-4 px-4 mb-20">
          {sortedDates.map((date) => {
            const items = groupedNotifications[date];
            // Сортируем уведомления внутри каждой даты (старые первыми)
            const sortedItems = [...items].sort(
              (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
            );

            return (
              <div key={date}>
                <div className="flex justify-center items-center">
                  <Typography
                    size={14}
                    weight={400}
                    color={COLORS_TEXT.gray100}
                    className="text-center font-medium mb-2 mt-8 rounded-full w-[28%] px-3 bg-[#FFFFFF80]"
                  >
                    {date}
                  </Typography>
                </div>

                {sortedItems.map((notification) => (
                  <div
                    key={notification.id}
                    data-notification-id={notification.id}
                    className="bg-[#FFFFFFBF] rounded-[18px] p-3 mt-2 flex items-start gap-3"
                  >
                    <div
                      className={`w-0.5 h-[84px] ${getColorByType(notification.type)} rounded-full`}
                    ></div>

                    <div className="flex-1 min-w-0">
                      <Typography
                        size={18}
                        weight={500}
                        color={COLORS_TEXT.totalBlack}
                        className="mb-2 break-words w-full"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {notification.title}
                      </Typography>

                      <Typography
                        size={14}
                        weight={400}
                        color={COLORS_TEXT.totalBlack}
                        className="leading-5 break-words w-full whitespace-normal"
                        style={{
                          wordBreak: "break-word",
                          overflowWrap: "break-word",
                        }}
                      >
                        {notification.message}
                      </Typography>

                      {notification.type === NotificationType.NEGATIVE && (
                        <div className="mt-1">
                          <span
                            className="text-[14px] font-semibold text-blue200 cursor-pointer"
                            onClick={() => navigate({ to: "/help/TermsOfUse" })}
                          >
                            {t("PolitikLearn")}
                          </span>
                        </div>
                      )}

                      <Typography
                        size={14}
                        weight={400}
                        color={COLORS_TEXT.gray100}
                        className="text-right"
                      >
                        {new Date(notification.createdAt).toLocaleTimeString(
                          "ru-RU",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </Typography>
                    </div>
                  </div>
                ))}
              </div>
            );
          })}
          {/* Маркер для автоматической прокрутки вниз */}
          <div ref={bottomRef} />
        </div>
      ) : (
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
      )}

      <NavMenuOrg />
    </div>
  );
};
