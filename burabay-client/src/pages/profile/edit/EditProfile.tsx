import { FC, useState } from "react";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../app/icons/back-icon.svg";
import CrossIcon from "../../../app/icons/cross.svg";
import { Controller, useForm } from "react-hook-form";
import { DefaultForm } from "../../auth/ui/DefaultForm";
import { TextField } from "@mui/material";
import { Button } from "../../../shared/ui/Button";
import { useAuth } from "../../../features/auth";
import { Organization, Profile } from "../model/profile";
import { apiService } from "../../../services/api/ApiService";
import { useNavigate, useRouter } from "@tanstack/react-router";

interface FormType {
  organization: Organization;
  email: string;
}

export const EditProfile: FC = function EditProfile() {
  const { user, setUser } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate()
  const {history} = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { handleSubmit, control, formState:{isValid} } = useForm<FormType>({
    defaultValues: {
      organization: {
        name: user?.organization?.name || "",
        description: user?.organization?.description || "",
        siteUrl: user?.organization?.siteUrl || "",
      },
      email: user?.email || "",
    },
    mode: "onChange",
  });

  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const handleError = (errorText: string) => {
    setErrorText(errorText);
    setError(true);
  };

  const saveUser = async (form: FormType) => {
    try {
      setIsLoading(true);
      const response = await apiService.patch<Profile>({
        url: "/profile",
        dto: form,
      });

      if (response.data) {
        setUser(response.data)
        navigate({to:"/profile"})
      } else {
        handleError(t("invalidCode"));
      }

      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка при сохранении пользователя:", error);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer
            align="start"
            action={handleSubmit((form) => {
              saveUser(form);
            })}
          >
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={18} weight={500}>
            {t("accountSettings")}
          </Typography>
          <IconContainer align="end" action={() => history.back()}>
            <img src={CrossIcon} alt="Подтвердить" />
          </IconContainer>
        </div>
      </Header>

      <div className="pt-4 px-4">
        <DefaultForm
          onSubmit={handleSubmit(saveUser)}
          className="flex flex-col gap-2"
        >
          <Controller
            name="organization.name"
            control={control}
            rules={{
              required: t("requiredField"),
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
                  label={t("organizationName")}
                  fullWidth={true}
                  variant="outlined"
                  inputProps={{ maxLength: 40 }}
                  placeholder={t("inputOrgName")}
                />
                <span className="absolute top-2 right-2 text-gray-400 text-sm">
                  {field.value?.length || 0}/40
                </span>
              </div>
            )}
          />

          <Controller
            name="organization.description"
            control={control}
            rules={{
              required: t("requiredField"),
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
                  label={t("organizationAbout")}
                  fullWidth={true}
                  variant="outlined"
                  inputProps={{ maxLength: 300 }}
                  multiline
                  placeholder={t("description")}
                />
                <span className="absolute top-2 right-2 text-gray-400 text-sm">
                  {field.value?.length || 0}/300
                </span>
              </div>
            )}
          />

          <Controller
            name="email"
            control={control}
            rules={{
              required: t("requiredField"),
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: t("invalidEmail"),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={Boolean(error?.message)}
                helperText={error?.message}
                label={t("email")}
                fullWidth={true}
                variant="outlined"
              />
            )}
          />

          <Controller
            name="organization.siteUrl"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={Boolean(error?.message)}
                helperText={error?.message}
                label={t("site")}
                fullWidth={true}
                variant="outlined"
                placeholder="burabay.kz"
              />
            )}
          />

          {!error ? (
            <Button
              className="fixed bottom-4 left-3 w-header z-10"
              type="submit"
              loading={isLoading}
              disabled={!isValid}
            >
              {t("save")}
            </Button>
          ) : (
            <Button mode="red" className="fixed bottom-4 left-3 w-header mt-8 z-10">
              {errorText}
            </Button>
          )}
        </DefaultForm>
      </div>
    </div>
  );
};
