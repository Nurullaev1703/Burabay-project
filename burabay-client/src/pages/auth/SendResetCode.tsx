import { FC, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { IconContainer } from "../../shared/ui/IconContainer";
import { DefaultForm } from "./ui/DefaultForm";
import { Typography } from "../../shared/ui/Typography";
import { TextField } from "@mui/material";
import { Button } from "../../shared/ui/Button";
import BackIcon from "../../app/icons/back-icon-white.svg";
import { LanguageButton } from "../../shared/ui/LanguageButton";
import { apiService } from "../../services/api/ApiService";
import { HTTP_STATUS } from "../../services/api/ServerData";
import { roleService, tokenService } from "../../services/storage/Factory";

// форма отслеживает только email
interface FormType {
  email: string;
}

export const SendResetCode: FC = function SendResetCode() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {history} = useRouter()
  useEffect(() => {
    roleService.deleteValue();
    tokenService.deleteValue();
  }, []);
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });
  return (
    <div className="bg-almostWhite h-screen">
      <AlternativeHeader>
        <div className="flex justify-between items-start mb-2">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography
            size={28}
            weight={700}
            color={COLORS_TEXT.white}
            align="center"
          >
            {t("recoveryPassword")}
          </Typography>
          <LanguageButton />
        </div>
      </AlternativeHeader>

      <DefaultForm
        onSubmit={handleSubmit(async (form) => {
          setIsLoading(true);
          const response = await apiService.post({
            url: "/auth/reset-password",
            dto: form,
          });
          if (response.data == HTTP_STATUS.FAILED_DEPENDENCY) {
            setErrorMessage(t("defaultError"));
            setEmailError(true);
          }
          if (response.data == HTTP_STATUS.OK) {
            navigate({
              to: "/auth/recovery/$email",
              params:{
                email: form.email
              }
            });
          }
          setIsLoading(false);
        })}
        className="flex flex-col"
      >
        <div className="flex flex-col items-center gap-5 py-6 px-4">
          <Typography>{t("inputResetEmail")}</Typography>
          <Controller
            name="email"
            control={control}
            rules={{
              validate: (value: string) => {
                const emailRegex =
                  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                return emailRegex.test(value) || t("invalidEmail");
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={Boolean(error?.message) || emailError}
                helperText={error?.message || errorMessage}
                fullWidth={true}
                type={"email"}
                variant="outlined"
                label={t("mail")}
                autoFocus={true}
                placeholder={t("inputMail")}
              />
            )}
          />
        </div>
        <Button
          disabled={!isValid || isSubmitting}
          loading={isLoading}
          type="submit"
          className="w-header mx-auto mt-[15%]"
        >
          {t("sendMail")}
        </Button>
      </DefaultForm>
    </div>
  );
};
