import  { FC, HTMLAttributes } from 'react';


export const Card: FC<HTMLAttributes<HTMLDivElement>> = function Card(props) {
  return <div
    className={`mx-auto p-4 rounded-lg ${props.className}`}>
        {props.children}
  </div>
};