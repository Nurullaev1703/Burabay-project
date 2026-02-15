import React, { FC } from "react";
import { Button } from "../shared/ui/Button";
import { COLORS_TEXT } from "../shared/ui/colors";
import { useTranslation } from "react-i18next";
import  offlinesvg  from "../app/icons/no-internet.svg"

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
          {/* Use external svg from public folder so designers can replace it easily */}
          <img src={offlinesvg} alt="no internet" className="w-48 h-48 object-contain" />
        </div>

        <h3 className="text-xl font-semibold mb-3 text-totalBlack">{t("offline.title")}</h3>
        <p className="text-gray-600 mb-6">{t("offline.description")}</p>

        <div className="px-0">
          <Button onClick={onRetry} mode="default" className="w-full rounded-full">{t("offline.buttonRefresh")}</Button>
        </div>
      </div>
    </div>
  );
};

export default OfflineScreen;
