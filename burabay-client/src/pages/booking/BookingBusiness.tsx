import { FC, useCallback, useMemo } from "react";
import { Typography } from "../../shared/ui/Typography";
import { NavMenuOrg } from "../../shared/ui/NavMenuOrg";
import { useTranslation } from "react-i18next";
import BookingWaitingIcon from "../../app/icons/booking-waiting.svg";
import { TabMenu, TabMenuItem } from "../../shared/ui/TabMenu";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import FilterIcon from "../../app/icons/main/filter.svg";
import ActiveFilterIcon from "../../app/icons/active-filter.svg";
import SearchIcon from "../../app/icons/search-icon.svg";

interface Props {}

export const BookingBusiness: FC<Props> = function BookingBusiness() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  
  /* @ts-ignore */
  const queryParams = new URLSearchParams(location.search);
  const onlinePayment = queryParams.get("onlinePayment") === "true";
  const onSidePayment = queryParams.get("onSidePayment") === "true";
  const canceled = queryParams.get("canceled") === "true";
  const status = queryParams.get("status") || "ACTIVE";
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
        to: "/booking/business",
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
      {/* Фиксированный хедер с табами и поиском */}
      <div className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm">
        {/* Табы */}
        <div className="py-4 px-4 bg-white">
          <TabMenu
            data={TABS_DATA}
            activeIndex={activeIndex}
            onChangeIndex={handleTabChange}
          />
        </div>

        <div className="flex justify-between items-center text-center gap-3 px-4 bg-white pb-4">
          <div className="w-full flex items-center gap-2 bg-gray-100 rounded-full px-2 py-2 shadow-sm">
            <img src={SearchIcon} alt="Поиск" />
            <input
              type="text"
              placeholder={t("search")}
              className="flex-grow bg-transparent outline-none text-gray-700"
              disabled
            />
          </div>
          <Link
            to="/booking/filter"
            search={{
              onlinePayment,
              onSidePayment,
              canceled,
              status,
            }}
          >
            <img
              src={isFilterActive ? ActiveFilterIcon : FilterIcon}
              alt="Фильтр"
            />
          </Link>
        </div>
      </div>

      {/* Отступ для фиксированного хедера */}
      <div className="h-[140px]"></div>

      {/* Основной контент с пустым состоянием */}
      <div className="flex justify-center flex-col items-center flex-grow min-h-[calc(100vh-140px)] mb-32">
        <img src={BookingWaitingIcon} className="w-40 h-40 mb-8" alt="" />
        <div className="flex flex-col justify-center items-center gap-2">
          <Typography size={18} weight={500}>
            {t("noBooking")}
          </Typography>
          <Typography size={16} weight={400} align="center" className="w-4/5">
            {t("bookingAlertBusiness")}
          </Typography>
        </div>
      </div>
      <NavMenuOrg />
    </section>
  );
};
