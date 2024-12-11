import BackIcon from "../../app/icons/back-icon.svg";
import { FC, useState } from "react";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import WhatsApp from "../../app/icons/whatsapp.svg";
import { Button } from "../../shared/ui/Button";
import { useNavigate, useRouter } from "@tanstack/react-router";
import device from "current-device";
import {
  firstAuth,
  getDocuments,
  getQrCode,
  postSignResponse,
  secondAuth,
} from "../auth/egovData/EgovData";
import { Loader } from "../../components/Loader";
import { apiService } from "../../services/api/ApiService";
import { useAuth } from "../../features/auth";
import { NCALayerClient } from "ncalayer-js-client";
import { Hint } from "../../shared/ui/Hint";
import { useTranslation } from "react-i18next";
import { NavMenuOrg } from "../../shared/ui/NavMenuOrg";

export const Help: FC = function Help() {
  const { history } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const { t } = useTranslation();

  // авторизация через Egov по ИИН
  const handleEgovAuth = async () => {
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
      const response = await apiService.get<string>({
        url: `/auth/iin/${userData.data.userId}`,
      });
      if (response.data) {
        setToken(response.data);
        navigate({ to: "/profile" });
      }
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
        base64EncodedSignature
      );
      const response = await apiService.get<string>({
        url: `/auth/iin/${userData.data.userId}`,
      });
      if (response.data) {
        setToken(response.data);
        navigate({ to: "/profile" });
      }
    }
  };

  return (
    <div className=" min-h-screen">
      <AlternativeHeader>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={20} weight={700}>
            {"Помощь"}
          </Typography>
          <IconContainer align="end">
            <img src={WhatsApp} alt="" />
          </IconContainer>
        </div>
      </AlternativeHeader>
      <main className="mt-18 py-4">
        <div className="py-4 border-b mb-4">
          <Typography className="mb-4" size={20} weight={600}>
            {"Если нет доступа к телефону"}
          </Typography>
          <Typography className="mb-4" size={16} weight={400}>
            {"Вы можете войти в свой аккаунт с помощью ЭЦП"}
          </Typography>
          <Button mode="border" onClick={handleEgovAuth}>
            {"Перейти в Egov Mobile"}
          </Button>
        </div>
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
        <div className="py-4 border-b mb-4">
          <Typography className="mb-4" size={20} weight={600}>
            {"О сервисе"}
          </Typography>
          <Typography className="mb-4" size={16} weight={400}>
            {
              "Сервис OneClick облегчает предпринимателям поиск и продажу товаров, подписание договоров и открывает новый путь для продвижения товаров"
            }
          </Typography>
        </div>
        <div className="py-4 border-b mb-4">
          <Typography className="mb-4" size={20} weight={600}>
            {"Сделки безопасны?"}
          </Typography>
          <Typography className="mb-4" size={16} weight={400}>
            {
              "Все поставщики проходят верификацию своего бизнеса используя Egov и ЭЦП. Мошенники не смогут создать аккаунт."
            }
          </Typography>
        </div>
        
        {isLoading && <Loader />}
      </main>
      
      <NavMenuOrg/>
    </div>
    
  );
};
