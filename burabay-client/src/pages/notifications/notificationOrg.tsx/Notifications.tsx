import  { FC } from 'react';
import { Typography } from '../../../shared/ui/Typography';
import { useTranslation } from 'react-i18next';
import { NavMenuOrg } from '../../../shared/ui/NavMenuOrg';
import bacground from "../../../app/icons/announcements/bacground.png"
import reviews from "../../../app/icons/announcements/reviews.svg"

interface Props {

}

export const Notifications: FC<Props> = function Notifications() {
  const {t} = useTranslation()
  return (
<div className="min-h-screen relative">
  <img className="absolute inset-0 w-full h-full object-cover z-0" src={bacground} alt="" />
  
  {/* <div className="relative z-10 flex justify-center items-center min-h-screen">
    <div className="bg-white shadow-lg rounded-lg p-6 w-[90%] max-w-md mx-auto">
      <img src={reviews} className="w-40 h-40 mb-8 mx-auto" alt="" />
      <div className="flex flex-col justify-center items-center gap-2 mb-12">
        <Typography size={18} weight={500}>
          {t("notificationsNav")}
        </Typography>
      </div>
    </div>
  </div> */}
 <div className="relative z-10 min-h-screen py-4 px-4 mb-20">
      {/* Дата уведомлений */}
      <Typography
        size={14}
        className="text-center text-gray-500 font-medium mb-4"
      >
        24.03.2024
      </Typography>

      {/* Уведомление 1 */}
      <div className="bg-white rounded-lg p-4 shadow-md mb-4 flex">
        <div className="w-1 bg-yellow-500 mr-3"></div>
        <div>
          <Typography size={16} className="font-semibold text-gray-900 mb-2">
            Жалоба на рассмотрении
          </Typography>
          <Typography size={14} className="text-gray-700 leading-5">
            Вами была отправлена жалоба на отзыв от 22.03.2024 от пользователя:
            Анна. Текст отзыва: "Ужасное место, весь отдых не было
            электричества." Комментарий к жалобе "Клевета, был у нас свет".
          </Typography>
          <Typography size={12} className="text-gray-400 mt-2 text-right">
            10:20
          </Typography>
        </div>
      </div>

      {/* Уведомление 2 */}
      <div className="bg-white rounded-lg p-4  mb-4 flex">
        <div className="w-2 bg-red mr-3 rounded-lg h-auto"></div>
        <div>
          <Typography size={16} className="font-semibold text-gray-900 mb-2">
            Жалоба отклонена
          </Typography>
          <Typography size={14} className="text-gray-700 leading-5">
            Вами была отправлена жалоба на отзыв от 22.03.2024 от пользователя:
            Анна. Текст отзыва: "Ужасное место, весь отдых не было
            электричества." Комментарий к жалобе "Клевета, был у нас свет".
          </Typography>
          <Typography size={12} className="text-gray-400 mt-2 text-right">
            10:20
          </Typography>
        </div>
      </div>

      {/* Уведомление 3 */}
      <div className="bg-white rounded-lg p-4 shadow-sm mb-4 flex">
        <div className="w-1 bg-red-500 mr-3"></div>
        <div>
          <Typography size={16} className="font-semibold text-gray-900 mb-2">
            Объявление удалено
          </Typography>
          <Typography size={14} className="text-gray-700 leading-5">
            Экскурсия "Бурабайские ископаемые" нарушает условия пользования
            сервисом.
          </Typography>
          <Typography
            size={14}
            className="text-blue-500 font-medium mt-2 cursor-pointer"
          >
            Ознакомиться с правилами пользования
          </Typography>
          <Typography size={12} className="text-gray-400 mt-2 text-right">
            10:20
          </Typography>
        </div>
      </div>

      {/* Уведомление 4 */}
      <div className="bg-white rounded-lg p-4 shadow-sm flex">
        <div className="w-1 bg-green-500 mr-3"></div>
        <div>
          <Typography size={16} className="font-semibold text-gray-900 mb-2">
            Жалоба удовлетворена. Отзыв удален
          </Typography>
          <Typography size={14} className="text-gray-700 leading-5">
            Вами была отправлена жалоба на отзыв от 22.03.2024 от пользователя:
            Анна. Текст отзыва: "Ужасное место, весь отдых не было
            электричества." Комментарий к жалобе "Клевета, был у нас свет".
          </Typography>
          <Typography size={12} className="text-gray-400 mt-2 text-right">
            10:20
          </Typography>
        </div>
      </div>
    </div>
  
  
  <NavMenuOrg />
</div>


)
};