import { ButtonHTMLAttributes, FC, useContext } from 'react';
import { LanguageContext } from '../context/LanguageProvider';
import { COLORS_BACKGROUND } from './colors';

const LanguageToggleButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = (props) => {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error('Кнопка не может работать вне провайдера');
  }

  const { language, toggleLanguage } = context;

  return (
    <button onClick={toggleLanguage}
    className={`p-[10px] ${COLORS_BACKGROUND.gray200} rounded-[8px] ${props.className}`}
    >
      {language === 'ru' ? 'Каз' : 'Рус'}
    </button>
  );
};

export default LanguageToggleButton;
