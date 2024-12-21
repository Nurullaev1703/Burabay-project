import { FC } from "react";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../../../shared/ui/colors";
import { Link } from "@tanstack/react-router";
import ArrowRight from "../../../../app/icons/arrow-right.svg";

interface Props {
  price: number;
  priceForChild: number;
  adultNumbers: number;
  kidsNumber: number;
  petsAllowed: boolean;
}

export const CostInfoList: FC<Props> = function CostInfoList({
  price,
  priceForChild,
  adultNumbers,
  kidsNumber,
  petsAllowed,
}) {
  const { t } = useTranslation();
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("ru-RU").format(value) + " ₸";
  };

  return (
    <div className="bg-white p-4 mb-2">
      <h2 className="font-medium text-lg mb-2">{t("cost")}</h2>
      <ul className="flex mb-4">
        <li className="flex flex-col w-44">
          <span className={`text-[#155A77] font-medium text-lg`}>
            {formatPrice(price || 0)}
          </span>
          <span className={`${COLORS_TEXT.gray100} text-sm`}>{t("forAdults")}</span>
        </li>
        <li className="flex flex-col w-44">
          <span className={`text-[#155A77] font-medium text-lg`}>
            {formatPrice(priceForChild)}
          </span>
          <span className={`${COLORS_TEXT.gray100} text-sm`}>
            {t("paymentForKids")}
          </span>
        </li>
      </ul>

      <ul>
        <li className="mb-4">
          <span>Оплата на месте</span>
          <p className={`${COLORS_TEXT.gray100} max-w-72 leading-4 text-sm`}>
            {t("cashOrCard")}
          </p>
        </li>
        <li className="mb-4">
          <span>
            {t("adults") +
              " — " +
              (adultNumbers ? adultNumbers : "без ограничений")}
          </span>
          <p className={`${COLORS_TEXT.gray100} leading-4 text-sm`}>
            {t("maxAdults")}
          </p>
        </li>
        <li className="mb-4">
          <span>
            {t("kids") + " — " + (kidsNumber ? kidsNumber : "без ограничений")}
          </span>
          <p className={`${COLORS_TEXT.gray100} leading-4 text-sm`}>
            {t("maxKids")}
          </p>
        </li>
        {petsAllowed && (
          <li className="mb-4">
            <span>{t("permissionWithAnimals")}</span>
          </li>
        )}
          <li className="py-4">
            <Link className="flex justify-between">
            <span>{t("serviceSchedule")}</span>
            <img src={ArrowRight} alt="Стрелка" />
            </Link>
          </li>
      </ul>
    </div>
  );
};
