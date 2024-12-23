import  { FC, useState } from 'react';
import { Header } from '../../components/Header';
import { IconContainer } from '../../shared/ui/IconContainer';
import { Typography } from '../../shared/ui/Typography';
import { COLORS_TEXT } from '../../shared/ui/colors';
import { ProgressSteps } from './ui/ProgressSteps';
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { InputAdornment, OutlinedInput, Switch, TextField } from '@mui/material';
import { DefaultForm } from '../auth/ui/DefaultForm';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SmallHint } from '../../shared/ui/SmallHint';
import { Button } from '../../shared/ui/Button';
import { useNavigate } from '@tanstack/react-router';
import { apiService } from '../../services/api/ApiService';

interface Props {
  adId: string;
}

interface FormType {
    price: number;
    priceForChild: number;
}

export const PriceService: FC<Props> = function PriceService(props) {
    const navigate = useNavigate();
    const [booking, setBooking] = useState(false);
    const [onSitePayment, setOnSitePayment] = useState(false);
    const [onlinePayment, setOnlinePayment] = useState(false);
    const {t} = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { control , handleSubmit  } = useForm<FormType>({
        defaultValues: {
            price: 0,
            priceForChild: 0,
        },
        mode: "onSubmit",
      });
  return (
    <main className='min-h-screen'>
        <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography size={18} weight={500} color={COLORS_TEXT.blue200} align="center">
              {t("newService")}
            </Typography>
            <Typography size={14} weight={400} color={COLORS_TEXT.blue200}>{t("priceService")}</Typography>
          </div>
          <IconContainer align="end" action={() => history.back()}>
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={9} totalSteps={9} />
      </Header>
      <div className=''>
      <div className='flex justify-between items-center px-4'>
        <div className="flex flex-col">
          <Typography size={16} weight={400} className="">{t("booking")}</Typography>
          <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="">
          {t("bookingBoolean")}
        </Typography>
        </div>
        <Switch
              checked={booking}
              onChange={() => setBooking(!booking)}
              className="sr-only"
            />
      </div>
      <div className='mt-5 px-4'>
        <Typography size={16} weight={400}>{t("priceService")}</Typography>
        <Typography size={12} weight={400} color={COLORS_TEXT.gray100}>{t("ifFree")}</Typography>
      </div>
      <DefaultForm className='mt-2'
      onSubmit={handleSubmit(async (form) =>{
        const response  = await apiService.patch({
          url: `/ad/${props.adId}`,
          dto: {
            isBookable: booking,
            onSitePayment: onSitePayment,
            onlinePayment: onlinePayment,
            price: Number(form.price) ,
            priceForChild: Number(form.priceForChild) , 
  
          }
          
        })
        if(response.data){
          navigate({
            to: "/announcements/$announcementId",
            params: {
              announcementId: props.adId
            }
          })
        }
      })}
      >
      <Controller
        name="price"
            control={control}
            rules={{
                maxLength: {
                    value: 40,
                    message: t("maxLengthExceeded", { count: 40 }),
                  },
            }}
            render={({ field, fieldState: { error } }) => (
            <div className='min-w-3 max-w-fit'>
              <TextField  
                {...field}
              variant='outlined'    
                error={Boolean(error?.message)}
                fullWidth={true}
                type={"number"}
                inputMode='numeric'
                label={t("priceForAdult")}
                autoFocus={true}
                placeholder={t("")}

              />
              </div>       
    )}/>
          <Controller
        name="priceForChild"
            control={control}
            rules={{
                maxLength: {
                    value: 40,
                    message: t("maxLengthExceeded", { count: 40 }),
                  },
            }}
            render={({ field, fieldState: { error } }) => (
            <div className=''>
              <TextField

                {...field}
                error={Boolean(error?.message)}
                helperText={error?.message || errorMessage}
                fullWidth={true}
                type={"number"}
                variant="outlined"
                label={t("priceForChild")}
                inputProps={{ maxLength: 40 }}
                autoFocus={true}
                placeholder={t("")}
              />
              </div>
              
              
    )}/>
        <div className='fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full'>
        <Button type="submit" mode='default'>{t("continueBtn")}</Button>
      </div>
      </DefaultForm>
      </div>
      <div className='px-4'>
      <SmallHint background='white' text={t('paymentMethod')}/>
      </div>
      <div className='flex justify-between items-center px-4 mb-10'>
        <div className="flex flex-col">
          <Typography size={16} weight={400} className="">{t("payOnPlace")}</Typography>
          <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="">
          {t("payOnPlaceOrOnline")}
        </Typography>
        </div>
        <Switch
              checked={onSitePayment}
              onChange={() => setOnSitePayment(!onSitePayment)}
              className="sr-only"
            />
      </div>
      <div className='flex justify-between items-center px-4'>
        <div className="flex flex-col">
          <Typography size={16} weight={400} className="">{t("onlinePayment")}</Typography>
          <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="">
          {t("payIsMadeOnline")}
        </Typography>
        </div>
        <Switch
              checked={onlinePayment}
              onChange={() => setOnlinePayment(!onlinePayment)}
              className="sr-only"
            />
      </div>
      <div className='px-4 mt-2'>
      <Typography size={12} weight={700} color={COLORS_TEXT.red}>{t("accessAcount")} <span style={{ fontWeight: 400}}>{t("accountOnlinePay")}</span></Typography>
      <Button onClick={() => navigate({
          to: `/profile`,
        })} mode="transparent">{t("accessAccountBtn")}</Button>
      </div>

    </main>
)
};