import { FC, useEffect, useRef, useState } from "react";
import { Header } from "../../components/Header";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { ProgressSteps } from "./ui/ProgressSteps";
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Modal, Switch } from "@mui/material";
import { DefaultForm } from "../auth/ui/DefaultForm";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { SmallHint } from "../../shared/ui/SmallHint";
import { Button } from "../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import { apiService } from "../../services/api/ApiService";
import { Announcement } from "./model/announcements";

interface Props {
  adId: string;
  announcement?: Announcement;
}

interface FormType {
  price: number;
  priceForChild: number;
}

export const PriceService: FC<Props> = function PriceService({
  adId,
  announcement,
}) {
  const [showModal, setShowModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const symbolRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>("0");
  const [inputValueChild, setInputValueChild] = useState<string>("0");
  const navigate = useNavigate();
  const [booking, setBooking] = useState(announcement?.isBookable || false);
  const [onSitePayment, setOnSitePayment] = useState(
    announcement?.onSitePayment || false
  );
  const [onlinePayment, _setOnlinePayment] = useState(
    announcement?.onlinePayment || false
  );
  const { t } = useTranslation();
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isFocusedChild, setIsFocusedChild] = useState<boolean>(false);
  const inputRefChild = useRef<HTMLInputElement>(null);
  const symbolRefChild = useRef<HTMLDivElement>(null);

  const calculateTextWidth = (number: string, font: string): number => {
    const span = document.createElement("span");
    span.style.visibility = "hidden";
    span.style.position = "absolute";
    span.style.font = font;
    span.textContent = number || "0"; // Учитываем значение "0" как дефолтное
    document.body.appendChild(span);
    const width = span.offsetWidth + 10; // Добавляем небольшой отступ
    document.body.removeChild(span);
    return width;
  };

  const formatNumberWithSpaces = (value: string): string => {
    const sanitizedValue = value.replace(/\D/g, ""); // Удаляем всё, кроме цифр
    return sanitizedValue.replace(/\B(?=(\d{3})+(?!\d))/g, " "); // Добавляем пробелы
  };
  const updateTengePosition = (
    inputRef: React.RefObject<HTMLInputElement>,
    symbolRef: React.RefObject<HTMLDivElement>,
    inputValue: string
  ) => {
    if (inputRef.current && symbolRef.current) {
      const font = getComputedStyle(inputRef.current).font;
      const formattedValue = formatNumberWithSpaces(
        inputValue.replace(/\s/g, "")
      );
      const textWidth = calculateTextWidth(formattedValue, font);
      symbolRef.current.style.left = `${textWidth + 10}px`;
    }
  };

  const handleInputChange = (rawValue: string) => {
    let sanitizedValue = rawValue.replace(/\D/g, ""); // Удаляем всё, кроме цифр
    if (sanitizedValue.startsWith("0")) {
      sanitizedValue = sanitizedValue.substring(1); // Удаляем начальный ноль
    }
    const formattedValue = formatNumberWithSpaces(sanitizedValue); // Форматируем с пробелами
    setInputValue(formattedValue || "0"); // Если значение пустое, показываем "0"
  };

  const handleInputChangeChild = (rawValue: string) => {
    let sanitizedValue = rawValue.replace(/\D/g, "");
    if (sanitizedValue.startsWith("0")) {
      sanitizedValue = sanitizedValue.substring(1);
    }
    const formattedValue = formatNumberWithSpaces(sanitizedValue);
    setInputValueChild(formattedValue || "0");
  };

  const checkPriceService = () => {
    if (
      announcement?.price ||
      announcement?.priceForChild ||
      announcement?.isBookable ||
      announcement?.onSitePayment ||
      announcement?.onlinePayment
    ) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    updateTengePosition(inputRef, symbolRef, inputValue);
  }, [inputValue]);

  useEffect(() => {
    updateTengePosition(inputRefChild, symbolRefChild, inputValueChild);
  }, [inputValueChild]);

  const { control, handleSubmit } = useForm<FormType>({
    defaultValues: {
      price: announcement?.price || 0,
      priceForChild: announcement?.priceForChild || 0,
    },
    mode: "onSubmit",
  });
  return (
    <main className="min-h-screen overflow-auto">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography
              size={18}
              weight={500}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {checkPriceService() ? t("changeAd") : t("newService")}
            </Typography>
            <Typography
              size={14}
              weight={400}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("priceService")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => setShowModal(true)}
          >
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={9} totalSteps={9} />
      </Header>
      {showModal && (
        <Modal className="flex w-full h-full justify-center items-center p-4" open={showModal} onClose={() => setShowModal(false)}>
          <div className="relative w-full flex flex-col bg-white p-4 rounded-lg">
          <Typography size={16} weight={400} className="text-center w-4/5 mx-auto">
            {t("confirmDelete")}
          </Typography>
          <div onClick={() => setShowModal(false)} className="absolute right-[-2px] top-[-2px] p-4">
          <img src={XIcon} className="w-[15px]" alt="" />
          </div>
          <div className="flex flex-col w-full px-4 justify-center mt-4">
            <Button className="mb-2" onClick={() => navigate({
              to: "/announcements"
            })}>{t("publish")}</Button>
              <Button mode="red" className="border-2 border-red" onClick={ async () =>{
              await apiService.delete({
                url: `/ad/${adId}`
              })
              navigate({
                to: "/announcements"
              })
            }
            }>{t("delete")}</Button>
          </div>
          </div>
        </Modal>
      )}
      <div className="">
        <div className="flex justify-between items-center px-4">
          <div className="flex flex-col">
            <Typography size={16} weight={400} className="">
              {t("booking")}
            </Typography>
            <Typography
              size={12}
              weight={400}
              color={COLORS_TEXT.gray100}
              className=""
            >
              {t("bookingBoolean")}
            </Typography>
          </div>
          <Switch
            checked={booking}
            onChange={() => setBooking(!booking)}
            className="sr-only"
          />
        </div>
        <div className="mt-5 px-4">
          <Typography size={16} weight={400}>
            {t("priceService")}
          </Typography>
          <Typography
            size={12}
            weight={400}
            className="mb-4"
            color={COLORS_TEXT.gray100}
          >
            {t("ifFree")}
          </Typography>
        </div>
        <DefaultForm
          className="mt-2"
          onSubmit={handleSubmit(async () => {
            const sanitizedPrice = inputValue.replace(/\s/g, ""); // Убираем все пробелы
            const sanitizedPriceForChild = inputValueChild.replace(/\s/g, ""); // Убираем все пробелы
            const response = await apiService.patch({
              url: `/ad/${adId}`,
              dto: {
                isBookable: booking,
                onSitePayment: onSitePayment,
                onlinePayment: onlinePayment,
                price: Number(sanitizedPrice),
                priceForChild: Number(sanitizedPriceForChild),
              },
            });
            if (response.data) {
              navigate({
                to: "/announcements",
              });
            }
          })}
        >
          <Controller
            name="price"
            control={control}
            rules={{
              maxLength: {
                value: 40,
                message: t("maxLengthExceeded", { count: 40 }),
              },
            }}
            render={({ field }) => (
              <div className=" relative px-4">
                <label
                  htmlFor="amount"
                  className={`block text-[12px] font-normal ${
                    isFocused ? "text-blue200" : "text-[#999999]"
                  }`}
                >
                  {t("priceForAdult")}
                </label>
                <input
                  {...field}
                  defaultValue={0}
                  ref={inputRef}
                  id="amount"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={inputValue}
                  onFocus={() => setIsFocused(true)} // Ставим фокус
                  onBlur={() => setIsFocused(false)} // Убираем фокус
                  onChange={(e) => handleInputChange(e.target.value)}
                  className=" rounded-lg pb-2 w-full bg-white focus:outline-none focus:ring-0"
                />
                <div
                  ref={symbolRef}
                  id="tenge"
                  className="absolute top-[30px] transform -translate-y-1/2 text-black"
                  style={{ left: "0px" }}
                >
                  ₸
                </div>
              </div>
            )}
          />
          <Controller
            name="priceForChild"
            control={control}
            rules={{
              maxLength: {
                value: 40,
                message: t("maxLengthExceeded", { count: 40 }),
              },
            }}
            render={({ field }) => (
              <div className="relative px-4">
                <label
                  htmlFor="amountChild"
                  className={`block text-[12px] font-normal ${
                    isFocusedChild ? "text-blue200" : "text-[#999999]"
                  }`}
                >
                  {t("priceForChild")}
                </label>
                <input
                  {...field}
                  ref={inputRefChild}
                  id="amountChild"
                  type="text"
                  inputMode="numeric"
                  maxLength={10}
                  value={inputValueChild}
                  onFocus={() => setIsFocusedChild(true)}
                  onBlur={() => setIsFocusedChild(false)}
                  onChange={(e) => handleInputChangeChild(e.target.value)}
                  className="rounded-lg pb-2 w-full bg-white focus:outline-none focus:ring-0"
                />
                <div
                  ref={symbolRefChild}
                  className="absolute top-[30px] transform -translate-y-1/2 text-black"
                  style={{ left: "0px" }}
                >
                  ₸
                </div>
              </div>
            )}
          />
          <div className="fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full z-10">
            <Button className="" type="submit" mode="default">
              {t("continueBtn")}
            </Button>
          </div>
        </DefaultForm>
      </div>
      <div className="px-4">
        <SmallHint background="white" text={t("paymentMethod")} />
      </div>
      <div className="flex justify-between items-center px-4 mb-10">
        <div className="flex flex-col">
          <Typography size={16} weight={400} className="">
            {t("payOnPlace")}
          </Typography>
          <Typography
            size={12}
            weight={400}
            color={COLORS_TEXT.gray100}
            className=""
          >
            {t("payOnPlaceOrOnline")}
          </Typography>
        </div>
        <Switch
          checked={onSitePayment}
          onChange={() => setOnSitePayment(!onSitePayment)}
          className="sr-only"
        />
      </div>
      <div className="flex justify-between items-center px-4">
        <div className="flex flex-col">
          <Typography size={16} weight={400} className="">
            {t("onlinePayment")}
          </Typography>
          <Typography
            size={12}
            weight={400}
            color={COLORS_TEXT.gray100}
            className=""
          >
            {t("payIsMadeOnline")}
          </Typography>
        </div>
        <Switch
          checked={onlinePayment}
          // onChange={() => _setOnlinePayment(!onlinePayment)}
          className="sr-only"
        />
      </div>
      <div className="px-4 mt-2 mb-32">
        <Typography size={12} weight={700} color={COLORS_TEXT.red}>
          {t("accessAcount")}{" "}
          <span style={{ fontWeight: 400 }}>{t("accountOnlinePay")}</span>
        </Typography>
        <Button
          onClick={() =>
            navigate({
              to: `/profile`,
            })
          }
          mode="transparent"
        >
          {t("accessAccountBtn")}
        </Button>
      </div>
    </main>
  );
};
