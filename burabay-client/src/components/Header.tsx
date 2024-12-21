import { FC, HTMLAttributes } from "react";
import { COLORS_BACKGROUND } from "../shared/ui/colors";

interface HeaderProps extends HTMLAttributes<HTMLElement> {
  pt?: string; 
  pb?: string; 
  pl?: string; 
  pr?: string; 
}

export const Header: FC<HeaderProps> = function Header({
  pt = "pt-4", 
  pb = "pb-4",  
  pl = "pl-4",  
  pr = "pr-4",  
  className,
  children,
  ...props
}) {
  return (
    <header className={`w-full ${pt} ${pb} ${pl} ${pr} ${COLORS_BACKGROUND.white}`}>
      <div className={`mx-auto ${className}`} {...props}>
        {children}
      </div>
    </header>
  );
};

