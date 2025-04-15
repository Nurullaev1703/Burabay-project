import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Announcement, Schedule } from "../../model/announcements";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import ArrowRight from "../../../../app/icons/arrow-right.svg";
import { Link } from "@tanstack/react-router";
import PhoneIcon from "../../../../app/icons/announcements/phone.svg";
import { roleService } from "../../../../services/storage/Factory";
import { ROLE_TYPE } from "../../../auth/model/auth-model";
import { baseUrl } from "../../../../services/api/ServerData";
import DefaultImage from "../../../../app/icons/abstract-bg.svg";
import ConfirmedIcon from "../../../../app/icons/profile/confirmed.svg";
interface Props {
  ad: Announcement;
  isAdmin?: boolean;
}
export const formatPhoneNumber = (number: number | string) => {
  const phoneStr = number.toString().replace(/\D/g, ""); // Убираем все нецифровые символы
  return `+${phoneStr.slice(0, 1)} ${phoneStr.slice(1, 4)} ${phoneStr.slice(4, 7)} ${phoneStr.slice(7, 9)}-${phoneStr.slice(9)}`;
};
export const AnnouncementInfoList: FC<Props> = function AnnouncementInfoList({
  ad,
  isAdmin,
}) {
  const { t } = useTranslation();
  const [imageSrc, setImageSrc] = useState<string>(
    baseUrl + ad.organization.imgUrl
  );
  // Обработка обьекта с расписанием работы
  const renderSchedule = () => {
    if (!ad.schedule || typeof ad.schedule === "string") {
      return "Нет расписания";
    }

    const daysMap: { [key: string]: string } = {
      mon: "Пн",
      tue: "Вт",
      wen: "Ср",
      thu: "Чт",
      fri: "Пт",
      sat: "Сб",
      sun: "Вс",
    };

    // Фильтрация дней с рабочим временем не равным "00:00"
    const workingDays = Object.entries(daysMap)
      .filter(([key]) => {
        const startKey = `${key}Start`;
        const endKey = `${key}End`;
        return (
          ad.schedule[startKey as keyof Schedule] !== "00:00" &&
          ad.schedule[endKey as keyof Schedule] !== "00:00"
        );
      })
      .map(([, value]) => value);

    return workingDays.length > 0
      ? workingDays.join(", ")
      : t("aroundClockDays");
  };

  return (
    <ul>
      <li className="py-3">
        <Link
          to={`/announcements/org-page/${ad.organization.id}`}
          className="flex justify-between"
        >
          <div className="flex items-center relative">
            <img
              className="rounded-full w-10 h-10 mr-2 object-cover"
              src={imageSrc}
              alt={ad.organization.name}
              onError={() => setImageSrc(DefaultImage)}
            />
            {ad.organization.isConfirmed && (
              <img
                src={ConfirmedIcon}
                className="absolute top-[-5px] left-6"
                alt="Подтверждено"
              />
            )}
            <span>{ad.organization.name}</span>
          </div>
          <img src={ArrowRight} alt="Стрелка" />
        </Link>
      </li>
      {ad.phoneNumber &&
      
      <li className="flex border-b border-[#E4E9EA] py-3 justify-between">
        <div className="flex flex-col">
          <span>{formatPhoneNumber(ad.phoneNumber)}</span>
          <span className={`${COLORS_TEXT.gray100} text-sm`}>
            {t("contactPhone")}
          </span>
        </div>
        {roleService.getValue() === ROLE_TYPE.TOURIST && (
          <a href={`tel:${ad.phoneNumber}`}>
            <img src={PhoneIcon} alt="Звонить" />
          </a>
        )}
      </li>
      }
      <li className="border-b border-[#E4E9EA] py-3">
        <Link
          to={`/announcements/schedule/${ad.id}`}
          className="flex justify-between"
        >
          <div className="flex flex-col">
            <span>
              {ad.isRoundTheClock ? t("aroundClockDays") : renderSchedule()}
            </span>
            <span className={`${COLORS_TEXT.gray100} text-sm`}>
              {t("workingDays")}
            </span>
          </div>
          <img src={ArrowRight} alt="Стрелка" />
        </Link>
      </li>
      {!isAdmin && ad.address && (
        <li className="border-b border-[#E4E9EA] py-3">
          <Link className="flex justify-between" to={`/mapNav?adId=${ad.id}`}>
            <span>{t("locationOnMap")}</span>
            <img src={ArrowRight} alt="Стрелка" />
          </Link>
        </li>
      )}
      <li className="py-3">
        <Link
          to={`/announcements/details/${ad.id}`}
          className="flex justify-between"
        >
          <span>{t("details")}</span>
          <img src={ArrowRight} alt="Стрелка" />
        </Link>
      </li>
    </ul>
  );
};
