import { FC } from "react";
import { DateCalendar, PickersDay, PickersDayProps } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/ru";
import "dayjs/locale/kk";
import "dayjs/locale/en";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);

interface BookingCalendarProps {
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  shouldDisableDate: (date: Dayjs) => boolean;
  locale: "ru" | "kk" | "en";
  isFullDay?: boolean;
  selectedDateStart?: string | null;
  selectedDateEnd?: string | null;
}

const CalendarDay = (
  props: PickersDayProps<Dayjs> & {
    isInRange?: boolean;
    isRangeStart?: boolean;
    isRangeEnd?: boolean;
  }
) => {
  const { day, isInRange, isRangeStart, isRangeEnd, ...other } = props;
  const isToday = day.isSame(dayjs(), "day");

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {isToday && (
        <div
          style={{
            position: "absolute",
            top: "8px",
            right: "10px",
            width: "8px",
            height: "8px",
            borderRadius: "50%",
            backgroundColor: "#0A7D9E",
            border: "2px solid white",
            zIndex: 1,
          }}
        />
      )}
      <PickersDay
        {...other}
        day={day}
        sx={{
          ...(isRangeStart || isRangeEnd
            ? {
                backgroundColor: "#0A7D9E !important",
                color: "white !important",
                "&:hover": {
                  backgroundColor: "#0A7D9E !important",
                },
              }
            : isInRange
              ? {
                  color: "#0A7D9E !important",
                  backgroundColor: "transparent !important",
                  "&:hover": {
                    backgroundColor: "rgba(10, 125, 158, 0.1) !important",
                  },
                }
              : {}),
        }}
      />
    </div>
  );
};

export const BookingCalendar: FC<BookingCalendarProps> = ({
  value,
  onChange,
  shouldDisableDate,
  locale,
  isFullDay = false,
  selectedDateStart,
  selectedDateEnd,
}) => {
  const calendarStyles = {
    width: "100%",
    maxWidth: "400px",
    "& .MuiPickersFadeTransitionGroup-root": {
      paddingLeft: "16px",
      paddingRight: "16px",
    },
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
    "& .MuiPickersCalendarHeader-labelContainer": {
      position: "absolute",
      left: "50%",
      transform: "translateX(-50%)",
      pointerEvents: "none",
      textTransform: "capitalize",
    },
    "& .MuiPickersCalendarHeader-label": {
      fontSize: "16px",
      fontWeight: 500,
      color: "#999999",
      textAlign: "center",
    },
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
    "& .MuiPickersCalendarHeader-switchViewButton": {
      display: "none",
    },
    "& .MuiDayCalendar-header": {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: 0,
      paddingLeft: 0,
      paddingRight: 0,
      marginBottom: "8px",
    },
    "& .MuiDayCalendar-weekDayLabel": {
      width: "44px",
      height: "44px",
      margin: 0,
      padding: 0,
      fontSize: "16px",
      fontWeight: 400,
      color: "#999999",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    "& .MuiDayCalendar-weekContainer": {
      display: "grid",
      gridTemplateColumns: "repeat(7, 1fr)",
      gap: 0,
      margin: 0,
    },
    "& .MuiDayCalendar-slideTransition": {
      minHeight: "240px",
    },
    "& .MuiPickersDay-root": {
      width: "32px",
      height: "32px",
      margin: "6px auto",
      fontSize: "14px",
      fontWeight: 400,
      color: "#333",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderRadius: "50%",
      "&:hover": {
        backgroundColor: "rgba(10, 125, 158, 0.1)",
      },
      "&.Mui-selected": {
        backgroundColor: "#0A7D9E !important",
        color: "white !important",
        "&:hover": {
          backgroundColor: "#0A7D9E !important",
        },
      },
      "&.Mui-disabled": {
        color: "#ccc !important",
      },
    },
    "& .MuiPickersDay-today": {
      border: "none !important",
      backgroundColor: "transparent",
    },
  };

  const isInRange = (day: Dayjs): boolean => {
    if (!selectedDateStart || !selectedDateEnd) return false;

    const start = dayjs(selectedDateStart, "DD.MM.YYYY");
    const end = dayjs(selectedDateEnd, "DD.MM.YYYY");

    return day.isAfter(start, "day") && day.isBefore(end, "day");
  };

  const isRangeStart = (day: Dayjs): boolean => {
    if (!selectedDateStart) return false;
    return day.format("DD.MM.YYYY") === selectedDateStart;
  };

  const isRangeEnd = (day: Dayjs): boolean => {
    if (!selectedDateEnd) return false;
    return day.format("DD.MM.YYYY") === selectedDateEnd;
  };

  return (
    <div className="w-full">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={locale}>
        <DateCalendar
          value={value}
          onChange={onChange}
          shouldDisableDate={shouldDisableDate}
          showDaysOutsideCurrentMonth
          dayOfWeekFormatter={(day) => day.format("dd")}
          minDate={dayjs()}
          disablePast
          sx={calendarStyles}
          slots={{
            day: CalendarDay,
          }}
          slotProps={{
            day: (ownerState) =>
              ({
                isInRange: isInRange(ownerState.day),
                isRangeStart: isRangeStart(ownerState.day),
                isRangeEnd: isRangeEnd(ownerState.day),
              }) as any,
          }}
        />
      </LocalizationProvider>
    </div>
  );
};
