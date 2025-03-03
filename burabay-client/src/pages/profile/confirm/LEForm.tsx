import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import BackIcon from "../../../app/icons/announcements/blueBackicon.svg";
import CloseIcon from "../../../app/icons/announcements/reviews/close.svg";
import { DefaultForm } from "../../auth/ui/DefaultForm";
import { TextField } from "@mui/material";
import { useMask } from "@react-input/mask";
import { Button } from "../../../shared/ui/Button";
import FileIcon from "../../../app/icons/profile/confirm/file.svg";
import FileSuccessIcon from "../../../app/icons/profile/confirm/file-success.svg";
import DeleteIcon from "../../../app/icons/profile/confirm/delete.svg";
import { apiService } from "../../../services/api/ApiService";
import { HTTP_STATUS } from "../../../services/api/ServerData";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../features/auth";

interface FormType {
  iin: string;
  phoneNumber: string;
  registerFile: File | null;
  IBANFile: File | null;
  charterFile: File | null;
}

export const LEForm: FC = function LEForm() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<FormType>({
    defaultValues: {
      iin: "",
      phoneNumber: "",
      registerFile: null,
      IBANFile: null,
      charterFile: null,
    },
  });
  const mask = useMask({
    mask: "+7 ___ ___-__-__",
    replacement: { _: /\d/ },
    showMask: true,
  });
  const navigate = useNavigate();
  const {user, setUser} = useAuth();
  console.log(user)
  const handleSubmitForm = async (form: FormType) => {
    setIsLoading(true);
    try {
      // Добавление файла
      const formData = new FormData();
      if (form.registerFile) formData.append("registerFile", form.registerFile);
      if (form.IBANFile) formData.append("IBANFile", form.IBANFile);
      if (form.charterFile) formData.append("charterFile", form.charterFile);
      const responseDocs = await apiService.post<string>({
        url: `/docs`,
        dto: formData,
      });

      if (parseInt(responseDocs.data) !== parseInt(HTTP_STATUS.CREATED))
        throw Error("Ошибка при создании");

      const responseFilenames = await apiService.patch<string>({
        url: `/users/docs-path`,
        dto: {
          regCouponPath: form.registerFile?.name,
          ibanDocPath: form.IBANFile?.name,
          orgRulePath: form.charterFile?.name,
        },
      });

      if (parseInt(responseFilenames.data) !== parseInt(HTTP_STATUS.CREATED))
        throw Error("Ошибка при создании");

      navigate({ to: "/" });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section className="min-h-screen bg-background">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="Назад" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("accountConfirmation")}
            </Typography>
            <Typography
              size={14}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("legalEntity")}
            </Typography>
          </div>
          <IconContainer align="end" action={() => history.back()}>
            <img src={CloseIcon} alt="Закрыть" />
          </IconContainer>
        </div>
      </Header>

      <DefaultForm
        className="flex flex-col gap-2 p-4"
        onSubmit={handleSubmit(async (form) => {
          console.log(form);
        })}
      >
        <Controller
          name="iin"
          control={control}
          rules={{
            required: t("requiredField"),
            maxLength: {
              value: 40,
              message: t("maxLengthExceeded", { count: 40 }),
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={Boolean(error?.message)}
              helperText={error?.message}
              label={t("IIN")}
              fullWidth={true}
              variant="outlined"
              placeholder={t("EnterIIN")}
            />
          )}
        />

        <Controller
          name="phoneNumber"
          control={control}
          rules={{
            required: t("requiredField"),
            validate: (value: string) => {
              const phoneRegex = /^\+7 \d{3} \d{3}-\d{2}-\d{2}$/;
              return phoneRegex.test(value) || t("invalidNumber");
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={Boolean(error?.message)}
              helperText={error?.message}
              fullWidth
              type="tel"
              inputMode="tel"
              label={t("phoneWhatsapp")}
              variant="outlined"
              inputRef={mask}
              placeholder="+7 700 000-00-00"
            />
          )}
        />

        <Controller
          name="registerFile"
          control={control}
          rules={{
            required: t("requiredField"),
          }}
          render={({ field: { onChange, value } }) => (
            <div>
              <input
                type="file"
                id="register-file"
                className="hidden"
                onChange={(e) => onChange(e.target.files?.[0])}
              />
              <label
                htmlFor="register-file"
                className="bg-white flex justify-between items-center py-3 px-2 rounded-lg"
              >
                <div className="flex">
                  <img
                    src={value ? FileSuccessIcon : FileIcon}
                    alt="Файл"
                    className="mr-0.5"
                  />
                  <div className={`${COLORS_TEXT.gray100} flex flex-col`}>
                    <span className="text-xs">{t("uploadFile")}</span>
                    <span
                      className={
                        value ? COLORS_TEXT.totalBlack : COLORS_TEXT.gray100
                      }
                    >
                      {value ? value.name : t("certificateRegistration")}
                    </span>
                  </div>
                </div>
                {value && (
                  <img
                    src={DeleteIcon}
                    alt="Удалить"
                    onChange={() => onChange(null)}
                  />
                )}
              </label>
            </div>
          )}
        />

        <Controller
          name="IBANFile"
          control={control}
          rules={{
            required: t("requiredField"),
          }}
          render={({ field: { onChange, value } }) => (
            <div>
              <input
                type="file"
                id="iban-file"
                className="hidden"
                onChange={(e) => onChange(e.target.files?.[0])}
              />
              <label
                htmlFor="iban-file"
                className="bg-white flex justify-between items-center py-3 px-2 rounded-lg"
              >
                <div className="flex">
                  <img
                    src={value ? FileSuccessIcon : FileIcon}
                    alt="Файл"
                    className="mr-0.5"
                  />
                  <div className={`${COLORS_TEXT.gray100} flex flex-col`}>
                    <span className="text-xs">{t("uploadFile")}</span>
                    <span
                      className={
                        value ? COLORS_TEXT.totalBlack : COLORS_TEXT.gray100
                      }
                    >
                      {value ? value.name : t("certificateIBAN")}
                    </span>
                  </div>
                </div>
                {value && (
                  <img
                    src={DeleteIcon}
                    alt="Удалить"
                    onChange={() => onChange(null)}
                  />
                )}
              </label>
            </div>
          )}
        />
        <Controller
          name="charterFile"
          control={control}
          rules={{
            required: t("requiredField"),
          }}
          render={({ field: { onChange, value } }) => (
            <div>
              <input
                type="file"
                id="charter-file"
                className="hidden"
                onChange={(e) => onChange(e.target.files?.[0])}
              />
              <label
                htmlFor="charter-file"
                className="bg-white flex justify-between items-center py-3 px-2 rounded-lg"
              >
                <div className="flex">
                  <img
                    src={value ? FileSuccessIcon : FileIcon}
                    alt="Файл"
                    className="mr-0.5"
                  />
                  <div className={`${COLORS_TEXT.gray100} flex flex-col`}>
                    <span className="text-xs">{t("uploadFile")}</span>
                    <span
                      className={
                        value ? COLORS_TEXT.totalBlack : COLORS_TEXT.gray100
                      }
                    >
                      {value ? value.name : t("organizationCharter")}
                    </span>
                  </div>
                </div>
                {value && (
                  <img
                    src={DeleteIcon}
                    alt="Удалить"
                    onChange={() => onChange(null)}
                  />
                )}
              </label>
            </div>
          )}
        />

        <Button
          className="fixed bottom-4 left-3 w-header z-10"
          type="submit"
          loading={isLoading}
          disabled={!isValid}
        >
          {t("send")}
        </Button>
      </DefaultForm>
    </section>
  );
};
