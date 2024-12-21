import { FC } from "react";
import { RotatingLines } from "react-loader-spinner";
import { COLORS } from "../shared/ui/colors";

// загрузчик на весь экран на время выполнения запросов
export const Loader: FC = function Loader() {
  return (
    <div className="flex flex-col h-screen justify-center items-center fixed top-0 left-0 w-full bg-alternate z-50 bg-totalBlack bg-opacity-40 overflow-hidden">
      <RotatingLines strokeColor={COLORS.white} width="48px"/>
    </div>
  );
};
