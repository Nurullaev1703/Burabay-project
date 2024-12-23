import  { FC } from 'react';
import { baseUrl } from '../../../services/api/ServerData';

interface Props {
    src: string;
}

export const IconMap: FC<Props> = function IconMap(props) {
  return (
    <div
    className={`relative min-w-7 min-h-7 rounded-full bg-white  `}
  >
    
    <img
      src={baseUrl + props.src}
      className="absolute top-1/2 left-1/2 w-4 h-4 mr-2 -translate-x-1/2 -translate-y-1/2 mix-blend-screen z-10"
    />
  </div>
  )
  
};