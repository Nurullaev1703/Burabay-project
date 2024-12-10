import  { FC } from 'react';

interface SVGIconProps {
    strokeColor?: string;
    fillColor?: string;
}
export const Map: FC<SVGIconProps> = function Map({
    strokeColor = "#999999",
    fillColor = "#FFFFFF"
}) {
    return (
<svg width="24" height="24"
 viewBox="0 0 24 24"
  fill={fillColor}
   xmlns="http://www.w3.org/2000/svg">
<path d="M20.7969 9.79688C20.7969 16.0606 13.5907 21.7637 12.0747 22.8943C11.9062 23.0199 11.6875 23.0199 11.5191 22.8943C10.0031 21.7637 2.79688 16.0606 2.79688 9.79688C2.79688 4.82631 6.82631 0.796875 11.7969 0.796875C16.7674 0.796875 20.7969 4.82631 20.7969 9.79688Z"
 stroke={strokeColor}
  strokeWidth="1.6"/>
<circle cx="11.7969" cy="9.79688" r="4" stroke={strokeColor} strokeWidth="1.6" fill="white"/>
</svg>
    )
}


