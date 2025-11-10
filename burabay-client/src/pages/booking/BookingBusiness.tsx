import { FC, useCallback, useMemo, useState } from "react";
import { Typography } from "../../shared/ui/Typography";
import { NavMenuOrg } from "../../shared/ui/NavMenuOrg";
import { useTranslation } from "react-i18next";
import BookingWaitingIcon from "../../app/icons/booking-waiting.svg";
import { TabMenu, TabMenuItem } from "../../shared/ui/TabMenu";
import { useNavigate } from "@tanstack/react-router";

interface Props {}

export const BookingBusiness: FC<Props> = function BookingBusiness() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);

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
      setActiveIndex(index);
      const newStatus = index === 0 ? "ACTIVE" : "DONE";
      navigate({
        to: "/booking/business",
        search: {
          status: newStatus,
        },
      });
    },
    [navigate]
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
      </div>

      {/* Основной контент с пустым состоянием на весь экран */}
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
