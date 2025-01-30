export enum PaymentType {
  CASH = 'cash',
  ONLINE = 'online',
}

export enum BookingStatus {
  IN_PROCESS = 'в процессе',
  PAYED = 'оплачено',
  CANCELED = 'отменено',
}

export interface BookingFilter {
  canceled?: boolean;
  onSidePayment?: boolean;
  onlinePayment?: boolean;
}
