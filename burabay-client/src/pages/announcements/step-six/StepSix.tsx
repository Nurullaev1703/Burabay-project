import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import {
  COLORS_BACKGROUND,
  COLORS_BORDER,
  COLORS_TEXT,
} from "../../../shared/ui/colors";
import { ProgressSteps } from "../ui/ProgressSteps";
import BackIcon from "../../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../../app/icons/announcements/blueKrestik.svg";
import { Switch, TextField } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import PlusIcon from "../../../app/icons/plus.svg";
import { useMask } from "@react-input/mask";
import { Button } from "../../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import { apiService } from "../../../services/api/ApiService";
import { HTTP_STATUS } from "../../../services/api/ServerData";
import { Announcement } from "../model/announcements";
import { queryClient } from "../../../ini/InitializeApp";

interface Props {
  id: string;
  announcement?: Announcement;
}

interface FormType {
  isFullDay: boolean;
  startTime: string[];
  isDuration: boolean;
  duration: string;
  tempServiceTime?: string;
}

export const StepSix: FC<Props> = function StepSix({ id, announcement }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { handleSubmit, watch, setValue, control } = useForm<FormType>({
    defaultValues: {
      isFullDay: announcement?.isFullDay || false,
      startTime: announcement?.startTime || [],
      isDuration: announcement?.isDuration || false,
      duration: announcement?.duration || "",
    },
  });
  const validateTime = (value: string) => {
    const isValidFormat = /^\d{2}:\d{2}$/.test(value);
    if (!isValidFormat) return t("invalidTimeFormat");
  
    const [hours, minutes] = value.split(":");
    const hoursNumber = parseInt(hours, 10);
    const minutesNumber = parseInt(minutes, 10);
  
    if (hoursNumber > 23 || minutesNumber > 59) {
      return t("invalidTimeRange");
    }
  
    return true; 
  };
  const fullDay = watch("isFullDay");
  const isDuration = watch("isDuration");
  const serviceTime = watch("startTime");
  const duration = watch("duration");
  const [servicesTime, setServicesTime] = useState<string[]>(serviceTime);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [tempTime, setTempTime] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  // Логика валидации
  const isButtonValid = () => {
    if (fullDay) {
      // Кнопка всегда валидна, если первый свитч активен
      return true;
    }
    if (isDuration) {
      // Если второй свитч активен, кнопка невалидна, если duration пустое или невалидно
      return !!duration && validateTime(duration) === true; // Проверяем duration
    }
    // Проверяем, что все времена в servicesTime валидны
    const areAllTimesValid = servicesTime.every((time) => validateTime(time) === true);
    return serviceTime.length > 0 && areAllTimesValid;
  };

  // Добавление времени
  const addServiceTime = () => {
    if (servicesTime.length < 8) {
      setIsCreating(true);
      setTempTime("");
    }
  };

  // Редактирование времени
  const handleServiceChange = (index: number, value: string) => {
    const updatedServices: string[] = [...servicesTime];
    updatedServices[index] = value;
    setServicesTime(updatedServices);
    setValue("startTime", updatedServices);
  };

  // При создании времени - создаю временную переменную для дальнейшего добавления
  const handleTempTimeChange = (value: string) => {
    setTempTime(value); // Обновляем временное значение
  };

  // При отвода фокуса от поля
  const handleBlur = () => {
    const isValidTime = validateTime(tempTime) === true; // Используем validateTime
  
    if (isCreating && tempTime) {
      if (!isValidTime) {
        setError(true); // Устанавливаем ошибку
        return;
      }
      const updatedServices = [...servicesTime, tempTime];
      setServicesTime(updatedServices); // Обновляем список
      setValue("startTime", updatedServices); // Сохраняем весь массив
      setIsCreating(false); // Завершаем создание
      setTempTime(""); // Сбрасываем временное значение
      setError(false); // Убираем ошибку, если формат корректный
    }
  
    if (editingIndex !== null) {
      if (!isValidTime) {
        setError(true); // Устанавливаем ошибку
        return;
      }
      const updatedServices = [...servicesTime];
      setValue("startTime", updatedServices); // Сохраняем весь массив
      setEditingIndex(null); // Завершаем редактирование
      setError(false); // Убираем ошибку
    }
  };

  const deleteTime = (index: number) => {
    const updatedServices = [...servicesTime];
    updatedServices.splice(index, 1);
    setServicesTime(updatedServices);
    setValue("startTime", updatedServices);
  };

  const handleError = (errorText: string) => {
    setErrorText(errorText);
    setError(true);
  };

  const saveSchedule = async (form: FormType) => {
    try {
      setIsLoading(true);

      const response = await apiService.patch<string>({
        url: `/ad/${id}`,
        dto: form,
      });
      
      if (response.data) {
        await queryClient.refetchQueries({queryKey: [`/ad/${id}`]})
        navigate({
          to: `/announcements/bookingBan/${id}?serviceTime=${form.startTime.join(",")}`,
          params: {
            adId: id,
          },
        });
      }

      if (response.data == HTTP_STATUS.CONFLICT) {
        handleError(t("invalidCode"));
      }
      if (response.data == HTTP_STATUS.SERVER_ERROR) {
        handleError(t("tooManyRequest"));
      }

      setIsLoading(false);
    } catch (e) {
      console.error("Ошибка при сохранении графика:", error);
    }
  };
  return (
    <section>
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer
            align="start"
            action={() =>
              navigate({
                to: `/announcements/addAnnouncements/step-five/${id}`,
              })
            }
          >
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("preview")}
            </Typography>
            <Typography
              size={14}
              weight={400}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("serviceSchedule")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={async () =>
              navigate({
                to: "/announcements",
              })
            }
          >
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={6} totalSteps={9}></ProgressSteps>
      </Header>

      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <span>{t("serviceFullDay")}</span>
          <Controller
            name="isFullDay"
            control={control}
            render={() => (
              <Switch
                checked={fullDay}
                onChange={() => setValue("isFullDay", !fullDay)}
              />
            )}
          />
        </div>

        {!fullDay && (
          <div>
            <span>{t("serviceTime")}</span>
            <p className={`text-xs ${COLORS_TEXT.gray100} w-80 mb-2`}>
              {t("serviceTimeDescription")}
            </p>

            {/* Рендер списка времени */}
            <ul className="flex flex-wrap gap-2 mb-4">
              {/* Кнопка "Добавить" */}
              {!isCreating && servicesTime.length < 8 && (
                <li
                  className={`${COLORS_BACKGROUND.blue200} py-3 px-12 cursor-pointer w-28 h-10 rounded-3xl`}
                  onClick={addServiceTime}
                >
                  <img src={PlusIcon} alt="Добавить" />
                </li>
              )}

              {isCreating && (
                <li
                  className={`border-2 ${
                    error ? "border-red-500" : COLORS_BORDER.blue200
                  } border-solid flex items-center gap-2 w-28 h-10 rounded-3xl`}
                >
                  <Controller
                    name="tempServiceTime"
                    control={control}
                    rules={{
                      validate: (value: any) => {
                        return validateTime(value); // Используем validateTime
                      },
                    }}
                    render={() => {
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
                        <div
                          className={`py-3 cursor-pointer w-28 h-10 rounded-3xl flex justify-center items-center`}
                        >
                          <input
                            type="text"
                            inputMode="numeric"
                            ref={timeMask}
                            className={`w-16 h-8 text-center focus:outline-none`}
                            value={tempTime} // Используем tempTime
                            autoFocus
                            onChange={(e) =>
                              handleTempTimeChange(e.target.value)
                            }
                            onBlur={handleBlur}
                            onKeyDown={
                              (e) => {
                                if (
                                  e.key == "Enter" &&
                                  /^\d{2}:\d{2}$/.test(tempTime)
                                ) {
                                  handleBlur();
                                }
                              }
                            }
                            placeholder="00:00"
                          />
                          <img
                            className="w-4 h-4"
                            src={XIcon}
                            alt="Удалить"
                            onClick={() => setIsCreating(false)}
                          />
                        </div>
                      );
                    }}
                  />
                </li>
              )}

              {servicesTime.map((time, index) => (
                <li
                  key={index}
                  className={`border-2 ${COLORS_BORDER.blue200} border-solid flex items-center gap-2 w-28 h-10 rounded-3xl`}
                >
                  {editingIndex === index ? (
                    <Controller
                    rules={{
                      validate: (value: any) => {
                        return validateTime(value); // Используем validateTime
                      },
                    }}
                      name={`startTime.${index}`}
                      control={control}
                      defaultValue={time}
                      render={({ field }) => {
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
                          <div
                            className={`py-3 cursor-pointer w-28 h-10 rounded-3xl flex justify-center items-center`}
                          >
                            <input
                              {...field}
                              type="text"
                              ref={timeMask}
                              className={`w-16 h-8 text-center focus:outline-none`}
                              onChange={(e) =>
                                handleServiceChange(index, e.target.value)
                              }
                              onBlur={handleBlur}
                              placeholder="00:00"
                            />
                            <img
                              className="w-4 h-4"
                              src={XIcon}
                              alt="Удалить"
                              onClick={() => deleteTime(index)}
                            />
                          </div>
                        );
                      }}
                    />
                  ) : (
                    <div
                      className={`py-3 cursor-pointer w-28 h-10 rounded-3xl flex justify-center items-center`}
                      onClick={() => setEditingIndex(index)}
                    >
                      <span className="w-16 text-center">{time}</span>
                      <img
                        className="w-4 h-4"
                        src={XIcon}
                        alt="Удалить"
                        onClick={() => deleteTime(index)}
                      />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="px-4">
        {!fullDay && (
          <div className="flex justify-between items-center mb-1">
            <div>
              <span>{t("standardDuration")}</span>
              <p className={`${COLORS_TEXT.gray100} text-xs`}>
                {t("infoForClients")}
              </p>
            </div>
            <Controller
              name="isDuration"
              control={control}
              render={() => (
                <Switch
                  checked={isDuration}
                  onChange={() => setValue("isDuration", !isDuration)}
                />
              )}
            />
          </div>
        )}
        {isDuration && !fullDay && (
          <Controller
            name={`duration`}
            control={control}
            rules={{
              required: t("requiredField"),
              validate: (value: any) => {
                return validateTime(value); // Используем validateTime
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
                <div className="flex items-center">
                  <TextField
                    {...field}
                    inputRef={timeMask}
                    error={Boolean(error?.message)}
                    variant="standard"
                    style={{
                      width: "50px",
                      marginRight: "16px",
                      fontWeight: "bold",
                    }}
                    placeholder="00:00"
                  />
                  <span>ч</span>
                </div>
              );
            }}
          />
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
          disabled={!isButtonValid()}
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
