import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../../../components/Header";
import { Typography } from "../../../shared/ui/Typography";
import { IconContainer } from "../../../shared/ui/IconContainer";
import BackIcon from "../../../app/icons/back-icon.svg";
import SupportIcon from "../../../app/icons/support-icon.svg";
import { DefaultForm } from "../../auth/ui/DefaultForm";
import { Controller, useForm } from "react-hook-form";
import { useMask } from "@react-input/mask";
import { TextField } from "@mui/material";
import { Hint } from "../../../shared/ui/Hint";
import { Button } from "../../../shared/ui/Button";
import {
  firstAuth,
  getDocuments,
  getName,
  getQrCode,
  postSignResponse,
  secondAuth,
} from "../../auth/egovData/EgovData";
import { Loader } from "../../../components/Loader";
import { useAuth } from "../../../features/auth";
import { apiService } from "../../../services/api/ApiService";
import { Profile } from "../model/profile";
import { useNavigate } from "@tanstack/react-router";
import device from "current-device";
import { NCALayerClient } from "ncalayer-js-client";


interface FormType {
  phone: string;
}

export const EditNumber: FC = function EditNumber() {
  const { t } = useTranslation();
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { user, resetToken } = useAuth();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const navigate = useNavigate();
  const mask = useMask({ mask: "___ ___-__-__", replacement: { _: /\d/ } });
  const styles = {
    ".css-24rejj-MuiInputBase-input-MuiOutlinedInput-input": {
      padding: "16px 14px 16px 33px",
      fontSize: "16px",
    },
  };
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      phone: "",
    },
  });

  return (
    <section className="px-4">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={20} weight={800}>
            {t("changeNumber")}
          </Typography>
          <IconContainer align="end" action={() => navigate({to:"/help"})}>
            <img src={SupportIcon} alt="" />
          </IconContainer>
        </div>
      </Header>

      <div className="h-[60vh] flex flex-col justify-center items-center">
        <div className="text-center mb-2">
          <strong>{t("enterNewNumber")}</strong>
          <p>{t("descriptionNewNumber")}</p>
        </div>
        <DefaultForm
          onSubmit={handleSubmit(async (form) => {
            // api, необходимые для получения авторизации с egov
            const qrData = await getQrCode();
            setIsLoading(true);

            if (device.type === "mobile" || device.type === "tablet") {
              // открываем egovMobile
              window.location.href = qrData.data.eGovMobileLaunchLink;
              const authData = await firstAuth();
              await postSignResponse(qrData.data.signURL, authData.data.nonce, {
                nameRu: "Смена номера телефона",
                nameKz: "Телефон нөмірін өзгерту",
                nameEn: "Changing the phone number",
              });
              const docs = await getDocuments(qrData.data.signURL);
              const userData = await secondAuth(
                authData.data.nonce,
                docs.data.documentsToSign[0].document.file.data
              );
              // при успешной авторизации через Egov
              if (userData.data.userId) {
                const fullName = getName(userData.data).toUpperCase();
                if (user?.fullName.toUpperCase() !== fullName) {
                  setErrorMessage(t("invalidUsername"));
                  setPhoneError(true);
                  throw setIsLoading(false);
                }
                const response = await apiService.patch<Profile>({
                  url: "/profile",
                  dto: {
                    phoneNumber: form.phone.replace(/[ -]/g, ""),
                  },
                });
                if (response.data) {
                  resetToken();
                  navigate({ to: "/auth" });
                }
              }
            } else {
              const ncalayerClient = new NCALayerClient();

              try {
                await ncalayerClient.connect();
              } catch {
                setErrorText(t("ncalayerError"));
                setIsLoading(false)
                throw setIsError(true);
              }
              const authData = await firstAuth();
              let base64EncodedSignature;
              try {
                base64EncodedSignature = await ncalayerClient.basicsSignCMS(
                  NCALayerClient.basicsStorageAll,
                  authData.data.nonce,
                  NCALayerClient.basicsCMSParamsDetached,
                  NCALayerClient.basicsSignerAuthAny
                );
              } catch {
                setErrorText(t("signingError"));
                setIsLoading(false)
                throw setIsError(true);
              }
              const userData = await secondAuth(
                authData.data.nonce,
                base64EncodedSignature
              );
              // при успешной авторизации через Egov
              if (userData.data.userId) {
                const fullName = getName(userData.data).toUpperCase();
                if (user?.fullName.toUpperCase() !== fullName) {
                  setErrorMessage(t("invalidUsername"));
                  setPhoneError(true);
                  throw setIsLoading(false);
                }
                const response = await apiService.patch<Profile>({
                  url: "/profile",
                  dto: {
                    phoneNumber: form.phone.replace(/[ -]/g, ""),
                  },
                });
                if (response.data) {
                  resetToken();
                  navigate({ to: "/auth" });
                }
              }
            }
          })}
        >
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
              <div className="relative">
                <div className="absolute top-0 left-0 h-[55px] flex w-8 justify-end items-center z-10">
                  <Typography>{"+7"}</Typography>
                </div>
                <TextField
                  {...field}
                  error={Boolean(error?.message) || phoneError}
                  helperText={error?.message || errorMessage}
                  fullWidth={true}
                  type={"tel"}
                  variant="outlined"
                  autoFocus={true}
                  inputRef={mask}
                  sx={styles}
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
              </div>
            )}
          />
          <div className="mt-4">
            <Hint title={isError ? errorText : t("egovConfirm")} mode={isError ? "error" : "default"}></Hint>
            <Button
              className="mt-[4px]"
              disabled={!isValid || isSubmitting}
              type="submit"
            >
              {t("goToEgov")}
            </Button>
          </div>
        </DefaultForm>
      </div>
      {isLoading && <Loader />}
    </section>
  );
};
