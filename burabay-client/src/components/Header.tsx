import { FC, HTMLAttributes } from "react";
import { COLORS_BACKGROUND } from "../shared/ui/colors";

export const Header: FC<HTMLAttributes<HTMLElement>> = function Header(props) {
  return (
    <header
      className={`fixed top-0 left-0 z-50 w-full h-16 p-4 ${COLORS_BACKGROUND.alternative}`}
    >
      <div className={`container mx-auto max-w-[1280px] ${props.className}`}>{props.children}</div>
    </header>
  );
};
