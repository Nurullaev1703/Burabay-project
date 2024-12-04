import { Box, IconButton, TextField, Modal as MuiModal } from "@mui/material";
import { FC, useEffect, useState } from "react";
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
  filialId: string;
  stars: number;
  positiveText: string;
  negativeText: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  user: ProfileType;
}

export const RatingModal: FC<Props> = function RatingModal({
  open,
  onClose,
  user,
}) {
  const [currentRating, setCurrentRating] = useState<FormType>({
    filialId: user.filial?.id || "",
    stars: 0,
    positiveText: "",
    negativeText: "228",
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [appreciated, setAppreciated] = useState<boolean>(false);
  const { t } = useTranslation();

  const { handleSubmit, control, setValue } = useForm<FormType>({
    defaultValues: {
      filialId: user.filial?.id,
      stars: currentRating.stars,
      positiveText: currentRating.positiveText,
      negativeText: "228",
    },
  });

  const stars = useWatch({
    control,
    name: "stars",
  });

  // Получение текущей оценки
  useEffect(() => {
    const fetchRating = async () => {
      setIsLoading(true);
      try {
        const response = await apiService.get<FormType>({
          url: `/feedback/${user.filial?.id}`,
        });
        if (response.data) {
          setCurrentRating(response.data);
          // Обновляем значения в форме
          setValue("stars", response.data.stars);
          setValue("positiveText", response.data.positiveText);
          setValue("negativeText", "228");
        }
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRating();
  }, [user.filial?.id, setValue]);

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
              {[...Array(5)].map((star, index) => {
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
                    name="positiveText"
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
