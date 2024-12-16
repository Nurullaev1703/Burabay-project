import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import { TextField } from "@mui/material";
import { Button } from "../../shared/ui/Button";
import BackIcon from "../../app/icons/back-icon-white.svg";
import { LanguageButton } from "../../shared/ui/LanguageButton";
import { apiService } from "../../services/api/ApiService";
import { HTTP_STATUS } from "../../services/api/ServerData";
import { DefaultForm } from "../auth/ui/DefaultForm";

// форма отслеживает только email
interface FormType {
  email: string;
}

export const ChangeEmail: FC = function ChangeEmail() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { history } = useRouter()
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
      <AlternativeHeader isMini>
        <div className="flex justify-between items-center mb-2">
          <IconContainer align="start" action={history.back}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={18} weight={500} color={COLORS_TEXT.white}>
            {t("changeEmail")}
          </Typography>
          <LanguageButton hideIcon/>
        </div>
      </AlternativeHeader>

      <DefaultForm
        onSubmit={handleSubmit(async (form) => {
          setIsLoading(true);
            navigate({
              to: "/profile/security/accept-password/$email",
              params: { email: form.email },
            });
          setIsLoading(false);
        })}
        className="flex flex-col"
      >
        <div className="flex flex-col items-center gap-5 py-6 px-4">
          <div>
            <Typography size={14} className="mb-2 leading-none">{t("inputNewEmail")}</Typography>
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
                  error={Boolean(error?.message)}
                  helperText={error?.message}
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
        </div>
        <Button
          disabled={!isValid || isSubmitting}
          loading={isLoading}
          type="submit"
          className="w-header mx-auto mt-[25%]"
        >
          {t("next")}
        </Button>
      </DefaultForm>
    </div>
  );
};
