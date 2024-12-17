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
import { DefaultForm } from "../auth/ui/DefaultForm";
import ClosedEye from "../../app/icons/close-eye.svg"
import OpenedEye from "../../app/icons/open-eye.svg"
import { useAuth } from "../../features/auth";
import { HTTP_STATUS } from "../../services/api/ServerData";

interface Props {
  email: string;
}

// форма отслеживает данные
interface FormType {
  password: string;
}

export const CheckPasswordPage: FC<Props> = function CheckPasswordPage(props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const { setToken } = useAuth();
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      password: "",
    },
    mode: "onChange",
  });
  return (
    <div className="bg-almostWhite h-screen">
      <AlternativeHeader>
        <div className="flex justify-between items-center mb-2">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={28} weight={700} color={COLORS_TEXT.white}>
            {t("auth")}
          </Typography>
          <LanguageButton />
        </div>
        <div>
          <Typography
            align="center"
            color={COLORS_TEXT.white}
            size={18}
            weight={500}
            className="leading-none"
          >
            {t("passwordFor")}
          </Typography>
          <Typography
            align="center"
            color={COLORS_TEXT.white}
            size={18}
            weight={500}
            className="line-clamp-1"
          >
            {props.email}
          </Typography>
        </div>
      </AlternativeHeader>

      <DefaultForm
        onSubmit={handleSubmit(async (form) => {
          setIsLoading(true);
          const response = await apiService.post<string>({
            url: "/auth/check-password",
            dto: {
              password: form.password,
              email: props.email,
            },
          });
          if (response.data && response.status == Number(HTTP_STATUS.CREATED)) {
            setToken(response.data);
            // navigate({
            //   to: "/profile",
            // });
            window.location.href = "/profile"
          } else {
            setErrorMessage(t("wrongPassword"));
            setPasswordError(true);
          }
          setIsLoading(false);
        })}
        className="flex flex-col"
      >
        <div className="flex flex-col items-center gap-5 py-6 px-4 pb-[120px]">
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
                  error={Boolean(error?.message) || passwordError}
                  helperText={error?.message || errorMessage}
                  fullWidth={true}
                  type={isShowPassword ? "text" : "password"}
                  variant="outlined"
                  label={t("password")}
                  placeholder={t("inputPassword")}
                  onChange={(e) => {
                    field.onChange(e);
                    setPasswordError(false);
                    setErrorMessage("");
                  }}
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
          {t("signIn")}
        </Button>
        <Typography size={14} align="center" className="flex flex-col">
          <Link to={"/auth/reset-password"}>
            <span className={`${COLORS_TEXT.blue200} font-semibold`}>
              {t("forgotPassword")}
            </span>
          </Link>
        </Typography>
      </DefaultForm>
    </div>
  );
};
