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
import { useMask } from "@react-input/mask";
import { Button } from "../../../shared/ui/Button";
import { useAuth } from "../../../features/auth";
import { useNavigate } from "@tanstack/react-router";
import { apiService } from "../../../services/api/ApiService";
import { HTTP_STATUS } from "../../../services/api/ServerData";

interface FormType {
  fullName: string;
  email: string;
  phoneNumber: string;
}

export const EditProfileUser: FC = function EditProfileUser() {
  const { user } = useAuth();
  const { t } = useTranslation();
  const mask = useMask({ mask: "___ ___-__-__", replacement: { _: /\d/ } });
  const { handleSubmit, control } = useForm<FormType>({
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      phoneNumber: user?.phoneNumber?.replace(/^(\+7)/, "") || "",
    },
    mode: "onBlur",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");

  const handleError = (errorText: string) => {
    setErrorText(errorText);
    setError(true);
  };

  const formatPhoneNumber = (phone: string) => {
    const cleaned = phone.replace(/[^0-9]/g, "");
    return cleaned.startsWith("7") ? `+7${cleaned}` : `+${cleaned}`;
  };

  const saveUser = async (form: FormType) => {
    try {
      setIsLoading(true);

      const updatedForm = {
        ...form,
        phoneNumber: formatPhoneNumber(form.phoneNumber),
      };

      const response = await apiService.patch<string>({
        url: "/profile/",
        dto: updatedForm,
      });

      if (response.data == HTTP_STATUS.OK) {
        navigate({to:"/profile"})
      }

      if (response.data == HTTP_STATUS.CONFLICT) {
        handleError(t("invalidCode"));
      }
      if (response.data == HTTP_STATUS.SERVER_ERROR) {
        handleError(t("tooManyRequest"));
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
            action={handleSubmit(async (form) => {
              setIsLoading(true);
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
        <DefaultForm onSubmit={handleSubmit(saveUser)}>
          <Controller
            name="fullName"
            control={control}
            rules={{
              required: t("requiredField"),
              maxLength: {
                value: 40,
                message: t("maxLengthExceeded", { count: 40 }),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <div className="relative p-2 rounded-md bg-white mb-2">
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  label={t("name")}
                  placeholder={"Максим"}
                  fullWidth={true}
                  variant="outlined"
                  inputProps={{ maxLength: 40 }}
                />
                <span className="absolute top-2 right-2 text-gray-400 text-sm">
                  {field.value?.length || 0}/40
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
              <div className="p-2 rounded-md bg-white mb-2">
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  label={t("email")}
                  fullWidth={true}
                  variant="outlined"
                />
              </div>
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: t("requiredField"),
              
            }}
            render={({ field, fieldState: { error } }) => (
              <div className="relative p-2 rounded-md bg-white mb-2">
                <div className="absolute top-[10px] left-3 flex h-full items-center pointer-events-none z-10">
                  {"+7"}
                </div>
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  fullWidth
                  type="tel"
                  label={t("phoneV2")}
                  variant="outlined"
                  inputRef={mask}
                  placeholder="700 000-00-00"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    style: {
                      paddingLeft: "30px",
                      backgroundColor: error ? "#fff0f0" : "transparent",
                    },
                  }}
                />
              </div>
            )}
          />

          {!error ? (
            <Button
              className="fixed bottom-4 left-3 w-header"
              type="submit"
              loading={isLoading}
            >
              {t("save")}
            </Button>
          ) : (
            <Button mode="red" className="fixed bottom-4 left-3 w-header mt-8">
              {errorText}
            </Button>
          )}
        </DefaultForm>
      </div>
    </div>
  );
};
