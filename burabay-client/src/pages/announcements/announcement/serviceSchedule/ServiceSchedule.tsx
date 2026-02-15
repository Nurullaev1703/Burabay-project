import { FC, useState, useMemo, useEffect } from "react";
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

  // Отладка: выводим данные о заблокированных датах
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  // Инициализируем times со всеми доступными временами при загрузке
  const [times, setTimes] = useState<string[]>(announcement.startTime || []);
  const [imageSrc, setImageSrc] = useState<string>(
    baseUrl + announcement.images[0]
  );

  // Вычисляем дни недели, которые заблокированы в расписании (00:00 - 00:00)
  const blockedDaysOfWeek = useMemo(() => {
    // Если круглосуточно или это полный день - не блокируем по расписанию
    if (announcement.isFullDay || announcement.isRoundTheClock) {
      return [];
    }

    // Проверяем все дни - если все 00:00 - 00:00, то это круглосуточно
    if (announcement.schedule) {
      const schedule = announcement.schedule;
      const allDaysUnavailable =
        schedule.monStart === "00:00" &&
        schedule.monEnd === "00:00" &&
        schedule.tueStart === "00:00" &&
        schedule.tueEnd === "00:00" &&
        schedule.wenStart === "00:00" &&
        schedule.wenEnd === "00:00" &&
        schedule.thuStart === "00:00" &&
        schedule.thuEnd === "00:00" &&
        schedule.friStart === "00:00" &&
        schedule.friEnd === "00:00" &&
        schedule.satStart === "00:00" &&
        schedule.satEnd === "00:00" &&
        schedule.sunStart === "00:00" &&
        schedule.sunEnd === "00:00";

      // Если все дни 00:00 - это круглосуточно
      if (allDaysUnavailable) {
        return [];
      }
    }

    // Извлекаем дни, которые заблокированы (00:00 - 00:00)
    return Object.entries(announcement.schedule ?? {})
      .filter(([key, value]) => {
        if (!key.endsWith("Start") || value !== "00:00") return false;
        const endKey = key.replace("Start", "End");
        const endValue =
          announcement.schedule?.[endKey as keyof typeof announcement.schedule];
        return endValue === "00:00";
      })
      .map(([key]) => {
        const dayMap: Record<string, number> = {
          monStart: 1,
          tueStart: 2,
          wenStart: 3,
          thuStart: 4,
          friStart: 5,
          satStart: 6,
          sunStart: 0,
        };
        return dayMap[key] ?? null;
      })
      .filter((day): day is number => day !== null);
  }, [announcement]);

  // Проверяем, заблокирована ли дата по расписанию
  const isDayBlockedBySchedule = (date: Dayjs): boolean => {
    return blockedDaysOfWeek.includes(date.day());
  };

  // Проверяем, заблокирована ли дата в serviceSchedule (с allDay: true)
  const isDateBlockedByOrganization = (date: Dayjs): boolean => {
    return (
      serviceSchedule?.some((banDate) => {
        // ВАЖНО: Пропускаем даты, забронированные через систему бронирования (isByBooking: true)
        // Показываем только даты, заблокированные самой организацией (isByBooking: false)
        if (banDate.isByBooking) return false;

        const isSameDate = dayjs(banDate.date).isSame(date, "day");
        if (!isSameDate) return false;

        // Блокируем только если allDay: true
        if (banDate.allDay) {
          return true;
        }

        // Для times - НЕ блокируем дату, просто скроем недоступные времена
        return false;
      }) ?? false
    );
  };

  // Основная функция для блокирования дат в календаре
  const shouldDisableDate = (date: Dayjs): boolean => {
    const today = dayjs().startOf("day");

    if (date.isBefore(today)) return true; // Блокируем прошедшие дни
    if (isDayBlockedBySchedule(date)) return true; // Блокируем дни с "00:00"
    if (isDateBlockedByOrganization(date)) return true; // Блокируем заблокированные даты

    return false;
  };

  // Находим ближайшую доступную дату и устанавливаем её при загрузке
  useEffect(() => {
    // Ищем ближайшую дату, которая не заблокирована
    let currentDate = dayjs().startOf("day");
    let maxIterations = 365; // Ищем не более года в будущем
    let i = 0;

    while (i < maxIterations) {
      if (!shouldDisableDate(currentDate)) {
        // Нашли доступную дату
        setSelectedDate(currentDate);
        handleDateChange(currentDate);
        break;
      }
      currentDate = currentDate.add(1, "day");
      i++;
    }
  }, [announcement, serviceSchedule]);

  // Установка времени с учетом заблокированных (только доступные времена)
  const handleDateChange = (date: Dayjs | null) => {
    setSelectedDate(date);
    if (!date) return;

    // Находим все записи для выбранной даты в serviceSchedule
    // Учитываем ТОЛЬКО записи где isByBooking: false (заблокированные организацией)
    const matchingDates = serviceSchedule.filter(
      (currDate) =>
        dayjs(currDate.date).isSame(date, "day") && !currDate.isByBooking
    );

    const availableTimes = announcement.startTime || []; // Общие временные интервалы

    if (matchingDates.length > 0) {
      // Собираем все заблокированные времена из записей организации
      const allBlockedTimes = matchingDates.reduce((acc, curr) => {
        return [...acc, ...(curr.times || [])];
      }, [] as string[]);

      // Убираем дубликаты
      const uniqueBlockedTimes = [...new Set(allBlockedTimes)];

      // Исключаем только те времена, которые заблокированы организацией
      const availableTimes_filtered = availableTimes.filter(
        (time) => !uniqueBlockedTimes.includes(time)
      );
      setTimes(availableTimes_filtered);
    } else {
      // Если даты нет в расписании, все времена доступны
      setTimes(availableTimes);
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

      <div className="mb-4 p-4">
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
          shouldDisableDate={shouldDisableDate}
          locale={i18n.language as "ru" | "kk" | "en"}
        />
      </div>

      <div className="px-4 pb-24">
        {times.length > 0 ? (
          <>
            <h2 className="mb-4">{t("serviceDuration")}</h2>
            <ul className="flex flex-wrap gap-2">
              {times.map((time, index) => (
                <li
                  key={index}
                  className={`border-2 ${COLORS_BORDER.blue200} bg-white cursor-pointer rounded-3xl w-28 h-12 flex items-center justify-center`}
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
      <div className="fixed left-0 bottom-0 mb-2 p-2 w-full z-10">
        <Button onClick={() => history.back()}>{t("back")}</Button>
      </div>
    </section>
  );
};
