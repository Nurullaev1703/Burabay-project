import { createContext, useState, ReactNode, FC, useEffect } from 'react';
import i18n from './ChangeLanguage';
import { langService } from '../../services/storage/Factory';
import { apiService } from '../../services/api/ApiService';

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
  const languages = ["ru", "en", "kz"];
  const currentLanguage = langService.hasValue() ? langService.getValue() : "ru";
  const [language, setLanguage] = useState<string>(currentLanguage);
  
  // переключает язык, меняет язык в контексте и берет слово из i18
  const toggleLanguage = async () => {
    const currentIndex = languages.indexOf(language);
    const nextIndex = (currentIndex + 1) % languages.length;
    const newLanguage = languages[nextIndex];
    
    console.log('Changing language to:', newLanguage);
    
    setLanguage(newLanguage);
    langService.setValue(newLanguage);
    i18n.changeLanguage(newLanguage);
    
    // Отправляем язык на сервер
    try {
      console.log('Sending language update to server...');
      // Патчим оба эндпоинта - и /users/language и /profile
      const results = await Promise.all([
        apiService.patch({
          url: '/users/language',
          dto: { language: newLanguage },
        }),
        apiService.patch({
          url: '/profile',
          dto: { language: newLanguage },
        }),
      ]);
      console.log('Language update successful:', results);
    } catch (error) {
      console.error('Failed to update language on server:', error);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};
