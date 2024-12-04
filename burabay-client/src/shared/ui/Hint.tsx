import { FC, HTMLAttributes } from "react";
import { Typography } from "./Typography";
import { COLORS_BACKGROUND, COLORS_TEXT } from "./colors";

type TEXT_ALIGN = "left" | "center" | "right";
type HINT_MODE = "default" | "error"
// поступающий текст для отображения подсказки
interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  align?: TEXT_ALIGN;
  mode?: HINT_MODE;
}

export const Hint: FC<Props> = function Hint(props) {
  const { title = "", align = "left", mode = "default" } = props;
  const bgColor = mode == "error" ? COLORS_BACKGROUND.error : COLORS_BACKGROUND.accent100
  const textColor = mode == "error" ? COLORS_TEXT.alternative : COLORS_TEXT.primary
  return (
    <div
      {...props}
      className={`rounded-button p-3 w-full ${bgColor} relative ${props.className}`}
    >
      <Typography className={`text-${align}`} color={textColor}>{title}</Typography>
    </div>
  );
};
