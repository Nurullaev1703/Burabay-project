
import { ROLE_TYPE } from "../../auth/model/auth-model";
import { Product } from "../../subcategory/types/subcategory-types";
import { PositionType } from "../employees/model/employee-type";

export interface Address {
  id: string;
  region: string;
  city: string;
  street: string;
}

export interface Organization {
  id: string;
  imgUrl: string;
  name: string;
  type: string;
  identityNumber: string;
  rating: number;
  reviewCount: number;
}

export interface Requisities {
  id: string;
  bankName: string;
  identityCode: string;
  bankCode: string;
  benCode: string;
}

export interface AuthHistory {
  id: string;
  date: Date;
  point: string;
  managerName: string;
}
export interface Filial {
  CashbackAccount: CashBack[];
  id: string;
  name: string;
  image: string;
  employees: Employee[];
  products: Product[]
  organization: Organization
  minSum:number
}

export interface CashBack {
  id: string;
  amount: number;

}

export interface Employee {
  email: string;
  fullName: string;
  id: string;
  iin: string;
  permissions: Permission;
  phoneNumber: string;
  position: string;
  role: string;
}

interface Permission {
  createOrders: boolean;
  signContracts: boolean;
  editProducts: boolean;
  editEmployees: boolean;
}

export interface ClientManager {
  email: string;
  fullName: string;
  id: string;
  iin: string;
  permissions: Permission;
  phoneNumber: string;
  position: string;
  role: string;
}

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  iin: string;
  address: Address | null;
  phoneNumber: string;
  position: PositionType;
  organization: Organization | null;
  requisities: Requisities[] | null;
  role: ROLE_TYPE;
  authHistories: AuthHistory[] | null;
  filial: Filial | null;
  deliveryAddress?: string;
  clientManager: ClientManager;
}

export interface Bank {
  name: string;
  identityCode: string;
}

export const banks: Bank[] = [
  {
    name: "АО KASPI BANK",
    identityCode: "KZ12345A67891011123",
  },
  {
    name: "АО JUSAN BANK",
    identityCode: "KZ12345A67891011122",
  },
];
