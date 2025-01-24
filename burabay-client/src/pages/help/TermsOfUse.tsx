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

export const TermsOfUse: FC<Props> = function TermsOfUse() {
  const {t} = useTranslation();
  return (
    <main>
    <AlternativeHeader isMini>
    <div className="flex justify-between items-center">
      <IconContainer align="start" action={() => history.back()}>
        <img src={BackIcon} alt="" />
      </IconContainer>
      <Typography size={20} weight={700} color={COLORS_TEXT.white}>
        {t("termsUse")}
      </Typography>
     <LanguageButton/>
    </div>
  </AlternativeHeader>
  <div className="p-6 bg-white rounded-md shadow-md max-w-xl mx-auto">
      <Typography size={16} weight={400} className="text-black">
        Обновлено: [Дата]
      </Typography>
      <Typography size={16} weight={400} className="text-black mt-4">
        Добро пожаловать в [Название приложения]. Пользуясь нашим приложением, вы соглашаетесь с нижеприведенными условиями:
      </Typography>

      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black ">
          1. Основные положения:
        </Typography>
        <ul className="list-disc list-inside mt-2">
          <li>
            <Typography size={16} weight={400} className="text-black">
              [Название приложения] предоставляет услуги бронирования отелей и активностей.
            </Typography>
          </li>
          <li>
            <Typography size={16} weight={400} className="text-black">
              Все данные, предоставленные вами, должны быть достоверными.
            </Typography>
          </li>
        </ul>
      </div>

      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
          2. Ответственность:
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
          Мы предоставляем актуальную информацию, но не несем ответственности за изменения, внесенные нашими партнерами (отелями, организаторами активностей).
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
          Пользователь самостоятельно несет ответственность за выбор и корректность бронирований.
        </Typography>
      </div>

      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black ">
          3. Оплаты и отмены:
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
          Условия оплаты и отмены зависят от конкретного поставщика услуги (отеля, организатора). Информация об этом указана перед подтверждением бронирования.
        </Typography>
      </div>

      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black ">
          4. Ограничения использования:
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
          Запрещено использование приложения в незаконных целях или с нарушением прав других пользователей.
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
          Пользователь обязан соблюдать все правила и инструкции, указанные в приложении.
        </Typography>
      </div>

      <div className="mt-4">
        <Typography size={16} weight={400} className="text-black">
          5. Изменения условий:
        </Typography>
        <Typography size={16} weight={400} className="text-black mt-2">
          [Название приложения] оставляет за собой право изменять данные Условия. Изменения вступают в силу с момента их публикации в приложении.
        </Typography>
      </div>

      <Typography size={16} weight={400} className="text-black mt-4">
        С полными условиями вы можете ознакомиться [по ссылке].
      </Typography>
      <Typography size={16} weight={400} className="text-black mt-2">
        Если у вас есть вопросы, свяжитесь с нами через службу поддержки.
      </Typography>
    </div>
    </main>
)
};