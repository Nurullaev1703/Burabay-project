import { useNavigate } from "@tanstack/react-router";
import { FC } from "react";
import { Map } from "../../app/icons/navbar/map"; 
import { COLORS_BACKGROUND, COLORS_TEXT } from "./colors";
import { Profile } from "../../app/icons/navbar/profile"; 
import { Notifications} from "../../app/icons/navbar/notifications";
import { useTranslation } from "react-i18next";
import { Main} from "../../app/icons/navbar/main"
import { Booking} from "../../app/icons/navbar/booking"

export const NavMenuClient: FC = function NavMenuClient() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getStrokeColor = (path: string) =>
    location.pathname.includes(path) ? "#0A7D9E" : "#999999";

  const getFillColor = (path: string) =>
    location.pathname.includes(path) ? "#0A7D9E" : "#FFFFFF"; 

  const getFillColorMask = (path: string) =>
    location.pathname.includes(path) ? "#FFFFFF" : "#999999";

  return (
    <nav
      className={`fixed bottom-0 left-0 z-50 pb-[8px] pt-[5px] w-full flex justify-center ${COLORS_BACKGROUND.white}`}
    >
      <ul className="flex justify-between w-full px-4">
        <li className="w-[68px]" onClick={() => navigate({
          to: "/main"
        })}>
          <div className="flex justify-center items-center flex-col cursor-pointer">
            <Main 
              strokeColor={getStrokeColor("main")}
              fillColor={getFillColor("main")} 
              fillColorMask = {getFillColorMask("main")}
            />
            <span
              className={`${
                location.pathname.includes("main")
                  ? COLORS_TEXT.blue200
                  : COLORS_TEXT.gray100
              } text-[10px]`}
            >
              {t("Главная")}
            </span>
          </div>
        </li>

        <li className="w-[68px]" onClick={() => navigate({
          to: "/mapNav"
        })}>
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
              {t("Карта")}
            </span>
          </div>
        </li>
        <li className="w-[68px]" onClick={() => navigate({
          to: "/booking"
        })}>
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
              {t("Брони")}
            </span>
          </div>
        </li>
        <li className="w-[68px]" onClick={() => navigate({
          to: "/notifications"
        })}>
          <div className="flex justify-center items-center flex-col cursor-pointer">
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
              {t("Уведомления")}
            </span>
          </div>
        </li>
        <li className="w-[68px]" onClick={() => navigate({
          to: "/profile"
        })}>
          <div className="flex justify-center items-center flex-col cursor-pointer">
            <Profile 
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
              {t("Профиль")}
            </span>
          </div>
        </li>
      </ul>
    </nav>
  );
};
