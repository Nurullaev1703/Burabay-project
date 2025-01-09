import { FC } from "react";
import { Category } from "./model/announcements";
import { Header } from "../../components/Header";
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Typography } from "../../shared/ui/Typography";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { IconContainer } from "../../shared/ui/IconContainer";
import RightArrow from "../../app/icons/announcements/arrowRight.svg";
import { Button } from "../../shared/ui/Button";
import attractions from "../../app/icons/main/attractions.svg";
import entertaiment from "../../app/icons/main/entertaiment.svg";
import extreme from "../../app/icons/main/extreme.svg";
import health from "../../app/icons/main/health.svg";
import house from "../../app/icons/main/house.svg";
import nutrition from "../../app/icons/main/nutrition.svg";
import rental from "../../app/icons/main/rental.svg";
import rest from "../../app/icons/main/rest.svg";
import security from "../../app/icons/main/security.svg";
import { useNavigate } from "@tanstack/react-router";
import { ProgressSteps } from "./ui/ProgressSteps";
import { useTranslation } from "react-i18next";

interface Props {
  category: Category[];
}

export const AddAnnouncements: FC<Props> = function AddAnnouncements({
  category,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const icons = [
    rest,
    house,
    nutrition,
    attractions,
    health,
    entertaiment,
    extreme,
    rental,
    security,
  ];
  return (
    <section className="min-h-screen">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={async () => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("addNewAd")}
            </Typography>
            <Typography
              size={14}
              weight={400}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("choiseCat")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={async () =>
              navigate({
                to: "/announcements",
              })
            }
          >
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={1} totalSteps={9}></ProgressSteps>
      </Header>

      <div className="space-y-4 px-4 ">
        {category.map((item, index) => {
          const icon = icons[index % icons.length];
          return (
            <div
              key={item.id}
              onClick={() =>
                navigate({
                  to: `/announcements/addAnnouncementsStepTwo/${item.id}`,
                })
              }
              className="flex items-center justify-between border-b-[1px] rounded-xl w-full"
            >
              <div className="flex items-center gap-4 w-full">
                <IconContainer align="end">
                  <img src={icon} className="w-[34px] h-[34px]" />
                </IconContainer>
                <div className="flex items-center w-full">
                  <div className="w-full mr-2">
                    <Typography size={16} weight={400} className="text-black">
                      {t(item.name)}
                    </Typography>
                    <Typography
                      size={14}
                      weight={400}
                      color={COLORS_TEXT.gray100}
                      className="mb-4"
                    >
                      {t(item.description)}
                    </Typography>
                  </div>
                  <img src={RightArrow} className="w-7 h-4" alt="" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mb-2 mt-2 px-2">
        <Button mode="border" onClick={async () => history.back()}>
          {t("cancelBtn")}
        </Button>
      </div>
    </section>
  );
};
