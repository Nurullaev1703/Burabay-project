import { Box, Modal } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../../shared/ui/Button";

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
          <Button className="mb-4" >
            {t("changeMind")}
          </Button>
          <Button className="mb-4" mode="red">
            {t("cancel")}
          </Button>
        </Box>
      </Modal>
    </section>
  );
};
