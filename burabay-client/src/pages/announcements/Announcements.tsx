import { FC } from 'react';
import { Typography } from '../../shared/ui/Typography';
import { NavMenuOrg } from '../../shared/ui/NavMenuOrg';
import { Button } from '../../shared/ui/Button';
import Intersect from '../../app/icons/Intersect.png';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

interface Props {

}

export const Announcements: FC<Props> = function Announcements() {
  const {t} = useTranslation();
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex flex-col justify-between px-4">
      <div className="flex justify-center flex-col items-center flex-grow">
        <img src={Intersect} className="w-40 h-40 mb-8" alt=""/>
        <div className="flex flex-col justify-center items-center gap-2">
          <Typography size={18} weight={500}>{t("emptyAd")}</Typography>
          <Typography size={16} weight={400} align="center">
            {t("addAd")}
          </Typography>
        </div>
      </div>

      <div className="mt-auto mb-16" onClick={() => navigate({
          to: "/announcements/addAnnouncements"
        })}>
        <Button>{t("addAdBtn")}</Button>
      </div>
 

      <NavMenuOrg />
    </div>
  );
};
