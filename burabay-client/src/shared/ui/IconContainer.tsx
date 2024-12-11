import  { FC, PropsWithChildren } from 'react';

type alignType = "start" | "end" | "center"

interface Props extends PropsWithChildren {
    align: alignType,
    action?: () => void
}

export const IconContainer: FC<Props> = function IconContainer(props) {
  let iconAlign = "justify-start"

  if(props.align === "end"){
    iconAlign = "justify-end"
  }
  else if(props.align === "center"){
    iconAlign = "justify-center"
  }

  const style = `h-11 min-w-11 w-11 flex items-center ${iconAlign} cursor-pointer select-none`
  return <div className={style} onClick={props.action}>
    {props.children}
  </div>
};