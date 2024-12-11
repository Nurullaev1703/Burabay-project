export interface GoogleAuthType {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  picture: string;
  sub: string;
}

export interface GoogleAccessToken{
    accessToken: string
}