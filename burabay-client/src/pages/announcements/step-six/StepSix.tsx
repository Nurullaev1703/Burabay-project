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
import { Switch } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { Button } from "../../../shared/ui/Button";
import PlusIcon from "../../../app/icons/plus.svg";
import { useMask } from "@react-input/mask";

export const StepSix: FC = function StepSix() {
  const { t } = useTranslation();

  const { handleSubmit, watch, setValue, control } = useForm({
    defaultValues: {
      fullDay: false,
      serviceTime: ["12:13"],
      duration: "",
    },
  });

  const fullDay = watch("fullDay");
  const serviceTime = watch("serviceTime");
  const [servicesTime, setServicesTime] = useState<string[]>(serviceTime);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const addServiceTime = () => {
    if (servicesTime.length < 8) {
      const newServiceTime = "";
      setServicesTime([...servicesTime, newServiceTime]);
      setEditingIndex(servicesTime.length); // Указываем, что новое время редактируется
    }
  };

  const handleServiceChange = (index: number, value: string) => {
    const updatedServices = [...servicesTime];
    updatedServices[index] = value;
    setServicesTime(updatedServices);
    setValue(`serviceTime.${index}`, value);
  };

  const handleBlur = () => {
    setEditingIndex(null); // Убираем режим редактирования
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

      <div className="px-4">
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
              {editingIndex === null && servicesTime.length < 8 && (
                <li
                  className={`${COLORS_BACKGROUND.blue200} py-3 px-12 cursor-pointer w-28 h-10 rounded-3xl`}
                  onClick={addServiceTime}
                >
                  <img src={PlusIcon} alt="Добавить" />
                </li>
              )}

              {servicesTime.map((time, index) => (
                <li
                  key={index}
                  className={`border-solid border-2 ${COLORS_BORDER.blue200} border-solid flex items-center gap-2 w-28 h-10 rounded-3xl`}
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
                              className={`w-16 h-8 text-center`}
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
                      <img className="w-4 h-4" src={XIcon} alt="Удалить" />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
};
