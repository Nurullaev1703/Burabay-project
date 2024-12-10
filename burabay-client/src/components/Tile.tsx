import { FC, HTMLAttributes } from "react";
import { COLORS_TEXT } from "../shared/ui/colors";
import { Typography } from "../shared/ui/Typography";

interface Props extends HTMLAttributes<HTMLDivElement> {
  title: string;
  imgUrl: string;
}

export const Tile: FC<Props> = function Tile(props) {
  return (
    <div
      className={`w-[100%] h-[74px] bg-[#F4F4F4] rounded-[12px] grid items-baseline text-start relative overflow-hidden ${props.className}`}
    >
      <img
        src={props.imgUrl}
        alt={props.title}
        className="absolute w-[70%] h-[100%] right-0 bottom-0 object-cover"
      />
      <Typography
        size={14}
        weight={600}
        color={COLORS_TEXT.totalBlack}
        className="z-10 p-2"
      >
        {props.title}
      </Typography>
    </div>
  );
};
