import { FC } from "react";
import { Announcement as AnnouncementType } from "../model/announcements";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import BackIcon from "../../../app/icons/announcements/blueBackicon.svg";
import EyeIcon from "../../../app/icons/announcements/eye.svg";
import FavouriteIcon from "../../../app/icons/announcements/favourite.svg";
import EditIcon from "../../../app/icons/edit.svg";
import { baseUrl } from "../../../services/api/ServerData";
import { AnnouncementInfoList } from "./ui/AnnouncementInfoList";
import { CostInfoList } from "./ui/CostInfoList";

interface Props {
  announcement: AnnouncementType;
}

export const Announcement: FC<Props> = function Announcement({ announcement }) {
  const { t } = useTranslation();
  console.log(announcement);
  return (
    <section className="bg-background">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("ad")}
            </Typography>
          </div>
          <IconContainer align="end" action={() => history.back()}>
            <img src={EditIcon} alt="" />
          </IconContainer>
        </div>
      </Header>

      <div className="px-4 bg-white pb-4 mb-2">
        <img
          src={baseUrl + announcement.images[0]}
          alt={announcement.title}
          className="h-96 mb-4"
        />
        <h1 className="font-medium text-[22px]">{announcement.title}</h1>

        <div className="flex justify-between mb-4">
          <span className="text-sm">
            {t("duration") +
              " — " +
              (announcement.duration
                ? announcement.duration
                : t("notSpecified"))}
          </span>
          <div className="flex">
            <div className="flex mr-4 items-center">
              <span className="mr-1 text-sm">
                {announcement.views ? announcement.views : 0}
              </span>
              <img src={EyeIcon} alt="Просмотренных" className="w-[18px]" />
            </div>
            <div className="flex items-center">
              <span className="mr-1 text-sm">
                {announcement.favCount ? announcement.favCount : 0}
              </span>
              <img src={FavouriteIcon} alt="Избранных" className="w-[14px]" />
            </div>
          </div>
        </div>

        <p className="mb-4 leading-5">{announcement.description}</p>

        <AnnouncementInfoList
          phoneNumber={announcement.phoneNumber}
          schedule={announcement.schedule}
        />
      </div>

      <CostInfoList
        price={announcement.price}
        priceForChild={announcement.priceForChild}
        adultNumbers={announcement.adultsNumber}
        kidsNumber={announcement.kidsNumber}
        petsAllowed={announcement.petsAllowed}
      />
    </section>
  );
};
