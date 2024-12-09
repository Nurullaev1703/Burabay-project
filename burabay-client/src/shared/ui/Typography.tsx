import { FC, HTMLAttributes } from "react";
import { COLORS_TEXT } from "./colors";

// типы для используемых параметров

type TEXT_SIZE = 28 | 24 | 22 | 20 | 18 | 16 | 14 | 12 | 10;

type TEXT_WEIGHT = 800 | 700 | 600 | 500 | 400 | 300;

type TEXT_ALIGN = "left" | "center" | "right";

// соответствие типов и значений
const STYLE_SIZE = {
  28: "text-[28px]",
  24: "text-[24px]",
  22: "text-[22px]",
  20: "text-[20px]",
  18: "text-[18px]",
  16: "text-[16px]",
  14: "text-[14px]",
  12: "text-[12px]",
  10: "text-[10px]",
};

const STYLE_WEIGHT = {
  800: "font-extrabold",
  700: "font-bold",
  600: "font-semibold",
  500: "font-medium",
  400: "font-normal",
  300: "font-light",
};

const STYLE_ALIGN = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
};

// перечисление параметров, возможных для типографии
interface TypographyProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: TEXT_SIZE;
  weight?: TEXT_WEIGHT;
  color?: string;
  align?: TEXT_ALIGN;
}

export const Typography: FC<TypographyProps> = function Typography(props) {
  // значения для типографии по умолчанию
  const {
    size = 16,
    weight = 400,
    color = COLORS_TEXT.totalBlack,
    align = "left",
    ...rest
  } = props;

  // формирование стилей для типографии
  const styles = `${STYLE_SIZE[size]} ${STYLE_WEIGHT[weight]} ${color} ${STYLE_ALIGN[align]} ${props?.className} leading-none`;

  //формирование типографии на выходе
  return (
    <p {...rest} className={styles}>
      {props.children}
    </p>
  );
};
