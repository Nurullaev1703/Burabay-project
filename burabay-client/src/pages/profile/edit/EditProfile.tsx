import { InputAdornment, TextField } from "@mui/material";
import { Link, useNavigate } from "@tanstack/react-router";
import { FC, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { apiService } from "../../../services/api/ApiService";
import { DefaultForm } from "../../auth/ui/DefaultForm";
import { Button } from "../../../shared/ui/Button";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import BackIcon from "../../../app/icons/back-icon.svg";
import { useTranslation } from "react-i18next";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import ImageIcon from "../../../app/icons/profile/settings/image.svg";
import PlusIcon from "../../../app/icons/profile/settings/plus.svg";
import CrossIcon from "../../../app/icons/profile/settings/cross.svg";
import ArrowBottomIcon from "../../../app/icons/profile/settings/arrow-bottom.svg";
import ChangeIcon from "../../../app/icons/profile/settings/change.svg";
import ChangeImageIcon from "../../../app/icons/profile/settings/changeImage.svg";
import ConfirmIcon from "../../../app/icons/profile/settings/confirm.svg";
import { baseUrl } from "../../../services/api/ServerUrl";
import { imageService } from "../../../services/api/ImageService";
import { Bank, banks, Profile } from "../model/profile";
import { formatPhoneNumber } from "../../../shared/ui/format-phone";
import { tokenService } from "../../../services/storage/Factory";
import { EmployeesModal } from "./ui/EmployeesModal";
import { Loader } from "../../../components/Loader";

export interface AddressDto {
  region: string;
  street?: string;
}

export interface OrganizationDto {
  identityNumber: string;
  name: string;
}

interface Requisities {
  id?: string;
  bankName: string;
  identityCode: string;
  bankCode: string;
  benCode: string;
}

interface FormType {
  fullName: string;
  organization: OrganizationDto;
  address: AddressDto;
  managerId: string;
  phoneNumber: string;
  requisities: Requisities[] | [];
}

interface Props {
  user: Profile;
}

export const EditProfile: FC<Props> = function EditProfile(props) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(
    props.user?.clientManager?.id || null
  );
  const [selectedEmployeeName, setSelectedEmployeeName] = useState<
    string | null
  >(props.user?.clientManager?.fullName || "");
  const navigate = useNavigate();
  const [imgUrl, setImgUrl] = useState<string>(
    baseUrl + props.user.organization?.imgUrl || ""
  );
  const { handleSubmit, watch, control, setValue, clearErrors, resetField } =
    useForm<FormType>({
      defaultValues: {
        fullName: props.user?.fullName || "",
        organization: {
          name: props.user?.organization?.name || "",
          identityNumber: props.user?.organization?.identityNumber || "",
        },
        address: {
          region: props.user?.address?.region || "",
        },
        managerId: props.user?.clientManager?.id || "",
        requisities: props.user?.requisities || [],
      },
      mode: "onBlur",
    });

  const requisities = watch("requisities");

  // Добавление рекзвита
  const addRequisite = () => {
    // Проверяем, что количество реквизитов не превышает 5
    if (requisities.length < 5) {
      // Добавляем новый реквизит с пустыми полями
      setValue("requisities", [
        ...requisities,
        { bankName: "", identityCode: "", bankCode: "", benCode: "" },
      ]);
    }
  };

  const [editIndex, setEditIndex] = useState<number | null>(null);

  // Отмена добавления реквизита
  const cancelRequisite = (index: number) => {
    const updatedRequisities = requisities.filter((_, i) => i !== index);
    setValue("requisities", updatedRequisities);
    if (editIndex === index) setEditIndex(null);
  };

  // Удаление реквизита
  const deleteRequisite = async (requisite: Requisities, index: number) => {
    await apiService.delete({
      url: `/profile/requisities/${requisite.id}`,
    });
    cancelRequisite(index);
  };

  // Проверка на заполняемости одного реквизита
  const areAllFieldsFilled = (requisite: Requisities) => {
    return (
      requisite.bankName &&
      requisite.identityCode &&
      requisite.bankCode &&
      requisite.benCode
    );
  };
  const saveUser = async (form: FormType) => {
    try {
      setIsLoading(true);
      // Создаем промисы для всех операций с реквизитами
      const requisitesPromises = form.requisities.map(async (requisite) => {
        const { id, ...dto } = requisite;

        if (id) {
          // Обновление существующего реквизита
          await apiService.patch<Requisities>({
            url: `/profile/requisities/${id}`,
            dto,
          });
        } else {
          // Создание нового реквизита
          await apiService.post<Requisities>({
            url: "/profile/requisities",
            dto,
          });
        }
      });

      // Ожидаем завершения всех операций с реквизитами
      await Promise.all(requisitesPromises);

      // Создаем новый объект формы без реквизитов
      const { requisities, ...formWithoutRequisites } = form;

      // Обновляем профиль
      const response = await apiService.patch<string>({
        url: "/profile",
        dto: formWithoutRequisites,
      });

      setIsLoading(false);
      // Проверяем статус ответа
      if (response.status >= 200 && response.status < 300) {
        history.back();
      } else {
        console.error("Ошибка при обновлении профиля:", response.status);
      }
    } catch (error) {
      console.error("Ошибка при сохранении пользователя:", error);
    }
  };

  //  --------------------- Работа с банком
  const [filteredBanks, setFilteredBanks] = useState<Bank[]>([]);
  const handleBankNameChange = (index: number, value: string) => {
    // Обновляем значение bankName
    setValue(`requisities.${index}.bankName`, value);

    // Фильтруем список банков по введенному значению
    if (value) {
      const filtered = banks.filter((bank) =>
        bank.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredBanks(filtered);
    } else {
      setFilteredBanks([]);
    }
  };

  const selectBank = (index: number, bank: Bank) => {
    setValue(`requisities.${index}.bankName`, bank.name);
    setValue(`requisities.${index}.identityCode`, bank.identityCode);
    // Сбрасываем ошибку, если банк был выбран из списка
    clearErrors(`requisities.${index}.bankName`);
    setFilteredBanks([]);
  };

  //  --------------------- Работа с изображением

  const imageChange = async (data: File) => {
    if (data) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", data);
      try {
        if (props.user?.organization?.imgUrl.includes("/image")) {
          // удаление картинки. Принимает на себя путь к картинке
          await apiService.delete({
            url: "/image",
            dto: {
              filepath: props.user?.organization?.imgUrl,
            },
          });
        }
        // сохранение картинки. В результате получаем ссылку на картинку
        const response = await imageService.post<string>({
          url: "/image/profile",
          dto: formData,
        });
        await apiService.patch({
          url: "/profile",
          dto: {
            organization: {
              imgUrl: response.data,
            },
          },
        });
        setImgUrl(baseUrl + response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      console.error("No file selected");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      imageChange(selectedFiles[0]);
    } else {
      console.error("Не выбрано изображение");
    }
  };

  return (
    <div className="px-4">
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
          <Typography size={20} weight={800}>
            {t("settings")}
          </Typography>
          <IconContainer
            align="end"
            action={handleSubmit(async (form) => {
              setIsLoading(true);
              saveUser(form);
            })}
          >
            <img src={ConfirmIcon} alt="Подтвердить" />
          </IconContainer>
        </div>
      </Header>

      <div className="w-full flex flex-col justify-center items-center">
        <DefaultForm className={"mt-18"}>
          <div className="flex flex-col justify-center items-center mb-4">
            <div className="relative w-32 h-32 bg-[#FFF2DA] rounded-full flex items-center justify-center">
              <img
                src={imgUrl ? imgUrl : ImageIcon}
                className="object-cover rounded-full h-full w-full"
              />
              <label
                htmlFor="logo"
                className="absolute bottom-0 right-0 p-1 rounded-[7px] bg-white cursor-pointer"
              >
                <img src={ChangeImageIcon} alt="Изменить" />
              </label>
            </div>
            <input
              type="file"
              id="logo"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <h1 className="text-xl font-extrabold text-center mb-4 h-[27.5px]">
            {props.user?.organization?.type?.toUpperCase() || ""} «
            {props.user?.organization?.name?.toUpperCase() || ""}»
          </h1>

          <Controller
            name="fullName"
            control={control}
            rules={{ required: t("requiredField") }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                sx={{ marginBottom: "16px" }}
                error={Boolean(error?.message)}
                helperText={error?.message}
                label={"ФИО"}
                fullWidth={true}
                variant="standard"
                contentEditable={false}
                disabled={true}
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="organization.identityNumber"
            control={control}
            rules={{ required: t("requiredField") }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                sx={{ marginBottom: "16px" }}
                error={Boolean(error?.message)}
                helperText={error?.message}
                label={"ИИН/БИН"}
                fullWidth={true}
                variant="standard"
                disabled={true}
                InputProps={{
                  readOnly: true,
                }}
              />
            )}
          />
          <Controller
            name="address.region"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                sx={{ marginBottom: "16px" }}
                error={Boolean(error?.message)}
                helperText={error?.message}
                label={t("region")}
                fullWidth={true}
                variant="standard"
              />
            )}
          />
          <Controller
            name="managerId"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                sx={{ marginBottom: "16px" }}
                error={Boolean(error?.message)}
                onClick={() => setShowModal(true)}
                helperText={error?.message}
                label={t("managerFilial")}
                fullWidth={true}
                variant="standard"
                InputProps={{
                  readOnly: true,
                  value: selectedEmployeeName || "", // Выводим имя менеджера или оставляем поле пустым
                  endAdornment: (
                    <InputAdornment position="end">
                      <img src={ArrowBottomIcon} alt="arrow" />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          {/* Показ модалки сотрудников, если тру */}
          {showModal && (
            <EmployeesModal
              open={showModal}
              onClose={() => setShowModal(false)}
              user={props.user}
              onSelectEmployee={(employeeId, employeeName) => {
                setSelectedEmployeeId(employeeId);
                setSelectedEmployeeName(employeeName);
                setValue("managerId", employeeId);
              }}
            />
          )}

          <span className={"font-semibold text-xl my-4"}>
            {t("requisitesCheck")}
          </span>

          {/* Функционал добавления реквизитов */}
          {requisities.map((requisite, index) => {
            return (
              <div key={index}>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-xl">
                    {requisities[index]?.bankName || t("newRequisite")}
                  </h3>
                  {areAllFieldsFilled(requisite) && editIndex === index ? (
                    <span
                      className={`font-semibold ${COLORS_TEXT.main200} cursor-pointer`}
                      onClick={() => {
                        setEditIndex(null);
                        resetField(`requisities.${index}.bankName`);
                        resetField(`requisities.${index}.identityCode`);
                        resetField(`requisities.${index}.bankCode`);
                        resetField(`requisities.${index}.benCode`);
                      }}
                    >
                      {t("cancel")}
                    </span>
                  ) : areAllFieldsFilled(requisite) ? (
                    <img
                      src={ChangeIcon}
                      onClick={() => {
                        setEditIndex(index);
                      }}
                    />
                  ) : (
                    <span
                      className={`font-semibold ${COLORS_TEXT.main200} cursor-pointer`}
                      onClick={() => cancelRequisite(index)}
                    >
                      {t("cancel")}
                    </span>
                  )}
                </div>

                {areAllFieldsFilled(requisite) && editIndex === index ? (
                  <div>
                    <Controller
                      name={`requisities.${index}.bankName`}
                      control={control}
                      rules={{
                        validate: (value) =>
                          banks.some((bank) => bank.name === value) ||
                          t("bankNameError"),
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <div className="relative">
                          <TextField
                            {...field}
                            value={requisite.bankName}
                            sx={{ marginBottom: "16px" }}
                            error={Boolean(error?.message)}
                            helperText={error?.message}
                            label={t("fullBankName")}
                            fullWidth={true}
                            variant="standard"
                            onChange={(e) =>
                              handleBankNameChange(index, e.target.value)
                            }
                          />
                          {/* Выпадающий список с вариантами */}
                          {filteredBanks.length > 0 && (
                            <ul className="absolute z-10 bg-white border w-full">
                              {filteredBanks.map((bank, idx) => (
                                <li
                                  key={idx}
                                  className="p-2 cursor-pointer hover:bg-gray-200"
                                  onClick={() => selectBank(index, bank)}
                                >
                                  {bank.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    />
                    <Controller
                      name={`requisities.${index}.identityCode`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          sx={{ marginBottom: "16px" }}
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                          label={"ИИК"}
                          fullWidth={true}
                          variant="standard"
                        />
                      )}
                    />
                    <Controller
                      name={`requisities.${index}.bankCode`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          sx={{ marginBottom: "16px" }}
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                          label={"БИК"}
                          fullWidth={true}
                          variant="standard"
                        />
                      )}
                    />
                    <Controller
                      name={`requisities.${index}.benCode`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          sx={{ marginBottom: "16px" }}
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                          label={"КБЕ"}
                          fullWidth={true}
                          variant="standard"
                        />
                      )}
                    />
                    <div
                      className="flex w-max cursor-pointer mb-2"
                      onClick={() => deleteRequisite(requisite, index)}
                    >
                      <img className="mr-2" src={CrossIcon} alt="Удалить" />
                      <span className={`font-semibold ${COLORS_TEXT.error}`}>
                        {t("deleteRequisite")}
                      </span>
                    </div>
                  </div>
                ) : areAllFieldsFilled(requisite) ? (
                  <div>
                    <Controller
                      name={`requisities.${index}.bankName`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          sx={{ marginBottom: "16px" }}
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                          label={t("fullBankName")}
                          fullWidth={true}
                          variant="standard"
                          contentEditable={false}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      )}
                    />
                    <Controller
                      name={`requisities.${index}.identityCode`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          sx={{ marginBottom: "16px" }}
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                          label={"ИИК"}
                          fullWidth={true}
                          variant="standard"
                          contentEditable={false}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      )}
                    />
                    <Controller
                      name={`requisities.${index}.bankCode`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          sx={{ marginBottom: "16px" }}
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                          label={"БИК"}
                          fullWidth={true}
                          variant="standard"
                          contentEditable={false}
                          InputProps={{
                            readOnly: true,
                          }}
                        />
                      )}
                    />
                    <Controller
                      name={`requisities.${index}.benCode`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          sx={{ marginBottom: "16px" }}
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                          label={"КБЕ"}
                          fullWidth={true}
                          variant="standard"
                        />
                      )}
                    />
                  </div>
                ) : (
                  <div>
                    <Controller
                      name={`requisities.${index}.bankName`}
                      control={control}
                      rules={{
                        validate: (value) =>
                          banks.some((bank) => bank.name === value) ||
                          t("bankNameError"),
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <div className="relative">
                          <TextField
                            {...field}
                            value={requisite.bankName}
                            sx={{ marginBottom: "16px" }}
                            error={Boolean(error?.message)}
                            helperText={error?.message}
                            label={t("fullBankName")}
                            fullWidth={true}
                            variant="standard"
                            onChange={(e) =>
                              handleBankNameChange(index, e.target.value)
                            }
                          />
                          {/* Выпадающий список с вариантами */}
                          {filteredBanks.length > 0 && (
                            <ul className="absolute z-10 bg-white border w-full">
                              {filteredBanks.map((bank, idx) => (
                                <li
                                  key={idx}
                                  className="p-2 cursor-pointer hover:bg-gray-200"
                                  onClick={() => selectBank(index, bank)}
                                >
                                  {bank.name}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    />
                    <Controller
                      name={`requisities.${index}.identityCode`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          sx={{ marginBottom: "16px" }}
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                          label={"ИИК"}
                          fullWidth={true}
                          variant="standard"
                        />
                      )}
                    />
                    <Controller
                      name={`requisities.${index}.bankCode`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          sx={{ marginBottom: "16px" }}
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                          label={"БИК"}
                          fullWidth={true}
                          variant="standard"
                        />
                      )}
                    />
                    <Controller
                      name={`requisities.${index}.benCode`}
                      control={control}
                      render={({ field, fieldState: { error } }) => (
                        <TextField
                          {...field}
                          sx={{ marginBottom: "16px" }}
                          error={Boolean(error?.message)}
                          helperText={error?.message}
                          label={"КБЕ"}
                          fullWidth={true}
                          variant="standard"
                        />
                      )}
                    />
                  </div>
                )}
              </div>
            );
          })}

          {requisities.length < 5 &&
            (requisities.length === 0 ||
              areAllFieldsFilled(requisities[requisities.length - 1])) && (
              <div className="flex w-max cursor-pointer" onClick={addRequisite}>
                <img className="mr-2" src={PlusIcon} alt="Добавить" />
                <span className={`font-semibold ${COLORS_TEXT.main200}`}>
                  {t("addRequisite")}
                </span>
              </div>
            )}

          <span className={"font-semibold text-xl my-4"}>
            {t("dataForLogin")}
          </span>

          <Link to="/profile/edit/number">
            <span>{formatPhoneNumber(props.user?.phoneNumber)}</span>
            <p className={`text-xs ${COLORS_TEXT.secondary}`}>
              {t("changeNumberHint")}
            </p>
          </Link>

          <Button
            mode={"red"}
            className={`mb-[42px] ${COLORS_TEXT.error}`}
            onClick={() => {
              tokenService.deleteValue();
              navigate({ to: "/auth" });
            }}
          >
            {t("logoutFromAccount")}
          </Button>
        </DefaultForm>
      </div>
      {isLoading && <Loader />}
    </div>
  );
};
