import { useNavigate } from "@tanstack/react-router";
import { FC } from "react";
import { Announcements } from "../../app/icons/navbar/announcements";
import { Star } from "../../app/icons/navbar/star";
import { COLORS_BACKGROUND, COLORS_TEXT } from "./colors";
import { Profile } from "../../app/icons/navbar/profile"; 
import { Notifications} from "../../app/icons/navbar/notifications";
import { useTranslation } from "react-i18next";
import { Booking } from "../../app/icons/navbar/booking";

export const NavMenuOrg: FC = function NavMenuOrg() {
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
      className={`fixed bottom-0 left-0 z-50 pb-[8px] pt-[5px] w-full flex justify-center ${COLORS_BACKGROUND.almostWhite}`}
    >
      <ul className="flex justify-between w-full px-4">
        <li className="w-[68px]" onClick={() => navigate({
          to: "/announcements"
        })}>
          <div className="flex justify-center items-center flex-col cursor-pointer">
            <Announcements 
              strokeColor={getStrokeColor("announcements")}
              fillColor={getFillColor("announcements")} 
              fillColorMask = {getFillColorMask("announcements")}
            />
            <span
              className={`${
                location.pathname.includes("announcements")
                  ? COLORS_TEXT.blue200
                  : COLORS_TEXT.gray100
              } text-[10px]`}
            >
              {t("Объявления")}
            </span>
          </div>
        </li>
        <li className="w-[68px]" onClick={() => navigate({
          to: "/reviews"
        })}>
          <div className="flex justify-center items-center flex-col cursor-pointer">
            <Star 
              strokeColor={getStrokeColor("reviews")}
              fillColor={getFillColor("reviews")} 
            />
            <span
              className={`${
                location.pathname.includes("reviews")
                  ? COLORS_TEXT.blue200
                  : COLORS_TEXT.gray100
              } text-[10px]`}
            >
              {"Отзывы"}
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
