import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { BookingState } from "../booking-time/BookingTime";
import { useLocation, useNavigate } from "@tanstack/react-router";
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
import DefaultIcon from "../../../app/icons/abstract-bg.svg"

export type PaymentType = "online" | "cash";

interface FormType {
  adId: string;
  name: string;
  phoneNumber: string;
  date?: string | null;
  time?: string | null;
  isChildRate: boolean;
  paymentType: PaymentType;
  dateStart?: string | null;
  dateEnd?: string | null;
}

export const Booking: FC = function Booking() {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { time, date, announcement, dateStart, dateEnd } =
    location.state as BookingState;
  const { t } = useTranslation();
  const { user } = useAuth();
  const formatPrice = (value: number) => {
    return new Intl.NumberFormat("ru-RU").format(value) + " ₸";
  };
  const navigate = useNavigate();
  const [imageSrc, setImageSrc] = useState<string>(
    baseUrl + announcement.images[0]
  );
  const mask = useMask({
    mask: "+7 ___ ___-__-__",
    replacement: { _: /\d/ },
    showMask: true,
  });
  const formatPhoneNumber = (phone?: string) => {
    if (!phone) return "+7 ___ ___-__-__"; // Возвращаем маску по умолчанию
    const digits = phone.replace(/\D/g, ""); // Убираем все нечисловые символы
    if (digits.length !== 11 || !digits.startsWith("7")) {
      return "+7 ___ ___-__-__"; // Проверяем корректность номера
    }
    return `+7 ${digits.slice(1, 4)} ${digits.slice(4, 7)}-${digits.slice(7, 9)}-${digits.slice(9, 11)}`;
  };

  const { handleSubmit, watch, control, setValue , formState: { isValid } } = useForm<FormType>({
    defaultValues: {
      adId: announcement.id,
      name: user?.fullName || "Безымянный",
      phoneNumber: formatPhoneNumber(user?.phoneNumber) || "",
      date: date || null,
      time: time || null,
      isChildRate: false,
      paymentType: "cash",
      dateStart: dateStart || null,
      dateEnd: dateEnd || null,
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
        navigate({ to: `/booking/tourist` });
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
            src={imageSrc}
            onError={() => setImageSrc(DefaultIcon)}
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
        {date && (
          <li className="flex justify-between border-b border-[#E4E9EA] py-4 items-center">
            <span className={`${COLORS_TEXT.blue200} text-sm`}>
              {t("bookingDate")}
            </span>
            <span>{date}</span>
          </li>
        )}
        {time && (
          <li className="flex justify-between border-b border-[#E4E9EA] py-4 items-center">
            <span className={`${COLORS_TEXT.blue200} text-sm`}>
              {t("bookingTime")}
            </span>
            <span>{time}</span>
          </li>
        )}
        {dateStart && (
          <li className="flex justify-between border-b border-[#E4E9EA] py-4 items-center">
            <span className={`${COLORS_TEXT.blue200} text-sm`}>
              {t("CheckInDate")}
            </span>
            <span>{dateStart}</span>
          </li>
        )}
        {dateEnd && (
          <li className="flex justify-between border-b border-[#E4E9EA] py-4 items-center">
            <span className={`${COLORS_TEXT.blue200} text-sm`}>
              {t("DepatureDate")}
            </span>
            <span>{dateEnd}</span>
          </li>
        )}
        {dateEnd && dateStart && (
          <li className="flex justify-between border-b border-[#E4E9EA] py-4 items-center">
            <span className={`${COLORS_TEXT.blue200} text-sm`}>
              {t("totalDuration")}
            </span>
            <span>
              {(() => {
                const parseDate = (dateString: string) => {
                  const [day, month, year] = dateString.split(".").map(Number);
                  return new Date(year, month - 1, day);
                };
                const getDaySuffix = (days: number) => {
                  if (days % 10 === 1 && days % 100 !== 11) return t("daysV2"); // "дня"
                  if (
                    [2, 3, 4].includes(days % 10) &&
                    ![12, 13, 14].includes(days % 100)
                  ) {
                    return t("daysV2"); // "дня"
                  }
                  return t("daysV1"); // "дней"
                };
                const start = parseDate(dateStart);
                const end = parseDate(dateEnd);
                const diffInMs = end.getTime() - start.getTime();
                const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

                return `${diffInDays} ${getDaySuffix(diffInDays)}`;
              })()}
            </span>
          </li>
        )}
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
          {(() => {
            // Если даты заезда и отъезда указаны
            if (dateStart && dateEnd) {
              // Преобразуем даты в формат Date
              const parseDate = (dateString: string) => {
                const [day, month, year] = dateString.split(".").map(Number);
                return new Date(year, month - 1, day);
              };

              const start = parseDate(dateStart);
              const end = parseDate(dateEnd);

              // Вычисляем разницу в миллисекундах и переводим в дни
              const diffInMs = end.getTime() - start.getTime();
              const totalDays = Math.ceil(diffInMs / (1000 * 60 * 60 * 24)); // Округляем вверх

              // Выбираем стоимость в зависимости от тарифа (взрослый или детский)
              const dailyPrice = isChildRate
                ? announcement.priceForChild
                : announcement.price;

              // Рассчитываем общую стоимость
              const totalCost = totalDays * dailyPrice;

              // Форматируем и возвращаем стоимость
              return formatPrice(totalCost);
            }

            // Если даты не указаны, возвращаем стоимость за один день
            return formatPrice(
              isChildRate ? announcement.priceForChild : announcement.price
            );
          })()}
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
        {announcement.onlinePayment && (
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
                {!announcement.onlinePayment ? (
                  <Radio
                    checked={paymentType === "online"}
                    onChange={() => setValue("paymentType", "online")}
                  />
                ) : (
                  <></>
                )}
              </div>
            )}
          />
        )}
        {announcement.onSitePayment && (
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
                {!announcement.onSitePayment ? (
                  <Radio
                    checked={paymentType === "cash"}
                    onChange={() => setValue("paymentType", "cash")}
                  />
                ) : (
                  <></>
                )}
              </div>
            )}
          />
        )}
      </div>

      <div className="flex justify-center mb-6">
        <Button
          className="w-header z-10"
          type="submit"
          onClick={() => handleSubmit(saveBooking)()}
          disabled={!isValid || isLoading}
          loading={isLoading}
        >
          {t("send")}
        </Button>
      </div>
    </section>
  );
};
