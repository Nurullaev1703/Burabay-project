import { FC, useState } from "react";
import { Announcement, Booking } from "../../model/announcements";
import { Header } from "../../../../components/Header";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import { Typography } from "../../../../shared/ui/Typography";
import {
  COLORS_BACKGROUND,
  COLORS_BORDER,
  COLORS_TEXT,
} from "../../../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../../app/icons/announcements/blueBackicon.svg";
import dayjs, { Dayjs } from "dayjs";
import { baseUrl } from "../../../../services/api/ServerData";
import StarIcon from "../../../../app/icons/announcements/star.svg";
import DefaultImage from "../../../../app/icons/abstract-bg.svg";
import { Button } from "../../../../shared/ui/Button";
import { BookingCalendar } from "../../booking-time/ui/BookingCalendar";

interface Props {
  announcement: Announcement;
  serviceSchedule: Booking[];
}

export const ServiceSchedule: FC<Props> = function ServiceSchedule({
  serviceSchedule,
  announcement,
}) {
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [times, setTimes] = useState<{ time: string; isBlocked: boolean }[]>(
    []
  );
  const [imageSrc, setImageSrc] = useState<string>(
    baseUrl + announcement.images[0]
  );

  // Установка времени с учетом заблокированных
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    if (!date) return;

    const formattedDate = date.format("DD.MM.YYYY");
    const matchingDate = serviceSchedule.find(
      (currDate) => currDate.date === formattedDate
    );

    const availableTimes = announcement.startTime || []; // Общие временные интервалы
    if (matchingDate) {
      const blockedTimes = matchingDate.times; // Временные интервалы, которые заблокированы
      const combinedTimes = availableTimes.map((time) => ({
        time,
        isBlocked: blockedTimes.includes(time),
      }));
      setTimes(combinedTimes);
    } else {
      // Если даты нет в расписании, все времена доступны
      const combinedTimes = availableTimes.map((time) => ({
        time,
        isBlocked: false,
      }));
      setTimes(combinedTimes);
    }
  };

  return (
    <section>
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
              {t("serviceSchedule")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => history.back()}
          ></IconContainer>
        </div>
      </Header>

      <div className="mb-4 px-4">
        <div className="flex">
          <img
            src={imageSrc}
            onError={() => setImageSrc(DefaultImage)}
            alt={announcement.title}
            className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
          />
          <div>
            <span>{announcement.title}</span>
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
          </div>
        </div>
      </div>

      <div className="mb-8 px-4">
        <BookingCalendar
          value={selectedDate}
          onChange={handleDateChange}
          shouldDisableDate={(date: Dayjs) => date.isBefore(dayjs(), "day")}
          locale={i18n.language as "ru" | "kk" | "en"}
        />
      </div>

      <div className="px-4">
        {times.length > 0 ? (
          <>
            <h2 className="mb-4">{t("serviceDuration")}</h2>
            <ul className="flex flex-wrap gap-2">
              {times.map(({ time, isBlocked }, index) => (
                <li
                  key={index}
                  className={`border-2 rounded-3xl w-28 h-12 flex items-center justify-center ${
                    isBlocked
                      ? "border-gray-400 text-gray-400 cursor-not-allowed"
                      : `${COLORS_BORDER.blue200} bg-white cursor-pointer`
                  }`}
                >
                  <span>{time}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <span
            className={`${COLORS_TEXT.gray100} flex items-center justify-center w-full h-full text-sm`}
          >
            {t("serviceFullDay")}
          </span>
        )}
      </div>

      {/* Кнопка назад внизу страницы, как на других шагах */}
      <div className="fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full z-10">
        <Button onClick={() => history.back()}>{t("back")}</Button>
      </div>
    </section>
  );
};
