import  { FC } from 'react';



interface SVGIconProps {
  strokeColor?: string;
  fillColor?: string;
}

export const ProfileIcon: FC<SVGIconProps> = ({
  strokeColor = "#999999", 
  fillColor = "#FFFFFF"
}) => {
  return (
    <svg width="24" height="24" viewBox="0 0 25 25" xmlns="http://www.w3.org/2000/svg">

      <circle 
        cx="12.7969" 
        cy="12.7969" 
        r="11.25" 
        stroke={strokeColor} 
        strokeWidth="1.5"
        fill={fillColor}
      />
            <path 
        d="M16.7969 10.7969C16.7969 13.006 15.006 14.7969 12.7969 14.7969C10.5877 14.7969 8.79688 13.006 8.79688 10.7969C8.79688 8.58774 10.5877 6.79688 12.7969 6.79688C15.006 6.79688 16.7969 8.58774 16.7969 10.7969Z" 
        stroke={strokeColor} 
        strokeWidth="1.5"
        fill={"#FFFFFF"}
      />
      <path 
        d="M19.7969 19.2969C19.7969 21.7822 16.6629 23.7969 12.7969 23.7969C8.93088 23.7969 5.79688 21.7822 5.79688 19.2969C5.79688 16.8116 8.93088 14.7969 12.7969 14.7969C16.6629 14.7969 19.7969 16.8116 19.7969 19.2969Z" 
        stroke={strokeColor} 
        strokeWidth="1.5"
        fill={"#FFFFFF"}
      />
    </svg>
  );
};





