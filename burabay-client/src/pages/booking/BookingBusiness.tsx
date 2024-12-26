
import  { FC } from 'react';
import { Typography } from '../../shared/ui/Typography';
import { NavMenuOrg } from '../../shared/ui/NavMenuOrg';
import { useTranslation } from 'react-i18next';
import BookingWaitingIcon from "../../app/icons/booking-waiting.svg"

interface Props {

}

export const BookingBusiness: FC<Props> = function BookingBusiness() {
  const {t} = useTranslation()
  return (
    <div className="min-h-screen bg-white">
      <div className="flex justify-center flex-col items-center flex-grow min-h-screen">
        <img src={BookingWaitingIcon} className="w-40 h-40 mb-8" alt="" />
        <div className="flex flex-col justify-center items-center gap-2">
          <Typography size={18} weight={500}>
            {t("noBooking")}
          </Typography>
          <Typography size={16} weight={400} align="center">
            {t("bookingAlertBusiness")}
          </Typography>
        </div>
      </div>
      <NavMenuOrg />
    </div>
  );
};