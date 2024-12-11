// роли для пользователей сайта

export enum ROLE_TYPE {
  TOURIST = "турист",
  BUSINESS = "бизнес",
}

export interface GoogleAuthData{
    email: string,
    name:string, 
    picture: string
}

export interface FacebookAuthData {
  email: string;
  name: string;
  image: FacebookPictureData;
}
interface FacebookPictureData{
    data:{
        height: number,
        width: number,
        url: string
    }
}