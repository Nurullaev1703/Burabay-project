import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Schedule } from "../../model/announcements";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import ArrowRight from "../../../../app/icons/arrow-right.svg";
import { Link } from "@tanstack/react-router";
interface Props {
  phoneNumber: string;
  schedule: Schedule | null | string;
  id: string;
}

export const AnnouncementInfoList: FC<Props> = function AnnouncementInfoList({
  phoneNumber,
  schedule,
  id
}) {
  const { t } = useTranslation();

  // Обработка обьекта с расписанием работы
  const renderSchedule = () => {
    if (!schedule || typeof schedule === "string") {
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
          schedule[startKey as keyof Schedule] !== "00:00" &&
          schedule[endKey as keyof Schedule] !== "00:00"
        );
      })
      .map(([, value]) => value);
  
    return workingDays.length > 0
      ? workingDays.join(", ")
      : "Нет рабочих дней";
  };
  

  const formatPhoneNumber = (number: number | string) => {
    const phoneStr = number.toString().replace(/\D/g, ""); // Убираем все нецифровые символы
    return `+${phoneStr.slice(0, 1)} ${phoneStr.slice(1, 4)} ${phoneStr.slice(4, 7)} ${phoneStr.slice(7, 9)}-${phoneStr.slice(9)}`;
  };

  return (
    <ul>
      <li className="flex flex-col border-b border-[#999999] py-3">
        <span>{formatPhoneNumber(phoneNumber)}</span>
        <span className={`${COLORS_TEXT.gray100} text-sm`}>
          {t("contactPhone")}
        </span>
      </li>
      <li className="border-b border-[#999999] py-3">
        <Link to={`/announcements/schedule/${id}`} className="flex justify-between">
          <div className="flex flex-col">
            <span>{renderSchedule()}</span>
            <span className={`${COLORS_TEXT.gray100} text-sm`}>
              {t("workingDays")}
            </span>
          </div>
          <img src={ArrowRight} alt="Стрелка" />
        </Link>
      </li>
      <li className="border-b border-[#999999] py-3">
        <Link className="flex justify-between">
          <span>{t("locationOnMap")}</span>
          <img src={ArrowRight} alt="Стрелка" />
        </Link>
      </li>
      <li className="py-3">
        <Link className="flex justify-between">
          <span>{t("details")}</span>
          <img src={ArrowRight} alt="Стрелка" />
        </Link>
      </li>
    </ul>
  );
};
