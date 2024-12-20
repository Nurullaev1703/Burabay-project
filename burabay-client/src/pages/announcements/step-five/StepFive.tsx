import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import { ProgressSteps } from "../ui/ProgressSteps";
import BackIcon from "../../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../../app/icons/announcements/blueKrestik.svg";
import { Controller, useForm } from "react-hook-form";
import { DefaultForm } from "../../auth/ui/DefaultForm";
import { Switch, TextField } from "@mui/material";
import { useMask } from "@react-input/mask";
import { Button } from "../../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";

export const StepFive: FC = function StepFive() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  // Проверка на наличие данных schedule перед форматированием времени
  const formatTime = (time: string | undefined) => {
    if (!time) return "00:00"; // Если данных нет, возвращаем "00:00"
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const { handleSubmit, control, setValue, watch } = useForm({
    defaultValues: {
      aroundClock: false,
      workingDays: {
        mondayStartTime: formatTime(undefined), // Проверяем наличие schedule
        mondayEndTime: formatTime(undefined),
        tuesdayStartTime: formatTime(undefined),
        tuesdayEndTime: formatTime(undefined),
        wednesdayStartTime: formatTime(undefined),
        wednesdayEndTime: formatTime(undefined),
        thursdayStartTime: formatTime(undefined),
        thursdayEndTime: formatTime(undefined),
        fridayStartTime: formatTime(undefined),
        fridayEndTime: formatTime(undefined),
        saturdayStartTime: formatTime(undefined),
        saturdayEndTime: formatTime(undefined),
        sundayStartTime: formatTime(undefined),
        sundayEndTime: formatTime(undefined),
      },
      breaks: [
        {
          startTime: "12:12",
          endTime: "13:12",
        },
      ],
    },
    mode: "onBlur",
  });
  const [breaks, setBreaks] = useState<string[]>(watch("breaks"));
  const currentAroundClock = watch("aroundClock", false);
  // -------------- Дни недели

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ] as const;

  type Day = (typeof daysOfWeek)[number];

  const isDayActive = (day: Day) => {
    const startTime = watch(`workingDays.${day}StartTime`);
    const endTime = watch(`workingDays.${day}EndTime`);
    return startTime !== "00:00" || endTime !== "00:00";
  };

  const addBreak = () => {
    if (breaks.length < 2) {
      // Добавляем новый объект с пустыми значениями времени
      const newBreak = { startTime: "", endTime: "" };
      setBreaks([...breaks, newBreak]);
  
      // Синхронизируем с React Hook Form
      setValue(`breaks.${breaks.length}`, newBreak);  // устанавливаем новый break
    }
  };

  const handleBreakChange = (index: number, field: string, value: string) => {
    // Обновляем перерыв в массиве
    const updatedBreaks = [...breaks];
    updatedBreaks[index] = { ...updatedBreaks[index], [field]: value };
    setBreaks(updatedBreaks);
  
    // Обновляем значение в форме через setValue
    setValue(`breaks.${index}.${field}`, value);
  };

  const removeBreak = (index: number) => {
    // Удаляем перерыв по индексу
    const updatedBreaks = breaks.filter((_, i) => i !== index);
    setBreaks(updatedBreaks);
  
    // Синхронизируем с React Hook Form
    setValue('breaks', updatedBreaks);  // обновляем breaks в форме
  };

  return (
    <section className="min-h-screen bg-background">
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
              {t("newAnnouncemet")}
            </Typography>
            <Typography
              size={14}
              weight={400}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("workingDays")}
            </Typography>
          </div>
          <IconContainer align="end" action={() => history.back()}>
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={5} totalSteps={9}></ProgressSteps>
      </Header>

      <div className="mt-2 mx-4 bg-white rounded-lg">
        <DefaultForm>
          {/* Круглосточно или нет */}
          <div
            className={`flex justify-between items-center p-3 ${currentAroundClock ? "rounded-b-lg" : ""}`}
          >
            <span>{t("aroundClock")}</span>
            <Controller
              name={"aroundClock"}
              control={control}
              render={({ field }) => (
                <Switch
                  checked={currentAroundClock}
                  onChange={() => setValue("aroundClock", !currentAroundClock)}
                />
              )}
            />
          </div>

          {/* График работы */}
          {!currentAroundClock && (
            <ul className="items-center px-3 pt-3 rounded-b-lg">
              {daysOfWeek.map((day) => (
                <li key={day} className="mt-4">
                  <div className="flex justify-between items-center">
                    <span>{t(day)}</span>
                    <Controller
                      name={`workingDays.${day}StartTime`}
                      control={control}
                      render={({ field }) => (
                        <Switch
                          checked={isDayActive(day)}
                          onChange={() => {
                            const currentStartTime = watch(
                              `workingDays.${day}StartTime`
                            );
                            const currentEndTime = watch(
                              `workingDays.${day}EndTime`
                            );

                            if (
                              currentStartTime === "00:00" &&
                              currentEndTime === "00:00"
                            ) {
                              // Если активируем
                              setValue(`workingDays.${day}StartTime`, "09:00");
                              setValue(`workingDays.${day}EndTime`, "18:00");
                            } else {
                              // Если деактивируем
                              setValue(`workingDays.${day}StartTime`, "00:00");
                              setValue(`workingDays.${day}EndTime`, "00:00");
                            }
                          }}
                        />
                      )}
                    />
                  </div>

                  {isDayActive(day) && (
                    <div className="mb-2.5 items-center flex">
                      <span className="mr-4">{"с"}</span>
                      <Controller
                        name={`workingDays.${day}StartTime`}
                        control={control}
                        rules={{ required: t("requiredField") }}
                        render={({ field, fieldState: { error } }) => {
                          const timeMask = useMask({
                            mask: "hH:mM",
                            replacement: {
                              h: /[0-2]/,
                              H: /[0-9]/,
                              m: /[0-5]/,
                              M: /[0-9]/,
                            },
                          });
                          return (
                            <TextField
                              {...field}
                              inputRef={timeMask}
                              error={Boolean(error?.message)}
                              helperText={error?.message}
                              variant="standard"
                              style={{ width: "80px", marginRight: "16px" }}
                            />
                          );
                        }}
                      />
                      <span className="mr-4">{"до"}</span>
                      <Controller
                        name={`workingDays.${day}EndTime`}
                        control={control}
                        rules={{ required: t("requiredField") }}
                        render={({ field, fieldState: { error } }) => {
                          const timeMask = useMask({
                            mask: "hH:mM",
                            replacement: {
                              h: /[0-2]/,
                              H: /[0-9]/,
                              m: /[0-5]/,
                              M: /[0-9]/,
                            },
                          });
                          return (
                            <TextField
                              {...field}
                              inputRef={timeMask}
                              error={Boolean(error?.message)}
                              helperText={error?.message}
                              variant="standard"
                              style={{ width: "80px", marginLeft: "16px" }}
                            />
                          );
                        }}
                      />
                    </div>
                  )}
                  <hr />
                </li>
              ))}
            </ul>
          )}
        </DefaultForm>
      </div>

      {/* Перерыв */}
      <div className="bg-white p-3 rounded-lg mt-2 mx-4 mb-20">
        <h2>{t("breakTime")}</h2>
        <p className={`text-xs ${COLORS_TEXT.gray100}`}>
          {t("breakDescription")}
        </p>

        <ul>
          {breaks.map((breakItem, index) => (
            <li key={index} className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-4">{"с"}</span>
                <Controller
                  name={`breaks.${index}.startTime`}
                  control={control}
                  rules={{ required: t("requiredField") }}
                  render={({ field, fieldState: { error } }) => {
                    const timeMask = useMask({
                      mask: "hH:mM",
                      replacement: {
                        h: /[0-2]/,
                        H: /[0-9]/,
                        m: /[0-5]/,
                        M: /[0-9]/,
                      },
                    });
                    return (
                      <TextField
                        {...field}
                        inputRef={timeMask}
                        error={Boolean(error?.message)}
                        onChange={(e) => handleBreakChange(index, 'startTime', e.target.value)}
                        helperText={error?.message}
                        variant="standard"
                        style={{ width: "80px", marginRight: "16px" }}
                      />
                    );
                  }}
                />
                <span className="mr-4">{"до"}</span>
                <Controller
                  name={`breaks.${index}.endTime`}
                  control={control}
                  rules={{ required: t("requiredField") }}
                  render={({ field, fieldState: { error } }) => {
                    const timeMask = useMask({
                      mask: "hH:mM",
                      replacement: {
                        h: /[0-2]/,
                        H: /[0-9]/,
                        m: /[0-5]/,
                        M: /[0-9]/,
                      },
                    });
                    return (
                      <TextField
                        {...field}
                        inputRef={timeMask}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                        variant="standard"
                        onChange={(e) => handleBreakChange(index, 'endTime', e.target.value)}
                        style={{ width: "80px", marginLeft: "16px" }}
                      />
                    );
                  }}
                />
              </div>
              <img
                src={XIcon}
                alt="Закрыть"
                onClick={() => removeBreak(index)}
              />
            </li>
          ))}
        </ul>

        {breaks.length < 2 && (
          <div
            onClick={addBreak}
            className={`mt-2 h-11 w-fit items-center flex cursor-pointer ${COLORS_TEXT.blue200} font-semibold`}
          >
            {t("add")}
          </div>
        )}
      </div>
      <Button onClick={() => navigate({
          to: `/announcements/addAnnouncements/step-six`,
        })} className="fixed bottom-4 left-4 w-header">{t("Продолжить")}</Button>

    </section>
  );
};
