import { FC, useState } from "react";
import { Booking } from "../../model/announcements";
import { Header } from "../../../../components/Header";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import { Typography } from "../../../../shared/ui/Typography";
import { COLORS_BORDER, COLORS_TEXT } from "../../../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../../app/icons/announcements/blueBackicon.svg";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/ru";

interface Props {
  serviceSchedule: Booking[];
}

export const ServiceSchedule: FC<Props> = function ServiceSchedule({
  serviceSchedule,
}) {
  const { t } = useTranslation();
  const [times, setTimes] = useState<string[]>([]);

  //   Установка даты
  const handleDateChange = (date: any) => {
    serviceSchedule.forEach((currDate) => {
      if (currDate.date === date?.format("MM/DD/YYYY")) {
        setTimes(currDate.times);
      } else {
        setTimes([]);
      }
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

      <div className="mb-8">
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
          <DateCalendar
            showDaysOutsideCurrentMonth
            onChange={handleDateChange}
          />
        </LocalizationProvider>
      </div>

      <div className="px-4">
        <h2 className="mb-4">{t("serviceDuration")}</h2>
        <ul className="flex flex-wrap gap-2">
          {times.map((time, index) => (
            <li
              key={index}
              className={`border-2 ${COLORS_BORDER.blue200} border-solid rounded-3xl w-28 h-12 flex items-center`}
            >
              <span className="w-full text-center">{time}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
