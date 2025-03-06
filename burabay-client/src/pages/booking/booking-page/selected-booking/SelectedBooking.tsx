import { FC, useState } from "react";
import { Header } from "../../../../components/Header";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import { Typography } from "../../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import BackIcon from "../../../../app/icons/announcements/blueBackicon.svg";
import { SelectedBookingList, TSelectedBooking } from "../../model/booking";
import { Announcement } from "../../../announcements/model/announcements";
import { baseUrl } from "../../../../services/api/ServerData";
import { BookingModal } from "./modal/BookingModal";
import { formatPrice } from "../../../announcements/announcement/Announcement";
import { formatPhoneNumber } from "../../../announcements/announcement/ui/AnnouncementInfoList";
import PhoneIcon from "../../../../app/icons/announcements/phone.svg";
import { CancelBooking } from "./modal/CancelBooking";
import { Button } from "../../../../shared/ui/Button";
import { roleService } from "../../../../services/storage/Factory";
import { TouristBookingInfo } from "../../toursit/booking-info/TouristBookingInfo";
import { Link } from "@tanstack/react-router";
import ArrowBottomIcon from "../../../../app/icons/profile/settings/arrow-bottom.svg";

interface Props {
  announcement: Announcement;
  booking: TSelectedBooking;
}

export const SelectedBooking: FC<Props> = function SelectedBooking({
  booking,
  announcement,
}) {
  const [bookings, _] = useState<SelectedBookingList[]>(booking.bookings || []);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isCancel, setIsCancel] = useState<boolean>(false);
  const userRole = roleService.getValue();
  const [selectedBooking, setSelectedBooking] = useState<SelectedBookingList>({
    bookingId: "",
    avatar: "",
    isPaid: false,
    name: "",
    payment_method: "cash",
    price: 0,
    status: "",
    rate: "",
    time: "",
    user_number: "",
  });
  const { t } = useTranslation();
  const getDaySuffix = (days: number | undefined = 0) => {
    if (days % 10 === 1 && days % 100 !== 11) return t("daysV2"); // "день"
    if ([2, 3, 4].includes(days % 10) && ![12, 13, 14].includes(days % 100)) {
      return t("daysV2"); 
    }
    return t("daysV1"); 
  };
  return (
    <section>
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("booking")}
            </Typography>
            <Typography
              size={14}
              weight={400}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t(booking.date)}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => history.back()}
          ></IconContainer>
        </div>
      </Header>

      <div className="px-4 flex flex-col">
        {userRole === "турист" ? (
          <Link
            className="flex items-center justify-between py-3"
            to={`/announcements/${announcement.id}`}
          >
            <div className="flex items-center">
              <img
                src={baseUrl + announcement.images[0]}
                alt={announcement.title}
                className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
              />
              <span className="max-w-[266px] truncate">
                {announcement.title}
              </span>
            </div>
            <img src={ArrowBottomIcon} alt="Перейти" />
          </Link>
        ) : (
          <div className="flex items-center">
            <img
              src={baseUrl + announcement.images[0]}
              alt={announcement.title}
              className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
            />
            <span className="max-w-[266px] truncate">{announcement.title}</span>
          </div>
        )}
      </div>

      {/* РОЛЬ БИЗНЕСА */}
      {userRole === "бизнес" && (
        <>
          {booking.type === "Услуга" && (
            <ul className="flex flex-col px-4">
              {bookings.map((booking, index) => (
                <li
                  onClick={() => {
                    if (booking.status !== "отменено") {
                      setShowModal(true);
                      setSelectedBooking(booking);
                    }
                  }}
                  key={index}
                  className="flex flex-col py-3 border-b border-[#E4E9EA]"
                >
                  <div className="flex justify-between">
                    <span
                      className={`${booking.status === "отменено" ? `${COLORS_TEXT.gray100}` : `${COLORS_TEXT.blue200}`} font-bold mb-2`}
                    >
                      {booking.time}
                    </span>
                    <span className={`${COLORS_TEXT.red} font-bold`}>
                      {booking.status === "отменено" ? t("cancelStatus") : ""}
                    </span>
                  </div>
                  <span>{booking.name}</span>
                  <div className="flex justify-between">
                    <div>
                      <span className="text-sm mr-2">
                        {booking.payment_method === "cash"
                          ? t("payOnPlace")
                          : t("onlinePayment")}
                      </span>
                      {booking.isPaid && (
                        <span className={`text-sm ${COLORS_TEXT.access}`}>
                          {booking.isPaid ? t("paid") : t("")}
                        </span>
                      )}
                    </div>
                    <span className={`${COLORS_TEXT.blue200}`}>
                      {formatPrice(booking.price)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {booking.type === "Аренда" && (
            <div className="px-4 mt-4">
              {booking.bookings.map((b, index) => (
                <div
                  key={b.bookingId}
                  className={`mb-4 ${index === booking.bookings.length - 1 ? "" : "border-b border-[#E4E9EA]"}`}
                >
                  <div className="flex items-center py-3 border-t border-[#E4E9EA]">
                    <img
                      src={baseUrl + b.avatar}
                      alt={b.name}
                      className="w-[52px] h-[52px] object-cover rounded-full mr-4"
                    />
                    <span>{b.name}</span>
                  </div>

                  <ul className="mb-8">
                    <li className="flex justify-between py-3.5 border-b border-[#E4E9EA]">
                      <span className="text-sm">{t("CheckInDate")}</span>
                      <span>{booking.date}</span>
                    </li>
                    <li className="flex justify-between py-3.5 border-b border-[#E4E9EA]">
                      <span className="text-sm">{t("DepatureDate")}</span>
                      <span>{b.dateEnd}</span>
                    </li>
                    <li className="flex justify-between py-3.5 border-b border-[#E4E9EA]">
                      <span className="text-sm">{t("totalDuration")}</span>
                      <span>
                        <span>
                        {b.days} {getDaySuffix(b.days)}
                        </span>
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
            </div>
          )}
        </>
      )}

      {/* РОЛЬ ТУРИСТА */}
      {userRole === "турист" && (
        <TouristBookingInfo announcement={announcement} bookings={booking} />
      )}

      {showModal && (
        <BookingModal
          open={showModal}
          onClose={() => setShowModal(false)}
          booking={selectedBooking}
        />
      )}
    </section>
  );
};
