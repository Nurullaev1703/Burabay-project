// роли для пользователей сайта

export enum ROLE_TYPE {
  TOURIST = "турист",
  BUSINESS = "бизнес",
  ADMIN = "admin",
}

export interface FacebookAuthData {
  accessToken: string;
  data_access_expiration_time: number;
  email: string;
  expiresIn: number;
  graphDomain: string;
  id: string;
  name: string;
  picture: FacebookPictureData;
  signedRequest: string;
  userID: string;
  status: string
}
interface FacebookPictureData {
  data: {
    height: number;
    width: number;
    url: string;
  };
}
export interface GoogleAuthType {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  sub: string;
}
