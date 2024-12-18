import { FC } from "react";
import { Header } from "../../components/Header";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import BackIcon from "../../app/icons/back-icon.svg";
import CrossIcon from "../../app/icons/cross.svg";
import NextIcon from "../../app/icons/arrow-right.svg"
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { Link } from "@tanstack/react-router";

export const SettingsPage: FC = function SettingsPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={18} weight={500} color={COLORS_TEXT.blue200}>
            {t("accountSettings")}
          </Typography>
          <IconContainer align="end" action={() => history.back()}>
            <img src={CrossIcon} alt="Подтвердить" />
          </IconContainer>
        </div>
      </Header>
      <section className="p-4">
        <Link to="/profile/security/change-password" className="flex justify-between items-center border-b border-b-gray-300">
            <Typography>{t('changePassword')}</Typography>
            <IconContainer align="center">
                <img src={NextIcon} alt="" />
            </IconContainer>
        </Link>
        <Link to="/profile/security/change-email" className="flex justify-between items-center border-b border-b-gray-300">
            <Typography>{t('changeEmail')}</Typography>
            <IconContainer align="center">
                <img src={NextIcon} alt="" />
            </IconContainer>
        </Link>
        <Link className="flex justify-between items-center border-b border-b-gray-300" to="/profile/security/delete-account">
            <Typography>{t('deleteAccount')}</Typography>
            <IconContainer align="center">
                <img src={NextIcon} alt="" />
            </IconContainer>
        </Link>
      </section>
    </div>
  );
};
