// данные приходящие для QrCode
export interface qrCodeType {
  expireAt: number;
  dataURL: string;
  signURL: string;
  eGovMobileLaunchLink: string;
  eGovBusinessLaunchLink: string;
  qrCode: string;
}

// данные приходящие с getDocuments (результат подписания в EgovMobile)
interface dataType {
  data: string;
}
interface fileType {
  file: dataType;
}
interface documentType {
  document: fileType;
}
export interface getDocumentsType {
  documentsToSign: documentType[];
}

// данные с первой авторизации
export interface firstAuthData {
  nonce: string;
}

// данные о пользователе во второй авторизации
interface userDataValues{
    oid:string
    name:string
    valueInB64: boolean
    value: string
}

// данные после второй авторизации
export interface userDataType {
  userId: string;
  businessId: string;
  ca: string;
  subject: string
  subjectStructure: userDataValues[][]
}
