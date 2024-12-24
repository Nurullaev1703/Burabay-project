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
          <AlternativeHeader>
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
        <Typography size={16} weight={400}>[Название приложения] — удобный сервис для бронирования отелей и развлечений в курортных зонах. Планируйте свой отдых легко: выбирайте лучшие варианты проживания и активностей, оформляйте бронирование прямо в приложении.</Typography>
      </div>
        <Typography className="px-4 mt-4" size={16} weight={400}>Основные возможности:</Typography>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>Быстрый поиск и бронирование отелей.</Typography>
      </div>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>Удобный выбор экскурсий, активностей и развлечений.</Typography>
      </div>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>Актуальные цены и предложения.</Typography>
      </div>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>Поддержка пользователей 24/7.</Typography>
      </div>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>С нами ваш отдых станет комфортным и запоминающимся!</Typography>
      </div>
      <div className="mt-10 px-4">
        <Typography size={16} weight={400}>Связаться с нами...</Typography>
      </div>
  </main>
  )
};