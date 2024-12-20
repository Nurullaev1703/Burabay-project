import { ButtonHTMLAttributes, FC } from "react";
import { COLORS, COLORS_BACKGROUND, COLORS_TEXT } from "./colors";
import fingerprint from "../../app/icons/fingerprint.svg";
import { RotatingLines } from "react-loader-spinner";

// виды кнопок в приложении
type ButtonType =
  | "default"
  | "border"
  | "dark"
  | "transparent"
  | "error"
  | "red"
  | "fingerprint"
  | "loading"
  | "hidden";

// выбор вида кнопки
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: ButtonType;
  loading?: boolean;
}

export const Button: FC<Props> = function Button(props) {
  // настройки кнопки по умолчанию
  const { mode = "default", loading = false, ...rest } = props;
  const active = `active:bg-blue300`;

  let bgButton = `bg-blue200
        ${active}`;
  let textColor = COLORS_TEXT.white;

  // стили для темной кнопки
  if (mode == "dark") {
    bgButton = COLORS_BACKGROUND.gray100;
  }
  // стили для кнопки с границами
  else if (mode == "border") {
    bgButton = `border-[3px] border-blue200
        ${active}`;
    textColor = `${COLORS_TEXT.blue200} active:text-blue300`;
  } else if (mode == "transparent") {
    bgButton = `transparent`;
    textColor = COLORS_TEXT.blue200;
  } else if (mode == "error") {
    bgButton = COLORS_BACKGROUND.red;
  } else if (mode == "red") {
    bgButton = `transparent`;
    textColor = COLORS_TEXT.red;
  }
  else if(mode == "hidden"){
    bgButton = `transparent`;
    textColor = "text-transparent"
  }

  // стили для выключенной кнопки
  if (props.disabled) {
    bgButton = COLORS_BACKGROUND.gray100;
    textColor = COLORS_TEXT.white;
  }

  return (
    <button
      {...rest}
      className={`rounded-button flex justify-center items-center py-4 w-full ${bgButton} ${mode == "fingerprint" ? "flex items-center gap-2.5 justify-center" : ""} ${mode !== "hidden" && "transition-all"} font-semibold ${textColor} ${rest.className}`}
      disabled={loading || props.disabled}
    >
      {loading ? (
        <RotatingLines strokeColor={COLORS.white} width="24px"/>
      ) : (
        <>
          {mode == "fingerprint" && <img src={fingerprint} alt="" />}
          {rest.children}
        </>
      )}
    </button>
  );
};
