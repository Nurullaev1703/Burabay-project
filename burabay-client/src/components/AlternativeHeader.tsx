import { FC, HTMLAttributes } from "react";
import headerBg from "../app/icons/backgroundHeader.png"

interface Props extends HTMLAttributes<HTMLElement>{
  isMini?: boolean
}
export const AlternativeHeader: FC<Props> = function AlternativeHeader(props) {
  return (
    <header
      className={`max-w-fullWidth relative`} //FIXME: высоту хедера пофикстить
    >
      <div className={`relative top-0 left-0 w-full ${props.isMini ? "pt-[70px]" : "pt-[120px]"} `}>
        <img src={headerBg} className="absolute top-0 left-0 rounded-bl-3xl object-cover w-full h-full bg-blue200"/>
      </div>
      <div className={`absolute top-0 left-0 mx-auto w-full h-full py-2 px-4 ${props.className}`}>{props.children}</div>
    </header>
  );
};