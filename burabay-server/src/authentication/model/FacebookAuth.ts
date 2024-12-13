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
  status: string;
}
interface FacebookPictureData {
  data: {
    height: number;
    width: number;
    url: string;
  };
}
