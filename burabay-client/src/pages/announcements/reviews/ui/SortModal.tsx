import { Box, FormControlLabel, Modal, Radio, RadioGroup } from "@mui/material";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import CloseIcon from "../../../../app/icons/close.svg";

interface Props {
  open: boolean;
  sort: "highReview" | "lowReview";
  onClose: () => void;
  setSort: (value: "highReview" | "lowReview") => void;
}

export const SortModal: FC<Props> = function SortModal({
  open,
  onClose,
  sort,
  setSort,
}) {
  const { t } = useTranslation();
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
          ":focus": {
            border: "none",
            outline: "none",
          },
        }}
      >
        <div className="flex justify-between items-center mb-4 py-2.5">
          <span className="text-xl font-bold">{t("showFirst")}</span>
          <div
            className="w-11 h-11 flex items-center justify-end"
            onClick={onClose}
          >
            <img src={CloseIcon} alt="Закрыть" />
          </div>
        </div>

        <RadioGroup
          value={sort}
          onChange={(e) =>
            setSort(e.target.value as "highReview" | "lowReview")
          }
        >
          <FormControlLabel
            value="highReview"
            control={<Radio />}
            label={t("highReview")}
          />
          <FormControlLabel
            value="lowReview"
            control={<Radio />}
            label={t("lowReview")}
          />
        </RadioGroup>
      </Box>
    </Modal>
  );
};
