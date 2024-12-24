import  { FC } from 'react';
import { Header } from '../../components/Header';
import { IconContainer } from '../../shared/ui/IconContainer';
import { Typography } from '../../shared/ui/Typography';
import { COLORS_TEXT } from '../../shared/ui/colors';
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import WhatsAppIcon from "../../app/icons/whatsapp.svg"
import { Button } from '../../shared/ui/Button';
import { SmallHint } from '../../shared/ui/SmallHint';
import { useTranslation } from 'react-i18next';

interface Props {

}

export const HelpPage: FC<Props> = function HelpPage() {
  const {t} = useTranslation()
  return (
    <section className='min-h-screen'>
          <Header>
          <div className='flex justify-between items-center text-center'>
            <IconContainer align='start' action={() => history.back()}>
              <img src={BackIcon} alt="" />
            </IconContainer>
            <div>
              <Typography size={18} weight={500} color={COLORS_TEXT.blue200} align='center'>
                {t("help")}
              </Typography>
            </div>
            <IconContainer align='end' action={() => history.back()}>
              <img src={XIcon} alt="" />
            </IconContainer>
          </div>
        </Header>
        <div className='px-4'>
            <Typography className='mb-4' size={18} weight={500}>{t("contactUs")}</Typography>
            <Typography size={16} weight={400}>{t("dontFindAnswer")}</Typography>
            <Button className='mt-4' mode='border' >
                <img src={WhatsAppIcon} className='mr-3' alt="" />
                {t("whatsApp")}</Button>
            <SmallHint text={t('writeMail')} background='white'></SmallHint>
            <Button className='text-base font-semibold mb-4' mode="transparent">{"burabay_travel@gmail.com"}</Button>

        </div>
        <div className=''>
                <div className='w-full h-2 bg-[#F1F2F6]'></div>
        </div>
        <div className='px-4'>
            <div className='border-b py-4'>
                <Typography className='mb-4' size={18} weight={500}>{t("howCancelBook")}</Typography>
                <Typography size={16} weight={400}>{t("cancelSixHour")}</Typography>
            </div>
            <div className='border-b py-4'>
                <Typography className='mb-4' size={18} weight={500}>{t("cashBack")}</Typography>
                <Typography size={16} weight={400}>{t("cashBackThreeHours")}</Typography>
            </div>
            <div className='border-b py-4'>
                <Typography className='mb-4' size={18} weight={500}>{t("howRegOrg")}</Typography>
                <Typography size={16} weight={400}>{t("entrance")}</Typography>
            </div>
            <div className=' py-4'>
                <Typography className='mb-4' size={18} weight={500}>{t("howDelAcc")}</Typography>
                <Typography size={16} weight={400}>{t("security")}</Typography>
            </div>
        </div>
    </section>
)
};