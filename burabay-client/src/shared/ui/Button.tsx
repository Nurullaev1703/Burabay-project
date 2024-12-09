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
  | "fingerprint"
  | "loading";

// выбор вида кнопки
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  mode?: ButtonType;
  loading?: boolean;
}

export const Button: FC<Props> = function Button(props) {
  // настройки кнопки по умолчанию
  const { mode = "default", loading= false , ...rest } = props;
  const active = `active:bg-blue100`;

  let bgButton = `bg-blue200
        ${active}`;
  let textColor = COLORS_TEXT.alternative;

  // стили для темной кнопки
  if (mode == "dark") {
    bgButton = COLORS_BACKGROUND.context100;
  }
  // стили для кнопки с границами
  else if (mode == "border") {
    bgButton = `border-[3px] border-blue200
        ${active}`;
    textColor = `${COLORS_TEXT.primary} hover:text-alternate active:text-alternate`;
  } else if (mode == "transparent") {
    bgButton = `transparent`;
    textColor = COLORS_TEXT.blue200;
  } else if (mode == "error") {
    bgButton = COLORS_BACKGROUND.red;
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
      className={`rounded-button flex justify-center items-center py-4 w-full ${bgButton} ${mode == "fingerprint" ? "flex items-center gap-2.5 justify-center" : ""} transition-all font-semibold ${textColor} ${rest.className}`}
      disabled={loading || props.disabled}>
        {loading ? (
                  <svg
                  className="animate-spin h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.042.637 3.923 1.708 5.291l2.292-2.292z"
                  ></path>
                </svg>
        ) : (
          <>
              {mode == "fingerprint" && <img src={fingerprint} alt="" />}
              {rest.children}
          </>
        )}  
    </button>

  );
};
