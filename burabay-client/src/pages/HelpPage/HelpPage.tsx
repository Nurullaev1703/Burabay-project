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

interface Props {

}

export const HelpPage: FC<Props> = function HelpPage() {
  return (
    <section className='min-h-screen'>
                <Header>
          <div className='flex justify-between items-center text-center'>
            <IconContainer align='start' action={() => history.back()}>
              <img src={BackIcon} alt="" />
            </IconContainer>
            <div>
              <Typography size={18} weight={500} color={COLORS_TEXT.blue200} align='center'>
                {"Помощь"}
              </Typography>
            </div>
            <IconContainer align='end' action={() => history.back()}>
              <img src={XIcon} alt="" />
            </IconContainer>
          </div>
        </Header>
        <div className='px-4'>
            <Typography className='mb-4' size={18} weight={500}>{"Связаться с нами"}</Typography>
            <Typography size={16} weight={400}>{"Не нашли ответ на свой вопрос? Свяжитесь с нами!"}</Typography>
            <Button className='mt-4' mode='border' >
                <img src={WhatsAppIcon} className='mr-3' alt="" />
                {"Написать в Whats App"}</Button>
            <SmallHint text='Или напишите на почту' background='white'></SmallHint>
            <Button className='text-base font-semibold mb-4' mode="transparent">{"burabay_travel@gmail.com"}</Button>

        </div>
        <div className=''>
                <div className='w-full h-2 bg-[#F1F2F6]'></div>
        </div>
        <div className='px-4'>
            <div className='border-b py-4'>
                <Typography className='mb-4' size={18} weight={500}>{"Как отменить бронирование?"}</Typography>
                <Typography size={16} weight={400}>{"Отмена доступна за 6 часов до начала бронирования"}</Typography>
            </div>
            <div className='border-b py-4'>
                <Typography className='mb-4' size={18} weight={500}>{"Возврат средств"}</Typography>
                <Typography size={16} weight={400}>{"Предоплата будет возвращена на счёт в течении трёх часов. Если этого не произошло, обратитесь в свой банк"}</Typography>
            </div>
            <div className='border-b py-4'>
                <Typography className='mb-4' size={18} weight={500}>{"Как зарегестрировать организацию?"}</Typography>
                <Typography size={16} weight={400}>{"При входе в приложение нажмите на кнопку «Зарегестрировать организацию» и заполните представленные поля. В дальнейшем при входе по указанной почте вы будете попадать в созданный аккаунт организации. Если почта привязанна к туристическому аккаунту, укажите другой адрес при регистрации измените адрес в туристическом аккаунте."}</Typography>
            </div>
            <div className=' py-4'>
                <Typography className='mb-4' size={18} weight={500}>{"Как удалить аккаунт?"}</Typography>
                <Typography size={16} weight={400}>{"Во владке «безопасность» перейдите во вкладку «Удаление аккаунта» и следуйте инструкциям"}</Typography>
            </div>
        </div>
    </section>
)
};