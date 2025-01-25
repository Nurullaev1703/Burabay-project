export enum PaymentType {
  CASH = 'cash',
  ONLINE = 'online',
}

export enum BookingStatus {
  IN_PROCESS = 'в процессе',
  CONFIRMED = 'подтверждено',
  CANCELED = 'отменено',
}

export interface BookingFilter {
  canceled?: boolean;
  onSidePayment?: boolean;
  onlinePayment?: boolean;
}
