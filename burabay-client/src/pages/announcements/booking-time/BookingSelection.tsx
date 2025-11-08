import { FC, useState } from "react";
import { Announcement, Booking as BookingType } from "../model/announcements";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import {
  COLORS_BACKGROUND,
  COLORS_BORDER,
  COLORS_TEXT,
} from "../../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../app/icons/announcements/blueBackicon.svg";
import { baseUrl } from "../../../services/api/ServerData";
import StarIcon from "../../../app/icons/announcements/star.svg";
import { Button } from "../../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import dayjs, { Dayjs } from "dayjs";
import DefaultIcon from "../../../app/icons/abstract-bg.svg";
import isBetween from "dayjs/plugin/isBetween";
import { BookingCalendar } from "./ui/BookingCalendar";

dayjs.extend(isBetween);

interface Props {
  announcement: Announcement;
  bannedDates?: TDates[];
  serviceSchedule?: BookingType[];
}

interface TDates {
  startDate: string;
  endDate?: string;
}

export interface BookingState {
  time?: string;
  date?: string;
  announcement: Announcement;
  dateStart?: string;
  dateEnd?: string;
}

export const BookingSelection: FC<Props> = ({
  announcement,
  bannedDates,
  serviceSchedule,
}) => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState<string>(
    baseUrl + announcement.images[0]
  );
  const [errorMessage, _setErrorMessage] = useState<string | null>(null);

  // Определяем режим работы: суточное бронирование или почасовое
  const isFullDayBooking = announcement.isFullDay;

  // Состояния для суточного бронирования
  const [selectedDateStart, setSelectedDateStart] = useState<string | null>(
    null
  );
  const [selectedDateEnd, setSelectedDateEnd] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<"start" | "end">("start");

  // Состояния для почасового бронирования
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [times, setTimes] = useState<{ time: string; isBlocked: boolean }[]>(
    []
  );

  // Общее состояние для текущей выбранной даты в календаре
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Dayjs | null>(
    null
  );

  // Получаем локаль для календаря
  const locale =
    i18n.language === "kk" ? "kk" : i18n.language === "en" ? "en" : "ru";

  // ===========================================
  // ЛОГИКА ПРОВЕРКИ БЛОКИРОВОК
  // ===========================================

  // Проверка заблокированных дат из bannedDates (уже забронированные клиентами)
  const isDateBannedByBookings = (date: Dayjs): boolean => {
    return (
      bannedDates?.some(({ startDate, endDate }) => {
        const start = dayjs(startDate, "DD.MM.YYYY").startOf("day");
        // Если endDate отсутствует, считаем что забронирован только один день
        const end = endDate
          ? dayjs(endDate, "DD.MM.YYYY").endOf("day")
          : start.endOf("day");
        return date.isBetween(start, end, null, "[]");
      }) ?? false
    );
  };

  // Проверка заблокированных дат владельцем (announcement.bookingBanDate)
  const isDateBannedByOwner = (date: Dayjs): boolean => {
    return (
      announcement.bookingBanDate?.some((banDate) => {
        if (!banDate.allDay) {
          // Если не весь день заблокирован, пропускаем (проверка времени будет отдельно)
          return false;
        }
        // Даты могут приходить в формате "YYYY-MM-DD" или "DD.MM.YYYY"
        const bannedDate = banDate.date.includes("-")
          ? dayjs(banDate.date, "YYYY-MM-DD").startOf("day")
          : dayjs(banDate.date, "DD.MM.YYYY").startOf("day");
        return date.isSame(bannedDate, "day");
      }) ?? false
    );
  };

  // Проверка заблокированных дат из serviceSchedule (allDay: true)
  const isDateBlockedByServiceSchedule = (date: Dayjs): boolean => {
    return (
      serviceSchedule?.some(
        ({ date: blockedDate, allDay }) =>
          allDay && dayjs(blockedDate).isSame(date, "day")
      ) ?? false
    );
  };

  // Общая проверка: заблокирована ли дата
  const isDateBanned = (date: Dayjs): boolean => {
    return (
      isDateBannedByBookings(date) ||
      isDateBannedByOwner(date) ||
      isDateBlockedByServiceSchedule(date)
    );
  };

  // Проверка дней недели по расписанию (schedule с "00:00")
  // Если isRoundTheClock === true, не блокируем дни недели (работает 24/7)
  const blockedDaysOfWeek =
    isFullDayBooking || announcement.isRoundTheClock
      ? []
      : Object.entries(announcement.schedule ?? {})
          .filter(([key, value]) => {
            // Блокируем день только если Start === "00:00" И End === "00:00"
            // (это означает что день не работает вообще)
            if (!key.endsWith("Start") || value !== "00:00") return false;
            const endKey = key.replace("Start", "End");
            const endValue =
              announcement.schedule?.[
                endKey as keyof typeof announcement.schedule
              ];
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

  const isDayBlockedBySchedule = (date: Dayjs): boolean => {
    return blockedDaysOfWeek.includes(date.day());
  };

  // Основная функция для shouldDisableDate
  const shouldDisableDate = (date: Dayjs): boolean => {
    const today = dayjs().startOf("day");

    if (date.isBefore(today)) return true; // Блокируем прошедшие дни
    if (isFullDayBooking) return isDateBanned(date); // Для суточного бронирования
    if (isDayBlockedBySchedule(date)) return true; // Блокируем дни с "00:00"
    if (isDateBanned(date)) return true; // Блокируем заблокированные даты

    return false;
  };

  // ===========================================
  // ОБРАБОТЧИКИ ДЛЯ СУТОЧНОГО БРОНИРОВАНИЯ
  // ===========================================

  const handleFullDayDateChange = (date: Dayjs | null) => {
    if (!date) return;

    const formattedDate = date.format("DD.MM.YYYY");

    if (activeField === "start") {
      setSelectedDateStart(formattedDate);
      setCurrentSelectedDate(date);

      if (selectedDateEnd) {
        const endDate = dayjs(selectedDateEnd, "DD.MM.YYYY");
        if (date.isAfter(endDate)) {
          setSelectedDateEnd(null);
        }
      }

      setActiveField("end");
    } else {
      const startDate = dayjs(selectedDateStart, "DD.MM.YYYY");

      if (date.isBefore(startDate)) {
        return;
      }

      // Проверяем, есть ли заблокированные даты между startDate и date
      const hasBlockedDatesInRange =
        bannedDates?.some(({ startDate: bannedStart, endDate: bannedEnd }) => {
          const bannedStartDate = dayjs(bannedStart, "DD.MM.YYYY").startOf(
            "day"
          );
          const bannedEndDate = bannedEnd
            ? dayjs(bannedEnd, "DD.MM.YYYY").endOf("day")
            : bannedStartDate.endOf("day");

          return (
            bannedStartDate.isBetween(startDate, date, null, "[]") ||
            bannedEndDate.isBetween(startDate, date, null, "[]") ||
            (startDate.isBefore(bannedStartDate) && date.isAfter(bannedEndDate))
          );
        }) ?? false;

      if (hasBlockedDatesInRange) {
        // Находим ближайшую заблокированную дату в диапазоне
        const blockedRange = bannedDates?.find(
          ({ startDate: bannedStart, endDate: bannedEnd }) => {
            const bannedStartDate = dayjs(bannedStart, "DD.MM.YYYY").startOf(
              "day"
            );
            const bannedEndDate = bannedEnd
              ? dayjs(bannedEnd, "DD.MM.YYYY").endOf("day")
              : bannedStartDate.endOf("day");

            return (
              bannedStartDate.isBetween(startDate, date, null, "[]") ||
              bannedEndDate.isBetween(startDate, date, null, "[]") ||
              (startDate.isBefore(bannedStartDate) &&
                date.isAfter(bannedEndDate))
            );
          }
        );

        if (blockedRange) {
          // Ищем первую доступную дату после окончания заблокированного диапазона
          const blockedEndDate = blockedRange.endDate
            ? dayjs(blockedRange.endDate, "DD.MM.YYYY")
            : dayjs(blockedRange.startDate, "DD.MM.YYYY");
          let newStartDate = blockedEndDate.add(1, "day");

          // Проверяем, что новая дата доступна (не заблокирована и соответствует графику)
          while (
            newStartDate.isBefore(date) ||
            newStartDate.isSame(date, "day")
          ) {
            if (
              !isDateBanned(newStartDate) &&
              !isDayBlockedBySchedule(newStartDate)
            ) {
              // Нашли доступную дату
              break;
            }
            newStartDate = newStartDate.add(1, "day");
          }

          // Проверяем, что новая дата заезда не позже даты отъезда
          if (newStartDate.isBefore(date) || newStartDate.isSame(date, "day")) {
            if (
              !isDateBanned(newStartDate) &&
              !isDayBlockedBySchedule(newStartDate)
            ) {
              setSelectedDateStart(newStartDate.format("DD.MM.YYYY"));
              setCurrentSelectedDate(newStartDate);
            } else {
              // Если не можем найти доступную дату, не разрешаем выбор
              return;
            }
          } else {
            // Если не можем скорректировать, просто не разрешаем выбор
            return;
          }
        }
      }

      setSelectedDateEnd(formattedDate);
      setCurrentSelectedDate(date);
    }
  };

  // ===========================================
  // ОБРАБОТЧИКИ ДЛЯ ПОЧАСОВОГО БРОНИРОВАНИЯ
  // ===========================================

  const handleHourlyDateChange = (date: Dayjs | null) => {
    if (!date) return;

    setSelectedTime("");
    setSelectedDate(date);
    setCurrentSelectedDate(date);

    // Находим все записи для выбранной даты в serviceSchedule
    const matchingDates =
      serviceSchedule?.filter((currDate) =>
        dayjs(currDate.date).isSame(date, "day")
      ) ?? [];

    const availableTimes = announcement.startTime || []; // Общие временные интервалы

    if (matchingDates.length > 0) {
      // Собираем все заблокированные времена из всех записей для этой даты
      const allBlockedTimes = matchingDates.reduce((acc, curr) => {
        return [...acc, ...curr.times];
      }, [] as string[]);

      // Убираем дубликаты
      const uniqueBlockedTimes = [...new Set(allBlockedTimes)];

      const combinedTimes = availableTimes.map((time) => ({
        time,
        isBlocked: uniqueBlockedTimes.includes(time),
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

  // ===========================================
  // УНИВЕРСАЛЬНЫЙ ОБРАБОТЧИК ИЗМЕНЕНИЯ ДАТЫ
  // ===========================================

  const handleDateChange = (date: Dayjs | null) => {
    if (isFullDayBooking) {
      handleFullDayDateChange(date);
    } else {
      handleHourlyDateChange(date);
    }
  };

  // ===========================================
  // СОХРАНЕНИЕ И НАВИГАЦИЯ
  // ===========================================

  const saveBooking = async () => {
    if (isFullDayBooking) {
      // Суточное бронирование
      if (
        !selectedDateStart ||
        !selectedDateEnd ||
        selectedDateStart === selectedDateEnd
      ) {
        return;
      }

      const startDate = dayjs(selectedDateStart, "DD.MM.YYYY");
      const endDate = dayjs(selectedDateEnd, "DD.MM.YYYY");

      if (endDate.isBefore(startDate)) {
        return;
      }

      navigate({
        to: "/announcements/booking",
        state: {
          dateStart: selectedDateStart,
          dateEnd: selectedDateEnd,
          announcement,
        } as Record<string, unknown>,
      });
    } else {
      // Почасовое бронирование
      if (!selectedDate) return;

      navigate({
        to: "/announcements/booking",
        state: {
          time: selectedTime || null,
          date: selectedDate.format("DD.MM.YYYY"),
          announcement,
        } as unknown as Record<string, unknown>,
      });
    }
  };

  // Проверка доступности кнопки "Забронировать"
  const isButtonDisabled = isFullDayBooking
    ? !selectedDateStart ||
      !selectedDateEnd ||
      selectedDateStart === selectedDateEnd
    : !selectedDate || (!selectedTime && times.length > 0);

  return (
    <section>
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="Back" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {isFullDayBooking ? t("service") : t("serviceSchedule")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => history.back()}
          ></IconContainer>
        </div>
      </Header>

      {/* Информация об объявлении */}
      <div className="mb-4 px-4">
        <div className="flex">
          <img
            src={imageSrc}
            onError={() => setImageSrc(DefaultIcon)}
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

      {/* Календарь */}
      <BookingCalendar
        value={currentSelectedDate}
        onChange={handleDateChange}
        shouldDisableDate={shouldDisableDate}
        locale={locale}
        isFullDay={isFullDayBooking}
        selectedDateStart={
          isFullDayBooking
            ? selectedDateStart
            : selectedDate?.format("DD.MM.YYYY") || null
        }
        selectedDateEnd={isFullDayBooking ? selectedDateEnd : null}
      />

      {/* UI для суточного бронирования */}
      {isFullDayBooking && (
        <div className="px-4 mb-32">
          <h2 className="mb-4">{t("bookingDate")}</h2>
          <div className="flex justify-between mb-4">
            {/* Кнопка выбора даты заезда */}
            <button
              className={`relative w-full h-16 px-10 py-5 rounded-[40px] mr-2 text-sm border ${
                activeField === "start"
                  ? `${COLORS_BORDER.blue200} ${COLORS_TEXT.blue200}`
                  : `${COLORS_BORDER.gray100} ${COLORS_TEXT.gray100}`
              }`}
              onClick={() => {
                setActiveField("start");
              }}
            >
              <span
                className={`absolute bottom-[50%] left-0 w-full text-sm transition-all ${
                  selectedDateStart ? "translate-y-[-5px]" : "translate-y-[50%]"
                }`}
              >
                {t("CheckInDate")}
              </span>
              <span
                className={`absolute bottom-[20%] left-[25%] transition-all text-lg text-black font-medium`}
              >
                {selectedDateStart}
              </span>
            </button>

            {/* Кнопка выбора даты отъезда */}
            <button
              className={`relative w-full h-16 px-10 py-5 rounded-[40px] mr-2 text-sm border ${
                activeField === "end"
                  ? `${COLORS_BORDER.blue200} ${COLORS_TEXT.blue200}`
                  : `${COLORS_BORDER.gray100} ${COLORS_TEXT.gray100}`
              }`}
              onClick={() => {
                setActiveField("end");
              }}
            >
              <span
                className={`absolute bottom-[50%] left-0 w-full text-sm transition-all ${
                  selectedDateEnd ? "translate-y-[-5px]" : "translate-y-[50%]"
                }`}
              >
                {t("DepatureDate")}
              </span>
              <span
                className={`absolute bottom-[20%] left-[25%] transition-all text-lg text-black font-medium`}
              >
                {selectedDateEnd}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* UI для почасового бронирования */}
      {!isFullDayBooking && (
        <div className="px-4 mb-32">
          {times.length > 0 ? (
            <>
              <h2 className="mb-4">{t("serviceDuration")}</h2>
              <ul className="flex flex-wrap gap-2">
                {times.map(({ time, isBlocked }, index) => (
                  <li
                    key={index}
                    className={`border-2 rounded-3xl w-28 h-12 flex items-center justify-center 
                    ${
                      isBlocked
                        ? "border-gray-400 text-gray-400 cursor-not-allowed"
                        : `${COLORS_BORDER.blue200} cursor-pointer`
                    } 
                    ${selectedTime === time && !isBlocked ? "bg-blue200 text-white" : "bg-white"}`}
                    onClick={() => !isBlocked && setSelectedTime(time)}
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
      )}

      {errorMessage && (
        <div className="text-red-500 text-sm text-center mt-2">
          {errorMessage}
        </div>
      )}

      {/* Кнопка бронирования */}
      <Button
        disabled={isButtonDisabled}
        onClick={saveBooking}
        className="fixed bottom-6 left-3 w-header mt-8 z-10"
      >
        {t("toBook")}
      </Button>
    </section>
  );
};
