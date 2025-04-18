import { ROLE_TYPE } from '../../users/types/user-types';

export interface UsersFilter {
  name?: string;
  role?: ROLE_TYPE;
  status?: UsersFilterStatus;
  // skip?: number;
  // take?: number;
  page?: number;
}

export enum UsersFilterStatus {
  BAN = 'заблокирован',
  WAITING = 'ожидает подтверждения',
}
