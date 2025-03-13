export enum PaymentType {
  CASH = 'cash',
  ONLINE = 'online',
}

export enum BookingStatus {
  IN_PROCESS = 'в процессе',
  CONFIRM = 'подтверждено',
  PAYED = 'оплачено',
  CANCELED = 'отменено',
  DONE = 'исполнено',
}

export interface BookingFilter {
  canceled?: boolean;
  onSidePayment?: boolean;
  onlinePayment?: boolean;
}
