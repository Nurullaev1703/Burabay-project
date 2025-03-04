import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { COLORS_BACKGROUND, COLORS_TEXT } from "../../../shared/ui/colors";
import BackIcon from "../../../app/icons/announcements/blueBackicon.svg";
import CloseIcon from "../../../app/icons/announcements/reviews/close.svg";
import DocImg from "../../../app/icons/profile/confirm/doc.png";
import { TabMenu, TabMenuItem } from "../../../shared/ui/TabMenu";
import { Button } from "../../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
export const ConfirmPage: FC = function ConfirmPage() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number>(0);
  // данные для заполнения переключателя
  const TABS_DATA: TabMenuItem[] = [
    {
      index: 0,
      title: t("individualEntrepreneur"),
    },
    {
      index: 1,
      title: t("legalEntity"),
    },
  ];
  const navigate = useNavigate();
  return (
    <section className="bg-background min-h-screen">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="Назад" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("accountConfirmation")}
            </Typography>
          </div>
          <IconContainer align="end" action={() => history.back()}>
            <img src={CloseIcon} alt="Закрыть" />
          </IconContainer>
        </div>
      </Header>

      <div className="flex justify-center flex-col items-center h-[67vh]">
        <img src={DocImg} alt="Документ" className="w-36 h-44 mb-8" />
        <h1 className="font-medium text-lg mb-2">{t("chooseType")}</h1>
        <p className="text-center">{t("requestForDocs")}</p>
      </div>

      <div className="bg-white p-4">
        <TabMenu
          data={TABS_DATA}
          activeIndex={activeIndex}
          onChangeIndex={setActiveIndex}
          className={"mb-2"}
        />
        <p className={`${COLORS_BACKGROUND.almostWhite} p-3 rounded-lg mb-4`}>
          {activeIndex === 0 ? t("ifYouIE") : t("ifYouLE")}
        </p>
        <Button
          onClick={() =>
            activeIndex === 0
              ? navigate({ to: "/profile/confirm/ie" })
              : navigate({ to: "/profile/confirm/le" })
          }
        >
          {t("choose")}
        </Button>
      </div>
    </section>
  );
};
