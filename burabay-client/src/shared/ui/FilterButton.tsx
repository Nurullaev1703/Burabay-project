import { FC, HTMLAttributes } from "react";

interface Props extends HTMLAttributes<HTMLButtonElement> {
  isActive: boolean;
}

export const FilterButton: FC<Props> = function FilterButton(props) {
  return (
    <button
      className={`py-3 w-[40%] rounded-[49px] ${props.isActive ? "bg-main200" : "bg-alternate"} flex justify-center items-center gap-2 transition-colors ${props.className}`}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
};
