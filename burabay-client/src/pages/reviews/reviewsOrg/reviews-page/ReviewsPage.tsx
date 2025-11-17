import { FC, useState } from "react";
import { ReviewsOrg } from "../../../announcements/model/announcements";
import { baseUrl } from "../../../../services/api/ServerData";
import StarIcon from "../../../../app/icons/announcements/star.svg";
import ArrowBottomIcon from "../../../../app/icons/profile/settings/arrow-bottom.svg";
import { Link } from "@tanstack/react-router";
import { NavMenuOrg } from "../../../../shared/ui/NavMenuOrg";
import DefaultIcon from "../../../../app/icons/abstract-bg.svg";
import { Typography } from "../../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../../../shared/ui/colors";

interface Props {
  reviews: ReviewsOrg[];
}

export const ReviewsPage: FC<Props> = function ReviewsPage({ reviews }) {
  const { t } = useTranslation();
  const [imageSources, setImageSources] = useState<{ [key: string]: string }>(
    reviews.reduce((acc, review) => {
      acc[review.adId] = baseUrl + review.adImage;
      return acc;
    }, {} as { [key: string]: string })
  );

  const handleImageError = (adId: string) => {
    setImageSources((prev) => ({
      ...prev,
      [adId]: DefaultIcon,
    }));
  };

  return (
    <section>
      <div className="pt-4 px-4 pb-2 flex justify-center">
        <Typography size={20} weight={500} color={COLORS_TEXT.blue200}>
          {t("reviews")}
        </Typography>
      </div>
      <ul className="p-4">
        {reviews.map((review, index) => {
          return (
            <li key={index} className="py-3 border-b">
              <Link
                className="flex justify-between"
                to="/reviews/reviewsOrg/$announcementId"
                params={{ announcementId: review.adId }}
              >
                <div className="flex flex-1 min-w-0">
                  <img
                    src={imageSources[review.adId]}
                    onError={() => handleImageError(review.adId)}
                    alt={review.adTitle}
                    className="w-[52px] h-[52px] object-cover rounded-lg mr-2 flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="truncate w-full block">
                      {review.adTitle}
                    </span>
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
