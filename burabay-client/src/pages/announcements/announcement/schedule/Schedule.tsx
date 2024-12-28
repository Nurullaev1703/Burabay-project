import { FC, useState } from "react";
import { Header } from "../../../../components/Header";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import { Typography } from "../../../../shared/ui/Typography";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import {
  Announcement,
  Schedule as ScheduleType,
} from "../../model/announcements";
import BackIcon from "../../../../app/icons/announcements/blueBackicon.svg";
import { TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../../shared/ui/Button";

interface Props {
  announcement: Announcement;
}

interface Breaks {
  id: string;
  start: string;
  end: string;
}

interface FormType {
  isRoundTheClock: boolean;
  workingDays: ScheduleType;
  breaks: Breaks[];
}

type BreaksNames = `breaks.${number}.start` | `breaks.${number}.end`;

export const Schedule: FC<Props> = function Schedule({ announcement }) {
  const { t } = useTranslation();

  const [formattedBreaks, _] = useState<Breaks[]>(
    announcement.breaks as unknown as Breaks[]
  );

  const daysOfWeek = ["mon", "tue", "wen", "thu", "fri", "sat", "sun"] as const;
  // Форматирование времени
  const formatTime = (time: string | undefined) => {
    if (!time) return "00:00"; // Если данных нет, возвращаем "00:00"
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const { control } = useForm<FormType>({
    defaultValues: {
      isRoundTheClock: false,
      workingDays: {
        adId: announcement.id || "",
        monStart: formatTime(announcement.schedule.monStart),
        monEnd: formatTime(announcement.schedule.monEnd),
        tueStart: formatTime(announcement.schedule.tueStart),
        tueEnd: formatTime(announcement.schedule.tueEnd),
        wenStart: formatTime(announcement.schedule.wenStart),
        wenEnd: formatTime(announcement.schedule.wenEnd),
        thuStart: formatTime(announcement.schedule.thuStart),
        thuEnd: formatTime(announcement.schedule.thuEnd),
        friStart: formatTime(announcement.schedule.friStart),
        friEnd: formatTime(announcement.schedule.friEnd),
        satStart: formatTime(announcement.schedule.satStart),
        satEnd: formatTime(announcement.schedule.satEnd),
        sunStart: formatTime(announcement.schedule.sunStart),
        sunEnd: formatTime(announcement.schedule.sunEnd),
      },
      breaks: formattedBreaks,
    },
    mode: "onBlur",
  });
  return (
    <section className="bg-background min-h-screen">
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
              {announcement.title}
            </Typography>
            <Typography
              size={14}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("workingDays")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => history.back()}
          ></IconContainer>
        </div>
      </Header>

      <div className="bg-white mt-4 mx-4 rounded-lg">
        <ul>
          {daysOfWeek.map((day) => (
            <li
              key={day}
              className="mt-4 flex justify-between items-center h-12 border-b border-gray-300"
            >
              <div className="flex justify-between items-center px-4 w-full">
                {/* День недели */}
                <div>
                  <span>{t(day)}</span>
                </div>

                {/* Время или Выходной */}
                <div className="flex items-center">
                  <Controller
                    name={`workingDays.${day}Start`}
                    control={control}
                    render={({ field: startField }) => (
                      <Controller
                        name={`workingDays.${day}End`}
                        control={control}
                        render={({ field: endField }) => {
                          const isDayOff =
                            startField.value === "00:00" &&
                            endField.value === "00:00";

                          return isDayOff ? (
                            <span>{t("dayOff")}</span>
                          ) : (
                            <>
                              <span className="mr-2">{"с"}</span>
                              <TextField
                                {...startField}
                                variant="standard"
                                style={{ width: "50px" }}
                                InputProps={{
                                  readOnly: true,
                                  disableUnderline: true,
                                  style: {
                                    fontSize: "18px",
                                    fontWeight: "500",
                                  },
                                }}
                              />
                              <span className="mx-2">{"до"}</span>
                              <TextField
                                {...endField}
                                variant="standard"
                                style={{ width: "50px" }}
                                InputProps={{
                                  readOnly: true,
                                  disableUnderline: true,
                                  style: {
                                    fontSize: "18px",
                                    fontWeight: "500",
                                  },
                                }}
                              />
                            </>
                          );
                        }}
                      />
                    )}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white mx-4 mt-2">
        <ul>
          {formattedBreaks.map((_, index) => (
            <li
              key={index}
              className="mt-4 flex justify-between items-center h-12 border-b border-gray-300"
            >
              <div className="flex justify-between items-center px-4 w-full">
                {/* Перерыв */}
                <div>
                  <span>{t("breakTime")}</span>
                </div>

                <div className="flex items-center">
                  <Controller
                    name={`breaks[${index}].start` as BreaksNames}
                    control={control}
                    render={({ field: startField }) => (
                      <Controller
                        name={`breaks[${index}].end` as BreaksNames}
                        control={control}
                        render={({ field: endField }) => (
                          <>
                            <span className="mr-2">{"с"}</span>
                            <TextField
                              {...startField}
                              variant="standard"
                              style={{ width: "50px" }}
                              InputProps={{
                                readOnly: true,
                                disableUnderline: true,
                                style: {
                                  fontSize: "18px",
                                  fontWeight: "500",
                                },
                              }}
                            />
                            <span className="mx-2">{"до"}</span>
                            <TextField
                              {...endField}
                              variant="standard"
                              style={{ width: "50px" }}
                              InputProps={{
                                readOnly: true,
                                disableUnderline: true,
                                style: {
                                  fontSize: "18px",
                                  fontWeight: "500",
                                },
                              }}
                            />
                          </>
                        )}
                      />
                    )}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <Button
        className="fixed bottom-4 left-4 w-header z-10"
        onClick={() => history.back()}
      >
        {t("back")}
      </Button>
    </section>
  );
};
