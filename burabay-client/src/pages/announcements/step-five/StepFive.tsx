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
import { Breaks, Schedule } from "../model/announcements";
import { apiService } from "../../../services/api/ApiService";
import { HTTP_STATUS } from "../../../services/api/ServerData";
import { useNavigate } from "@tanstack/react-router";


interface Props {
  id: string;
}

interface FormType {
  isRoundTheClock: boolean;
  workingDays: Schedule;
  breaks: Breaks[];
}

export const StepFive: FC<Props> = function StepFive({ id }) {
  const navigate = useNavigate()
  const { t } = useTranslation();
  // Проверка на наличие данных schedule перед форматированием времени
  const formatTime = (time: string | undefined) => {
    if (!time) return "00:00"; // Если данных нет, возвращаем "00:00"
    const [hours, minutes] = time.split(":");
    return `${hours}:${minutes}`;
  };

  const { handleSubmit, control, setValue, watch , formState: {isValid} } = useForm<FormType>({
    defaultValues: {
      isRoundTheClock: false,
      workingDays: {
        adId: id || "",
        monStart: formatTime(undefined), // Проверяем наличие schedule
        monEnd: formatTime(undefined),
        tueStart: formatTime(undefined),
        tueEnd: formatTime(undefined),
        wenStart: formatTime(undefined),
        wenEnd: formatTime(undefined),
        thuStart: formatTime(undefined),
        thuEnd: formatTime(undefined),
        friStart: formatTime(undefined),
        friEnd: formatTime(undefined),
        satStart: formatTime(undefined),
        satEnd: formatTime(undefined),
        sunStart: formatTime(undefined),
        sunEnd: formatTime(undefined),
      },
      breaks: [],
    },
    mode: "onBlur",
  });
  const [breaks, setBreaks] = useState<Breaks[]>(watch("breaks"));
  const currentAroundClock = watch("isRoundTheClock", false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  // -------------- Дни недели

  const daysOfWeek = ["mon", "tue", "wen", "thu", "fri", "sat", "sun"] as const;

  type Day = (typeof daysOfWeek)[number];

  const isDayActive = (day: Day) => {
    const startTime = watch(`workingDays.${day}Start`);
    const endTime = watch(`workingDays.${day}End`);
    return startTime !== "00:00" || endTime !== "00:00";
  };

  const addBreak = () => {
    if (breaks.length < 5) {
      // Добавляем новый объект с пустыми значениями времени
      const newBreak = { adId: id, start: "", end: "" };
      setBreaks([...breaks, newBreak]);

      // Синхронизируем с React Hook Form
      setValue(`breaks.${breaks.length}`, newBreak); // устанавливаем новый break
    }
  };

  const handleBreakChange = (index: number, field: keyof Breaks, value: string) => {
    // Update the break in the state
    const updatedBreaks = [...breaks];
    updatedBreaks[index] = { ...updatedBreaks[index], [field]: value };
    setBreaks(updatedBreaks);
  
    // Update the value in the form through setValue
    setValue(`breaks.${index}.${field}` as const, value);
  };
  
    // Логика для определения, валидна ли кнопка
    const isButtonValid = () => {
      const currentAroundClock = watch("isRoundTheClock", false);
  
      // Если круглосуточно, кнопка всегда валидна
      if (currentAroundClock) return true;
  
      // Если не круглосуточно, кнопка валидна только если хотя бы один день имеет рабочее время
      return ["mon", "tue", "wen", "thu", "fri", "sat", "sun"].some((day: any) => isDayActive(day));
    };

  const removeBreak = (index: number) => {
    // Удаляем перерыв по индексу
    const updatedBreaks = breaks.filter((_, i) => i !== index);
    setBreaks(updatedBreaks);

    // Синхронизируем с React Hook Form
    setValue("breaks", updatedBreaks); // обновляем breaks в форме
  };

  const handleError = (errorText: string) => {
    setErrorText(errorText);
    setError(true);
  };

  const saveSchedule = async (form: FormType) => {
    try {
      setIsLoading(true);
      const responseSchedule = await apiService.post<string>({
        url: "/schedule",
        dto: form.workingDays,
      });
      const responseBreaks = await apiService.post<string>({
        url: "/breaks",
        dto: form.breaks,
      });
      const responseAd = await apiService.patch<string>({
        url: `/ad/${id}`,
        dto: {
          isRoundTheClock: form.isRoundTheClock,
        },
      });

      if (
        responseAd.data &&
        responseSchedule.data == HTTP_STATUS.CREATED &&
        responseBreaks.data == HTTP_STATUS.CREATED
      ) {
        navigate({
          to: "/announcements/addAnnouncements/step-six/$id",
          params: {
            id: id
          }
        })
      }

      if (
        responseAd.data == HTTP_STATUS.CONFLICT &&
        responseSchedule.data == HTTP_STATUS.CONFLICT &&
        responseBreaks.data == HTTP_STATUS.CONFLICT
      ) {
        handleError(t("invalidCode"));
      }
      if (
        responseAd.data == HTTP_STATUS.SERVER_ERROR &&
        responseSchedule.data == HTTP_STATUS.SERVER_ERROR &&
        responseBreaks.data == HTTP_STATUS.SERVER_ERROR
      ) {
        handleError(t("tooManyRequest"));
      }

      setIsLoading(false);
    } catch (e) {
      console.error("Ошибка при сохранении графика:", e);
    }
  };
  const validateTime = (value: string) => {
    const regex = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/; // Проверка формата времени
    if (!regex.test(value)) {
      return t("invalidTimeFormat"); // Сообщение об ошибке, если время некорректно
    }
  
    const [hours, minutes] = value.split(":").map(Number);
  
    // Если время больше 23:59, то заменяем на 23:59
    if (hours > 23 || (hours === 23 && minutes > 59)) {
      return "23:59"; // Автоматическая замена на 23:59
    }
  
    return true;
  };
  

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number, type: keyof Breaks) => {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    // Если значение больше "23:59", заменяем его на "23:59"
    if (value > "23:59") {
      handleBreakChange(index, type, "23:59");
    } else {
      handleBreakChange(index, type, value);
    }
  };
  
  
  return (
    <section className="min-h-screen bg-background pb-[20px]">
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
          <IconContainer align='end' action={async() =>  navigate({
        to: "/announcements"
      })}>
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
              name={"isRoundTheClock"}
              control={control}
              
              render={() => (
                <Switch
                  checked={currentAroundClock}
                  onChange={() =>
                    setValue("isRoundTheClock", !currentAroundClock)
                  }
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
                      name={`workingDays.${day}Start`}
                      control={control}
                      render={() => (
                        <Switch
                          checked={isDayActive(day)}
                          onChange={() => {
                            const currentStartTime = watch(
                              `workingDays.${day}Start`
                            );
                            const currentEndTime = watch(
                              `workingDays.${day}End`
                            );

                            if (
                              currentStartTime === "00:00" &&
                              currentEndTime === "00:00"
                            ) {
                              // Если активируем
                              setValue(`workingDays.${day}Start`, "09:00");
                              setValue(`workingDays.${day}End`, "18:00");
                            } else {
                              // Если деактивируем
                              setValue(`workingDays.${day}Start`, "00:00");
                              setValue(`workingDays.${day}End`, "00:00");
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
                        name={`workingDays.${day}Start`}
                        control={control}
                        rules={{
                          required: t("requiredField"),
                          validate: (value) => {
                            const isValidTime = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(value);
                            return isValidTime || t("invalidTimeFormat"); // Сообщение об ошибке
                          },
                        }}
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
                              variant="standard"
                              style={{ width: "80px", marginRight: "16px" }}
                            />
                          );
                        }}
                      />
                      <span className="mr-4">{"до"}</span>
                      <Controller
                        name={`workingDays.${day}End`}
                        control={control}
                        rules={{
                          required: t("requiredField"),
                          validate: (value) => {
                            const isValidTime = /^([01]?[0-9]|2[0-3]):([0-5][0-9])$/.test(value);
                            return isValidTime || t("invalidTimeFormat"); // Сообщение об ошибке
                          },
                        }}
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
          {breaks.map((_, index) => (
            <li key={index} className="mt-4 flex items-center justify-between">
              <div className="flex items-center">
                <span className="mr-4">{"с"}</span>
                <Controller
                  name={`breaks.${index}.start`}
                  control={control}
                  rules={{
                    required: t("requiredField"),
                    validate: (value) => validateTime(value) === true || t("invalidTimeFormat"),
                  }}
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
                        placeholder="00:00"
                        onChange={(e) => handleTimeChange(e, index, "start")}
                        variant="standard"
                        style={{ width: "80px", marginRight: "16px" }}
                      />
                    );
                  }}
                />
                <span className="mr-4">{"до"}</span>
                <Controller
                  name={`breaks.${index}.end`}
                  control={control}
                  rules={{
                    required: t("requiredField"),
                    validate: (value) => validateTime(value),
                  }}
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
                        variant="standard"
                        placeholder="00:00"
                        onChange={(e) => handleTimeChange(e, index, "end")}
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

        {breaks.length < 5 && (
          <div
            onClick={addBreak}
            className={`mt-2 h-11 w-fit items-center flex cursor-pointer ${COLORS_TEXT.blue200} font-semibold`}
          >
            {t("add")}
          </div>
        )}
      </div>
      {!error ? (
        <Button
          className="fixed bottom-4 left-4 w-header z-10"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(saveSchedule)();
          }}
          loading={isLoading}
          disabled={!isButtonValid() || !isValid}
        >
          {t("continue")}
        </Button>
      ) : (
        <Button mode="red" className="fixed bottom-4 left-3 w-header mt-8 z-10">
          {errorText}
        </Button>
      )}
    </section>
  );
};
