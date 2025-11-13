import { FC } from "react";
import { RotatingLines } from "react-loader-spinner";
import { COLORS } from "../shared/ui/colors";
import { useTranslation } from "react-i18next";

// загрузчик на весь экран на время выполнения запросов
export const Loader: FC = function Loader() {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col h-screen justify-center items-center fixed top-0 left-0 w-full bg-alternate z-[9999999999] bg-totalBlack bg-opacity-40 overflow-hidden">
      <RotatingLines strokeColor={COLORS.white} width="48px"/>
      <p className="text-white text-lg mt-4">{t("loading")}</p>
    </div>
  );
};
