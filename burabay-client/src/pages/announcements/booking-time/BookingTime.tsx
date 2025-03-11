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
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ru";
import { baseUrl } from "../../../services/api/ServerData";
import StarIcon from "../../../app/icons/announcements/star.svg";
import { Button } from "../../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import DefaultIcon from "../../../app/icons/abstract-bg.svg";

interface Props {
  announcement: Announcement;
  serviceSchedule: BookingType[];
}

export interface BookingState {
  time?: string;
  date?: string;
  announcement: Announcement;
  dateStart?: string;
  dateEnd?: string;
}

export const BookingTime: FC<Props> = function BookingTime({
  serviceSchedule,
  announcement,
}) {
  const { t } = useTranslation();
  const [times, setTimes] = useState<{ time: string; isBlocked: boolean }[]>(
    []
  );
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState<string>(
    baseUrl + announcement.images[0]
  );
  const isDateBlocked = (date: dayjs.Dayjs): boolean => {
    return serviceSchedule?.some(({ date: blockedDate, allDay }) => 
      allDay && dayjs(blockedDate, "DD.MM.YYYY").isSame(date, "day")
    ) ?? false;
  };
  // Установка времени с учетом заблокированных
  const handleDateChange = (date: any) => {
    setSelectedTime("");
    const selectedDate = date?.format("DD.MM.YYYY");
    setSelectedDate(selectedDate);
    const matchingDate = serviceSchedule.find(
      (currDate) => currDate.date === selectedDate
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

  const saveTime = async (
    time: string | null,
    date: string,
    announcement: Announcement
  ) => {
    navigate({
      to: "/announcements/booking",
      state: { time, date, announcement } as unknown as Record<string, unknown>,
    });
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

      <div className="mb-4 border-y border-[#E4E9EA] mx-4">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
          <DateCalendar
            showDaysOutsideCurrentMonth
            onChange={handleDateChange}
            shouldDisableDate={(date: dayjs.Dayjs) => date.isBefore(dayjs(), "day") || isDateBlocked(date)}
            sx={{
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
          />
        </LocalizationProvider>
      </div>

      <div className="px-4">
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

      <Button
        onClick={() =>
          saveTime(selectedTime || null, selectedDate, announcement)
        }
        className="fixed bottom-6 left-3 w-header mt-8 z-10"
        disabled={!selectedDate || (!selectedTime && times.length > 0)}
      >
        {t("toBook")}
      </Button>
    </section>
  );
};
