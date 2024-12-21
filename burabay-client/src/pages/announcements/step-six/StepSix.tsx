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

export const StepSix: FC = function StepSix() {
  const { t } = useTranslation();
  const navigate = useNavigate()

  const { handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      fullDay: false,
      serviceTime: ["12:13"],
      isDuration: false,
      duration: "",
    },
  });

  const isDuration = watch("isDuration");
  const fullDay = watch("fullDay");
  const serviceTime = watch("serviceTime");
  const [servicesTime, setServicesTime] = useState<string[]>(serviceTime);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [tempTime, setTempTime] = useState<string>("");

  // Добавление времени
  const addServiceTime = () => {
    if (servicesTime.length < 8) {
      setIsCreating(true);
      setTempTime("");
    }
  };

  // Редактирование времени
  const handleServiceChange = (index: number, value: string) => {
    const updatedServices = [...servicesTime];
    updatedServices[index] = value;
    setServicesTime(updatedServices);
    setValue("serviceTime", updatedServices);
  };

  // При создании времени - создаю временную переменную для дальнейшего добавления
  const handleTempTimeChange = (value: string) => {
    setTempTime(value); // Обновляем временное значение
  };

  // При отвода фокуса от поля
  const handleBlur = () => {
    if (isCreating && tempTime) {
      setServicesTime([...servicesTime, tempTime]); // Добавляем в список только после завершения ввода
      setValue(`serviceTime.${servicesTime.length}`, tempTime); // Сохраняем в useForm
      setIsCreating(false); // Завершаем создание
      setTempTime(""); // Сбрасываем временное значение
    }
    if (editingIndex !== null && servicesTime[editingIndex]) {
      setValue(`serviceTime.${editingIndex}`, servicesTime[editingIndex]); // Сохраняем в useForm
      setEditingIndex(null); // Завершаем редактирование
      setIsCreating(false);
    }
  };

  const deleteTime = (index: number) => {
    const updatedServices = [...servicesTime];
    updatedServices.splice(index, 1);
    setServicesTime(updatedServices);
    setValue("serviceTime", updatedServices);
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
          <IconContainer align="end" action={() => history.back()}>
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={6} totalSteps={9}></ProgressSteps>
      </Header>

      <div className="px-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <span>{t("serviceFullDay")}</span>
          <Controller
            name="fullDay"
            control={control}
            render={({ field }) => (
              <Switch
                checked={fullDay}
                onChange={() => setValue("fullDay", !fullDay)}
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
                  className={`border-2 ${COLORS_BORDER.blue200} border-solid flex items-center gap-2 w-28 h-10 rounded-3xl`}
                >
                  <Controller
                    name={`serviceTime.${editingIndex ?? 0}`}
                    control={control}
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
                              handleTempTimeChange(e.target.value)
                            }
                            onBlur={handleBlur}
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
                      name={`serviceTime.${index}`}
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
            render={({ field }) => (
              <Switch
                checked={isDuration}
                onChange={() => setValue("isDuration", !isDuration)}
              />
            )}
          />
        </div>

        {!isDuration && (
          <Controller
            name={`duration`}
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
                <div className="flex items-center">
                  <TextField
                    {...field}
                    inputRef={timeMask}
                    error={Boolean(error?.message)}
                    helperText={error?.message}
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

      <Button onClick={() => navigate({
          to: `/announcements/bookingBan`,
        })} className="fixed bottom-4 left-4 w-header">
        {t("continue")}
      </Button>
    </section>
  );
};
