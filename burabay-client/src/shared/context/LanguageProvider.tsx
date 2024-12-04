import { createContext, useState, ReactNode, FC } from 'react';
import i18n from './ChangeLanguage';

// данные, необходимые для работы контекста
interface LanguageContextProps {
  language: string;
  toggleLanguage: () => void;
}

export const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('ru');
    // переключает язык, меняет язык в контексте и берет слово из i18
  const toggleLanguage = () => {
    const newLanguage = language === 'ru' ? 'kz' : 'ru';
    setLanguage(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
