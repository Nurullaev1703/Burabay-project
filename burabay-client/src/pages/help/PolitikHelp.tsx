import { FC } from "react";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import BackIcon from "../../app/icons/back-icon-white.svg"
import { COLORS_TEXT } from "../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import { LanguageButton } from "../../shared/ui/LanguageButton";

interface Props {

}

export const PolitikHelp: FC<Props> = function PolitikHelp() {
  const {t} = useTranslation()
  return (
    <main>
    <AlternativeHeader>
    <div className="flex justify-between items-center">
      <IconContainer align="start" action={() => history.back()}>
        <img src={BackIcon} alt="" />
      </IconContainer>
      <Typography size={20} weight={700} color={COLORS_TEXT.white}>
        {t("politikHelp")}
      </Typography>
      <LanguageButton />
    </div>
  </AlternativeHeader>

  <div>
  <div className="bg-white p-6 rounded-md shadow-lg max-w-md mx-auto">
  <Typography className="text-black">Обновлено: [Дата]</Typography>
  <Typography className=" mt-4 mb-2">[Название приложения]</Typography>
  <Typography className="text-black">
    уважает вашу конфиденциальность и стремится защищать ваши персональные данные.
    Настоящая Политика конфиденциальности объясняет, какие данные мы собираем, как мы их используем и защищаем.
  </Typography>

  <div className="mt-4">
    <Typography className="">1. Какие данные мы собираем:</Typography>
    <ul className="list-disc list-inside text-black mt-2 space-y-1">
      <li>Личные данные: имя, email, номер телефона.</li>
      <li>Данные для бронирований: даты поездки, предпочтения.</li>
      <li>Техническая информация: IP-адрес, данные устройства, файлы cookie.</li>
    </ul>
  </div>

  <div className="mt-4">
    <Typography className="">2. Как мы используем данные:</Typography>
    <ul className="list-disc list-inside text-black mt-2 space-y-1">
      <li>Для обработки бронирований и предоставления услуг.</li>
      <li>Для улучшения работы приложения и поддержки пользователей.</li>
      <li>Для рассылки актуальных предложений (с возможностью отказа).</li>
    </ul>
  </div>

  <div className="mt-4">
    <Typography className="">3. Безопасность данных:</Typography>
    <p className="text-black mt-2">
      Мы принимаем все необходимые меры для защиты ваших данных от несанкционированного доступа,
      изменения или утраты.
    </p>
  </div>

  <div className="mt-4">
    <Typography className="">4. Передача данных третьим лицам:</Typography>
    <Typography className="text-black mt-2">
      Ваши данные могут быть переданы партнерам (например, отелям или организаторам активностей) только для выполнения бронирования.
      Мы не продаем ваши данные.
    </Typography>
  </div>

  <div className="mt-4">
    <Typography className="">5. Ваши права:</Typography>
    <Typography className="text-black mt-2">
      Вы можете запросить доступ к своим данным, их удаление или изменение, обратившись в нашу службу поддержки.
    </Typography>
  </div>

  <Typography className="text-black mt-4">
    Подробную информацию смотрите в полном тексте Политики конфиденциальности [ссылка].
  </Typography>
</div>

  </div>
  </main>
  )
};