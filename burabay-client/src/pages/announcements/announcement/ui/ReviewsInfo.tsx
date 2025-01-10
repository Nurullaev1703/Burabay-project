import { FC } from "react";
import { Announcement } from "../../model/announcements";
import { useTranslation } from "react-i18next";
import { COLORS_BACKGROUND, COLORS_TEXT } from "../../../../shared/ui/colors";
import StarIcon from "../../../../app/icons/announcements/star.svg";
import ArrowIcon from "../../../../app/icons/announcements/black-arrowRight.svg";
import { Link } from "@tanstack/react-router";

interface Props {
  ad: Announcement;
}

export const ReviewsInfo: FC<Props> = function ReviewsInfo({ ad }) {
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
      
      
    </div>
  );
};
