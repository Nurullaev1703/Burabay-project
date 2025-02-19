import { FC, useState } from "react";
import { Announcement } from "../../announcements/model/announcements";
import { Carousel } from "../../../components/Carousel";
import { baseUrl } from "../../../services/api/ServerData";
import { Typography } from "../../../shared/ui/Typography";
import { categoryBgColors, COLORS_TEXT } from "../../../shared/ui/colors";
import maptracker from "../../../app/icons/main/maptracker.svg";
import StarIcon from "../../../app/icons/main/star.svg";
import FavouriteIcon from "../../../app/icons/favourite.svg";
import { Link } from "@tanstack/react-router";
import { apiService } from "../../../services/api/ApiService";
interface Props {
  ad: Announcement;
  isOrganization?: boolean;
  width?: string;
  ref?: (node: HTMLLIElement | null) => void;
}

export const AdCard: FC<Props> = function AdCard({
  ad,
  isOrganization,
  width,
  ref,
}) {
  const [carouselItems, _] = useState(
    ad.images.map((image, index) => {
      return {
        imgUrl: baseUrl + image,
        index,
      };
    })
  );
  const addToFavourite = async () => {
    const response = await apiService.get({
      url: `/ad/favorite/${ad.id}`,
    });
  };
  return (
    <li
      className={`rounded-2xl relative overflow-hidden min-w-[140px] max-w-[266px] ${width}`}
      ref={ref}
    >
      <Link
        to="/announcements/$announcementId"
        params={{ announcementId: ad.id }}
      >
        <Carousel items={carouselItems} />
      </Link>
      <div
        className={`absolute top-2 right-2 ${categoryBgColors[ad?.subcategory?.category?.name] || "bg-white"} rounded-full p-1 z-20`}
      >
        <img
          src={baseUrl + ad?.subcategory?.category?.imgPath}
          alt="category"
          className="w-8 h-8 object-contain scale-75 brightness-200 z-10"
        />
      </div>
      <div className="p-1">
        <div className="flex justify-between items-center">
          <Typography
            size={18}
            weight={700}
            color={COLORS_TEXT.blue200}
            className="uppercase"
          >
            {ad.price
              ? (ad.price || 0).toLocaleString("ru-RU") + " ₸"
              : "Бесплатно"}
          </Typography>
          {!isOrganization && (
            <img src={FavouriteIcon} alt="" onClick={addToFavourite} />
          )}
        </div>
        <Typography size={14} weight={400} className="line-clamp-1">
          {ad.title}
        </Typography>
        <Typography
          size={12}
          weight={400}
          className="line-clamp-2 h-[25px] text-ellipsis leading-none"
        >
          {ad.description}
        </Typography>
        {!isOrganization && (
          <div className="flex gap-1 items-center mt-1">
            <img src={maptracker} alt="" className="w-3" />
            <Typography
              size={12}
              weight={400}
              className="text-black text-xs line-clamp-2"
            >
              {ad?.address?.address || "Боровое"}
            </Typography>
          </div>
        )}
        <div className="flex items-center mt-1 gap-1">
          <img src={StarIcon} alt="" className="w-3" />
          <Typography size={12}>{ad.avgRating || 0}</Typography>
          <div className="w-1 h-1 bg-gray100 mx-1 rounded-full"></div>
          <Typography size={12} color={COLORS_TEXT.gray100}>
            {ad.reviewCount + ` оценок`}
          </Typography>
        </div>
      </div>
    </li>
  );
};
