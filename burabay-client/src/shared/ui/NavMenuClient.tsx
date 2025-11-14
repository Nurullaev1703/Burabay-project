import { useNavigate } from "@tanstack/react-router";
import { FC, useRef, useState, useEffect } from "react";
import { Map } from "../../app/icons/navbar/map"; 
import { COLORS_BACKGROUND, COLORS_TEXT } from "./colors";
import { ProfileIcon } from "../../app/icons/navbar/profile"; 
import { Notifications} from "../../app/icons/navbar/notifications";
import { useTranslation } from "react-i18next";
import { Main} from "../../app/icons/navbar/main"
import { Booking} from "../../app/icons/navbar/booking"
import { apiService } from "../../services/api/ApiService";


export const NavMenuClient: FC = function NavMenuClient() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState<boolean>(false);

  // Проверяем непрочитанные уведомления при монтировании и каждую минуту
  useEffect(() => {
    const checkNotifications = async () => {
      try {
        const response = await apiService.get({
          url: "/notification/check-notifications",
        });
        console.log("Notifications response:", response);
        // Обрабатываем варианты ответа
        let hasUnread = false;
        if (typeof response === "boolean") {
          hasUnread = response;
        } else if (typeof response.data === "boolean") {
          hasUnread = response.data;
        } else if (response.data && typeof response.data === "object") {
          hasUnread = (response.data as any).has_unread || false;
        }
        console.log("Has unread notifications:", hasUnread);
        setHasUnreadNotifications(hasUnread);
      } catch (error) {
        console.error("Error checking notifications:", error);
      }
    };

    // Проверяем сразу при загрузке
    checkNotifications();

    // Устанавливаем интервал для проверки каждую минуту (60000 мс)
    const intervalId = setInterval(checkNotifications, 60000);

    // Очищаем интервал при размонтировании компонента
    return () => clearInterval(intervalId);
  }, []);

  const getStrokeColor = (path: string) =>
    location.pathname.includes(path) ? "#0A7D9E" : "#999999";

  const getFillColor = (path: string) =>
    location.pathname.includes(path) ? "#0A7D9E" : "#FFFFFF"; 

  const getFillColorMask = (path: string) =>
    location.pathname.includes(path) ? "#FFFFFF" : "#999999";

  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      if (location.pathname === "/main") {
        // Двойной клик - скроллим наверх
        sessionStorage.removeItem("mainPageScroll");
        // Ищем скролируемый контейнер
        const scrollableElement = document.querySelector(
          ".ios-scrollable-content"
        ) as HTMLElement;
        if (scrollableElement) {
          scrollableElement.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }
    } else {
      clickTimeout.current = setTimeout(() => {
        // Одиночный клик - переходим на главную с сохранением скролла
        navigate({ to: "/main" });
        clickTimeout.current = null;
      }, 250);
    }
  };


  return (
    <nav
      className={`fixed bottom-0 left-0 z-50 w-full pb-1 flex justify-center ${COLORS_BACKGROUND.white}`}
    >
      <ul className="flex justify-between w-full px-4 items-center">
        <li
          className="w-1/5 pb-4 pt-2"
          onClick={handleClick}
        >
          <div className="flex justify-center items-center flex-col cursor-pointer">
            <Main
              strokeColor={getStrokeColor("main")}
              fillColor={getFillColor("main")}
              fillColorMask={getFillColorMask("main")}
            />
            <span
              className={`${
                location.pathname.includes("main")
                  ? COLORS_TEXT.blue200
                  : COLORS_TEXT.gray100
              } text-[10px]`}
            >
              {t("mainPage")}
            </span>
          </div>
        </li>
        <li
          className="w-1/5 pb-4 pt-2"
          onClick={() =>
            navigate({
              to: "/mapNav",
            })
          }
        >
          <div className="flex justify-center items-center flex-col cursor-pointer">
            <Map
              strokeColor={getStrokeColor("map")}
              fillColor={getFillColor("map")}
            />
            <span
              className={`${
                location.pathname.includes("map")
                  ? COLORS_TEXT.blue200
                  : COLORS_TEXT.gray100
              } text-[10px]`}
            >
              {t("mapNav")}
            </span>
          </div>
        </li>
        <li
          className="w-1/5 pb-4 pt-2"
          onClick={() =>
            navigate({
              to: "/booking/tourist",
            })
          }
        >
          <div className="flex justify-center items-center flex-col cursor-pointer">
            <Booking
              strokeColor={getStrokeColor("booking")}
              fillColor={getFillColor("booking")}
            />
            <span
              className={`${
                location.pathname.includes("booking")
                  ? COLORS_TEXT.blue200
                  : COLORS_TEXT.gray100
              } text-[10px]`}
            >
              {t("book")}
            </span>
          </div>
        </li>
        <li
          className="w-1/5 pb-4 pt-2"
          onClick={() =>
            navigate({
              to: "/notifications",
            })
          }
        >
          <div className="flex justify-center items-center flex-col cursor-pointer relative">
            {hasUnreadNotifications && (
              <div className="absolute top-[0px] -right-[-20px] w-[5px] h-[5px] bg-red rounded-full"></div>
            )}
            <Notifications
              strokeColor={getStrokeColor("notifications")}
              fillColor={getFillColor("notifications")}
            />
            <span
              className={`${
                location.pathname.includes("notifications")
                  ? COLORS_TEXT.blue200
                  : COLORS_TEXT.gray100
              } text-[10px]`}
            >
              {t("notific")}
            </span>
          </div>
        </li>
        <li
          className="w-1/5 pb-4 pt-2"
          onClick={() =>
            navigate({
              to: "/profile",
            })
          }
        >
          <div className="flex justify-center items-center flex-col cursor-pointer">
            <ProfileIcon
              strokeColor={getStrokeColor("profile")}
              fillColor={getFillColor("profile")}
            />
            <span
              className={`${
                location.pathname.includes("profile")
                  ? COLORS_TEXT.blue200
                  : COLORS_TEXT.gray100
              } text-[10px]`}
            >
              {t("profile")}
            </span>
          </div>
        </li>
      </ul>

    </nav>
  );
};
