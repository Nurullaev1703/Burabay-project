import { FC } from "react";
import { Header } from "../../components/Header";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import BackIcon from "../../app/icons/back-icon.svg";
import WhatsAppIcon from "../../app/icons/help/whatsapp-icon.svg";
import { useTranslation } from "react-i18next";
import { Button } from "../../shared/ui/Button";

export const HelpPage: FC = function HelpPage() {
    const { t } = useTranslation();
    return (
        <section className="px-4 min-h-screen">
            <Header>
                <div className="flex justify-between items-center">
                    <IconContainer align="start" action={() => history.back()}>
                        <img src={BackIcon} alt="" />
                    </IconContainer>
                    <Typography weight={700} size={20} align="center">
                        {t("help")}
                    </Typography>
                    <IconContainer align="end" action={() => { }}>
                        <img src={WhatsAppIcon} alt="" />
                    </IconContainer>
                </div>
            </Header>

            <div className="pt-20">
                <ul>
                    <li>
                        <h2>{t("noAccessPhone")}</h2>
                        <p>{t("loginEDS")}</p>
                        <Button mode="border">{t("enterEgovMobile")}</Button>
                    </li>
                </ul>
            </div>
        </section>
    )
}