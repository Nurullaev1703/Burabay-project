import { FC, useState } from "react";
import { Announcement } from "../model/announcements";
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
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ru";
import { baseUrl } from "../../../services/api/ServerData";
import StarIcon from "../../../app/icons/announcements/star.svg";
import { Button } from "../../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import dayjs, { Dayjs } from "dayjs";
import DefaultIcon from "../../../app/icons/abstract-bg.svg";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

interface Props {
  announcement: Announcement;
  bannedDates?: TDates[];
}

interface TDates {
  startDate: string;
  endDate: string;
}

export const BookingDate: FC<Props> = ({ announcement, bannedDates }) => {
  const { t } = useTranslation();
  const [selectedDateStart, setSelectedDateStart] = useState<string | null>(
    null
  );
  const [selectedDateEnd, setSelectedDateEnd] = useState<string | null>(null);
  const [activeField, setActiveField] = useState<"start" | "end">("start"); // Текущее активное поле
  const navigate = useNavigate();
  const [errorMessage, _setErrorMessage] = useState<string | null>(null);
  const [imageSrc, setImageSrc] = useState<string>(
    baseUrl + announcement.images[0]
  );
  const isButtonDisabled =
    !selectedDateStart ||
    !selectedDateEnd ||
    selectedDateStart === selectedDateEnd;

  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (!date) return;

    const formattedDate = date.format("DD.MM.YYYY");

    if (activeField === "start") {
      setSelectedDateStart(formattedDate);

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

      setSelectedDateEnd(formattedDate);
    }
  };

  const isDateBanned = (date: Dayjs): boolean => {
    return (
      bannedDates?.some(({ startDate, endDate }) => {
        const start = dayjs(startDate, "DD.MM.YYYY").startOf("day");
        const end = dayjs(endDate, "DD.MM.YYYY").endOf("day");
        return date.isBetween(start, end, null, "[]");
      }) ?? false
    );
  };

  // Функция проверки, можно ли выбрать эту дату
  const blockedDaysOfWeek = announcement.isFullDay
    ? [] // Если isFullDay === true, не блокируем дни недели
    : Object.entries(announcement.schedule)
        .filter(([key, value]) => key.endsWith("Start") && value === "00:00")
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

  const isDayBlockedBySchedule = (date: dayjs.Dayjs): boolean => {
    return blockedDaysOfWeek.includes(date.day());
  };

  const shouldDisableDate = (date: dayjs.Dayjs): boolean => {
    const today = dayjs().startOf("day");

    if (date.isBefore(today)) return true; // Блокируем прошедшие дни
    if (announcement.isFullDay) return isDateBanned(date); // Если isFullDay, блокируем только заблокированные даты
    if (isDayBlockedBySchedule(date)) return true; // Блокируем дни с "00:00"
    if (isDateBanned(date)) return true; // Блокируем заблокированные даты

    if (activeField === "end" && selectedDateStart) {
      const startDate = dayjs(selectedDateStart, "DD.MM.YYYY");
      const endDate = date;

      return (
        bannedDates?.some(({ startDate: bannedStart, endDate: bannedEnd }) => {
          const bannedStartDate = dayjs(bannedStart, "DD.MM.YYYY").startOf(
            "day"
          );
          const bannedEndDate = dayjs(bannedEnd, "DD.MM.YYYY").endOf("day");

          return (
            bannedStartDate.isBetween(startDate, endDate, null, "[]") ||
            bannedEndDate.isBetween(startDate, endDate, null, "[]") ||
            (startDate.isBefore(bannedStartDate) &&
              endDate.isAfter(bannedEndDate))
          );
        }) ?? false
      );
    }

    return false;
  };
  const saveTime = async () => {
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
  };

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
              {t("service")}
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
      <div className="mb-4 border-y border-[#E4E9EA] mx-4">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
          <DateCalendar
            showDaysOutsideCurrentMonth
            onChange={handleDateChange}
            shouldDisableDate={shouldDisableDate}
            sx={{
              "& .Mui-selected": {
                backgroundColor: "#0A7D9E !important",
                color: "white !important",
              },
              "& .css-z4ns9w-MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button ":
                {
                  padding: "0px !important",
                },
              "& .css-1e9nyoq-MuiPickersCalendarHeader-labelContainer": {
                marginLeft: "20% !important",
              },
              "& .css-1chuxo2-MuiPickersCalendarHeader-label": {
                color: "#999999",
              },
              "& .css-1nxbkmn-MuiPickersCalendarHeader-root": {
                flexDirection: "row-reverse !important",
                position: "relative",
              },
              "& .css-17nrfho-MuiButtonBase-root-MuiIconButton-root-MuiPickersArrowSwitcher-button":
                {
                  position: "absolute",
                  right: "25px",
                  padding: "0px",
                },
              "& .css-iupya1-MuiButtonBase-root-MuiIconButton-root-MuiPickersCalendarHeader-switchViewButton":
                {
                  display: "none",
                },
              "& .css-1rf3jwr-MuiButtonBase-root-MuiIconButton-root-MuiPickersCalendarHeader-switchViewButton":
                {
                  display: "none",
                },
            }}
            slotProps={{
              day: {
                disableHighlightToday: true,
              },
            }}
          />
        </LocalizationProvider>
      </div>

      {/* Выбор дат */}
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
            onClick={() => setActiveField("start")}
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
            onClick={() => setActiveField("end")}
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
      {errorMessage && (
        <div className="text-red-500 text-sm text-center mt-2">
          {errorMessage}
        </div>
      )}
      {/* Кнопка */}
      <Button
        disabled={isButtonDisabled}
        onClick={saveTime}
        className="fixed bottom-6 left-3 w-header mt-8 z-10"
      >
        {t("toBook")}
      </Button>
    </section>
  );
};
