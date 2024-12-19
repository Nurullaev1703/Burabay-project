import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DefaultForm } from "./ui/DefaultForm";
import OtpInput from "react-otp-input";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Loader } from "../../components/Loader";
import { apiService } from "../../services/api/ApiService";
import { Typography } from "../../shared/ui/Typography";
import { COLORS, COLORS_TEXT } from "../../shared/ui/colors";
import { Button } from "../../shared/ui/Button";
import TimerButton from "../../shared/ui/TimerButton";
import { LanguageButton } from "../../shared/ui/LanguageButton";
import { IconContainer } from "../../shared/ui/IconContainer";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import BackIcon from "../../app/icons/back-icon-white.svg";
import { HTTP_STATUS } from "../../services/api/ServerData";
import { roleService } from "../../services/storage/Factory";

interface Props {
  email: string;
  role?: string;
}

interface FormType {
  code: string;
}

export const AcceptEmail: FC<Props> = function AcceptEmail(props) {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [shaking, setShaking] = useState<boolean>(false);
  const [time, setTime] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const navigate = useNavigate();
  const { history } = useRouter();
  const { t } = useTranslation();

  const handleError = (errorText: string) => {
    setErrorText(errorText);
    setError(true);
    setTimeout(() => {
      setError(false);
    }, 2000);
    setShaking(true);
    setTimeout(() => setShaking(false), 500);
    setOtp("");
  };
  useEffect(() => {
    if (otp.length === 4) {
      onSubmit(otp);
    }
  }, [otp]);

  const {
    handleSubmit,
    formState: {},
  } = useForm<FormType>({
    defaultValues: {
      code: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (otp: string) => {
    setIsSubmitting(true);
    const response = await apiService.post({
      url: "/auth/verify-code",
      dto: {
        email: props.email,
        code: otp,
      },
    });
    if (response.data == HTTP_STATUS.OK) {
      // если есть роль, то это регистрация бизнеса

      if(roleService.hasValue()){
        navigate({
          to: "/register/business/$email",
          params: { email: props.email },
        });
      }
      else{
        navigate({
          to: "/register/password/new/$email",
          params: { email: props.email },
        });
      }
    }
    if (response.data == HTTP_STATUS.CONFLICT) {
      handleError(t("invalidCode"));
    }
    if (response.data == HTTP_STATUS.SERVER_ERROR) {
      handleError(t("tooManyRequest"));
    }
    setIsSubmitting(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <AlternativeHeader isMini>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography
            size={28}
            weight={700}
            color={COLORS_TEXT.white}
            align="center"
            className="w-3/5"
          >
            {props.role ?  "Business" : "Tourist"}
          </Typography>
          <LanguageButton />
        </div>
      </AlternativeHeader>
      <DefaultForm
        onSubmit={handleSubmit(() => onSubmit(otp))}
        className="flex flex-col items-center justify-center h-[60vh] px-4"
      >
        <div className="text-center">
          <Typography align="center" size={22} weight={500} className="mb-4">
            {t("inputCode")}
          </Typography>
          <Typography align="center" className="mb-1">
            {t("sendCodeInfo")}
          </Typography>
          <Typography weight={700} align="center" className="mb-6">
            {props.email}
          </Typography>
        </div>
        <OtpInput
          value={otp}
          onChange={setOtp}
          numInputs={4}
          shouldAutoFocus={true}
          renderInput={(props) => (
            <input
              {...props}
              type="number"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="●"
              style={{
                width: "54px",
                height: "54px",
                color: COLORS.blue200,
                fontWeight: "700",
                textAlign: "center",
                fontSize: props.value ? "48px" : "20px",
              }}
              className={`outline-none caret-transparent placeholder:text-blue200 placeholder:align-middle bg-circle placeholder:text-xl ${shaking ? "animate-shake" : ""}`}
            />
          )}
        />

        {error ? (
          <Button mode="red" className="mt-8">
            {errorText}
          </Button>
        ) : (
          <Button mode="hidden" className="mt-8">
            {t('defaultError')}
          </Button>
        )}
        {errorText !== t("tooManyRequest") ? (
          <TimerButton
            initialTime={time}
            type="button"
            onClick={async () => {
              setTime(60);
              const response = await apiService.post<string>({
                url: "/auth/verification",
                dto: {
                  email: props.email,
                },
              });
              if (response.data == HTTP_STATUS.SERVER_ERROR) {
                setErrorText(t("tooManyRequests"));
                setError(true);
                setTimeout(() => {
                  setError(false);
                }, 2000);
              }
            }}
            className="my-4"
          />
        ) : (
          <Button mode="border" onClick={() => navigate({ to: "/auth" })}>
            {t("goToAuth")}
          </Button>
        )}
      </DefaultForm>
      {isSubmitting && <Loader />}
    </div>
  );
};
