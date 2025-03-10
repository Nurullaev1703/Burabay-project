import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { TSelectedBooking } from "../../model/booking";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import { formatPrice } from "../../../announcements/announcement/Announcement";
import { Button } from "../../../../shared/ui/Button";
import { CancelBooking } from "../../booking-page/selected-booking/modal/CancelBooking";
import { Announcement } from "../../../announcements/model/announcements";
import ArrowBottomIcon from "../../../../app/icons/profile/settings/arrow-bottom.svg";
import { Link } from "@tanstack/react-router";
import { Typography } from "../../../../shared/ui/Typography";

interface Props {
  announcement: Announcement;
  bookings: TSelectedBooking;
}

export const TouristBookingInfo: FC<Props> = function TouristBookingInfo({
  announcement,
  bookings,
}) {
  const [bookingsState, _] = useState<TSelectedBooking>(
    bookings || { bookings: [] }
  ); // Установка значения по умолчанию
  const [isCancel, setIsCancel] = useState<boolean>(false);
  const { t } = useTranslation();

  // Проверка на undefined
  if (!bookingsState || !bookingsState.bookings) {
    return <div>{t("noBookingsAvailable")}</div>; // Сообщение, если данные отсутствуют
  }
  const getDaySuffix = (days: number | undefined = 0) => {
    if (days % 10 === 1 && days % 100 !== 11) return t("daysV2"); // "день"
    if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
      return t("daysV2");
    }
    return t("daysV1");
  };
  return (
    <>
      {bookings.type === "Аренда" ? (
        <ul className="px-4">
          {bookingsState.bookings.map((b, index) => (
            <div
              key={b.bookingId}
              className={`mb-4 ${index === bookingsState.bookings.length - 1 ? "" : "border-b border-[#E4E9EA]"}`}
            >
              <ul className="mb-8">
                <li className="flex justify-between py-3.5 border-y border-[#E4E9EA]">
                  <span className="text-sm">{t("CheckInDate")}</span>
                  <span>{bookingsState.date}</span>
                </li>
                <li className="flex justify-between py-3.5 border-b border-[#E4E9EA]">
                  <span className="text-sm">{t("DepatureDate")}</span>
                  <span>{b.dateEnd}</span>
                </li>
                <li className="flex justify-between py-3.5 border-b border-[#E4E9EA]">
                  <span className="text-sm">{t("cost")}</span>
                  <span>{formatPrice(announcement.price)}</span>
                </li>
                <li className="flex justify-between py-3.5 border-b border-[#E4E9EA]">
                  <span className="text-sm">{t("totalDuration")}</span>
                  <span>
                    {b.days} {getDaySuffix(b.days)}
                  </span>
                </li>
                <li className="flex justify-between py-3.5 border-b border-[#E4E9EA]">
                  <div>
                    <span className="text-sm">
                      {b.payment_method === "online"
                        ? t("onlinePayment")
                        : t("onSidePayment")}
                    </span>
                    {b.isPaid && (
                      <span className={`text-sm ${COLORS_TEXT.access}`}>
                        {b.isPaid ? t("paid") : t("")}
                      </span>
                    )}
                  </div>
                  <span className={`${COLORS_TEXT.blue200}`}>
                    {formatPrice(b.price)}
                  </span>
                </li>
                <li className="py-3.5 border-b border-[#E4E9EA]">
                  <Link
                    className="flex justify-between"
                    to={`/mapNav?adId=${announcement.id}`}
                  >
                    <span>{t("locationOnMap")}</span>
                    <img src={ArrowBottomIcon} alt="Перейти" />
                  </Link>
                </li>
              </ul>
              {b.status !== "отменено" && (
                <Button
                  className="mb-4"
                  onClick={() => setIsCancel(true)}
                  mode="red"
                >
                  {t("cancelBooking")}
                </Button>
              )}
              <CancelBooking
                open={isCancel}
                onClose={() => setIsCancel(false)}
                bookingId={b.bookingId}
              />
            </div>
          ))}
        </ul>
      ) : (
        <ul className="px-4">
          {bookingsState.bookings.map((b, index) => (
            <div
              key={b.bookingId}
              className={`mb-4 ${index === bookingsState.bookings.length - 1 ? "" : "border-b border-[#E4E9EA]"}`}
            >
              <ul className="mb-8">
                <li className="flex justify-between py-3.5 border-y border-[#E4E9EA]">
                  <span className="text-sm">{t("date")}</span>
                  <span>{bookingsState.date}</span>
                </li>
                <li className="flex justify-between py-3.5 border-b border-[#E4E9EA]">
                  <span className="text-sm">{t("bookingTime")}</span>
                  {announcement.isFullDay ? (
                    <Typography size={14}>{t("aroundClockDays")}</Typography>
                  ) : (
                  <span>{b.time}</span>
                  )}
                </li>
                <li className="flex justify-between py-3.5 border-b border-[#E4E9EA]">
                  <span className="text-sm">{t("cost")}</span>
                  <span>{formatPrice(announcement.price)}</span>
                </li>
                <li className="flex justify-between py-3.5 border-b border-[#E4E9EA]">
                  <div>
                    <span className="text-sm">
                      {b.payment_method === "online"
                        ? t("onlinePayment")
                        : t("onSidePayment")}
                    </span>
                    {b.isPaid && (
                      <span className={`text-sm ${COLORS_TEXT.access}`}>
                        {b.isPaid ? t("paid") : t("")}
                      </span>
                    )}
                  </div>
                  <span className={`${COLORS_TEXT.blue200}`}>
                    {formatPrice(b.price)}
                  </span>
                </li>
                <li className="flex justify-between py-3.5 border-b border-[#E4E9EA]">
                  <span className="text-sm">{t("rate")}</span>
                  <span>
                    {b.rate === "Взрослый" ? t("adults") : t("child")}
                  </span>
                </li>
                <li className="py-3.5 border-b border-[#E4E9EA]">
                  <Link
                    className="flex justify-between"
                    to={`/mapNav?adId=${announcement.id}`}
                  >
                    <span>{t("locationOnMap")}</span>
                    <img src={ArrowBottomIcon} alt="Перейти" />
                  </Link>
                </li>
              </ul>
              {b.status !== "отменено" && (
                <Button
                  className="mb-4"
                  onClick={() => setIsCancel(true)}
                  mode="red"
                >
                  {t("cancelBooking")}
                </Button>
              )}
              <CancelBooking
                open={isCancel}
                onClose={() => setIsCancel(false)}
                bookingId={b.bookingId}
              />
            </div>
          ))}
        </ul>
      )}
    </>
  );
};
