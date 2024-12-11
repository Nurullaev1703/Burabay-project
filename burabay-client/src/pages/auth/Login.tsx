import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Loader } from "../../components/Loader";
import { useAuth } from "../../features/auth";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { IconContainer } from "../../shared/ui/IconContainer";
import { DefaultForm } from "./ui/DefaultForm";
import { Typography } from "../../shared/ui/Typography";
import { TextField } from "@mui/material";
import { Button } from "../../shared/ui/Button";
import InfoIcon from "../../app/icons/info.svg";
import { useGoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import FacebookLogin from "react-facebook-login";
import GoogleLogo from "../../app/icons/google-logo.svg";
import FacebookLogo from "../../app/icons/facebook-logo.svg";
import { LanguageButton } from "../../shared/ui/LanguageButton";

// роль, которую выбрал пользователь
interface Props {}

// форма отслеживает только номер телефона
interface FormType {
  email: string;
}

export const Login: FC<Props> = function Login(props) {
  const navigate = useNavigate();
  const { history } = useRouter();
  const { t } = useTranslation();
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setToken } = useAuth();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => console.log(tokenResponse),
  });
  const handleFacebookCallback = (response: any) => {
    if (response?.status === "unknown") {
      return;
    }
    console.log(response);
  };
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      email: "",
    },
    mode: "onChange"
  });
  return (
    <div className="bg-almostWhite h-screen">
      <AlternativeHeader>
        <div className="flex justify-between items-center mb-2">
          <IconContainer align="start">
            <img src={InfoIcon} alt="" />
          </IconContainer>
          <Typography size={28} weight={700} color={COLORS_TEXT.white}>
            {t("signin")}
          </Typography>
          <LanguageButton />
        </div>
        <Typography
          size={18}
          weight={500}
          color={COLORS_TEXT.white}
          className="text-center"
        >
          {t("welcome")}
        </Typography>
      </AlternativeHeader>

      <DefaultForm
        onSubmit={handleSubmit(async (form) => {})}
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
                return emailRegex.test(value) || t("invalidNumber");
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={Boolean(error?.message) || phoneError}
                helperText={error?.message || errorMessage}
                fullWidth={true}
                type={"email"}
                variant="outlined"
                label={t("mail")}
                autoFocus={true}
                placeholder={t("inputMail")}
                onBlur={() => {}}
                onChange={(e) => {
                  field.onChange(e);
                  setPhoneError(false);
                  setErrorMessage("");
                }}
              />
            )}
          />
          <div className="relative w-full h-4 my-4 flex items-center">
            <div className="w-full h-[1px] bg-gray100"></div>
            <Typography
              size={12}
              color={COLORS_TEXT.gray100}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-almostWhite px-4"
            >
              {t("signinWith")}
            </Typography>
          </div>
          <div className="flex items-center justify-between w-full">
            <button
              type="button"
              className="bg-white flex items-center justify-center gap-3 w-[48%] p-4 rounded-button"
            >
              <img src={GoogleLogo} alt="" />
              <Typography>Google</Typography>
            </button>
            <FacebookLogin
              buttonStyle={{
                padding: "16px",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                textTransform: "capitalize",
                fontSize: "16px",
                fontWeight: 400,
                borderRadius: "32px"
              }}
              containerStyle={{
                width:"48%"
              }}
              appId="939844554734638"
              autoLoad={false}
              textButton="Facebook"
              fields="name,email,picture"
              callback={handleFacebookCallback}
              icon={<img src={FacebookLogo} />}
            />
          </div>
        </div>
        <Button disabled={!isValid || isSubmitting} type="submit" className="w-header mx-auto">
          {t("next")}
        </Button>
      </DefaultForm>

      {isLoading && <Loader />}
    </div>
  );
};
