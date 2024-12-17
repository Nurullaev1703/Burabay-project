import { ROLE_TYPE } from "../../auth/model/auth-model";

export interface Organization {
  address: string;
  description: string;
  id: string;
  imgUrl: string;
  isConfirmed: boolean;
  name: string;
  rating: number;
  reviewCount: number;
  siteUrl: string;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  isEmailConfirmed: boolean;
  organization: Organization;
  phoneNumber: string;
  picture: string;
  role: ROLE_TYPE;
}
