import { FC } from "react";

interface SVGIconProps {
  strokeColor?: string;
  fillColor?: string;
  fillColorMask?: string;
}

export const Booking: FC<SVGIconProps> = function Booking({
  strokeColor = "#999999",
  fillColor = "#FFFFFF"
}) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 25 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M19.5 4H5.5C4.39543 4 3.5 4.89543 3.5 6V20C3.5 21.1046 4.39543 22 5.5 22H19.5C20.6046 22 21.5 21.1046 21.5 20V6C21.5 4.89543 20.6046 4 19.5 4Z"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.5 2V6"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 2V6"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.5 10H21.5"
        stroke={strokeColor}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="4"
        y="10.3"
        width="17"
        height="11.2"
        fill={fillColor}
        rx="1"
      />
    </svg>
  );
};
