import { FC, useState } from "react";
import { Announcement as AnnouncementType } from "../model/announcements";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import BackIcon from "../../../app/icons/announcements/blueBackicon.svg";
import EyeIcon from "../../../app/icons/announcements/eye.svg";
import FavouriteIcon from "../../../app/icons/announcements/favourite.svg";
// import EditIcon from "../../../app/icons/edit.svg";
import { AnnouncementInfoList } from "./ui/AnnouncementInfoList";
import { CostInfoList } from "./ui/CostInfoList";
import { Carousel, CarouselItem } from "../../../components/Carousel";
import { categoryColors } from "../../mapNav/MapNav";
import { baseUrl } from "../../../services/api/ServerData";

interface Props {
  announcement: AnnouncementType;
}

export const Announcement: FC<Props> = function Announcement({ announcement }) {
  const { t } = useTranslation();
  const [carouselImages, _] = useState<CarouselItem[]>(
    announcement.images.map((image, index) => {
      return {
        imgUrl: baseUrl + image,
        index,
      };
    })
  );

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
            {/* <img src={EditIcon} alt="" /> */}
          </IconContainer>
        </div>
      </Header>

      <div className="px-4 bg-white pb-4 mb-2">
        <div className="relative">
          <div
            className={`absolute w-7 h-7 rounded-full ${categoryColors[announcement.subcategory.category.name]} z-10 right-2.5 top-2.5`}
          >
            <img
              src={baseUrl + announcement.subcategory.category.imgPath}
              alt="Категория"
              className="absolute top-1/2 left-1/2 w-4 h-4 mr-2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen z-100"
            />
          </div>
          <Carousel items={carouselImages} height="pt-[105%]" />
        </div>
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
          id={announcement.id}
          phoneNumber={announcement.phoneNumber}
          schedule={announcement.schedule}
        />
      </div>
      {/* FIXME цена в виде boolean */}
      <CostInfoList
        price={0}
        priceForChild={announcement.priceForChild}
        adultNumbers={announcement.adultsNumber}
        kidsNumber={announcement.kidsNumber}
        petsAllowed={announcement.petsAllowed}
      />
    </section>
  );
};
