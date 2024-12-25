import { FC } from "react";

interface SVGIconProps {
  strokeColor?: string;
  fillColor?: string;
  fillColorMask?: string;
}

export const Main: FC<SVGIconProps> = function Main({
  strokeColor = "#999999",
  fillColor = "#FFFFFF",
}) {
    return (
        <svg width="25" height="24" viewBox="0 0 25 24" fill={fillColor} xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9334 1.25905L1.98352 9.39984C1.51925 9.7797 1.25 10.3479 1.25 10.9478V11.5C1.25 12.3284 1.92157 13 2.75 13H3.25L3.25 21C3.25 22.1046 4.14543 23 5.25 23H8.25C8.80228 23 9.25 22.5523 9.25 22V16C9.25 15.4477 9.69772 15 10.25 15H14.25C14.8023 15 15.25 15.4477 15.25 16V22C15.25 22.5523 15.6977 23 16.25 23H19.25C20.3546 23 21.25 22.1046 21.25 21V13H21.75C22.5784 13 23.25 12.3284 23.25 11.5V10.9478C23.25 10.3479 22.9807 9.7797 22.5165 9.39984L12.5666 1.25905C12.3824 1.10836 12.1176 1.10836 11.9334 1.25905Z" stroke={strokeColor} strokeWidth="1.6"/>
        </svg>
    )
}
