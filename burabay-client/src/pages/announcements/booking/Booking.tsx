import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookingState } from "../booking-time/BookingTime";
import { useLocation } from "@tanstack/react-router";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { Typography } from "../../../shared/ui/Typography";
import { COLORS_BACKGROUND, COLORS_TEXT } from "../../../shared/ui/colors";
import BackIcon from "../../../app/icons/announcements/blueBackicon.svg";
import { baseUrl, HTTP_STATUS } from "../../../services/api/ServerData";
import StarIcon from "../../../app/icons/announcements/star.svg";
import { DefaultForm } from "../../auth/ui/DefaultForm";
import { Controller, useForm } from "react-hook-form";
import { useAuth } from "../../../features/auth";
import { Radio, Switch, TextField } from "@mui/material";
import { useMask } from "@react-input/mask";
import { Button } from "../../../shared/ui/Button";
import { apiService } from "../../../services/api/ApiService";

type PaymentType = "online" | "cash";

interface FormType {
  name: string;
  phoneNumber: string;
  date: string;
  time: string;
  isChildRate: boolean;
  paymentType: PaymentType;
}

export const Booking: FC = function Booking() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { time, date, announcement } = location.state as BookingState;
  const { t } = useTranslation();
  const { user } = useAuth();
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("ru-RU").format(value) + " ₸";
  };
  const mask = useMask({
    mask: "+7 ___ ___-__-__",
    replacement: { _: /\d/ },
    showMask: true,
  });
  const { handleSubmit, watch, control, setValue } = useForm<FormType>({
    defaultValues: {
      name: user?.fullName || "Безымянный",
      phoneNumber: user?.phoneNumber || "",
      date: date,
      time: time,
      isChildRate: false,
      paymentType: "online",
    },
    mode: "onChange",
  });

  const paymentType = watch("paymentType");
  const isChildRate = watch("isChildRate");

  const saveBooking = async (form: FormType) => {
    try {
      setIsLoading(true);
      const response = await apiService.post<string>({
        url: "/booking",
        dto: form,
      });

      if (parseInt(response.data) === parseInt(HTTP_STATUS.CREATED)) {
        console.log(true);
      } else {
        console.error(response.data);
      }
      setIsLoading(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section>
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
              {t("booking")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => history.back()}
          ></IconContainer>
        </div>
      </Header>

      <div className="mb-4 px-4">
        <div className="flex">
          <img
            src={baseUrl + announcement.images[0]}
            alt={announcement.title}
            className="w-[52px] h-[52px] object-cover rounded-lg mr-2"
          />
          <div>
            <span>{announcement.title}</span>
            <div className="flex items-center">
              <div className="flex items-center mr-2">
                <img src={StarIcon} className="w-[16px] mr-1 mb-1" />
                <span className="mr-1">
                  {announcement.avgRating ? announcement.avgRating : 0}
                </span>
              </div>
              <div
                className={`${COLORS_BACKGROUND.gray100} w-1 h-1 rounded-full mr-2`}
              ></div>
              <span className={`mr-1 ${COLORS_TEXT.gray100}`}>
                {announcement.reviewCount ? announcement.reviewCount : 0}{" "}
                {t("grades")}
              </span>
            </div>
          </div>
        </div>
      </div>

      <ul className="px-4 mb-4">
        <li className="flex justify-between border-b border-[#E4E9EA] py-4 items-center">
          <span className={`${COLORS_TEXT.blue200} text-sm`}>
            {t("bookingDate")}
          </span>
          <span>{date}</span>
        </li>
        <li className="flex justify-between border-b border-[#E4E9EA] py-4 items-center">
          <span className={`${COLORS_TEXT.blue200} text-sm`}>
            {t("bookingTime")}
          </span>
          <span>{time}</span>
        </li>
      </ul>

      <div className="px-4 mb-4">
        <h2 className="text-lg font-medium mb-2">{t("yourData")}</h2>
        <DefaultForm id="paymentForm" onSubmit={handleSubmit(saveBooking)}>
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
              <div className="relative w-full">
                <TextField
                  {...field}
                  error={Boolean(error?.message)}
                  helperText={error?.message}
                  label={t("name")}
                  fullWidth={true}
                  variant="outlined"
                />
                <span className="absolute top-2 right-2 text-gray-400 text-sm">
                  {field.value?.length || 0}/40
                </span>
              </div>
            )}
          />

          <Controller
            name="phoneNumber"
            control={control}
            rules={{
              required: t("requiredField"),
              validate: (value: string) => {
                const phoneRegex = /^\+7 \d{3} \d{3}-\d{2}-\d{2}$/;
                return phoneRegex.test(value) || t("invalidNumber");
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                error={Boolean(error?.message)}
                helperText={error?.message}
                fullWidth
                type="tel"
                inputMode="tel"
                label={t("phoneV2")}
                variant="outlined"
                inputRef={mask}
                placeholder="+7 700 000-00-00"
              />
            )}
          />
        </DefaultForm>
      </div>

      <div className="px-4 mb-4">
        <h2 className="font-medium text-lg mb-2">{t("costOneService")}</h2>
        <ul className="flex mb-4">
          <li className="flex flex-col w-44">
            <span className={`text-[#155A77] font-medium text-lg`}>
              {formatPrice(announcement.price)}
            </span>
            <span className={`${COLORS_TEXT.gray100} text-sm`}>
              {t("forAdults")}
            </span>
          </li>
          <li className="flex flex-col w-44">
            <span className={`text-[#155A77] font-medium text-lg`}>
              {formatPrice(announcement.priceForChild)}
            </span>
            <span className={`${COLORS_TEXT.gray100} text-sm`}>
              {t("paymentForKids")}
            </span>
          </li>
        </ul>
      </div>

      <p
        className={`${COLORS_BACKGROUND.almostWhite} mx-4 p-4 leading-5 rounded-lg mb-4`}
      >
        {t("bookingAttention")}
      </p>

      <ul className="px-4 mb-4">
        <li className="mb-4">
          <span>
            {t("adults") +
              " — " +
              (announcement.adultsNumber
                ? announcement.adultsNumber
                : "без ограничений")}
          </span>
          <p className={`${COLORS_TEXT.gray100} leading-4 text-sm`}>
            {t("maxAdults")}
          </p>
        </li>
        <li className="mb-4">
          <span>
            {t("kids") +
              " — " +
              (announcement.kidsNumber
                ? announcement.kidsNumber
                : "без ограничений")}
          </span>
          <p className={`${COLORS_TEXT.gray100} leading-4 text-sm`}>
            {t("maxKids")}
          </p>
        </li>
      </ul>

      <div className="px-4 mb-4">
        <Controller
          name={"isChildRate"}
          control={control}
          render={() => (
            <div className="flex justify-between items-center">
              <div>
                <span>{t("childRate")}</span>
                <p className={`${COLORS_TEXT.gray100} text-xs`}>
                  {t("ifChildRate")}
                </p>
              </div>
              <Switch
                checked={isChildRate}
                onChange={() => setValue("isChildRate", !isChildRate)}
              />
            </div>
          )}
        />
      </div>

      <div className="px-4 flex flex-col">
        <span className="text-[22px] font-medium mb-2">{t("total")}</span>
        <span className={`font-bold ${COLORS_TEXT.blue200} text-[28px]`}>
          {isChildRate
            ? formatPrice(announcement.priceForChild)
            : formatPrice(announcement.price)}
        </span>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center">
          <div className={`w-28 ${COLORS_BACKGROUND.gray100} h-0.5`}></div>
          <span className={`${COLORS_TEXT.gray100}`}>{t("paymentMethod")}</span>
          <div className={`w-28 ${COLORS_BACKGROUND.gray100} h-0.5`}></div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <Controller
          name={"paymentType"}
          control={control}
          render={() => (
            <div className="flex justify-between items-center py-3">
              <div>
                <span>{t("onlinePayment")}</span>
                <p className={`${COLORS_TEXT.gray100} text-xs`}>
                  {t("onlinePaymentDescription")}
                </p>
              </div>
              <Radio
                checked={paymentType === "online"}
                onChange={() => setValue("paymentType", "online")}
              />
            </div>
          )}
        />
        <Controller
          name={"paymentType"}
          control={control}
          render={() => (
            <div className="flex justify-between items-center py-3">
              <div>
                <span>{t("payOnPlace")}</span>
                <p className={`${COLORS_TEXT.gray100} text-xs`}>
                  {t("payOnPlaceOrOnline")}
                </p>
              </div>
              <Radio
                checked={paymentType === "cash"}
                onChange={() => setValue("paymentType", "cash")}
              />
            </div>
          )}
        />
      </div>

      <div className="flex justify-center">
        <Button
          className="w-header z-10"
          type="submit"
          onClick={() => handleSubmit(saveBooking)()}
          loading={isLoading}
        >
          {t("pay")}
        </Button>
      </div>
    </section>
  );
};
