import  { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../../shared/ui/Typography';
import { Button } from '../../../shared/ui/Button';
import { NavMenuOrg } from '../../../shared/ui/NavMenuOrg';
import Intersect from "../../../app/icons/Intersect.png";

interface Props {

}

export const Reviews: FC<Props> = function Reviews() {
    const {t} = useTranslation()
  return (
<div className='min-h-screen'>
<div className="flex justify-center flex-col items-center flex-grow p-4 w-full min-h-screen">
          <img src={Intersect} className="w-40 h-40 mb-8" alt="" />
          <div className="flex flex-col justify-center items-center gap-2 mb-12">
            <Typography size={18} weight={500}>
              {t("reviewsNav")}
            </Typography>
            <Typography size={16} weight={400} align="center">
              {t("reviewsNavText")}
            </Typography>
          </div>
          <Button onClick={() => history.back()}>{"Вернуться"}</Button>
        </div>
        <NavMenuOrg/>
</div>  
)
};