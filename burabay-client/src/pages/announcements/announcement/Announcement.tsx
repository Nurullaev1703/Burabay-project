import { FC, useEffect, useState } from "react";
import {
  Announcement as AnnouncementType,
  ReviewAnnouncement,
} from "../model/announcements";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import {
  categoryBgColors,
  COLORS_BACKGROUND,
  COLORS_TEXT,
} from "../../../shared/ui/colors";
import BackIcon from "../../../app/icons/announcements/blueBackicon.svg";
import EyeIcon from "../../../app/icons/announcements/eye.svg";
import FavouriteIcon from "../../../app/icons/announcements/favourite.svg";
import FavouriteActiveIcon from "../../../app/icons/announcements/favourite-active.svg";
import EditIcon from "../../../app/icons/edit.svg";
import DeleteIcon from "../../../app/icons/delete.svg";
import StarIcon from "../../../app/icons/announcements/star.svg";
import FavouriteFocusedIcon from "../../../app/icons/announcements/favourite-focus.svg";
import { AnnouncementInfoList } from "./ui/AnnouncementInfoList";
import { CostInfoList } from "./ui/CostInfoList";
import { Carousel, CarouselItem } from "../../../components/Carousel";
import { baseUrl } from "../../../services/api/ServerData";
import { ModalDelete } from "./ui/ModalDelete";
import { roleService } from "../../../services/storage/Factory";
import { ROLE_TYPE } from "../../auth/model/auth-model";
import { ReviewsInfo } from "./ui/ReviewsInfo";
import { useNavigate } from "@tanstack/react-router";
import VerticalIcon from "../../../app/icons/vertical.svg";
import { apiService } from "../../../services/api/ApiService";
import { queryClient } from "../../../ini/InitializeApp";
import { FavouriteHint } from "../../../components/favourite-hint/FavouriteHint";

interface Props {
  announcement: AnnouncementType;
  review?: ReviewAnnouncement;
}

export const formatPrice = (value: number) => {
  return new Intl.NumberFormat("ru-RU").format(value) + " ₸";
};
export const Announcement: FC<Props> = function Announcement({
  announcement,
  review,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isFavouriteModal, setIsFavouriteModal] = useState<boolean>(false);
  const [carouselImages, _] = useState<CarouselItem[]>(
    announcement.images.map((image, index) => {
      return {
        imgUrl: baseUrl + image,
        index,
      };
    })
  );
  const [isFavourite, setIsFavourite] = useState<boolean>(
    announcement.isFavourite || false
  );
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isAdActions, setIsAdActions] = useState<boolean>(false);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addToFavourite = async () => {
    const response = await apiService.get({
      url: `/ad/favorite/${announcement.id}`,
    });
    if (response.data) {
      if (isFavourite) {
        setIsFavourite(false)
        setIsFavouriteModal(false)
      }  else {
        setIsFavourite(true);
        setIsFavouriteModal(true)
      } 
    }
    await queryClient.refetchQueries({ queryKey: ["ad/favorite/list"] });
    await queryClient.refetchQueries({ queryKey: ["main-page-announcements"] });
  };

  return (
    <section className="bg-background">
      <Header>
        <div className="flex justify-between items-center text-center relative">
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
          {roleService.getValue() == ROLE_TYPE.BUSINESS ? (
            <IconContainer
              align="end"
              action={() => setIsAdActions(!isAdActions)}
            >
              <img src={VerticalIcon} alt="" />
            </IconContainer>
          ) : (
            <IconContainer align="center" />
          )}
          {isAdActions && (
            <ul
              className="absolute top-full right-0 py-2 rounded-lg bg-white bg-opacity-70 z-[100]"
              id="morph"
            >
              <li
                className="flex gap-2 items-center p-4"
                onClick={() =>
                  navigate({
                    to: "/announcements/edit/subcategory/$subcatId/$adId",
                    params: {
                      adId: announcement.id,
                      subcatId: announcement.subcategory.category.id,
                    },
                  })
                }
              >
                <img src={EditIcon} alt="" />
                <Typography size={14}>{"Редактировать"}</Typography>
              </li>
              <li
                className="flex gap-2 items-center p-4"
                onClick={() => setShowModal(true)}
              >
                <img src={DeleteIcon} alt="" />
                <Typography size={14}>{"Удалить"}</Typography>
              </li>
            </ul>
          )}
        </div>
      </Header>

      <div className="px-4 bg-white pb-4 mb-2">
        <div className="relative">
          <div
            className={`absolute w-7 h-7 rounded-full ${categoryBgColors[announcement.subcategory.category.name]} z-10 right-2.5 top-2.5`}
          >
            <img
              src={baseUrl + announcement.subcategory.category.imgPath}
              alt="Категория"
              className="absolute top-1/2 left-1/2 w-4 h-4 mr-2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen z-100"
            />
          </div>
          <Carousel
            items={carouselImages}
            ratio="aspect-[1/1.1]"
            height="h-full"
          />
        </div>
        <div className="flex items-center justify-between mt-4 mb-2">
          <h1 className="font-medium text-[28px] uppercase text-blue200">
            {announcement.price || announcement.priceForChild
              ? formatPrice(announcement.price || announcement.priceForChild)
              : t("free")}
          </h1>
          {roleService.getValue() === ROLE_TYPE.TOURIST && (
            <div onClick={addToFavourite}>
              <img
                src={isFavourite ? FavouriteActiveIcon : FavouriteFocusedIcon}
                alt="Избранное"
              />
            </div>
          )}
        </div>
        <h1 className="font-medium text-[22px]">{announcement.title}</h1>

        <div className="flex justify-between mb-4 items-center">
          <span className="text-sm">
            {t("duration") +
              " — " +
              (announcement.duration
                ? announcement.duration
                : t("notSpecified"))}
          </span>

          {/* Для организации блок */}
          {roleService.getValue() === ROLE_TYPE.BUSINESS && (
            <div className="flex">
              <div className="flex mr-4 items-center">
                <span className="mr-1 text-sm">
                  {announcement.views ? announcement.views : 0}
                </span>
                <img src={EyeIcon} className="w-[18px]" />
              </div>
              <div className="flex items-center">
                <span className="mr-1 text-sm">
                  {announcement.favCount ? announcement.favCount : 0}
                </span>
                <img src={FavouriteIcon} className="w-[14px]" />
              </div>
            </div>
          )}

          {/* Для туриста блок */}
          {roleService.getValue() === ROLE_TYPE.TOURIST && (
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <img src={StarIcon} className="w-[16px] mr-1 mb-1" />
                <span className="mr-1">
                  {announcement.avgRating ? announcement.avgRating : 0}
                </span>
              </div>
              <div
                className={`${COLORS_BACKGROUND.gray100} w-1 h-1 rounded-full mr-2`}
              ></div>
              <span className={`mr-1 ${COLORS_TEXT.gray100}`}>
                {announcement.reviewCount ? announcement.reviewCount : 0}{" "}
                {t("grades")}
              </span>
            </div>
          )}
        </div>

        <p className="mb-4 leading-5">{announcement.description}</p>

        <AnnouncementInfoList ad={announcement} />
      </div>
      <CostInfoList ad={announcement} />
      <ReviewsInfo ad={announcement} review={review} />
      {showModal && (
        <ModalDelete
          open={showModal}
          onClose={() => setShowModal(false)}
          adId={announcement.id}
        />
      )}
      {isFavouriteModal && <FavouriteHint />}
    </section>
  );
};
