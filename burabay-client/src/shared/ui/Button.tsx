import { ButtonHTMLAttributes, FC } from "react";
import { COLORS_BACKGROUND, COLORS_BORDER, COLORS_TEXT } from "./colors";
import fingerprint from "../../app/icons/fingerprint.svg";

// виды кнопок в приложении
type ButtonType =
  | "default"
  | "border"
  | "dark"
  | "transparent"
  | "error"
  | "red"
  | "fingerprint";

// выбор вида кнопки
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: ButtonType;
}

export const Button: FC<Props> = function Button(props) {
  // настройки кнопки по умолчанию
  const { mode = "default", ...rest } = props;
  const hover = `hover:bg-main300`;
  const active = `active:bg-main100`;

  let bgButton = `${COLORS_BACKGROUND.main200} 
        ${hover}
        ${active}`;
  let textColor = COLORS_TEXT.alternative;

  // стили для темной кнопки
  if (mode == "dark") {
    bgButton = COLORS_BACKGROUND.context100;
  }
  // стили для кнопки с границами
  else if (mode == "border") {
    bgButton = `border-2 ${COLORS_BORDER.main100} ${hover}
        ${active}`;
    textColor = `${COLORS_TEXT.primary} hover:text-alternate active:text-alternate`;
  } else if (mode == "transparent") {
    bgButton = `transparent`;
    textColor = COLORS_TEXT.main200;
  } else if (mode == "error") {
    bgButton = COLORS_BACKGROUND.error;
  } else if (mode == "red") {
    bgButton = `transparent`;
    textColor = COLORS_TEXT.error;
  }

  // стили для выключенной кнопки
  if (props.disabled) {
    bgButton = COLORS_BACKGROUND.disabled;
    textColor = COLORS_TEXT.secondary;
  }

  return (
    <button
      {...rest}
      className={`rounded-button py-4 w-full ${bgButton} ${mode == "fingerprint" ? "flex items-center gap-2.5 justify-center" : ""} transition-all font-semibold ${textColor} ${rest.className}`}
    >
      {mode == "fingerprint" && <img src={fingerprint} alt="" />}
      {rest.children}
    </button>
  );
};
