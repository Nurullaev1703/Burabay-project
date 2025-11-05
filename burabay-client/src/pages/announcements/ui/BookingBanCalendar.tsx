import { FC } from "react";
import { Modal } from "@mui/material";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { PickersDay, PickersDayProps } from "@mui/x-date-pickers/PickersDay";
import "dayjs/locale/ru";
import "dayjs/locale/kk";
import "dayjs/locale/en";
import { Dayjs } from "dayjs";
import XIcon from "../../../app/icons/announcements/blueKrestik.svg";

interface BookingBanCalendarProps {
  open: boolean;
  onClose: () => void;
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  shouldDisableDate: (date: Dayjs) => boolean;
  blockedDates: string[];
  locale: string;
}

// Кастомный компонент для дня календаря
function CalendarDay(props: PickersDayProps<Dayjs> & { dates?: string[] }) {
  const { dates = [], day, ...other } = props;
  const formattedDate = day.format("DD.MM.YYYY");
  const isAlreadySelected = dates.includes(formattedDate);

  return (
    <PickersDay
      {...other}
      day={day}
      className={isAlreadySelected ? "already-selected" : ""}
    />
  );
}

// Стили календаря
const calendarStyles = {
  width: "100%",
  maxHeight: "none",

  // Стили для текущего дня (синий кружок сверху)
  "& .MuiPickersDay-today": {
    border: "none !important",
    position: "relative",
    "&::before": {
      content: '""',
      position: "absolute",
      top: "4px",
      right: "4px",
      width: "4px",
      height: "4px",
      borderRadius: "50%",
      backgroundColor: "#0A7D9E",
    },
  },

  // Красный фон для выбранной даты
  "& .Mui-selected": {
    backgroundColor: "#FF4545 !important",
    color: "#fff !important",
    borderRadius: "50%",
    opacity: "1 !important",
  },
  "& .Mui-selected:hover": {
    backgroundColor: "#FF4545 !important",
    opacity: "1 !important",
  },
  "& .Mui-selected:focus": {
    backgroundColor: "#FF4545 !important",
    opacity: "1 !important",
  },
  // Убираем opacity для disabled и selected одновременно
  "& .Mui-disabled.Mui-selected": {
    opacity: "1 !important",
    backgroundColor: "#FF4545 !important",
  },

  // Убираем подсветку соседних дат
  "& .MuiPickersDay-root": {
    fontSize: "14px",
    fontWeight: 400,
    color: "#000",
    borderRadius: "50%",
    margin: "2px",
    "&:hover": {
      backgroundColor: "rgba(0, 0, 0, 0.04)",
    },
    "&:focus": {
      backgroundColor: "transparent",
    },
  },

  // Убираем эффекты для соседних дат при выборе
  "& .MuiPickersDay-root.MuiPickersDay-dayOutsideRangeInterval": {
    backgroundColor: "transparent !important",
  },

  "& .MuiPickersDay-root.MuiPickersDay-dayInsideRangeInterval": {
    backgroundColor: "transparent !important",
  },

  // Стили для уже заблокированных дат (красный круг вокруг)
  "& .MuiPickersDay-root.already-selected": {
    position: "relative",
    color: "#fff !important",
    backgroundColor: "#FF4545 !important",
    opacity: "1 !important",
    "&::after": {
      content: '""',
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "32px",
      height: "32px",
      borderRadius: "50%",
      backgroundColor: "#FF4545 !important",
      pointerEvents: "none",
      zIndex: -1,
    },
  },
  "& .MuiPickersDay-root.already-selected:hover": {
    backgroundColor: "#FF4545 !important",
    opacity: "1 !important",
  },

  // Стили для недоступных дат (серый цвет)
  "& .Mui-disabled": {
    color: "#DBDBDB !important",
  },

  // Дни вне текущего месяца
  "& .MuiPickersDay-dayOutsideMonth": {
    color: "#DBDBDB !important",
  },

  // Заголовок календаря - стрелки по бокам, заголовок в центре
  "& .MuiPickersCalendarHeader-root": {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: "16px",
    paddingRight: "16px",
    marginTop: "8px",
    marginBottom: "8px",
    position: "relative",
  },

  // Контейнер с заголовком - растягиваем на всю ширину
  "& .MuiPickersCalendarHeader-labelContainer": {
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    pointerEvents: "none",
    textTransform: "capitalize",
  },

  // Название месяца по центру
  "& .MuiPickersCalendarHeader-label": {
    fontSize: "16px",
    fontWeight: 500,
    color: "#999999",
    textAlign: "center",
  },

  // Стрелки навигации - размещаем по краям
  "& .MuiPickersArrowSwitcher-root": {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    position: "relative",
  },

  "& .MuiPickersArrowSwitcher-button": {
    padding: "8px",
    color: "#0A7D9E",
    zIndex: 1,
  },

  "& .MuiPickersArrowSwitcher-spacer": {
    display: "none",
  },

  // Скрываем кнопку переключения вида
  "& .MuiPickersCalendarHeader-switchViewButton": {
    display: "none",
  },

  // Названия дней недели
  "& .MuiDayCalendar-weekDayLabel": {
    fontSize: "12px",
    fontWeight: 400,
    color: "#999999",
  },
};

export const BookingBanCalendar: FC<BookingBanCalendarProps> = ({
  open,
  onClose,
  value,
  onChange,
  shouldDisableDate,
  blockedDates,
  locale,
}) => {
  return (
    <Modal
      className="flex w-full h-full justify-center items-center p-4"
      open={open}
      onClose={onClose}
    >
      <div className="relative w-full max-w-md bg-white rounded-lg">
        {/* Кнопка закрытия календаря */}
        <button
          onClick={onClose}
          className="absolute -top-2 -right-2 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors"
        >
          <img src={XIcon} className="w-4 h-4" alt="Закрыть" />
        </button>

        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
          <DateCalendar
            showDaysOutsideCurrentMonth
            value={value}
            onChange={onChange}
            shouldDisableDate={shouldDisableDate}
            slots={{
              day: CalendarDay,
            }}
            slotProps={{
              day: {
                dates: blockedDates,
              } as any,
            }}
            sx={calendarStyles}
          />
        </LocalizationProvider>
      </div>
    </Modal>
  );
};
