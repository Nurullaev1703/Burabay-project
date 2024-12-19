import  { FC, useState } from 'react';
import { Header } from '../../components/Header';
import { IconContainer } from '../../shared/ui/IconContainer';
import { Typography } from '../../shared/ui/Typography';
import { COLORS_TEXT } from '../../shared/ui/colors';
import { ProgressSteps } from './ui/ProgressSteps';
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Switch, TextField } from '@mui/material';
import { DefaultForm } from '../auth/ui/DefaultForm';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { SmallHint } from '../../shared/ui/SmallHint';
import { Button } from '../../shared/ui/Button';
import { useNavigate } from '@tanstack/react-router';

interface Props {

}

interface FormType {
    price: number;
}

export const PriceService: FC<Props> = function PriceService() {
    const navigate = useNavigate();
    const [booking, setBooking] = useState(false);
    const [onSitePayment, setOnSitePayment] = useState(false);
    const [onlinePayment, setOnlinePayment] = useState(false);
    const {t} = useTranslation();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { control, handleSubmit } = useForm<FormType>({
        defaultValues: {
            price: 0
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
              {"Новая слуга"}
            </Typography>
            <Typography size={14} weight={400} color={COLORS_TEXT.blue200}>{"Стоимость услуги"}</Typography>
          </div>
          <IconContainer align="end" action={() => history.back()}>
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={10} totalSteps={10} />
      </Header>
      <div className=''>
      <div className='flex justify-between items-center px-4'>
        <div className="flex flex-col">
          <Typography size={16} weight={400} className="">Бронирование</Typography>
          <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="">
          Укажжите, если у услугу нужно бронировать
        </Typography>
        </div>
        <Switch
              checked={booking}
              onChange={() => setBooking(!booking)}
              className="sr-only"
            />
      </div>
      <div className='mt-5 px-4'>
        <Typography size={16} weight={400}>{"Стоимость услуги"}</Typography>
        <Typography size={12} weight={400} color={COLORS_TEXT.gray100}>{"Не указывайте, если услуга бесплатна"}</Typography>
      </div>
      <DefaultForm className='mt-2'>
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
            <div className=''>
              <TextField

                {...field}
                error={Boolean(error?.message)}
                helperText={error?.message || errorMessage}
                fullWidth={true}
                type={"number"}
                variant="outlined"
                label={t("Стоимость услуги для взрослых клиентов")}
                inputProps={{ maxLength: 40 }}
                autoFocus={true}
                placeholder={t("")}
              />
              </div>
              
              
    )}/>
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
            <div className=''>
              <TextField

                {...field}
                error={Boolean(error?.message)}
                helperText={error?.message || errorMessage}
                fullWidth={true}
                type={"number"}
                variant="outlined"
                label={t("Доплата за детей (при необходимости)")}
                inputProps={{ maxLength: 40 }}
                autoFocus={true}
                placeholder={t("")}
              />
              </div>
              
              
    )}/>
      </DefaultForm>
      </div>
      <div className='px-4'>
      <SmallHint background='white' text='Способ оплаты'/>
      </div>
      <div className='flex justify-between items-center px-4 mb-10'>
        <div className="flex flex-col">
          <Typography size={16} weight={400} className="">{"Оплата на месте"}</Typography>
          <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="">
          {"Оплата услуги производится на месте наличными или по карте"}
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
          <Typography size={16} weight={400} className="">{"Онлайн оплата"}</Typography>
          <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="">
          {"Оплата производиться онлайн, через приложение"}
        </Typography>
        </div>
        <Switch
              checked={onlinePayment}
              onChange={() => setOnlinePayment(!onlinePayment)}
              className="sr-only"
            />
      </div>
      <div className='px-4 mt-2'>
      <Typography size={12} weight={700} color={COLORS_TEXT.red}>{"Подтвердите аккаунт,"} <span style={{ fontWeight: 400}}>{"что бы иметь возможность принимать онлайн предоплату"}</span></Typography>
      <Button mode="transparent">{"Подтвердить аккаунт"}</Button>
      </div>
      <div className='fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full'>
        <Button mode='default'>{"Продолжить"}</Button>
      </div>
    </main>
)
};