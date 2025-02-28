import { FC, useState } from "react";
import {
  Announcement,
  Review,
  ReviewAnnouncement,
} from "../../model/announcements";
import { useTranslation } from "react-i18next";
import { COLORS_BACKGROUND, COLORS_TEXT } from "../../../../shared/ui/colors";
import StarIcon from "../../../../app/icons/announcements/star.svg";
import UnfocusedStarIcon from "../../../../app/icons/announcements/unfocused-star.svg";
import ArrowIcon from "../../../../app/icons/announcements/black-arrowRight.svg";
import { Link, useNavigate } from "@tanstack/react-router";
import { baseUrl } from "../../../../services/api/ServerData";
import { Button } from "../../../../shared/ui/Button";
import { roleService } from "../../../../services/storage/Factory";
import { ROLE_TYPE } from "../../../auth/model/auth-model";
import { TextField } from "@mui/material";
import arrowDown from "../../../../app/icons/arrowDown.svg"

interface Props {
  ad: Announcement;
  review?: ReviewAnnouncement;
  isAdmin?: boolean;
}

export const ReviewsInfo: FC<Props> = function ReviewsInfo({ ad, review , isAdmin}) {
  const [showReviews, setShowReviews] = useState(!isAdmin);
  const [reviews, _] = useState<Review[]>(
    Array.isArray(review?.reviews) ? review.reviews : []
  );
  const { t } = useTranslation();
  const [expandedReviews, setExpandedReviews] = useState<
    Record<number, boolean>
  >({});
  const navigate = useNavigate();

  const toggleReviewText = (index: number) => {
    setExpandedReviews((prevState) => ({
      ...prevState,
      [index]: !prevState[index],
    }));
  };
  return (
    <div className="bg-white p-4 mb-2">
      <div className="flex justify-between mb-4">
        <div className="flex items-center">
          <h2 className="text-[22px] font-medium mr-1">
            {t("С высокой оценкой")}
          </h2>
          {!isAdmin &&
          
          <Link className="w-6 h-6 flex justify-center items-center">
            <img src={ArrowIcon} alt="Стрелка" className="mt-0.5" />
          </Link>
          }
          {isAdmin && 
          <button
          className="w-6 h-6 flex justify-center items-center"
          onClick={() => setShowReviews(!showReviews)}
        >
          <img
            src={showReviews ? arrowDown : ArrowIcon}
            className="mt-0.5"
          />
        </button>
          }
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
      {showReviews && (
      <ul className="flex flex-col gap-8">
        {/* Вывод отзывов */}
        {reviews.map((review, index) => (
          <li key={index} className="border-b border-[#E4E9EA] pb-4">
            <div className="flex justify-between items-center mb-2.5">
              <div className="flex flex-col">
                <span>
                  {review.user.fullName ? review.user.fullName : "Безымянный"}
                </span>
                <span className={`text-xs ${COLORS_TEXT.gray100}`}>
                  {review.date
                    ? new Date(review.date).toLocaleDateString()
                    : "Нет даты"}
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

            <div className="leading-5 mb-2.5 break-words">
              {expandedReviews[index] ? (
                <>
                  {review.text}{" "}
                  <span
                    className={`${COLORS_TEXT.blue200} cursor-pointer font-semibold`}
                    onClick={() => toggleReviewText(index)}
                  >
                    {t("hide")}
                  </span>
                </>
              ) : (
                <>
                  {review.text.length > 150
                    ? `${review.text.slice(0, 150)}...`
                    : review.text}{" "}
                  {review.text.length > 150 && (
                    <span
                      className={`${COLORS_TEXT.blue200} cursor-pointer font-semibold`}
                      onClick={() => toggleReviewText(index)}
                    >
                      {t("more")}
                    </span>
                  )}
                </>
              )}
            </div>

            <ul className="flex gap-1 overflow-x-auto scrollbar-hide scroll-smooth mb-2">
              {review.images.map((image, index) => (
                <li key={index} className="w-20 h-20 flex-shrink-0">
                  <img
                    src={baseUrl + image}
                    alt="Изображение"
                    className="rounded-lg  w-full h-full object-cover"
                  />
                </li>
              ))}
            </ul>

            <ul>
              {review.answer && (
                <li key={index}>
                  <TextField
                    value={review.answer.text}
                    sx={{ marginBottom: "8px", border: "solid #E4E9EA 1px" }}
                    variant="outlined"
                    fullWidth={true}
                    label={t("theAnswer")}
                    InputProps={{ readOnly: true }}
                  />
                </li>
              )}
              {review.report && (
                <li key={index}>
                  <TextField
                    InputLabelProps={{
                      sx: {
                        color: "red",
                        "&.Mui-focused": { color: "red" },
                      },
                    }}
                    value={review.report.text}
                    sx={{ marginBottom: "8px", border: "solid #E4E9EA 1px" }}
                    variant="outlined"
                    fullWidth={true}
                    label={t("complaint")}
                    InputProps={{ readOnly: true }}
                  />
                </li>
              )}
            </ul>
          </li>
        ))}
      </ul>
      )}
      {!isAdmin &&
      <Button
        mode="transparent"
        className="mb-4"
        onClick={() => navigate({ to: `/announcements/reviews/${ad.id}` })}
      >
        {t("viewAllReviews")}
      </Button>
      }
      {roleService.getValue() === ROLE_TYPE.TOURIST && ad.isBookable && (
        <Button
          onClick={() =>
            ad.subcategory.category.name === "Жилье"
              ? navigate({ to: `/announcements/booking-date/${ad.id}` })
              : navigate({ to: `/announcements/booking-time/${ad.id}` })
          }
        >
          {t("toBook")}
        </Button>
      )}
    </div>
  );
};
