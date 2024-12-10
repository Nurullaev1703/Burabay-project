import { FC } from "react";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../app/icons/back-icon.svg";
import CrossIcon from "../../../app/icons/cross.svg";
import { userInfo } from "../ui/UserInfoList";
import { Controller, useForm } from "react-hook-form";
import { DefaultForm } from "../../auth/ui/DefaultForm";
import { TextField } from "@mui/material";
import { useMask } from "@react-input/mask";
import { Button } from "../../../shared/ui/Button";

export const EditProfileUser: FC = function EditProfileUser() {
  const { t } = useTranslation();
  const mask = useMask({ mask: "___ ___-__-__", replacement: { _: /\d/ } });
  const { handleSubmit, control } = useForm({
    defaultValues: {
      name: userInfo?.organizationName || "",
      email: userInfo?.emailToLogin || "",
      phone: userInfo?.phone || "",
    },
    mode: "onBlur",
  });

  return (
    <div className="px-4 bg-background min-h-screen">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer
            align="start"
            // action={handleSubmit(async (form) => {
            //   setIsLoading(true);
            //   saveUser(form);
            // })}
            action={() => history.back()}
          >
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={18} weight={500}>
            {t("accountSettings")}
          </Typography>
          <IconContainer
            align="end"
            // action={handleSubmit(async (form) => {
            //   setIsLoading(true);
            //   saveUser(form);
            // })}
            action={() => history.back()}
          >
            <img src={CrossIcon} alt="Подтвердить" />
          </IconContainer>
        </div>
      </Header>

      <div className="pt-24">
        <DefaultForm>
          <Controller
            name="name"
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
                  fullWidth={true}
                  variant="standard"
                  inputProps={{ maxLength: 40 }}
                  focused
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
                  variant="standard"
                  focused
                />
              </div>
            )}
          />

          <Controller
            name="phone"
            control={control}
            rules={{
              required: t("requiredField"),
              validate: (value: string) => {
                const phoneRegex = /^\d{3} \d{3}-\d{2}-\d{2}$/;
                return phoneRegex.test(value) || t("invalidNumber");
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <div className="relative p-2 rounded-md bg-white mb-2">
                <div className="absolute left-3 flex h-full items-center pointer-events-none">
                  {"+7"}
                </div>
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  fullWidth
                  type="tel"
                  label={t("phoneV2")}
                  variant="standard"
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
                  focused
                />
              </div>
            )}
          />

          <Button className="fixed bottom-4 left-0">{t("save")}</Button>
        </DefaultForm>
      </div>
    </div>
  );
};
