import { FC } from "react";
import { Box, Modal } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "../../../../shared/ui/Button";
import { apiService } from "../../../../services/api/ApiService";

interface Props {
  open: boolean;
  onClose: () => void;
  adId: string
  isAdmin?: boolean;
}

export const ModalDelete: FC<Props> = function ModalDelete({ open, onClose, adId, isAdmin }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const handleDeleteAd = async() => {
    const response = await apiService.delete({
      url: `/ad/${adId}`
    })
    if (response.data) {
      navigate({
        to:"/announcements"
      })
    }
  }
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
        <Button mode="red" className="mb-2 border-red border-[3px] mt-4" onClick={handleDeleteAd}>
          {t("acceptDeleteAd")}
        </Button>
        <Button onClick={onClose}>{t("cancel")}</Button>
      </Box>
    </Modal>
  );
};
