import { Box, Modal } from "@mui/material";
import { FC } from "react";
import { Carousel, CarouselItem } from "../../../../components/Carousel";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import CloseIcon from "../../../../app/icons/cross.svg"
import DeleteIcon from "../../../../app/icons/delete.svg"

interface Props {
  open: boolean;
  images: CarouselItem[];
  onClose: () => void;
  firstItem?: number;
  onDelete?: () => void
}

export const ImageViewModal: FC<Props> = function ImageViewModal({
  open,
  onClose,
  images,
  firstItem,
  onDelete
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto",
        maxHeight: "100%",
      }}
      slotProps={{
        backdrop: {
          style: {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Прозрачный черный фон
          },
        },
      }}
    >
      <Box
        sx={{
          bgcolor: "transparent",
          py: "24px",
          width: "100%",
          maxWidth: 600,
          ":focus": {
            border: "none",
            outline: "none",
          },
        }}
      >
        <div className="flex justify-end items-center">
          <IconContainer align="center"action={onClose}>
            <img src={CloseIcon} alt="" className="brightness-[20]"/>
          </IconContainer>
        </div>
        <Carousel
          items={images}
          height="h-[60vh]"
          currentItemId={firstItem}
          radius="rounded-none"
          hasDelete={!!onDelete}
        />
        {onDelete &&
          <div className="flex justify-end">
            <IconContainer align="center" action={onDelete}>
              <img src={DeleteIcon} alt="" className="brightness-[20]" />
            </IconContainer>
          </div>
        }
      </Box>
    </Modal>
  );
};
