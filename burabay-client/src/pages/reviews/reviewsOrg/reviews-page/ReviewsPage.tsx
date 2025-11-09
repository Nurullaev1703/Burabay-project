import { FC, useState } from "react";
import { ReviewsOrg } from "../../../announcements/model/announcements";
import { baseUrl } from "../../../../services/api/ServerData";
import StarIcon from "../../../../app/icons/announcements/star.svg";
import ArrowBottomIcon from "../../../../app/icons/profile/settings/arrow-bottom.svg";
import { Link } from "@tanstack/react-router";
import { NavMenuOrg } from "../../../../shared/ui/NavMenuOrg";
import DefaultIcon from "../../../../app/icons/abstract-bg.svg"
import { Typography } from "../../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";

interface Props {
  reviews: ReviewsOrg[];
}

export const ReviewsPage: FC<Props> = function ReviewsPage({ reviews }) {
  const { t } = useTranslation();
  
  return (
    <section>
      <div className="pt-4 px-4 pb-2 flex justify-center">
        <Typography size={20} weight={500} className="text-[#0a7d9e]">
          {t("reviews")}
        </Typography>
      </div>
      <ul className="p-4">
        {reviews.map((review, index) => {
          const [imageSrc, setImageSrc] = useState<string>(
            baseUrl + review.adImage
          );
          return (
            <li key={index} className="py-3 border-b">
              <Link
                className="flex justify-between"
                to={`/reviews/reviewsOrg/${review.adId}`}
              >
                <div className="flex">
                  <img
                    src={imageSrc}
                    onError={() => setImageSrc(DefaultIcon)}
                    alt={review.adTitle}
                    className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
                  />
                  <div>
                    <span>{review.adTitle}</span>
                    <div className="flex items-center">
                      <div className="flex items-center mr-2">
                        <img src={StarIcon} className="w-[16px] mr-1 mb-1" />
                        <span className="mr-1">
                          {review.adAvgRating ? review.adAvgRating : 0}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <img src={ArrowBottomIcon} alt="Перейти" />
              </Link>
            </li>
          );
        })}
      </ul>
      <NavMenuOrg />
    </section>
  );
};
