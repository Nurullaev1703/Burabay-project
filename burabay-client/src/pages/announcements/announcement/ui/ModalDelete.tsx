import { FC, useState } from "react";
import { Box, Modal } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../../../../shared/ui/Button";
import { apiService } from "../../../../services/api/ApiService";
import { Hint } from "../../../../shared/ui/Hint";

interface Props {
  open: boolean;
  onClose: () => void;
  adId: string;
  isAdmin?: boolean;
  returnTo?: string;
  onAfterDelete?: () => void;
  onError?: (message: string) => void;
}

export const ModalDelete: FC<Props> = function ModalDelete({
  open,
  onClose,
  adId,
  isAdmin,
  returnTo,
  onAfterDelete,
  onError,
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const handleDeleteAd = async () => {
    try {
      const response = await apiService.delete<{
        message?: string;
        code?: number;
      }>({
        url: `/ad/${adId}`,
      });
      // Если в теле пришёл код ошибки (например code === 409), обрабатываем это как ошибку
      if (response.data?.code === 409 || response.status === 409) {
        // Всегда показываем локализованное сообщение для 409 —
        // чтобы не отображать строку на языке бэка (например, русский).
        const msg = t("cannotDeleteAdWithBookings");
        setErrorMessage(msg);
        setIsError(true);
        try {
          onError?.(msg);
        } catch (e) {
          // ignore
        }
        setTimeout(() => {
          setIsError(false);
        }, 5000);
        return;
      }

      // Проверяем успешное удаление по статусу
      if (response.status === 200) {
        // Если передан callback — вызываем его (позволяет родителю сам управлять редиректом)
        if (onAfterDelete) {
          try {
            onAfterDelete();
          } catch (e) {
            // ignore
          }
          return;
        }

        // Если явно передан путь возврата — переходим по нему
        if (returnTo) {
          navigate({ to: returnTo });
          return;
        }

        // По умолчанию: для админа — вернуться назад в истории (чтобы попасть на страницу,
        // с которой открылся просмотр объявления), для остальных — на список объявлений
        if (isAdmin) {
          // history.back() используется в приложении в других местах и корректно работает
          // для возврата на предыдущую страницу
          history.back();
        } else {
          navigate({ to: "/announcements" });
        }
      } else if (response.status === 409 || response.data?.code === 409) {
        // Ошибка из-за активных бронирований
        const msg = response.data?.message || t("cannotDeleteAdWithBookings");
        setErrorMessage(msg);
        setIsError(true);
        // Сообщаем родителю (если нужно показать hint вне модалки)
        try {
          onError?.(msg);
        } catch (e) {
          // ignore
        }
        setTimeout(() => {
          setIsError(false);
        }, 5000);
      } else {
        const msg = t("defaultError");
        setErrorMessage(msg);
        setIsError(true);
        try {
          onError?.(msg);
        } catch (e) {
          // ignore
        }
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    } catch (error: any) {
      const msg = error.response?.data?.message || t("defaultError");
      setErrorMessage(msg);
      setIsError(true);
      try {
        onError?.(msg);
      } catch (e) {
        // ignore
      }
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        display: "flex",
        alignItems: isAdmin ? "center" : "flex-end",
        justifyContent: "center",
        overflow: "auto",
        maxHeight: "max-h-100%",
      }}
    >
      <Box
        sx={{
          height: "fit",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: "24px",
          width: "100%",
          maxWidth: 600,
          borderRadius: isAdmin ? "14px" : "14px 14px 0 0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          ":focus": {
            border: "none",
            outline: "none",
          },
        }}
      >
        <span className="text-center font-medium">{t("deleteAd")}</span>
        <span className="text-center font-medium">{t("noReverse")}</span>
        {isError && (
          <div className="mt-4 w-full">
            <Hint
              title={errorMessage || t("defaultError")}
              mode="error"
              className="flex items-center justify-center"
            />
          </div>
        )}
        <Button
          mode="red"
          className="mb-2 border-red border-[3px] mt-4"
          onClick={handleDeleteAd}
        >
          {t("acceptDeleteAd")}
        </Button>
        <Button onClick={onClose}>{t("cancel")}</Button>
      </Box>
    </Modal>
  );
};
