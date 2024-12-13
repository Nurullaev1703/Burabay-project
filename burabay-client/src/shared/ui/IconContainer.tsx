import  { FC, HTMLAttributes } from 'react';

type alignType = "start" | "end" | "center"

interface Props extends HTMLAttributes<HTMLDivElement> {
  align: alignType;
  action?: () => void;
}

export const IconContainer: FC<Props> = function IconContainer(props) {
  let iconAlign = "justify-start"

  if(props.align === "end"){
    iconAlign = "justify-end"
  }
  else if(props.align === "center"){
    iconAlign = "justify-center"
  }

  const style = `w-[44px] h-[44px] flex items-center ${iconAlign} cursor-pointer select-none ${props.className}`
  return <div className={style} onClick={props.action}>
    {props.children}
  </div>
};