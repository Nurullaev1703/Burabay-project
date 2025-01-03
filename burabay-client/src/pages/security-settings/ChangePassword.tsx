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
import ClosedEye from "../../app/icons/close-eye.svg";
import OpenedEye from "../../app/icons/open-eye.svg";
import { HTTP_STATUS } from "../../services/api/ServerData";

// форма отслеживает данные
interface FormType {
  oldPassword: string;
  newPassword: string;
}

export const ChangePasswordPage: FC = function ChangePasswordPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
    },
    mode: "onChange",
  });
  return (
    <div className="bg-almostWhite h-screen">
      <AlternativeHeader isMini>
        <div className="flex justify-between items-center mb-2">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={18} weight={500} color={COLORS_TEXT.white}>
            {t("changingPassword")}
          </Typography>
          <LanguageButton hideIcon />
        </div>
      </AlternativeHeader>

      <DefaultForm
        onSubmit={handleSubmit(async (form) => {
          setIsLoading(true);
          const response = await apiService.patch<string>({
            url: "/auth/change-password",
            dto: form,
          });
          if (response.data == HTTP_STATUS.CONFLICT) {
            setErrorMessage(t("incorrectPassword"));
            setPasswordError(true);
          } 
          else if(response.data == HTTP_STATUS.OK){
            navigate({
                to:"/auth"
            })
          }
          setIsLoading(false);
        })}
        className="flex flex-col h-[60vh]"
      >
        <div className="flex flex-col items-center gap-5 py-6 px-4">
          <Controller
            name="oldPassword"
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
                  label={t("oldPassword")}
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
          <div className="w-full mb-11">
            <Typography size={14} className="mb-2">
              {t("createPassword")}
            </Typography>
            <Controller
              name="newPassword"
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
                    label={t("newPassword")}
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
        </div>
        <Button
          disabled={!isValid || isSubmitting}
          loading={isLoading}
          type="submit"
          className="w-header mx-auto mb-4"
        >
          {t("change")}
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
