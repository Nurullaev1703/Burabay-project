import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Header } from "../../components/Header";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import SupportIcon from "../../app/icons/support-icon.svg";
import BackIcon from "../../app/icons/back-icon.svg";
import { useMask } from "@react-input/mask";
import { useTranslation } from "react-i18next";
import { Loader } from "../../components/Loader";
import { useAuth } from "../../features/auth";
import { apiService } from "../../services/api/ApiService";
import { phoneService, roleService } from "../../services/storage/Factory";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { IconContainer } from "../../shared/ui/IconContainer";
import { DefaultForm } from "./ui/DefaultForm";
import { Typography } from "../../shared/ui/Typography";
import { TextField } from "@mui/material";
import { Button } from "../../shared/ui/Button";

// роль, которую выбрал пользователь
interface Props {
}

// форма отслеживает только номер телефона
interface FormType {
  phone: string;
}

export const Login: FC<Props> = function Login(props) {
  const navigate = useNavigate();
  const { history } = useRouter();
  const { t } = useTranslation();
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setToken } = useAuth();

  // маска для ввода номера телефона
  const mask = useMask({ mask: "___ ___-__-__", replacement: { _: /\d/ } });

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      phone: phoneService.hasValue() ? phoneService.getValue() : "",
    },
  });
  return (
    <div>
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={20} weight={800}>
            {""}
          </Typography>
          <IconContainer align="end" action={() => navigate({ to: "/help" })}>
            <img src={SupportIcon} alt="" />
          </IconContainer>
        </div>
      </Header>

      <DefaultForm
        onSubmit={handleSubmit(async (form) => {
          const sendCode = await apiService.post<number>({
            url: "/auth/verification",
            dto: {
              phone: "+7" + form.phone.replace(/[ -]/g, ""),
            },
          });
          if (sendCode.status === 400) {
            setErrorMessage(t("invalidNumber"));
            throw setPhoneError(true);
          }
          if (sendCode.status === 429) {
            setErrorMessage(t("tooManyRequests"));
            throw setPhoneError(true);
          }
          phoneService.setValue(form.phone);
          navigate({
            to: "/auth/accept/$phone",
            params: { phone: form.phone },
          });
        })}
        className="flex flex-col"
      >
        <div className="flex flex-col items-center mb-10">
          <div
            className={`w-36 aspect-square  flex items-end justify-center rounded-button`}
          >
            <img
              src={""}
              alt=""
              className="mix-blend-multiply"
            />
          </div>
          <div className="flex flex-col gap-2 mt-4">
            <div>
              <Typography weight={500} align="center">
                {t("inputNumber")}
              </Typography>
              <Typography weight={300} align="center">
                {t("inputNumberText")}
              </Typography>
            </div>
            <Controller
              name="phone"
              control={control}
              rules={{
                required: t("requiredField"),
                validate: (value: string) => {
                  const phoneRegex = /^\d{3} \d{3}-\d{2}-\d{2}$/;
                  return phoneRegex.test(value) || t("invalidNumber");
                },
              }}
              render={({ field, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    error={Boolean(error?.message) || phoneError}
                    helperText={error?.message || errorMessage}
                    fullWidth={true}
                    type={"tel"}
                    variant="outlined"
                    autoFocus={true}
                    inputRef={mask}
                    placeholder="700 000-00-00"
                    onFocus={() => {
                      window.scrollTo({
                        top: window.screen.height / 2,
                        behavior: "smooth", // Для плавного скролла (поддержка может быть не у всех браузеров)
                      });
                    }}
                    onChange={(e) => {
                      field.onChange(e);
                      setPhoneError(false);
                      setErrorMessage("");
                    }}
                  />
              )}
            />
            <Typography size={14}>
              <span className={`${COLORS_TEXT.secondary}`}>
                {t("termsOfUseText") + " "}
              </span>
              <Link to={"/"}>
                <span className={`${COLORS_TEXT.main200}`}>
                  {t("termsOfUseLink")}
                </span>
              </Link>
            </Typography>
          </div>
        </div>
        <div className="sticky top-full left-0 w-full">
          {t("buyerRole") ? (
            <Button
              mode="transparent"
              type="button"
              onClick={async () => {
                setIsLoading(true)
                roleService.setValue("Гость");
                const token = await apiService.post<string>({
                  url: "/auth",
                  dto: {
                    phoneNumber: "+77000000000",
                    role: "гость",
                    authPoint: "string",
                  },
                });
                if(token.data){
                  setToken(token.data)
                  navigate({ to: "/profile" });
                }
              }}
            >
              {t("skip")}
            </Button>
          ) : (
            <></>
          )}
          <Button disabled={!isValid || isSubmitting} type="submit">
            {t("getCode")}
          </Button>
        </div>
      </DefaultForm>
      {isLoading && <Loader/>}
    </div>
  );
};
