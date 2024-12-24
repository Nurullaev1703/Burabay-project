import { FC, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { AlternativeHeader } from "../../components/AlternativeHeader";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import { TextField } from "@mui/material";
import { Button } from "../../shared/ui/Button";
import BackIcon from "../../app/icons/back-icon-white.svg";
import { LanguageButton } from "../../shared/ui/LanguageButton";
import { apiService } from "../../services/api/ApiService";
import { HTTP_STATUS } from "../../services/api/ServerData";
import { DefaultForm } from "../auth/ui/DefaultForm";
import { useAuth } from "../../features/auth";

interface Props {
  email: string;
}

// форма отслеживает данные
interface FormType {
  orgName: string;
  description: string;
  siteUrl?: string;
}

export const BusinessInfo: FC<Props> = function BusinessInfo({ email }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const { setToken } = useAuth();

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      orgName: "",
      description: "",
      siteUrl: "",
    },
    mode: "onChange",
  });
  return (
    <div className="bg-almostWhite h-screen">
      <AlternativeHeader isMini>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={28} weight={700} color={COLORS_TEXT.white}>
            {"Business"}
          </Typography>
          <LanguageButton />
        </div>
      </AlternativeHeader>

      <DefaultForm
        onSubmit={handleSubmit(async (form) => {
          setIsLoading(true);
          const formDto = form.siteUrl
            ? {
                email: email,
                orgName: form.orgName,
                description: form.description,
                siteUrl: form.siteUrl,
              }
            : {
                email: email,
                orgName: form.orgName,
                description: form.description,
              };
          const response = await apiService.post<string>({
            url: "/auth/register-business",
            dto: formDto,
          });
          if (response.data == HTTP_STATUS.CONFLICT) {
            setIsError(true);
            setTimeout(() => {
              setIsError(false);
            }, 3000);
          } else {
            setToken(response.data);
            navigate({
              to: "/profile",
            });
          }
          setIsLoading(false);
        })}
        className="flex flex-col"
      >
        <div className="flex flex-col items-center gap-5 py-6 px-4">
          <Controller
            name="orgName"
            control={control}
            rules={{
              required: true,
              maxLength: {
                value: 40,
                message: t("maxLengthExceeded", { count: 40 }),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <div className="relative w-full">
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  variant="outlined"
                  label={t("organizationName")}
                  placeholder={t("inputOrgName")}
                  fullWidth={true}
                  inputProps={{ maxLength: 40 }}
                />
                <span className="absolute top-2 right-2 text-gray-400 text-sm">
                  {field.value?.length || 0}/40
                </span>
              </div>
            )}
          />
          <Controller
            name="description"
            control={control}
            rules={{
              required: true,
              maxLength: {
                value: 300,
                message: t("maxLengthExceeded", { count: 300 }),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <div className="relative w-full">
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  variant="outlined"
                  label={t("description")}
                  placeholder={t("inputDescription")}
                  fullWidth={true}
                  multiline
                  inputProps={{ maxLength: 300 }}
                />
                <span className="absolute top-2 right-2 text-gray-400 text-sm">
                  {field.value?.length || 0}/300
                </span>
              </div>
            )}
          />
          <Controller
            name="siteUrl"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth={true}
                type={"text"}
                variant="outlined"
                label={t("siteUrl")}
                placeholder={t("webAddress")}
              />
            )}
          />
        </div>
        <Button
          disabled={!isValid || isSubmitting}
          loading={isLoading}
          type="submit"
          className="w-header mx-auto my-4"
        >
          {t("acceptRegister")}
        </Button>
        {isError && (
          <Typography color={COLORS_TEXT.red} align="center">
            {t("defaultError")}
          </Typography>
        )}
      </DefaultForm>
    </div>
  );
};
