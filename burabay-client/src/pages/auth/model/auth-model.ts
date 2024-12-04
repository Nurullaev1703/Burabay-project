// роли для пользователей сайта
export enum ROLE_TYPE{
    CLIENT = "клиент",
    PROVIDER = "поставщик"
}
// данные, приходящие с API для выявления IP пользователя
export interface IpDataType{
    ipString: string,
    ipType:string
}
// данные для определения местоположения
export interface PointDataType{
    region:string,
    city:string
}