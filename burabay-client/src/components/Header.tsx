import { FC, HTMLAttributes } from "react";
import headerBg from "../app/icons/backgroundHeader.png"

export const Header: FC<HTMLAttributes<HTMLElement>> = function Header(props) {
  return (
    <header
      className={`max-w-fullWidth relative`} //FIXME: высоту хедера пофикстить
    >
      <div className="relative top-0 left-0 w-full pt-[120px]">
        <img src={headerBg} className="absolute top-0 left-0 rounded-bl-3xl object-cover w-full h-full bg-blue200"/>
      </div>
      <div className={`absolute top-0 left-0 mx-auto w-full h-full py-2 px-4 ${props.className}`}>{props.children}</div>
    </header>
  );
};