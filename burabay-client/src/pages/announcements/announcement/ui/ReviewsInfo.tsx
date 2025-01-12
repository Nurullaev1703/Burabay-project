import { FC, useState } from "react";
import { Announcement, Review } from "../../model/announcements";
import { useTranslation } from "react-i18next";
import { COLORS_BACKGROUND, COLORS_TEXT } from "../../../../shared/ui/colors";
import StarIcon from "../../../../app/icons/announcements/star.svg";
import UnfocusedStarIcon from "../../../../app/icons/announcements/unfocused-star.svg";
import ArrowIcon from "../../../../app/icons/announcements/black-arrowRight.svg";
import { Link } from "@tanstack/react-router";
import { baseUrl } from "../../../../services/api/ServerData";

interface Props {
  ad: Announcement;
  review?: Review[];
}

export const ReviewsInfo: FC<Props> = function ReviewsInfo({ ad, review }) {
  const [reviews, _] = useState<Review[]>(review || []);
  const { t } = useTranslation();
  return (
    <div className="bg-white p-4 mb-2">
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-[22px] font-medium mr-1">{t("reviews")}</h2>
          <Link className="w-6 h-6 flex justify-center items-center">
            <img src={ArrowIcon} alt="Стрелка" className="mt-0.5" />
          </Link>
        </div>

        <div className="flex items-center">
          <div className="flex items-center mr-2">
            <img src={StarIcon} className="w-[16px] mr-1 mb-1" />
            <span className="mr-1">{ad.avgRating ? ad.avgRating : 0}</span>
          </div>
          <div
            className={`${COLORS_BACKGROUND.gray100} w-1 h-1 rounded-full mr-2`}
          ></div>
          <span className={`mr-1 ${COLORS_TEXT.gray100}`}>
            {ad.reviewCount ? ad.reviewCount : 0} {t("grades")}
          </span>
        </div>
      </div>

      <ul className="flex flex-col gap-8">
        {reviews.map((review, index) => (
          <li key={index} className="border-b border-[#E4E9EA] pb-4">
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex flex-col">
                <span>
                  {review.user_name ? review.user_name : "Безымянный"}
                </span>
                <span className={`text-xs ${COLORS_TEXT.gray100}`}>
                  {review.date ? review.date.toLocaleDateString() : "Нет даты"}
                </span>
              </div>
              <div className="flex gap-1">
                {[...Array(5)].map((_, starIndex) => (
                  <img
                    key={starIndex}
                    src={
                      starIndex < review.stars ? StarIcon : UnfocusedStarIcon
                    }
                    alt={
                      starIndex < review.stars
                        ? "Активная звезда"
                        : "Неактивная звезда"
                    }
                    width={16}
                    height={16}
                  />
                ))}
              </div>
            </div>

            <p className="leading-5 mb-2.5">{review?.text}</p>

            <ul className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth">
              {review.images.map((image, index) => (
                <li key={index} className="w-20 h-20 flex-shrink-0">
                  <img
                    src={baseUrl + "/public/images/reviews/" + image + ".jpg"}
                    alt="Изображение"
                    className="rounded-lg  w-full h-full object-cover"
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
