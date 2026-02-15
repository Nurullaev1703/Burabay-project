import { ROLE_TYPE } from '../../users/types/user-types';

export interface UsersFilter {
  searchQuery?: string; // Универсальный поиск по email, phone, name организации
  role?: ROLE_TYPE;
  status?: UsersFilterStatus;
  page?: number;
  take?: number; // Количество записей на странице (10, 25, 50, 100)
}

export enum UsersFilterStatus {
  BAN = 'заблокирован',
  WAITING = 'ожидает подтверждения',
}
