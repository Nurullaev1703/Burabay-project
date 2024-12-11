import { createContext, useState, ReactNode, FC } from 'react';
import i18n from './ChangeLanguage';
import { langService } from '../../services/storage/Factory';

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
  const languages = ["ru", "kz", "en"];
  const currentLanguage = langService.hasValue() ? langService.getValue() : "ru";
  const [language, setLanguage] = useState<string>(currentLanguage);
    // переключает язык, меняет язык в контексте и берет слово из i18
  const toggleLanguage = () => {
    const currentIndex = languages.indexOf(language); // Определяем индекс текущего языка
    const nextIndex = (currentIndex + 1) % languages.length; // Рассчитываем индекс следующего языка
    const newLanguage = languages[nextIndex];
    setLanguage(newLanguage);
    langService.setValue(newLanguage);
    i18n.changeLanguage(newLanguage);
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
