import { FC, useState } from "react";
import { SelectedBookingList } from "../../../model/booking";
import { Box } from "@mui/material";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../shared/ui/Button";
import { baseUrl } from "../../../../../services/api/ServerData";
import BaseLogoIcon from "../../../../../app/icons/profile/settings/image.svg";
import { formatPrice } from "../../../../announcements/announcement/Announcement";
import { COLORS_TEXT } from "../../../../../shared/ui/colors";
import { formatPhoneNumber } from "../../../../announcements/announcement/ui/AnnouncementInfoList";
import PhoneIcon from "../../../../../app/icons/announcements/phone.svg";
import { CancelBooking } from "./CancelBooking";
import { useNavigate } from "@tanstack/react-router";
import { apiService } from "../../../../../services/api/ApiService";
import { queryClient } from "../../../../../ini/InitializeApp";
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
  const [isConfirmed, setIsConfirmed] = useState<boolean>(
    booking.status == "подтверждено"
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [profileImg, setProfileImg] = useState<string>(
    baseUrl + booking.avatar
  );
  const { t } = useTranslation();

  // Если открыта модалка отмены, показываем только её
  if (isCancel) {
    return (
      <CancelBooking
        open={true}
        onClose={() => setIsCancel(false)}
        bookingId={booking.bookingId}
      />
    );
  }

  return (
    <section>
      {open && (
        <>
          {/* Кастомный backdrop */}
          <div
            onClick={onClose}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              zIndex: 1400,
            }}
          />
          {/* Контент модалки */}
          <div
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1401,
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                p: "24px",
                width: "100%",
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
                    className="w-[52px] h-[52px] object-cover rounded-full mr-4 flex-shrink-0"
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
              {!isConfirmed && (
                <Button
                  className={isConfirmed ? "hidden" : ""}
                  onClick={async () => {
                    setIsLoading(true);
                    try {
                      await apiService.patch({
                        url: `/booking/${booking.bookingId}/confirm`,
                      });
                      setIsConfirmed(true);
                      // Инвалидируем кэш после подтверждения
                      await queryClient.invalidateQueries({
                        queryKey: [`/booking/org`],
                      });
                      await queryClient.invalidateQueries({
                        queryKey: [`/booking/by-ad`],
                        refetchType: "all",
                      });
                      navigate({
                        to: "/booking/business",
                      });
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  loading={isLoading}
                >
                  {t("accept")}
                </Button>
              )}

              <Button
                className="mb-4"
                onClick={() => !isLoading && setIsCancel(true)}
                mode="red"
              >
                {t("cancel")}
              </Button>
            </Box>
          </div>
        </>
      )}
    </section>
  );
};
