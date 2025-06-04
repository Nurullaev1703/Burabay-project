import { useNavigate } from "@tanstack/react-router";
import { FC, useRef } from "react";
import { Map } from "../../app/icons/navbar/map"; 
import { COLORS_BACKGROUND, COLORS_TEXT } from "./colors";
import { ProfileIcon } from "../../app/icons/navbar/profile"; 
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

  const clickTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleClick = () => {
    if (clickTimeout.current) {
      clearTimeout(clickTimeout.current);
      clickTimeout.current = null;
      if (location.pathname === "/main") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } else {
      clickTimeout.current = setTimeout(() => {
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
