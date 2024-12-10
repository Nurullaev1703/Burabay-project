// роли для пользователей сайта

// данные, приходящие с API для выявления IP пользователя
export interface IpDataType{
    ipString: string,
    ipType:string
}
// данные для определения местоположения
export interface PointDataType{
    region:string,
    city:string

export enum ROLE_TYPE {
  TOURIST = "турист",
  BUSINESS = "бизнес",
}