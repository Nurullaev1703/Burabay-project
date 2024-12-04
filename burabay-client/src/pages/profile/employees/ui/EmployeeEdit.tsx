import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import BackIcon from "../../../../app/icons/back-icon.svg";
import { TextField, Switch, FormControlLabel } from "@mui/material";
import { useMask } from "@react-input/mask";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { Header } from "../../../../components/Header";
import { IconContainer } from "../../../../shared/ui/IconContainer";
import { DefaultForm } from "../../../auth/ui/DefaultForm";
import { EmployeeType, PermissionsType } from "../model/employee-type";
import { Typography } from "../../../../shared/ui/Typography";
import { Button } from "../../../../shared/ui/Button";
import { Controller, useForm } from "react-hook-form";
import { apiService } from "../../../../services/api/ApiService";
import { queryClient } from "../../../../ini/InitializeApp";

interface Props {
  employee?: EmployeeType;
}

interface FormType {
  fullName: string;
  phoneNumber: string;
  email: string;
  position: string;
  permissions: PermissionsType;

}

export const EmployeeEdit: FC<Props> = function EmployeeEdit(props) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { history } = useRouter();
  const [phoneError, setPhoneError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const styles = {
    ".css-1f2cr75-MuiInputBase-root-MuiInput-root": {
      padding: "4px 0px 4px 20px",
    },
  };

  const handleDelEmployee = async () =>{   
    const response = await apiService.delete({
      url: `/employees/${props.employee?.id}`  


    })
    if(response.status){
      navigate({
        to: "/profile/employees"
      })
    }
  }
  const handleSaveEmployee = async (form: FormType) =>{
    const response = await apiService.patch({
      url: `/employees/${props.employee?.id}`,
      dto: {
        fullName : form.fullName,
        phoneNumber: `+7${form.phoneNumber.replace(/\D/g, "")}`,
        email : form.email,
        position: form.position,
        permissions: form.permissions,
      },
    })
    if(response.data){
      await queryClient.invalidateQueries({queryKey: ["employee" , props.employee?.id]})
      navigate({
        to: "/profile/employees"
      })
    }
  }

  const mask = useMask({ mask: "___ ___-__-__", replacement: { _: /\d/ } });
  const formatPhoneNumber = (phone: string) => {
    const cleaned = ('' + phone).replace(/\D/g, ''); // Убираем всё, кроме цифр
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{2})(\d{2})$/);
  
    if (match) {
      return `${match[1]} ${match[2]}-${match[3]}-${match[4]}`;
    }
  
    return phone; // Если формат не соответствует, возвращаем исходный номер
  };

  
  const {
    handleSubmit,
    control,
    formState: { isValid, isSubmitting },
  } = useForm<FormType>({
    defaultValues: {
      fullName: props.employee?.fullName || "",
      phoneNumber: props.employee?.phoneNumber ? formatPhoneNumber(props.employee.phoneNumber.replace("+7", "")) : "",
      email: props.employee?.email || "",
      position: props.employee?.position || "",
      permissions: {
        createOrders: props.employee?.permissions.createOrders || false,
        signContracts: props.employee?.permissions.signContracts || false ,
        editProducts: props.employee?.permissions.editProducts || false ,
        editEmployee: props.employee?.permissions.editEmployee || false ,
      }
    },
    mode: "onBlur",
  });



  return (
    <section className="px-4">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <Typography size={20} weight={800}>
            {props.employee?.fullName || t("edit")}
          </Typography>
          <IconContainer align="end"></IconContainer>
        </div>
      </Header>

      <div className="w-full flex flex-col justify-center items-center">
        <DefaultForm
          className="mt-20 flex flex-col justify-between"
          onSubmit={handleSubmit(handleSaveEmployee)}
        >
          <div>
            <Controller
              name="fullName"
              control={control}
              rules={{
                required: t("requiredField"),
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  fullWidth
                  label= {t("ФИО")}
                  variant="standard"
                  autoFocus
                  margin="normal"
                />
              )}
            />

            <Controller
              name="phoneNumber"
              control={control}
              rules={{
                required: t("requiredField"),
                validate: (value: string) => {
                  const phoneRegex = /^\d{3} \d{3}-\d{2}-\d{2}$/;
                  return phoneRegex.test(value) || t("invalidNumber");
                },
              }}
              render={({ field, fieldState: { error } }) => (
                <div className="relative">
                  <div className="absolute top-[-8px] left-[-15px] h-[55px] flex w-8 justify-end items-center z-10">
                    <Typography>{"+7"}</Typography>
                  </div>
                  <TextField
                    {...field}
                    error={Boolean(error?.message) || phoneError}
                    helperText={error?.message || errorMessage}
                    fullWidth={true}
                    variant="standard"
                    inputRef={mask}
                    sx={styles}
                    placeholder="700 000-00-00"
                    onChange={(e) => {
                      const formattedValue = formatPhoneNumber(e.target.value);
                      field.onChange(formattedValue);
                      setPhoneError(false);
                      setErrorMessage("");
                    }}
                    value={field.value || ""}
                  />
                </div>
              )}
            />

            <Controller
              name="email"
              control={control}
              rules={{
                required: t("requiredField"),
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  fullWidth
                  label={t("emailForNotifications")}
                  variant="standard"
                  margin="normal"
                />
              )}
            />

            <Controller
              name="position"
              control={control}
              rules={{
                required: t("requiredField"),
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  fullWidth
                  label={t("positionEmployee")}
                  variant="standard"
                  margin="normal"
                />
              )}
            />

            <Controller
              name="permissions.createOrders"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  className="flex justify-between items-center border-b py-4 border-t w-full"
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label={
                    <Typography className="m-0" size={16} weight={400}>
                      {t("placingOrder")}
                    </Typography>
                  }
                  labelPlacement="start"
                  sx={{ margin: 0 }}
                />
              )}
            />

            <Controller
              name="permissions.signContracts"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  className="flex justify-between items-center border-b py-4 w-full"
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label={
                    <Typography size={16} weight={400}>
                      {t("signingContract")}
                    </Typography>
                  }
                  labelPlacement="start"
                  sx={{ margin: 0 }}
                />
              )}
            />

            <Controller
              name="permissions.editProducts"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  className="flex justify-between items-center border-b py-4 w-full"
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label={
                    <Typography size={16} weight={400}>
                      {t("portfolioEdit")}
                    </Typography>
                  }
                  labelPlacement="start"
                  sx={{ margin: 0 }}
                />
              )}
            />

            <Controller
              name="permissions.editEmployee"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  className="flex justify-between items-center border-b py-4 w-full"
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  }
                  label={
                    <Typography size={16} weight={400}>
                      {t("employeeManagement")}
                    </Typography>
                  }
                  labelPlacement="start"
                  sx={{ margin: 0 }}
                />
              )}
            />
          </div>
          <Button disabled={!isValid || isSubmitting} className="mt-6" type="submit">
            {t("save")}
          </Button>
          <Button onClick={handleDelEmployee} mode={"red"} className="my-6">
              {t("deleteEmployee")}
            </Button>

        </DefaultForm>
      </div>
    </section>
  );
};
