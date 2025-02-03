import { ROLE_TYPE } from 'src/users/types/user-types';

export interface UsersFilter {
  name?: string;
  role?: ROLE_TYPE;
  status?: UsersFilterStatus;
}

export enum UsersFilterStatus {
  BAN = 'заблокирован',
  WAITING = 'ожидает подтверждения',
}
