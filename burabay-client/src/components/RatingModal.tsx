import { Box, IconButton, TextField, Modal as MuiModal } from "@mui/material";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { DefaultForm } from "../pages/auth/ui/DefaultForm";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Button } from "../shared/ui/Button";
import { Profile as ProfileType } from "../pages/profile/model/profile";
import { apiService } from "../services/api/ApiService";
import { Loader } from "./Loader";

interface FormType {
  stars: number;
  text: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  user: ProfileType;
}

export const RatingModal: FC<Props> = function RatingModal({ open, onClose }) {
  const [currentRating, _setCurrentRating] = useState<FormType>({
    stars: 0,
    text: "",
  });

  const [isLoading, _setIsLoading] = useState<boolean>(false);
  const [appreciated, setAppreciated] = useState<boolean>(false);
  const { t } = useTranslation();
  const { handleSubmit, control, setValue } = useForm<FormType>({
    defaultValues: {
      stars: currentRating.stars,
      text: currentRating.text,
    },
  });

  const stars = useWatch({
    control,
    name: "stars",
  });

  // Получение текущей оценки
  // useEffect(() => {
  //   const fetchRating = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await apiService.get<FormType>({
  //         url: `/feedback/${user?.id}`,
  //       });
  //       if (response.data) {
  //         setCurrentRating(response.data);
  //         // Обновляем значения в форме
  //         setValue("stars", response.data.stars);
  //         setValue("text", response.data.text);
  //       }
  //     } catch (e) {
  //       console.log(e);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchRating();
  // }, [user?.id, setValue]);

  const handleClick = (index: number) => {
    setValue("stars", index);
  };

  return (
    <MuiModal
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
        }}
      >
        <h2 className="text-xl font-semibold text-center mb-4">
          {appreciated ? t("thanks") : t("questionConvenient")}
        </h2>
        {!appreciated && (
          <>
            <Box display="flex" justifyContent="center">
              {[...Array(5)].map((_star, index) => {
                const starIndex = index + 1;
                const isFilled = starIndex <= stars;
                return (
                  <IconButton
                    key={index}
                    onClick={() => handleClick(starIndex)}
                    sx={{ width: 44, height: 44 }}
                  >
                    {isFilled ? (
                      <StarIcon sx={{ fontSize: 44 }} color="primary" />
                    ) : (
                      <StarBorderIcon sx={{ fontSize: 44 }} />
                    )}
                  </IconButton>
                );
              })}
            </Box>
            {stars > 0 && (
              <div className="mt-4 flex justify-center">
                <DefaultForm
                  onSubmit={handleSubmit(async (form) => {
                    await apiService.patch({
                      url: "/feedback",
                      dto: form,
                    });
                    setAppreciated(true);
                  })}
                >
                  <Controller
                    name="text"
                    control={control}
                    rules={{ required: t("requiredField") }}
                    render={({ field, fieldState: { error } }) => (
                      <TextField
                        {...field}
                        error={Boolean(error?.message)}
                        helperText={error?.message}
                        placeholder={
                          stars >= 4
                            ? t("describeСonvenient")
                            : t("describeInconvenient")
                        }
                        className="placeholder:text-base sm:placeholder:text-sm" // Уменьшаем шрифт
                        multiline
                      />
                    )}
                  />
                  <Button type="submit" className="mt-4">
                    {t("answer")}
                  </Button>
                </DefaultForm>
              </div>
            )}
          </>
        )}
        {isLoading && <Loader />}
      </Box>
    </MuiModal>
  );
};
