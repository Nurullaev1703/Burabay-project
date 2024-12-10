import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import BackIcon from "../../app/icons/back-icon.svg";
import WhatsappIcon from "../../app/icons/whatsapp.svg";
import { Button } from "../../shared/ui/Button";
import { Hint } from "../../shared/ui/Hint";
import device from "current-device";
import { Loader } from "../../components/Loader";
import {
  firstAuth,
  getBusinessId,
  getDocuments,
  getName,
  getOrganizationName,
  getQrCode,
  postSignResponse,
  secondAuth,
} from "../auth/egovData/EgovData";
import { apiService } from "../../services/api/ApiService";
import { useNavigate } from "@tanstack/react-router";
import { Profile } from "../profile/model/profile";
import { NCALayerClient } from "ncalayer-js-client";
import { userDataType } from "../auth/egovData/types";

export const RegisterAccept: FC = function RegisterAccept() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async (user: Profile, userData: userDataType) => {
    const username = getName(userData);
    console.log(username);
    // обновление данных для ИП
    if (user.organization?.type == "ИП") {
      if (user?.fullName.toUpperCase().includes(username)) {
        const bin = getBusinessId(userData);
        const response = await apiService.patch<string>({
          url: "/profile",
          dto: {
            fullName: username,
            organization: {
              identityNumber: bin,
            },
          },
        });
        if (response.data) {
          navigate({ to: "/register/success" });
        }
      } else {
        setErrorText(t("ownerError"));
        throw setIsError(true);
      }
    }
    // обновление данных для других организаций
    else {
      if (
        userData.businessId &&
        user?.fullName.toUpperCase().includes(username)
      ) {
        const orgName = getOrganizationName(userData);
        const response = await apiService.patch<string>({
          url: "/profile",
          dto: {
            fullName: username,
            iin: userData.userId,
            organization: {
              name: orgName,
              identityNumber: userData.businessId.replace("BIN", ""),
            },
          },
        });
        if (response.data) {
          navigate({ to: "/register/success" });
        }
      } else if (!userData.businessId) {
        setErrorText(t("noBusinessInfo"));
        throw setIsError(true);
      } else {
        setErrorText(t("ownerError"));
        throw setIsError(true);
      }
    }
  };

  const handleSubmit = async () => {
    const user = await apiService.get<Profile>({
      url: "/profile",
    });
    if (device.type === "mobile" || device.type === "tablet") {
      // api, необходимые для получения авторизации с egov
      const qrData = await getQrCode();
      setIsLoading(true);

      // открываем egovMobile
      window.location.href = qrData.data.eGovMobileLaunchLink;
      const authData = await firstAuth();
      await postSignResponse(qrData.data.signURL, authData.data.nonce);
      const docs = await getDocuments(qrData.data.signURL);
      const userData = await secondAuth(
        authData.data.nonce,
        docs.data.documentsToSign[0].document.file.data
      );
      // обновление данных о пользователе
      await handleRegister(user.data, userData.data);
      setIsLoading(false);
    } else {
      const ncalayerClient = new NCALayerClient();

      try {
        await ncalayerClient.connect();
      } catch {
        setErrorText(t("ncalayerError"));
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
        throw setIsError(true);
      }
      const userData = await secondAuth(
        authData.data.nonce,
        base64EncodedSignature[0] || base64EncodedSignature
      );
      await handleRegister(user.data, userData.data);
    }
  };

  const handleCheckProfile = async () => {
    const profile = await apiService.get<Profile>({
      url: "/profile",
    });
    if (profile.data.organization?.identityNumber) {
      navigate({ to: "/register/success" });
    } else {
      setErrorText(
        "ЭЦП не подтверждена, обратитесь в поддержку если возникла ошибка"
      );
      setIsError(true);
      throw setIsLoading(false);
    }
  };
  return (
    <div className="px-4 h-view">
      <AlternativeHeader>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={20} weight={800}>
            {t("register")}
          </Typography>
          <IconContainer align="end">
            <img src={WhatsappIcon} alt="" />
          </IconContainer>
        </div>
      </AlternativeHeader>
      <main className="mt-18 h-view flex flex-col justify-between">
        <div className="mt-8">
          <div
            id="image"
            className="w-full h-[70vw] bg-amber-200 rounded-[14px] bg-cover max-h-96"
          />
          <div className="mt-4">
            <Typography size={20} weight={800} className="mb-2">
              {t("acceptPerson")}
            </Typography>
            <Typography weight={500}>{t("acceptPersonHint")}</Typography>
          </div>
        </div>
        <div id="buttons" className="w-full">
          {isError && (
            <div className="relative">
              <Hint title={errorText} mode="error" />
              <button
                className="absolute w-11 h-full right-0 top-0 flex justify-end pt-2 px-3 text-alternate cursor-pointer"
                onClick={() => setIsError(false)}
              >
                {"X"}
              </button>
            </div>
          )}
          <Button className="my-2" onClick={handleSubmit}>
            {t("goToEgov")}
          </Button>
          <Button mode="border" onClick={handleCheckProfile}>
            {t("successEgov")}
          </Button>
        </div>
      </main>
      {isLoading && <Loader />}
    </div>
  );
};
