import { FC, HTMLAttributes } from "react";
import { COLORS_BACKGROUND, COLORS_TEXT } from "../shared/ui/colors";
import { Typography } from "../shared/ui/Typography";

interface Props extends HTMLAttributes<HTMLDivElement> {
  city: string;
  address: string;
  number: string;
}
export const BranchCard: FC<Props> = function BranchCard(props) {
  return (
    <div
      className={`w-[167px] p-2 rounded-[8px] ${COLORS_BACKGROUND.light200} ${props.className}`}
    >
      <div
        className={`w-full h-[114px] ${COLORS_BACKGROUND.accent100} mb-[10px]`}
      ></div>
      <Typography
        size={16}
        weight={400}
        align="left"
        color={COLORS_TEXT.totalBlack}
      >
        {props.city}
      </Typography>
      <Typography
        size={14}
        weight={400}
        align="left"
        color={COLORS_TEXT.secondary}
      >
        {props.address}
      </Typography>
      <Typography
        size={14}
        weight={400}
        align="left"
        color={COLORS_TEXT.secondary}
      >
        {props.number}
      </Typography>
    </div>
  );
};
