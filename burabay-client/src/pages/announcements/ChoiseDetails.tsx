import { FC, useRef, useState } from 'react';
import { Category, Subcategories } from './model/announcements';
import { Header } from '../../components/Header';
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Typography } from '../../shared/ui/Typography';
import { COLORS_TEXT } from '../../shared/ui/colors';
import { IconContainer } from '../../shared/ui/IconContainer';
import { baseUrl } from "../../services/api/ServerData";
import defaultImage from "../../app/icons/main/health.svg";
import { Button } from '../../shared/ui/Button';
import { useNavigate } from '@tanstack/react-router';
import { DefaultForm } from '../auth/ui/DefaultForm';
import { Controller, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMask } from '@react-input/mask';
import { ProgressSteps } from './ui/ProgressSteps';
import  imageSvg from "../../app/icons/announcements/image.svg"
import { apiService } from '../../services/api/ApiService';
import { imageService } from '../../services/api/ImageService';

interface Props {
    category: Category
    subcategory: Subcategories
}
interface FormType {
    name: string;
    description: string;
    youtube: string;
    phone: string;
    photo: string;
  }

export const ChoiseDetails: FC<Props> = function ChoiseDetails({category , subcategory}) {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    console.log(category)
    const mask = useMask({ mask: "___ ___-__-__", replacement: { _: /\d/ } });
    const {t} = useTranslation()
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [imgSource, setImgSource] = useState<string>(baseUrl + category.imgPath);
    const navigate = useNavigate();
    const [isError, setIsError] = useState<boolean>(false);
    const handleFocus = () => {
        if (inputRef.current) {
          setIsError(false);
          inputRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      };
      const { control, handleSubmit } = useForm<FormType>({
        defaultValues: {
          description: "",
        },
        mode: "onSubmit",
      });
      const inputRef = useRef<HTMLInputElement>(null);
      const [imgSrc, setImgSrc] = useState<string>(baseUrl + category.imgPath);
    return (
      <section className='min-h-screen bg-[#F1F2F6]'>
        <Header>
          <div className='flex justify-between items-center text-center'>
            <IconContainer align='start' action={() => history.back()}>
              <img src={BackIcon} alt="" />
            </IconContainer>
            <div>
              <Typography size={18} weight={500} color={COLORS_TEXT.blue200} align='center'>
                {"Новое обьявление"}
              </Typography>
              <Typography size={14} weight={400} color={COLORS_TEXT.blue200} align='center'>
                {"Оформите объявление"}
              </Typography>
            </div>
            <IconContainer align='end' action={() => history.back()}>
              <img src={XIcon} alt="" />
            </IconContainer>
          </div>
          <ProgressSteps currentStep={3} totalSteps={9}></ProgressSteps>
        </Header>
        <div className='px-4'>
        <DefaultForm className="mt-2">
  <div>
  <Controller
    name="name"
            control={control}
            rules={{
                maxLength: {
                    value: 40,
                    message: t("maxLengthExceeded", { count: 40 }),
                  },
            }}
            render={({ field, fieldState: { error } }) => (
            <div className='mb-2'>
              <TextField
                {...field}
                error={Boolean(error?.message)}
                helperText={error?.message || errorMessage}
                fullWidth={true}
                type={"text"}
                variant="outlined"
                label={t("Заголовок")}
                inputProps={{ maxLength: 40 }}
                autoFocus={true}
                placeholder={t("Название")}
              />
                <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="absolute top-[110px] right-5">
                {field.value?.length || 0}/40
                </Typography>
              </div>
              
              
    )}/>
      <Controller
    name="description"
            control={control}
            rules={{
                maxLength: {
                    value: 300,
                    message: t("maxLengthExceeded", { count: 300 }),
                  },
            }}
            render={({ field, fieldState: { error } }) => (
            <div className='mb-2'>
              <TextField
                {...field}
                error={Boolean(error?.message)}
                helperText={error?.message || errorMessage}
                fullWidth={true}
                type={"text"}
                variant="outlined"
                label={t("Описание")}
                inputProps={{ maxLength: 300 }}
                autoFocus={true}
                placeholder={t("Введите описание")}
              />
                <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="absolute top-[192px] right-5">
                {field.value?.length || 0}/300
                </Typography>
              </div>
              
              
    )}/>
        <div className='bg-white rounded-lg p-4 mb-2'>
            <Typography className='mb-2' size={12} weight={400} color={COLORS_TEXT.gray100}>{"Фото"}</Typography>
            <div className='w-24 h-24  border-[1px] border-[#0A7D9E] rounded-lg'>
                <div className='flex flex-col justify-center items-center w-full h-[100%]'>
                    <img src={imageSvg} alt="" />
                    <Typography size={12} weight={400} color={COLORS_TEXT.blue200}>{"Добавить"}</Typography>
                    <Typography size={12} weight={400} color={COLORS_TEXT.blue200}>{"фото"}</Typography>
                </div>
            </div>
            <Typography className='mt-2' size={14} weight={400}>{"Добавьте до десяти фотографий Перетащите что бы изменить порядок"}</Typography>
        </div> 
        <Controller
    name="youtube"
            control={control}
            rules={{
            }}
            render={({ field, fieldState: { error } }) => (
            <div className='mb-2'>
              <TextField
                {...field}
                error={Boolean(error?.message)}
                helperText={error?.message || errorMessage}
                fullWidth={true}
                type={"text"}
                variant="outlined"
                label={t("Видео из Youtube")}
                inputProps={{ maxLength: 300 }}
                autoFocus={true}
                placeholder={t("Вставьте ссылку на видео из YouTube")}
              />
                <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="absolute top-[192px] right-5"></Typography>
              </div>
              
              
    )}/> 
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
              <div className="relative rounded-lg bg-white mb-2">
                <div className="absolute left-2 top-[9.5px] flex h-full items-center pointer-events-none z-10">
                  {"+7"}
                </div>
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  fullWidth
                  type="tel"
                  label={t("Телефон для связи")}
                  variant="outlined"
                  inputRef={mask}
                  placeholder="700 000-00-00"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    style: {
                      paddingLeft: "30px",
                    },
                  }}
                />
              </div>
    )}
    />
              

  </div>
</DefaultForm>

        </div>
        <div className='fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full'>
          <Button onClick={() => navigate({
          to: `/map`,
        })} mode='default'>{"Продолжить"}</Button>
        </div>
      </section>
    );
};