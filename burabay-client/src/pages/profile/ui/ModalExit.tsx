import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../shared/ui/Button";
import { tokenService } from "../../../services/storage/Factory";
import { useNavigate } from "@tanstack/react-router";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const ModalExit: FC<Props> = function ModalExit({ open, onClose }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <section>
      {/* Кастомный backdrop */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1400,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
      >
        {/* Модальное окно */}
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: 'white',
            padding: '24px',
            width: '100%',
            maxWidth: '600px',
            borderTopLeftRadius: '14px',
            borderTopRightRadius: '14px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            zIndex: 1401,
          }}
        >
          <span className="text-center font-medium w-3/4">{t("areYouSure")}</span>
          <Button
            mode="red"
            className="mb-2"
            onClick={() => {
              tokenService.deleteValue();
              navigate({ to: "/auth" });
            }}
          >
            {t("exit")}
          </Button>
          <Button onClick={onClose}>{t("cancel")}</Button>
        </div>
      </div>
    </section>
  );
};
