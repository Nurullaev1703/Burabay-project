import { ROLE_TYPE } from "../../auth/model/auth-model";

export interface Organization {
  address: string;
  description: string;
  id: string;
  imgUrl: string;
  isConfirmed: boolean;
  isConfirmCanceled: boolean;
  isConfirmWating: boolean;
  name: string;
  rating: number;
  reviewCount: number;
  siteUrl: string;
  regCouponPath: string;
  ibanDocPath: string;
  orgRulePath: string;
  bin: string;
  email: string;
  isBanned: boolean;
}

export interface Profile {
  id: string,
  fullName: string;
  email: string;
  isEmailConfirmed: boolean;
  organization: Organization;
  phoneNumber: string;
  picture: string;
  role: ROLE_TYPE;
  isBanned: boolean
}
