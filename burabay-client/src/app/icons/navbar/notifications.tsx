import { FC } from "react";

interface SVGIconProps {
    strokeColor?: string;
    fillColor?: string
}

export const Notifications: FC<SVGIconProps> = function Notifications({
    strokeColor = "#999999",
    fillColor = "#FFFFFF"
}) {
    return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
<path  d="M11.7969 22.7969C14.006 22.7969 15.7969 21.006 15.7969 18.7969H7.79688C7.79688 21.006 9.58774 22.7969 11.7969 22.7969Z" stroke={strokeColor} strokeWidth="1.6"/>
<path fill={fillColor} d="M21.3285 18.7969H2.26525C1.45429 18.7969 0.796875 18.1395 0.796875 17.3285C0.796875 16.6748 1.08722 16.0549 1.58939 15.6364L3.07724 14.3966C3.53323 14.0166 3.79688 13.4537 3.79688 12.8601V8.79688C3.79688 4.3786 7.3786 0.796875 11.7969 0.796875C16.2152 0.796875 19.7969 4.3786 19.7969 8.79688V12.8601C19.7969 13.4537 20.0605 14.0166 20.5165 14.3966L22.0044 15.6364C22.5065 16.0549 22.7969 16.6748 22.7969 17.3285C22.7969 18.1395 22.1395 18.7969 21.3285 18.7969Z" stroke={strokeColor} strokeWidth="1.6" strokeLinecap="round"/>
</svg>
    )
}



