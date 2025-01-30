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
        <div className="flex items-center">
          <img
            src={baseUrl + announcement.images[0]}
            alt={announcement.title}
            className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
          />
          <span className="max-w-[266px] truncate">{announcement.title}</span>
        </div>
      </div>


      {/* {booking.} */}
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
