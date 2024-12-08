// TODO Создать Интерфейсы для всех категорий и заполнить поля
interface IChillPlaceDetails {
  type: 'chillPlace';
}

interface ILivingPlaceDetails {
  type: 'livingPlace';
  rooms: number;
  bathrooms: number;
  wifi: boolean;
}

interface ISupplyDetails {
  type: 'supply';
}

export type AdDetailsType = IChillPlaceDetails | ILivingPlaceDetails | ISupplyDetails;
