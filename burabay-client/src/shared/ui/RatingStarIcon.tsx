import { FC } from "react";
import { COLORS } from "./colors";

export const StarIcon: FC<{ fill: string }> = ({ fill }) => (
    <svg width="13" height="12" viewBox="0 0 13 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6.38212 0.642578L8.15866 4.16905L12.1314 4.73802L9.25678 7.48146L9.9352 11.3572L6.38212 9.52636L2.82905 11.3572L3.50747 7.48146L0.632812 4.73802L4.60559 4.16905L6.38212 0.642578Z" fill={fill} stroke={COLORS.blue200} strokeWidth="1" />
    </svg>

);