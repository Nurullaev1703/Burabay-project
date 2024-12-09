import { FC, HTMLAttributes } from "react";
import headerBg from "../app/icons/backgroundHeader.png"

export const Header: FC<HTMLAttributes<HTMLElement>> = function Header(props) {
  return (
    <header
      className={`relative z-50 max-w-fullWidth h-24`} //FIXME: высоту хедера пофикстить
    >
      <div className="absolute top-0 left-0 w-full ">
        <img src={headerBg} className="rounded-bl-3xl object-cover w-full h-full bg-blue200"/>
      </div>
      <div className={`absolute top-0 left-0 z-10 container mx-auto w-full h-full px-4 ${props.className}`}>{props.children}</div>
    </header>
  );
};