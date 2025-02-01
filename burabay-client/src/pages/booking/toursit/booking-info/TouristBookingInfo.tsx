import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { TSelectedBooking } from "../../model/booking";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import { formatPrice } from "../../../announcements/announcement/Announcement";
import { formatPhoneNumber } from "../../../announcements/announcement/ui/AnnouncementInfoList";
import PhoneIcon from "../../../../app/icons/announcements/phone.svg";
import { Button } from "../../../../shared/ui/Button";
import { CancelBooking } from "../../booking-page/selected-booking/modal/CancelBooking";
import { Announcement } from "../../../announcements/model/announcements";
import ArrowBottomIcon from "../../../../app/icons/profile/settings/arrow-bottom.svg";
import { Link } from "@tanstack/react-router";

interface Props {
  announcement: Announcement;
  bookings: TSelectedBooking;
}

export const TouristBookingInfo: FC<Props> = function TouristBookingInfo({
  announcement,
  bookings,
}) {
  const [bookingsState, _] = useState<TSelectedBooking>(bookings);
  const [isCancel, setIsCancel] = useState<boolean>(false);
  const { t } = useTranslation();
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
                  <span>{b.date}</span>
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
                    {(() => {
                      const parseDate = (dateString?: string) => {
                        if (!dateString) return null;
                        const [day, month, year] = dateString
                          .split(".")
                          .map(Number);
                        return new Date(year, month - 1, day);
                      };

                      const getDaySuffix = (days: number) => {
                        if (days % 10 === 1 && days % 100 !== 11)
                          return t("daysV2"); // "дня"
                        if (
                          [2, 3, 4].includes(days % 10) &&
                          ![12, 13, 14].includes(days % 100)
                        ) {
                          return t("daysV2"); // "дня"
                        }
                        return t("daysV1"); // "дней"
                      };

                      const start = parseDate(b.date);
                      const end = parseDate(b.dateEnd);

                      if (!start || !end) return t("noDate");

                      const diffInMs = end.getTime() - start.getTime();
                      const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

                      return `${diffInDays} ${getDaySuffix(diffInDays)}`;
                    })()}
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
                <li className="flex justify-between py-[18px] border-b border-[#E4E9EA]">
                  <div className="flex flex-col">
                    <span>{formatPhoneNumber(b.user_number)}</span>
                    <span className={`${COLORS_TEXT.gray100} text-sm`}>
                      {t("contactPhone")}
                    </span>
                  </div>
                  <a href={`tel:${b.user_number}`}>
                    <img src={PhoneIcon} alt="Звонить" />
                  </a>
                </li>
                <li className="py-3.5 border-b border-[#E4E9EA]">
                  <Link className="flex justify-between">
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
                  {t("cancel")}
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
        <ul className="px-4"></ul>
      )}
    </>
  );
};
