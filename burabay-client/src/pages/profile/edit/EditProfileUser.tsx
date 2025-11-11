import { FC, useState } from "react";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../app/icons/back-icon.svg";
import CrossIcon from "../../../app/icons/cross.svg";
import { Controller, useForm } from "react-hook-form";
import { DefaultForm } from "../../auth/ui/DefaultForm";
import { TextField } from "@mui/material";
import { useMask } from "@react-input/mask";
import { Button } from "../../../shared/ui/Button";
import { useAuth } from "../../../features/auth";
import { useNavigate } from "@tanstack/react-router";
import { apiService } from "../../../services/api/ApiService";
import { Profile } from "../model/profile";
import { formatToDisplayPhoneNumber } from "../../../shared/ui/format-phone";

interface FormType {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export const EditProfileUser: FC = function EditProfileUser() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const mask = useMask({
    mask: "+7 ___ ___-__-__",
    replacement: { _: /\d/ },
    showMask: true,
  });
  const {
    handleSubmit,
    control,
    formState: { isValid },
  } = useForm<FormType>({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: formatToDisplayPhoneNumber(user?.phoneNumber || "+7"),
    },
    mode: "onChange",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setError } = useForm<FormType>();
  const navigate = useNavigate();
  const [hasError, setHasError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const handleError = (errorText: string) => {
    setErrorText(errorText);
    setHasError(true);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    return `+${cleaned}`;
  };

  const saveUser = async (form: FormType) => {
    try {
      setIsLoading(true);
      setHasError(false);
      setErrorText("");

      // Дополнительная фронт-валидация номера телефона перед отправкой
      // 1) Если есть плейсхолдеры маски (например '_' от input mask) — значит номер введён не полностью
      if (form.phoneNumber.includes("_")) {
        setIsLoading(false);
        handleError(t("invalidNumber"));
        return;
      }

      // 2) Проверяем только, что номер начинается с +7 (маска остаётся)
      if (!form.phoneNumber.startsWith("+7")) {
        setIsLoading(false);
        handleError(t("invalidNumber"));
        return;
      }

      // 3) Валидация email на фронтенде
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(form.email)) {
        setIsLoading(false);
        setError("email", {
          type: "manual",
          message: t("invalidEmail"),
        });
        return;
      }

      const updatedForm = {
        ...form,
        phoneNumber: formatPhoneNumber(form.phoneNumber),
      };

      try {
        const response = await apiService.patch<Profile>({
          url: "/profile",
          dto: updatedForm,
        });

        if (response.data) {
          setUser(response.data);
          navigate({ to: "/profile" });
        } else {
          handleError(t("invalidCode"));
        }
      } catch (err: any) {
        // Проверяем тело ответа на стандартное сообщение валидации
        const serverMessage =
          err?.response?.data?.message || err?.data?.message || err?.message;
        
        // serverMessage может быть массивом
        if (Array.isArray(serverMessage)) {
          // Проверка на ошибку телефона
          if (
            serverMessage.some((m: string) =>
              String(m).toLowerCase().includes("phonenumber must be a valid phone number")
            )
          ) {
            setError("phoneNumber", {
              type: "server",
              message: t("invalidNumber"),
            });
            setIsLoading(false);
            return;
          }
          // Проверка на ошибку email
          if (
            serverMessage.some((m: string) =>
              String(m).toLowerCase().includes("email")
            )
          ) {
            setError("email", {
              type: "server",
              message: t("invalidEmail"),
            });
            setIsLoading(false);
            return;
          }
        } else {
          const msgStr = String(serverMessage).toLowerCase();
          // Проверка на ошибку телефона
          if (msgStr.includes("phonenumber must be a valid phone number")) {
            setError("phoneNumber", {
              type: "server",
              message: t("invalidNumber"),
            });
            setIsLoading(false);
            return;
          }
          // Проверка на ошибку email
          if (msgStr.includes("email")) {
            setError("email", {
              type: "server",
              message: t("invalidEmail"),
            });
            setIsLoading(false);
            return;
          }
        }

        handleError(t("defaultError"));
      }

      setIsLoading(false);
    } catch (e) {
      // на всякий случай оставляем общий обработчик
      handleError(t("defaultError"));
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer
            align="start"
            action={handleSubmit(async (form) => {
              setIsLoading(true);
              saveUser(form);
            })}
          >
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={18} weight={500}>
            {t("accountSettings")}
          </Typography>
          <IconContainer align="end" action={() => history.back()}>
            <img src={CrossIcon} alt="Подтвердить" />
          </IconContainer>
        </div>
      </Header>

      <div className="pt-4 px-4">
        <DefaultForm onSubmit={handleSubmit(saveUser)} className="flex flex-col gap-2">
          <Controller
            name="fullName"
            control={control}
            rules={{
              required: t("requiredField"),
              maxLength: {
                value: 40,
                message: t("maxLengthExceeded", { count: 40 }),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <div className="relative w-full">
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  label={t("name")}
                  multiline
                  placeholder={t("name")}
                  fullWidth={true}
                  variant="outlined"
                  inputProps={{ maxLength: 40 }}
                />
                <span className="absolute top-2 right-2 text-gray-400 text-sm">
                  {field.value?.length || 0}/40
                </span>
              </div>
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: t("requiredField"),
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: t("invalidEmail"),
              },
            }}
            render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  label={t("email")}
                  multiline
                  fullWidth={true}
                  variant="outlined"
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
                  label={t("phoneV2")}
                  variant="outlined"
                  inputRef={mask}
                  placeholder="+7 700 000-00-00"
                />
            )}
          />

          {!hasError ? (
            <Button
              className="fixed bottom-4 left-3 w-header z-10"
              type="submit"
              loading={isLoading}
              disabled={!isValid}
            >
              {t("save")}
            </Button>
          ) : (
            <Button mode="red" className="fixed bottom-4 left-3 w-header mt-8 z-10">
              {errorText}
            </Button>
          )}
        </DefaultForm>
      </div>
    </div>
  );
};
