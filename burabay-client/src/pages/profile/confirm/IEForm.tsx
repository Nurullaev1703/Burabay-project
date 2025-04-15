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
import { imageService } from "../../../services/api/ImageService";
import { HTTP_STATUS } from "../../../services/api/ServerData";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../features/auth";

interface FormType {
  iin: string;
  phoneNumber: string;
  registerFile: File | null;
  IBANFile: File | null;
}

export const IEForm: FC = function IEForm() {
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
    },
  });
  const mask = useMask({
    mask: "+7 ___ ___-__-__",
    replacement: { _: /\d/ },
    showMask: true,
  });
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleSubmitForm = async (form: FormType) => {
    setIsLoading(true);
    try {
      // Добавление файла
      const formData = new FormData();
      if (form.registerFile) formData.append("registerFile", form.registerFile);
      if (form.IBANFile) formData.append("IBANFile", form.IBANFile);

      const responseDocs = await imageService.post<string>({
        url: `/full-docs`,
        dto: formData,
      });

      if (!responseDocs.data) throw Error("Ошибка при создании");

      const responseFilenames = await apiService.patch<string>({
        url: `/users/docs-path`,
        dto: {
          regCouponPath: `registerFile.${form.registerFile?.name.split(".").pop()}`,
          ibanDocPath: `IBANFile.${form.IBANFile?.name.split('.').pop()}`,
          iin: form.iin,
          phoneNumber: "+" + form.phoneNumber.replace(/\D/g, ""),
        },
      }); 
      if (user) {
        setUser({
          ...user,
          organization: {
            ...user.organization,
            isConfirmWating: true,
          },
        });
      }
      if (parseInt(responseFilenames.data) !== parseInt(HTTP_STATUS.OK))
        throw Error("Ошибка при создании");
      navigate({ to: "/profile" });
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
              {t("individualEntrepreneur")}
            </Typography>
          </div>
          <IconContainer align="end" action={() => history.back()}>
            <img src={CloseIcon} alt="Закрыть" />
          </IconContainer>
        </div>
      </Header>

      <DefaultForm
        className="flex flex-col gap-2 p-4"
        onSubmit={handleSubmit(handleSubmitForm)}
      >
        <Controller
          name="iin"
          control={control}
          rules={{
            required: t("requiredField"),
            minLength: {
              value: 12,
              message: t("minLengthRequired", { count: 12 }),
            },
            maxLength: {
              value: 12,
              message: t("maxLengthExceeded", { count: 12 }),
            },
            validate: (value: string) => {
              const iinRegex = /^\d{12}$/;
              return iinRegex.test(value) || t("invalidIIN");
            },
          }}
          render={({ field, fieldState: { error } }) => (
            <TextField
              {...field}
              error={Boolean(error?.message)}
              helperText={error?.message}
              inputProps={{
                inputMode: "numeric",
                maxLength: 12
              }}
              onInput={(e) => {
                const target = e.target as HTMLInputElement;
                const value = target.value.replace(/\D/g, ''); 
                target.value = value.slice(0, 12);
              }}
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
                      {value ? value.name : t("certificateIE")}
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
