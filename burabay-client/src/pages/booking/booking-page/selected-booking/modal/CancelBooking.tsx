import { Box } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../shared/ui/Button";
import { apiService } from "../../../../../services/api/ApiService";
import { HTTP_STATUS } from "../../../../../services/api/ServerData";
import { queryClient } from "../../../../../ini/InitializeApp";

interface Props {
  bookingId: string;
  open: boolean;
  onClose: () => void;
}

export const CancelBooking: FC<Props> = function CancelBooking({
  bookingId,
  open,
  onClose,
}) {
  const { t } = useTranslation();
  const cancelBooking = async (idBooking: string = bookingId) => {
    try {
      const response = await apiService.patch<HTTP_STATUS>({
        url: `/booking/${idBooking}/cancel`,
      });
      if (parseInt(response.data) === parseInt(HTTP_STATUS.OK)) {
        // Инвалидируем все связанные запросы
        await queryClient.invalidateQueries({ queryKey: [`/booking/org`] });
        await queryClient.invalidateQueries({
          queryKey: [`/booking/by-ad`],
          refetchType: "all",
        });
        history.back();
      } else {
      }
    } catch (e) {}
  };

  return (
    <section>
      {open && (
        <>
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
            }}
          />
          {/* Контент модалки */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1401,
              maxWidth: '600px',
              margin: '0 auto',
            }}
          >
            <Box
              sx={{
                bgcolor: "background.paper",
                boxShadow: 24,
                p: "24px",
                width: "100%",
                borderTopLeftRadius: 14,
                borderTopRightRadius: 14,
                display: "flex",
                flexDirection: "column",
              }}
            >
          <h2 className="text-lg font-medium mb-4 text-center">
            {t("areYouSureCancelBooking")}
          </h2>
          <Button
            className="mb-4"
            mode="red"
            onClick={() => cancelBooking(bookingId)}
          >
            {t("cancelBooking")}
          </Button>
          <Button className="mb-4" onClick={onClose}>
            {t("changeMind")}
          </Button>
        </Box>
          </div>
        </>
      )}
    </section>
  );
};
