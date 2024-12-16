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

interface Props{
  currentEmail: string
  email:string
}
// форма отслеживает данные
interface FormType {
  password: string;
}

export const AcceptPassword: FC<Props> = function AcceptPassword(props) {
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
      password: "",
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
            {t("accepting")}
          </Typography>
          <LanguageButton hideIcon />
        </div>
      </AlternativeHeader>

      <DefaultForm
        onSubmit={handleSubmit(async (form) => {
          setIsLoading(true);
          const response = await apiService.post<string>({
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
        <div className="flex flex-col items-center gap-2 py-6 px-4">
          <Typography>{`${t('passwordFor')} ${props.currentEmail}`}</Typography>
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
