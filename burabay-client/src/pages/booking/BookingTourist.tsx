import { FC, useCallback, useMemo } from "react";
import { Typography } from "../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import BookingWaitingIcon from "../../app/icons/booking-waiting.svg";
import { NavMenuClient } from "../../shared/ui/NavMenuClient";
import { TabMenu, TabMenuItem } from "../../shared/ui/TabMenu";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { COLORS_TEXT } from "../../shared/ui/colors";
import SearchIcon from "../../app/icons/search-icon.svg";
import FilterIcon from "../../app/icons/main/filter.svg";
import ActiveFilterIcon from "../../app/icons/active-filter.svg";

interface Props {}

export const BookingTourist: FC<Props> = function BookingTourist() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  /* @ts-ignore */
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get("status") || "ACTIVE";
  const onlinePayment = queryParams.get("onlinePayment") === "true";
  const onSidePayment = queryParams.get("onSidePayment") === "true";
  const canceled = queryParams.get("canceled") === "true";
  
  const isFilterActive = onlinePayment || onSidePayment || canceled;
  const activeIndex = status === "ACTIVE" ? 0 : 1;

  const TABS_DATA: TabMenuItem[] = useMemo(
    () => [
      {
        index: 0,
        title: t("active"),
      },
      {
        index: 1,
        title: t("archive"),
      },
    ],
    [t]
  );

  const handleTabChange = useCallback(
    (index: number) => {
      const newStatus = index === 0 ? "ACTIVE" : "DONE";
      navigate({
        to: "/booking/tourist",
        search: {
          status: newStatus,
          ...(onlinePayment && { onlinePayment: "true" }),
          ...(onSidePayment && { onSidePayment: "true" }),
          // Убираем фильтр "отменено" при переходе на таб "Активные"
          ...(canceled && index !== 0 && { canceled: "true" }),
        },
      });
    },
    [navigate, onlinePayment, onSidePayment, canceled]
  );

  return (
    <section className="bg-almostWhite min-h-screen">
      {/* Фиксированный хедер с табами */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
        <div className="py-4 px-4 bg-white">
          <TabMenu
            data={TABS_DATA}
            activeIndex={activeIndex}
            onChangeIndex={handleTabChange}
          />
        </div>
        
        {/* Поиск и фильтр */}
        <div className="flex items-center gap-2 px-4 pb-4 bg-white">
          <div className="flex items-center gap-3 flex-1 px-4 py-3 bg-almostWhite rounded-xl">
            <img src={SearchIcon} className="w-5 h-5" alt="Search" />
            <input
              type="text"
              placeholder={t("search")}
              disabled={true}
              className="flex-1 bg-transparent outline-none text-base text-gray-400 cursor-not-allowed"
            />
          </div>
          <Link
            to="/booking/filter"
            search={{ status }}
            className="flex items-center justify-center w-12 h-12 rounded-xl bg-almostWhite"
          >
            <img
              src={isFilterActive ? ActiveFilterIcon : FilterIcon}
              className="w-6 h-6"
              alt="Filter"
            />
          </Link>
        </div>
      </div>

      {/* Отступ для фиксированного хедера */}
      <div className="h-[140px]"></div>

      {/* Основной контент с пустым состоянием на весь экран */}
      <div className="flex justify-center flex-col items-center flex-grow min-h-[calc(100vh-140px)] mb-32">
        <img src={BookingWaitingIcon} className="w-40 h-40 mb-8" alt="" />
        <div className="flex flex-col justify-center items-center gap-2">
          <Typography size={18} weight={500}>
            {t("noBooking")}
          </Typography>
          <Typography size={16} weight={400} align="center" className="w-4/5">
            {t("bookingAlertTourist")}
          </Typography>
        </div>
        {activeIndex === 1 && (
          <Typography
            weight={400}
            align="center"
            color={COLORS_TEXT.gray100}
            className="mt-4"
          >
            {t("archivedBookingsInfo")}
          </Typography>
        )}
      </div>
      <NavMenuClient />
    </section>
  );
};
