import  { ButtonHTMLAttributes, FC, useContext } from 'react';
import LanguageIcon from "../../app/icons/language.svg";
import { LanguageContext } from '../context/LanguageProvider';
import { Typography } from './Typography';
import { COLORS_TEXT } from './colors';

export const LanguageButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> =
  function LanguageButton() {
    const context = useContext(LanguageContext);

    if (!context) {
      throw new Error("Кнопка не может работать вне провайдера");
    }
    const { language, toggleLanguage } = context;

    return (
      <button type="button" className="py-3 flex items-center gap-1 uppercase" onClick={toggleLanguage}>
        <Typography color={COLORS_TEXT.white}>{language}</Typography>
        <img src={LanguageIcon} alt="" />
      </button>
    );
  };