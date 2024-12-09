import { FC, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DefaultForm } from "./ui/DefaultForm";
import OtpInput from "react-otp-input";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Loader } from "../../components/Loader";
import { useAuth } from "../../features/auth";
import { apiService } from "../../services/api/ApiService";
import { phoneService } from "../../services/storage/Factory";
import { Typography } from "../../shared/ui/Typography";
import { COLORS, COLORS_TEXT } from "../../shared/ui/colors";
import { Button } from "../../shared/ui/Button";
import TimerButton from "../../shared/ui/TimerButton";

interface Props {
  phoneNumber: string;
}

interface FormType {
  code: string;
}

export const AcceptPhone: FC<Props> = function AcceptPhone(props) {
  const [otp, setOtp] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [shaking, setShaking] = useState<boolean>(false);
  const [time, setTime] = useState<number>(60);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

  const navigate = useNavigate();
  const { history } = useRouter();
  const { t } = useTranslation();

  const { setToken } = useAuth();

  // скролл до центра экрана для ввода при запуске приложения
  useEffect(() => {
    window.scrollTo(
      {
        top: window.screen.height/2,
        behavior: 'smooth', // Для плавного скролла
      }
    )
  },[])
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
    setIsSubmitting(true)
  };

  return (
    <div className="flex flex-col h-screen px-4">
      <DefaultForm
        onSubmit={handleSubmit(() => onSubmit(otp))}
        className="flex flex-col items-center justify-center h-[60vh]"
      >
        <div>
          <Typography size={20} weight={800}>
            {t("inputCode")}
          </Typography>
          <Typography align="center">{t("sendCodeInfo")}</Typography>
          <div className="flex gap-2 mb-4">
            <Typography weight={500}>{"+7 "+props.phoneNumber}</Typography>
            <Typography
              color={COLORS_TEXT.main200}
              onClick={() => history.back()}
            >
              {t("change")}
            </Typography>
          </div>
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
              placeholder="●"
              style={{
                width: "54px",
                height: "54px",
                color: COLORS.main200,
                fontWeight: "700",
                textAlign: "center",
                fontSize: (props.value) ? "48px" : "20px" 
              }}
              className={`outline-none caret-transparent placeholder:text-main200 placeholder:align-middle bg-circle placeholder:text-xl ${shaking ? "animate-shake" : ""}`}
            />
          )}
        />

        <TimerButton
          initialTime={time}
          type="button"
          onClick={async () => {
            setTime(60);
            const response = await apiService.post<number>({
              url: "/auth/verification",
              dto: {
                phone: phoneService.getValue().replace(/[ -]/g, ""),
              },
            });
            if (response.status === 429) {
              setErrorText(t("tooManyRequests"));
              setError(true);
              setTimeout(() => {
                setError(false);
              }, 2000);
            }
          }}
          className="my-4"
        />
        <Button type="button" mode="border" onClick={() => {
            phoneService.setValue("")
            history.back()
        }}>
          {t("cancel")}
        </Button>
        {error && (
          <Button mode="error" className="mt-8">
            {errorText}
          </Button>
        )}
      </DefaultForm>
      {isSubmitting && <Loader />}
    </div>
  );
};
