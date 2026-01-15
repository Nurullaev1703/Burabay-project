import React, { FC } from "react";
import { Button } from "../shared/ui/Button";
import { COLORS_TEXT } from "../shared/ui/colors";
import { useTranslation } from "react-i18next";

interface Props {
  onRetry?: () => void;
}

const OfflineScreen: FC<Props> = ({ onRetry }) => {
  const { t } = useTranslation();

  return (
    // Сделал фон сплошным (без прозрачности)
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white px-6">
      <div className="max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <svg
            className={`w-24 h-24 ${COLORS_TEXT.blue200}`}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M2 8.82C6.5 5 11.5 5 16 8.82" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5.5 12.78C8.2 10.28 15.8 10.28 18.5 12.78" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8.5 16.74C10.1 15.2 13.9 15.2 15.5 16.74" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 20.5C12.8284 20.5 13.5 19.8284 13.5 19C13.5 18.1716 12.8284 17.5 12 17.5C11.1716 17.5 10.5 18.1716 10.5 19C10.5 19.8284 11.1716 20.5 12 20.5Z" fill="currentColor"/>
            <path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>

        <h3 className="text-xl font-semibold mb-3 text-totalBlack">{t("offline.title")}</h3>
        <p className="text-gray-600 mb-6">{t("offline.description")}</p>

        <div className="w-44 mx-auto">
          <Button onClick={onRetry} mode="default">{t("offline.buttonRefresh")}</Button>
        </div>
      </div>
    </div>
  );
};

export default OfflineScreen;
