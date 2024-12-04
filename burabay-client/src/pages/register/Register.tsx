import { FC, useRef, useState } from "react";
import { Header } from "../../components/Header";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import BackIcon from "../../app/icons/back-icon.svg";
import SupportIcon from "../../app/icons/support-icon.svg";
import { DefaultForm } from "../auth/ui/DefaultForm";
import { Controller, useForm } from "react-hook-form";
import {
  Autocomplete,
  TextField,
} from "@mui/material";
import { Hint } from "../../shared/ui/Hint";
import { Button } from "../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import { apiService } from "../../services/api/ApiService";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../shared/ui/colors";

// данные, формируемые в форме
interface FormType {
  type: string;
  name: string;
  username: string;
  city: string;
}
const options = [
  "ИП",
  "ТОО",
  "ХТ",
  "ПТ",
  "КТ",
  "ТДО",
  "АО",
  "ПК",
  "ГУП",
  "ОО",
  "РО",
  "НАО",
  "ЧК",
  "ИК",
  "КОР",
  "КСН",
  "ОгП",
  "ОБП",
  "ПОО",
  "ЧФ"
]


export const Register: FC = function Register() {
  const [isError, setIsError] = useState<boolean>(false);
  const [errorText, setIsErrorText] = useState<string>("");
  const [orgTypeValue, setOrgTypeValue] = useState<string | null>(options[0]);
  const [inputValue, setInputValue] = useState(options[0] || "");
  const navigate = useNavigate();

  const { t } = useTranslation();

  const inputRef = useRef<HTMLInputElement>(null);

  // скролл страницы при фокусе на поле
  const handleFocus = () => {
    if (inputRef.current) {
      setIsError(false);
      inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      type: inputValue,
      name: "",
      username: "",
      city: "",
    },
    mode: "onSubmit"
  });

  const onSubmit = handleSubmit(async (form) => {
    const response = await apiService.patch<string>({
      url: "/profile",
      dto: {
        fullName: form.username || "",
        organization: {
          type: inputValue,
          name: form.name,
        },
        address: {
          city: form.city,
        },
      },
    });
    // перенаправляем человека только после обновления данных
    if (response.data) navigate({ to: "/register/accept" });
    else {
      throw setIsError(true);
    }
  });

  return (
    <div className="px-4">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={20} weight={800}>
            {t("register")}
          </Typography>
          <IconContainer align="end" action={() => navigate({to: "/help"})}>
            <img src={SupportIcon} alt="" />
          </IconContainer>
        </div>
      </Header>

      <DefaultForm
        onSubmit={onSubmit}
        className={"flex flex-col justify-between mt-18 "}
      >
        <Typography size={12} color={COLORS_TEXT.secondary}>{t("orgName")}</Typography>
        <div className={"flex flex-col"}>
          <div className="flex gap-4">
            <Controller
              name="type"
              control={control}
              rules={{
                required: t("requiredField"),
              }}
              render={({ field }) => (
                <Autocomplete
                  {...field}
                  value={orgTypeValue}
                  onChange={(event: any, newValue: string | null) => {
                    setOrgTypeValue(newValue);
                  }}
                  inputValue={inputValue}
                  onInputChange={(event, newInputValue) => {
                    setInputValue(newInputValue);
                  }}
                  options={options}
                  sx={{ width: 80 }}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" sx={{height: "fit-content"}}/>
                  )}
                />
              )}
            />
            <Controller
              name="name"
              control={control}
              rules={{
                required: t("requiredField"),
                validate: (value) => value.length > 2 || `${t("minSymbols")} 2`,
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  variant="standard"
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  autoFocus
                  fullWidth
                />
              )}
            />
          </div>
          <Controller
            name="city"
            control={control}
            rules={{
              required: t("requiredField"),
              validate: (value) => value.length > 3 || `${t("minSymbols")} 3`,
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label={t("city")}
                variant="standard"
                error={Boolean(error?.message)}
                helperText={error?.message}
                sx={{ marginBottom: "24px" }}
                onFocus={handleFocus}
                inputRef={inputRef}
              />
            )}
          />
          {inputValue == "ИП" &&
            <Controller
              name="username"
              control={control}
              rules={{
                required: t("requiredField"),
                validate: (value) => value.length > 2 || `${t("minSymbols")} 2`,
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label={t("nameHint")}
                  variant="standard"
                  error={Boolean(error?.message) || isError}
                  helperText={error?.message || errorText}
                  sx={{ marginBottom: "24px" }}
                  onFocus={handleFocus}
                  inputRef={inputRef}
                />
              )}
            />
          }
        </div>
        <div className={"mt-2"}>
          <Hint title={t("acceptEgovData")} />
          <Button
            disabled={!isValid || isSubmitting}
            className="mt-1"
            type="submit"
          >
            {t("goToEgov")}
          </Button>
        </div>
      </DefaultForm>
    </div>
  );
};
