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
        <Typography size={16} weight={400}>1. {t("aboutServiceVosem")}</Typography>
      </div>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>1.1. {t("aboutServiceT")}</Typography>
      </div>
        <Typography className="px-4 mt-4" size={16} weight={400}>1.2. {t("aboutServiceOne")}</Typography>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>{t("aboutServiceTwo")}</Typography>
      </div>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>{t("aboutServiceTri")}</Typography>
      </div>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>{t("aboutServiceFour")}</Typography>
      </div>
      <div className="mt-4 px-4">
        <Typography size={16} weight={400}>{t("aboutServiceFive")}</Typography>
      </div>
      <div className="mt-10 px-4">
        <Typography size={16} weight={400}>1.3. {t("aboutServiceSix")}.</Typography>
      </div>
      <div className="mt-10 mb-2 px-4">
        <Typography size={16} weight={400}>1.4. {t("aboutServiceSeven")}.</Typography>
      </div>
  </main>
  )
};