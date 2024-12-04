import { apiService } from "../../../services/api/ApiService";
import {
  firstAuthData,
  getDocumentsType,
  qrCodeType,
  userDataType,
} from "./types";

// получение QR с ссылками на мобильные Egov
export const getQrCode = async () => {
  return apiService.post<qrCodeType>({
    url: "https://sigex.kz/api/egovQr",
    dto: {
      description: "Авторизация",
    },
  });
};
// первый этап авторизации - получение кода для документов
export const firstAuth = async () => {
  return apiService.post<firstAuthData>({
    url: "https://sigex.kz/api/auth",
    dto: {},
  });
};
// получение подписи после подписания в приложении
export const getDocuments = async (url: string) => {
  return apiService.get<getDocumentsType>({
    url: url,
  });
};

interface DocumentTextType {
  nameRu: string;
  nameKz: string;
  nameEn: string;
}

// отправка документов на подпись для авторизации
export const postSignResponse = async (
  url: string,
  nonce: string,
  text: DocumentTextType = {
    nameRu: "Аутентификация",
    nameKz: "Аутентификация",
    nameEn: "Authentication",
  }
) => {
  return apiService.post({
    url: url,
    dto: {
      documentsToSign: [
        {
          id: 1,
          nameRu: text.nameRu,
          nameKz: text.nameKz,
          nameEn: text.nameEn,
          meta: [],
          document: {
            file: {
              data: nonce,
              mime: "",
            },
          },
        },
      ],
      signMethod: "CMS_SIGN_ONLY",
    },
  });
};
// получение результата подписания с данными пользователя
export const secondAuth = async (nonceData: string, signatureData: string) => {
  return apiService.post<userDataType>({
    url: "https://sigex.kz/api/auth",
    dto: {
      nonce: nonceData,
      signature: signatureData,
    },
  });
};

export const getName = (authData: userDataType): string => {
  return (
    authData.subject.split(",").find((item) => item.includes("CN="))?.replace("CN=", "") || ""
  );
};
export const getOrganizationName = (authData: userDataType): string => {
  const orgname = authData.subject.split(",").find((item) => item.includes("O="))?.replace("O=", "") || ""
  const regex = /"([^"]+)"/;
  const match = orgname.match(regex);

  if (match) {
    const name = match[1];
    return name
  } else {
    return "";
  }
};
export const getBusinessId = (authData: userDataType): string => {
  if(authData.subject.split(",").find((item) => item.includes("SERIALNUMBER="))){
    return authData.subject
    .split(",")
    .find((item) => item.includes("SERIALNUMBER="))
    ?.replace("SERIALNUMBER=IIN", "") || ""
  }
  else if(authData.subject.split(",").find((item) => item.includes("IIN="))){
    return authData.subject
    .split(",")
    .find((item) => item.includes("IIN="))
    ?.replace("IIN=", "") || ""
  }
  return "";
};
