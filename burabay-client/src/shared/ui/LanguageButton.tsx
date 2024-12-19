import  { ButtonHTMLAttributes, FC, useContext } from 'react';
import LanguageIcon from "../../app/icons/language.svg";
import { LanguageContext } from '../context/LanguageProvider';
import { Typography } from './Typography';
import { COLORS_TEXT } from './colors';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement>{
  hideIcon?: boolean,
  color?: string
}

export const LanguageButton: FC<Props> =
  function LanguageButton(props) {
    const context = useContext(LanguageContext);

    if (!context) {
      throw new Error("Кнопка не может работать вне провайдера");
    }
    const { language, toggleLanguage } = context;

    return (
      <button type="button" className="py-3 min-w-11 flex items-center justify-center gap-1 uppercase" onClick={toggleLanguage}>
        <Typography color={props.color || COLORS_TEXT.white}>{language}</Typography>
        {!props.hideIcon &&
          <img src={LanguageIcon} alt="" />
        }
      </button>
    );
  };