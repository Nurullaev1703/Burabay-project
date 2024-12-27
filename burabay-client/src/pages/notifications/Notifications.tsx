import  { FC } from 'react';
import { Typography } from '../../shared/ui/Typography';
import { useTranslation } from 'react-i18next';
import bacground from "../../app/icons/announcements/bacground.png"
import reviews from "../../app/icons/announcements/reviews.svg"
import { NavMenuClient } from '../../shared/ui/NavMenuClient';

interface Props {

}

export const Notifications: FC<Props> = function Notifications() {
  const {t} = useTranslation()
  return (
    <div className="min-h-screen relative">
      <img
        className="absolute inset-0 w-full h-full object-cover z-0"
        src={bacground}
        alt=""
      />

      <div className="relative z-10 flex justify-center items-center min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6 w-[90%] max-w-md mx-auto">
          <img src={reviews} className="w-40 h-40 mb-8 mx-auto" alt="" />
          <div className="flex flex-col justify-center items-center gap-2 mb-12">
            <Typography size={18} weight={500} className="w-4/5">
              {t("notificationsNav")}
            </Typography>
          </div>
        </div>
      </div>

      <NavMenuClient />
    </div>
  );
};