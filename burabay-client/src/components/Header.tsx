import { FC, HTMLAttributes } from "react";
import { COLORS_BACKGROUND } from "../shared/ui/colors";

export const Header: FC<HTMLAttributes<HTMLElement>> = function Header(props) {
  return (
    <header
      className={`w-full p-4 ${COLORS_BACKGROUND.white}`}
    >
      <div className={`mx-auto ${props.className}`}>
        {props.children}
      </div>
    </header>
  );
};
