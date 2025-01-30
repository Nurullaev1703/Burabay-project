import { FC } from "react";
import { Box, Modal } from "@mui/material";
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

  return (
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
          alignItems: "center",
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
      </Box>
    </Modal>
  );
};
