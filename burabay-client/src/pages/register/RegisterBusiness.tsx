import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { Link, useNavigate } from "@tanstack/react-router";
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
import { ROLE_TYPE } from "../auth/model/auth-model";
import { roleService } from "../../services/storage/Factory";
import ClosedEye from "../../app/icons/close-eye.svg";
import OpenedEye from "../../app/icons/open-eye.svg";
// форма отслеживает данные
interface FormType {
  email: string;
  password: string
}

export const RegisterBusiness: FC = function RegisterBusiness() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [emailError, setEmailError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });
  return (
    <div className="bg-almostWhite h-screen">
      <AlternativeHeader isMini>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={28} weight={700} color={COLORS_TEXT.white}>
            {t("business")}
          </Typography>
          <LanguageButton />
        </div>
      </AlternativeHeader>

      <DefaultForm
        onSubmit={handleSubmit(async (form) => {
          setIsLoading(true);
          roleService.setValue(ROLE_TYPE.BUSINESS);
          const response = await apiService.post({
            url: "/auth",
            dto: {
              email: form.email,
              password: form.password,
              role: ROLE_TYPE.BUSINESS,
            },
          });
          if (response.data == HTTP_STATUS.CREATED) {
            navigate({
              to: "/auth/accept/$email",
              params: { email: form.email },
            });
          } else if (response.data == HTTP_STATUS.UNAUTHORIZED) {
            navigate({
              to: "/auth/accept/$email",
              params: { email: form.email },
            });
          } else if (response.data == HTTP_STATUS.CONFLICT) {
            setErrorMessage(t("emailBusy"));
            setEmailError(true);
          }
          setIsLoading(false);
        })}
        className="flex flex-col"
      >
        <div className="flex flex-col items-center gap-5 py-6 px-4">
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
                onChange={(e) => {
                  field.onChange(e);
                  setEmailError(false);
                  setErrorMessage("");
                }}
              />
            )}
          />
          <Controller
            name="password"
            control={control}
            rules={{
              validate: (value: string) => {
                const passwordRegex = /^[^\s]{8,}$/;
                return passwordRegex.test(value) || t("invalidPassword");
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <div className="relative w-full">
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  fullWidth={true}
                  type={isShowPassword ? "text" : "password"}
                  variant="outlined"
                  label={t("password")}
                  autoComplete={""}
                  placeholder={t("inputPassword")}
                />
                {field.value && (
                  <IconContainer
                    align="center"
                    className="absolute right-0 top-[24px]"
                    action={() => setIsShowPassword(!isShowPassword)}
                  >
                    <img
                      src={isShowPassword ? ClosedEye : OpenedEye}
                      alt="eye"
                    />
                  </IconContainer>
                )}
              </div>
            )}
          />
        </div>
        <Button
          disabled={!isValid || isSubmitting}
          loading={isLoading}
          type="submit"
          className="w-header mx-auto mb-4"
        >
          {t("register")}
        </Button>
        <Typography size={14} align="center" className="flex flex-col">
          <span className={`${COLORS_TEXT.totalBlack}`}>
            {t("termsOfUseText")}
          </span>
          <Link to={"/help"}>
            <span className={`${COLORS_TEXT.blue200} font-semibold`}>
              {t("termsOfUseLink")}
            </span>
          </Link>
        </Typography>
      </DefaultForm>
    </div>
  );
};
