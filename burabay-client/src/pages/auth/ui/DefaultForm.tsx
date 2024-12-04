import  { FC, FormHTMLAttributes } from 'react';


// стандартная стилизация формы
export const DefaultForm: FC<FormHTMLAttributes<HTMLFormElement>> = function DefaultForm(props) {
  return <form 
        {...props}
        className={`flex flex-col w-full ${props.className}`}
    />
};