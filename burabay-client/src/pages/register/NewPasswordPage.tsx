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
import { useAuth } from "../../features/auth";
import { HTTP_STATUS } from "../../services/api/ServerData";
import { Profile } from "../profile/model/profile";
import { roleService } from "../../services/storage/Factory";

interface Props {
  email: string;
}

// форма отслеживает данные
interface FormType {
  password: string;
}

export const NewPasswordPage: FC<Props> = function NewPasswordPage(props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const { setToken, setUser } = useAuth();
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
    <div className="bg-almostWhite min-h-screen">
      <AlternativeHeader>
        <div className="flex justify-between items-center mb-2">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={28} weight={700} color={COLORS_TEXT.white}>
            {t("register")}
          </Typography>
          <LanguageButton />
        </div>
        <Typography
          align="center"
          color={COLORS_TEXT.white}
          size={18}
          weight={500}
          className="w-3/5 mx-auto leading-none"
        >
          {t("createPassword")}
        </Typography>
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
          if (response.data !== HTTP_STATUS.CONFLICT) {
            setToken(response.data);
            const userResponse = await apiService.get<Profile>({
              url: "/profile",
            });
            if (userResponse.data) {
              setUser(userResponse.data);
              roleService.setValue(userResponse.data.role);
              navigate({
                to: "/profile",
              });
            } else {
              setErrorMessage(t("wrongPassword"));
            }
          } else {
            setErrorMessage(t("defaultError"));
            setPasswordError(true);
          }
          setIsLoading(false);
        })}
        className="flex flex-col h-[60vh]"
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
