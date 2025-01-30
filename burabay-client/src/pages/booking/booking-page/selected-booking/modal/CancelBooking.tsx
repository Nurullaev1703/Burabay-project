import { Box, Modal } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../shared/ui/Button";
import { apiService } from "../../../../../services/api/ApiService";
import { HTTP_STATUS } from "../../../../../services/api/ServerData";
import { useNavigate } from "@tanstack/react-router";
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
  const navigate = useNavigate();
  const cancelBooking = async (idBooking: string = bookingId) => {
    try {
      const response = await apiService.delete<HTTP_STATUS>({
        url: `/booking/${idBooking}`,
      });
      if (parseInt(response.data) === parseInt(HTTP_STATUS.OK)) {
        await queryClient.invalidateQueries({ queryKey: [`/booking/org`] });
        navigate({ to: "/booking/business" });
      } else {
        console.log("Ошибка чечни");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <section>
      <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "center",
          overflow: "auto",
          maxHeight: "100%",
        }}
      >
        <Box
          sx={{
            bgcolor: "background.paper",
            boxShadow: 24,
            p: "24px",
            width: "100%",
            maxWidth: 600,
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
            {t("cancel")}
          </Button>
          <Button className="mb-4" onClick={onClose}>
            {t("changeMind")}
          </Button>
        </Box>
      </Modal>
    </section>
  );
};
