import { FC } from "react";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import BackIcon from "../../app/icons/back-icon-white.svg"
import { COLORS_TEXT } from "../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import { LanguageButton } from "../../shared/ui/LanguageButton";


interface Props {

}

export const ServiceHelp: FC<Props> = function ServiceHelp() {
  const {t} = useTranslation()
  return (
  <main>
          <AlternativeHeader isMini>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={20} weight={700} color={COLORS_TEXT.white}>
            {t("aboutServiceHelp")}
          </Typography>
          <LanguageButton />
        </div>
      </AlternativeHeader>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>Burabay Travel — это мобильное приложение, предназначенное для туристов, планирующих посещение курортной зоны Бурабай в Республике Казахстан.</Typography>
      </div>
        <Typography className="px-4 mt-4" size={16} weight={400}>С помощью Приложения Пользователи могут:</Typography>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>Находить и бронировать услуги (проживание, питание, активный отдых и пр.)</Typography>
      </div>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>Оплачивать бронирования онлайн через подключённые платёжные системы.</Typography>
      </div>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>Оставлять отзывы и оценки.</Typography>
      </div>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>Использовать карту и фильтры для удобного поиска.</Typography>
      </div>
      <div className="mt-10 px-4">
        <Typography size={16} weight={400}>Приложение объединяет туристов и компании, предлагающие туристические услуги, в единую цифровую платформу для удобного взаимодействия.</Typography>
      </div>
      <div className="mt-10 px-4">
        <Typography size={16} weight={400}>Администрация Приложения осуществляет только информационно-технологическое сопровождение, не являясь поставщиком услуг, публикуемых организациями.</Typography>
      </div>
  </main>
  )
};