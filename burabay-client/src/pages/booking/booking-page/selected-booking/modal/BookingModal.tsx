import { FC, useState } from "react";
import { SelectedBookingList } from "../../../model/booking";
import { Box, Modal } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../shared/ui/Button";
import { baseUrl } from "../../../../../services/api/ServerData";
import BaseLogoIcon from "../../../../../app/icons/profile/settings/image.svg";
import { formatPrice } from "../../../../announcements/announcement/Announcement";
import { COLORS_TEXT } from "../../../../../shared/ui/colors";
import { formatPhoneNumber } from "../../../../announcements/announcement/ui/AnnouncementInfoList";
import PhoneIcon from "../../../../../app/icons/announcements/phone.svg";
import { CancelBooking } from "./CancelBooking";
interface Props {
  booking: SelectedBookingList;
  open: boolean;
  onClose: () => void;
}

export const BookingModal: FC<Props> = function BookingModal({
  booking,
  open,
  onClose,
}) {
  const [isCancel, setIsCancel] = useState<boolean>(false);
  const [profileImg, setProfileImg] = useState<string>(
    baseUrl + booking.avatar
  );
  const { t } = useTranslation();
  return (
    <section>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "auto",
          maxHeight: "100%",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            p: "24px",
            width: "100%",
            maxWidth: 600,
            borderTopLeftRadius: 14,
            borderTopRightRadius: 14,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="mb-4">
            <div className="flex items-center py-3">
              <img
                src={profileImg}
                alt={booking.name}
                className="w-[52px] h-[52px] object-cover rounded-full mr-4"
                onError={() => setProfileImg(BaseLogoIcon)}
              />
              <span>{booking.name}</span>
            </div>

            <ul>
              <li className="flex justify-between py-[18px] border-b border-[#E4E9EA]">
                <div className="flex">
                  <span className="mr-2">
                    {booking.payment_method === "cash"
                      ? t("onSidePayment")
                      : t("onlinePayment")}
                  </span>
                  <span className={`${COLORS_TEXT.access}`}>
                    {booking.status === "оплачено" ? t("paid") : ""}
                  </span>
                </div>
                <span className={`${COLORS_TEXT.blue200}`}>
                  {formatPrice(booking.price)}
                </span>
              </li>
              <li className="flex justify-between py-[18px] border-b border-[#E4E9EA]">
                <span>{t("rate")}</span>
                <span>
                  {booking.rate === "Детский"
                    ? t("childRate")
                    : t("adultsService")}
                </span>
              </li>
              <li className="flex justify-between py-[18px] border-b border-[#E4E9EA]">
                <div className="flex flex-col">
                  <span>{formatPhoneNumber(booking.user_number)}</span>
                  <span className={`${COLORS_TEXT.gray100} text-sm`}>
                    {t("contactPhone")}
                  </span>
                </div>
                <a href={`tel:${booking.user_number}`}>
                  <img src={PhoneIcon} alt="Звонить" />
                </a>
              </li>
            </ul>
          </div>

          <Button className="mb-4" onClick={() => setIsCancel(true)} mode="red">
            {t("cancel")}
          </Button>
        </Box>
      </Modal>

      {isCancel && (
        <CancelBooking
          open={isCancel}
          onClose={() => setIsCancel(false)}
          bookingId={booking.bookingId}
        />
      )}
    </section>
  );
};
