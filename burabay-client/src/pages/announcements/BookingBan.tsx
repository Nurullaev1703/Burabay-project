import { FC, useState, useEffect } from "react";
import { Header } from "../../components/Header";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import { ProgressSteps } from "./ui/ProgressSteps";
import { COLORS_TEXT } from "../../shared/ui/colors";
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Button } from "../../shared/ui/Button";
import PlusIcon from "../../app/icons/announcements/bluePlus.svg";
import editIcon from "../../app/icons/announcements/edit.svg";
import { Modal, Switch } from "@mui/material";
import { useMatch, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { apiService } from "../../services/api/ApiService";
import { Announcement, BookingBanDate } from "./model/announcements";
import dayjs, { Dayjs } from "dayjs";
import { BookingBanCalendar } from "./ui/BookingBanCalendar";

interface Props {
  adId: string;
  announcement?: Announcement;
}

interface DateSettings {
  allDay: boolean;
  times: string[];
  id?: string; // ID записи на сервере для обновления/удаления
}
interface TransformedData {
  [key: string]: DateSettings;
}

export const BookingBan: FC<Props> = function BookingBan({
  adId,
  announcement,
}) {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hasActiveBookings, setHasActiveBookings] = useState(false);
  const match = useMatch({
    from: "/announcements/bookingBan/$adId",
  });
  const searchParams = new URLSearchParams(match.search);
  const serviceTimeParam = searchParams.get("serviceTime");
  const serviceTime = serviceTimeParam ? serviceTimeParam.split(",") : [];
  const { t, i18n } = useTranslation();

  const checkBookingBan = () => {
    if (
      announcement?.bookingBanDate &&
      announcement?.bookingBanDate.length > 0
    ) {
      return true;
    }
    return false;
  };

  // Проверяем, является ли услуга круглосуточной через поле isFullDay из announcement
  const isFullDayService = announcement?.isFullDay || false;

  // Состояние для забронированных дат
  const [bookedDates, setBookedDates] = useState<
    Array<{ startDate: string; endDate?: string }>
  >([]);

  const [dates, setDates] = useState<string[]>(() => {
    const result =
      announcement?.bookingBanDate
        ?.filter((item) => item.date && !isNaN(new Date(item.date).getTime()))
        ?.map((item) => dayjs(item.date).format("DD.MM.YYYY")) || [];
    // Убираем дубликаты дат
    return Array.from(new Set(result));
  });

  const [dateSettings, setDateSettings] = useState<
    Record<string, DateSettings>
  >(() => {
    const result = transformData(announcement?.bookingBanDate || []) || {};
    return result;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModals, setShowModals] = useState<Record<string, boolean>>({});
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [currentSelectedDate, setCurrentSelectedDate] = useState<Dayjs | null>(
    null
  );
  const navigate = useNavigate();

  // Загружаем забронированные даты при монтировании компонента
  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const response = await apiService.get<
          Array<{ startDate: string; endDate?: string }>
        >({
          url: `/ad/check-dates/${adId}`,
        });
        if (response.data) {
          setBookedDates(response.data);
        }
      } catch (error) {
        console.error("Ошибка загрузки забронированных дат:", error);
      }
    };

    fetchBookedDates();
  }, [adId]);

  // Проверяем наличие активных бронирований при редактировании
  useEffect(() => {
    const checkActiveBookings = async () => {
      if (announcement) {
        try {
          const response = await apiService.get<{ hasActive: boolean }>({
            url: `/booking/has-active/${adId}`,
          });
          if (response.data) {
            setHasActiveBookings(response.data.hasActive);
          }
        } catch (error) {
          console.error("Ошибка проверки активных бронирований:", error);
        }
      }
    };

    checkActiveBookings();
  }, [adId, announcement]);

  // Получаем локаль для календаря
  const locale =
    i18n.language === "kk" ? "kk" : i18n.language === "en" ? "en" : "ru";

  const addDate = (newDate: string) => {
    if (!dates.includes(newDate)) {
      setDates([...dates, newDate]);
      setDateSettings({
        ...dateSettings,
        [newDate]: {
          allDay: isFullDayService, // Если услуга круглосуточная, сразу блокируем весь день
          times: isFullDayService ? [...serviceTime] : [],
        },
      });
    }
  };

  // Обработчик выбора даты из календаря
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      const formattedDate = date.format("DD.MM.YYYY");
      addDate(formattedDate);
      setCurrentSelectedDate(date);

      if (isFullDayService) {
        // Для круглосуточных услуг просто добавляем дату, календарь остается открытым
        // Не закрываем календарь и не открываем модалку
      } else {
        // Для услуг с временными интервалами - закрываем календарь и открываем модалку
        setShowCalendar(false);
        openModalForDate(formattedDate);
      }
    }
  };

  // Проверка, заблокирована ли дата
  const shouldDisableDate = (date: Dayjs) => {
    const formattedDate = date.format("DD.MM.YYYY");

    // Блокируем прошедшие даты и уже выбранные
    if (date.isBefore(dayjs(), "day") || dates.includes(formattedDate)) {
      return true;
    }

    // Проверяем, является ли расписание полностью круглосуточным (все дни 00:00 - 00:00)
    let isFullyUnavailable = false; // Все дни недоступны (00:00 - 00:00)
    if (announcement?.schedule) {
      const schedule = announcement.schedule;
      const allDaysUnavailable =
        schedule.monStart === "00:00" &&
        schedule.monEnd === "00:00" &&
        schedule.tueStart === "00:00" &&
        schedule.tueEnd === "00:00" &&
        schedule.wenStart === "00:00" &&
        schedule.wenEnd === "00:00" &&
        schedule.thuStart === "00:00" &&
        schedule.thuEnd === "00:00" &&
        schedule.friStart === "00:00" &&
        schedule.friEnd === "00:00" &&
        schedule.satStart === "00:00" &&
        schedule.satEnd === "00:00" &&
        schedule.sunStart === "00:00" &&
        schedule.sunEnd === "00:00";

      // Если не все дни 00:00 - 00:00, то у нас есть график работы
      if (!allDaysUnavailable) {
        // Блокируем дни недели, которые недоступны в расписании (00:00 - 00:00)
        const dayOfWeek = date.day(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        const dayMap: Record<number, { start: string; end: string }> = {
          1: { start: schedule.monStart, end: schedule.monEnd },
          2: { start: schedule.tueStart, end: schedule.tueEnd },
          3: { start: schedule.wenStart, end: schedule.wenEnd },
          4: { start: schedule.thuStart, end: schedule.thuEnd },
          5: { start: schedule.friStart, end: schedule.friEnd },
          6: { start: schedule.satStart, end: schedule.satEnd },
          0: { start: schedule.sunStart, end: schedule.sunEnd },
        };

        const daySchedule = dayMap[dayOfWeek];
        // Если оба времени "00:00" - день полностью недоступен
        if (
          daySchedule &&
          daySchedule.start === "00:00" &&
          daySchedule.end === "00:00"
        ) {
          return true;
        }
      }
      // Если все дни 00:00 - 00:00, то это круглосуточно - не блокируем по расписанию
    }

    // Блокируем даты, которые уже забронированы
    for (const booking of bookedDates) {
      if (booking.endDate) {
        // Для диапазона дат (аренда жилья)
        const startDate = dayjs(booking.startDate, [
          "DD.MM.YYYY",
          "YYYY-MM-DD",
        ]);
        const endDate = dayjs(booking.endDate, ["DD.MM.YYYY", "YYYY-MM-DD"]);

        // Проверяем, попадает ли дата в диапазон [startDate, endDate)
        if (
          (date.isAfter(startDate, "day") || date.isSame(startDate, "day")) &&
          date.isBefore(endDate, "day")
        ) {
          return true;
        }
      } else {
        // Для одной даты (почасовое бронирование)
        const bookedDate = dayjs(booking.startDate, [
          "DD.MM.YYYY",
          "YYYY-MM-DD",
        ]);
        if (date.isSame(bookedDate, "day")) {
          return true;
        }
      }
    }

    return false;
  };
  function transformData(data: BookingBanDate[]): TransformedData {
    return data.reduce<TransformedData>((acc, item) => {
      if (!item.date || isNaN(new Date(item.date).getTime())) {
        return acc;
      }

      const formattedDate = dayjs(item.date).format("DD.MM.YYYY");

      if (!acc[formattedDate]) {
        acc[formattedDate] = {
          allDay: item.allDay,
          times: [...item.times],
          id: item.id, // Сохраняем ID для обновления/удаления
        };
      } else {
        // Объединяем времена и удаляем дубликаты
        const combinedTimes = [...acc[formattedDate].times, ...item.times];
        acc[formattedDate].times = Array.from(new Set(combinedTimes));
      }
      return acc;
    }, {});
  }

  const toggleTimeSelection = (time: string) => {
    if (selectedDate) {
      setSelectedTimes((prevSelectedTimes) => {
        if (prevSelectedTimes.includes(time)) {
          return prevSelectedTimes.filter((t) => t !== time);
        } else {
          return [...prevSelectedTimes, time];
        }
      });
    }
  };

  const toggleAllDay = () => {
    if (selectedDate) {
      const newAllDayState = !dateSettings[selectedDate]?.allDay;
      setDateSettings({
        ...dateSettings,
        [selectedDate]: {
          allDay: newAllDayState,
          times: newAllDayState ? [...serviceTime] : [], // Если включаем allDay - блокируем все время, иначе очищаем
        },
      });
      // Обновляем selectedTimes для синхронизации UI
      setSelectedTimes(newAllDayState ? [...serviceTime] : []);
    }
  };

  const saveDateSettings = () => {
    if (selectedDate) {
      // Проверяем, что выбрано хотя бы одно время или включен allDay
      const isAllDay = dateSettings[selectedDate]?.allDay;
      const hasSelectedTimes = selectedTimes.length > 0;

      if (!isAllDay && !hasSelectedTimes) {
        // Если не выбрано время и не включен allDay - удаляем дату
        setDates(dates.filter((d) => d !== selectedDate));
        const newSettings = { ...dateSettings };
        delete newSettings[selectedDate];
        setDateSettings(newSettings);
      } else {
        // Сохраняем настройки
        setDateSettings({
          ...dateSettings,
          [selectedDate]: {
            ...dateSettings[selectedDate],
            times: selectedTimes, // Сохраняем выбранные (заблокированные) времена
          },
        });
      }
    }
    setShowModals((prev) => ({ ...prev, [selectedDate!]: false }));
    setSelectedDate(null);
    setSelectedTimes([]);
  };

  const openModalForDate = (date: string) => {
    setSelectedDate(date);
    setShowModals((prev) => ({ ...prev, [date]: true }));
    // Устанавливаем уже заблокированные времена как выбранные
    setSelectedTimes(dateSettings[date]?.times || []);
  };

  const closeCalendar = () => {
    setShowCalendar(false);
    setCurrentSelectedDate(null);
  };

  // Конвертируем дату из DD.MM.YYYY в ISO формат для сервера
  const convertToISODate = (dateString: string): string => {
    const [day, month, year] = dateString.split(".");
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async () => {
    // Если есть активные бронирования и это редактирование - показываем модалку
    if (hasActiveBookings && announcement) {
      setShowConfirmModal(true);
      return;
    }

    // Иначе сохраняем как обычно
    await saveChanges();
  };

  const saveChanges = async () => {
    try {
      // Разделяем даты на новые (без ID) и существующие (с ID)
      const newDates: Array<{
        adId: string;
        date: string;
        allDay: boolean;
        times: string[];
      }> = [];
      const existingDates: Array<{
        id: string;
        date: string;
        allDay: boolean;
        times: string[];
      }> = [];

      dates.forEach((date) => {
        const settings = dateSettings[date];
        const dateData = {
          date: convertToISODate(date),
          allDay: settings.allDay,
          times: settings.times,
        };

        if (settings.id) {
          // Существующая дата - будем обновлять
          existingDates.push({
            id: settings.id,
            ...dateData,
          });
        } else {
          // Новая дата - будем создавать
          newDates.push({
            adId: adId,
            ...dateData,
          });
        }
      });
      // Создаём новые даты и сохраняем их ID
      if (newDates.length > 0) {
        const response = await apiService.post<BookingBanDate[]>({
          url: `/booking-ban-date`,
          dto: newDates,
        });

        // Обновляем dateSettings с полученными ID
        if (response.data) {
          const updatedSettings = { ...dateSettings };
          response.data.forEach((createdDate) => {
            const formattedDate = dayjs(createdDate.date).format("DD.MM.YYYY");
            if (updatedSettings[formattedDate]) {
              updatedSettings[formattedDate].id = createdDate.id;
            }
          });
          setDateSettings(updatedSettings);
        }
      }

      // Обновляем существующие даты
      for (const dateData of existingDates) {
        const { id, ...updateDto } = dateData;
        await apiService.patch<string>({
          url: `/booking-ban-date/${id}`,
          dto: updateDto,
        });
      }

      // После успешного сохранения редиректим пользователя
      if (hasActiveBookings && announcement) {
        // Если есть активные бронирования - переходим на страницу объявлений
        navigate({
          to: "/announcements",
        });
      } else {
        // Иначе переходим на следующий шаг
        navigate({
          to: "/announcements/newService/$adId",
          params: {
            adId: adId,
          },
        });
      }
    } catch (error) {
      console.error("Ошибка при сохранении дат:", error);
    }
  };

  return (
    <main className="min-h-screen bg-[#F1F2F6] pb-16">
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
              {checkBookingBan() ? t("changeAd") : t("bookingban")}
            </Typography>
            <Typography
              size={14}
              weight={400}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("optionalNew")}
            </Typography>
          </div>
          <IconContainer
            align="end"
            action={() => {
              if (announcement) {
                // Если редактируем - просто возвращаемся назад
                navigate({ to: "/announcements" });
              } else {
                // Если создаём - показываем модалку
                setShowModal(true);
              }
            }}
          >
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={7} totalSteps={9} />
      </Header>
      {showModal && !announcement && (
        <Modal
          className="flex w-full h-full justify-center items-center p-4"
          open={showModal}
          onClose={() => setShowModal(false)}
        >
          <div className="relative w-full flex flex-col bg-white p-4 rounded-lg">
            <Typography
              size={16}
              weight={400}
              className="text-center w-4/5 mx-auto"
            >
              {t("confirmDelete")}
            </Typography>
            <div
              onClick={() => setShowModal(false)}
              className="absolute right-[-2px] top-[-2px] p-4"
            >
              <img src={XIcon} className="w-[15px]" alt="" />
            </div>
            <div className="flex flex-col w-full px-4 justify-center mt-4">
              <Button
                className="mb-2"
                onClick={() =>
                  navigate({
                    to: "/announcements",
                  })
                }
              >
                {t("publish")}
              </Button>
              <Button
                mode="red"
                className="border-2 border-red"
                onClick={async () => {
                  setIsDeleting(true);
                  try {
                    await apiService.delete({
                      url: `/ad/${adId}`,
                    });
                    navigate({
                      to: "/announcements",
                    });
                  } catch (error) {
                    console.error("Ошибка при удалении объявления:", error);
                    setIsDeleting(false);
                  }
                }}
                disabled={isDeleting}
              >
                {isDeleting ? t("deleting") : t("delete")}
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <div className="p-4 cursor-none">
        <button
          onClick={() => setShowCalendar(true)}
          className="w-full relative flex items-center border bg-white rounded-lg p-4 h-20 mb-4 cursor-pointer hover:bg-gray-50 transition-colors"
        >
          <img src={PlusIcon} alt="Добавить" />
          <Typography
            size={16}
            weight={600}
            color={COLORS_TEXT.blue200}
            className="w-[calc(100% - 84px)] absolute top-1/2 -translate-y-1/2 left-[52px]"
          >
            {isFullDayService ? t("addDateToBan") : t("addDateToBan")}
          </Typography>
        </button>

        {/* Предупреждение о наличии активных бронирований */}
        {hasActiveBookings && announcement && (
          <div className="mb-4 p-3 bg-red-50 rounded-lg">
            <Typography
              size={14}
              weight={500}
              color={COLORS_TEXT.red}
              className="text-center"
            >
              {t("activeBookingsWarning")}
            </Typography>
          </div>
        )}

        {/* Модальное окно с календарём */}
        <BookingBanCalendar
          open={showCalendar}
          onClose={closeCalendar}
          value={currentSelectedDate}
          onChange={handleDateChange}
          shouldDisableDate={shouldDisableDate}
          blockedDates={dates}
          locale={locale}
        />

        {dates.map((date) => (
          <div
            key={`date-card-${date}`}
            className="p-3 bg-white border rounded shadow mb-2 flex justify-between items-start"
          >
            <div className="w-full">
              <div className="w-full flex items-center justify-between">
                <Typography size={18} weight={500}>
                  {date}
                </Typography>
                <IconContainer
                  action={() => {
                    if (isFullDayService) {
                      // Для круглосуточных услуг сразу удаляем дату
                      const deleteDateHandler = async () => {
                        const banDateId = dateSettings[date]?.id;
                        if (banDateId) {
                          try {
                            await apiService.delete({
                              url: `/booking-ban-date/${banDateId}`,
                            });
                          } catch (error) {
                            console.error("Ошибка при удалении даты:", error);
                          }
                        }
                        setDates((prev) =>
                          prev.filter((item) => item !== date)
                        );
                        const newSettings = { ...dateSettings };
                        delete newSettings[date];
                        setDateSettings(newSettings);
                      };
                      deleteDateHandler();
                    } else {
                      // Для услуг с временными интервалами открываем модалку
                      openModalForDate(date);
                    }
                  }}
                  align="center"
                >
                  <img src={isFullDayService ? XIcon : editIcon} alt="" />
                </IconContainer>
              </div>
              {dateSettings[date]?.allDay ? (
                <Typography size={16} weight={400} className="mt-3">
                  {t("unavailableAllDay")}
                </Typography>
              ) : (
                <div className="flex overflow-x-scroll gap-1 mt-1">
                  {dateSettings[date]?.times.map((time, index) => (
                    <Typography
                      color={COLORS_TEXT.gray100}
                      key={`${date}-${time}-${index}`}
                      className="border-gray100 border px-10 py-2.5 rounded-2xl mr-2"
                    >
                      {time}
                    </Typography>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Модальные окна только для услуг с временными интервалами */}
      {!isFullDayService &&
        dates.map((date) =>
          showModals[date] && dateSettings[date] ? (
            <div
              key={`modal-${date}`}
              className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-20"
            >
              <div className="bg-white rounded-lg p-4 w-11/12 max-w-md">
                <Typography size={18} weight={500} className="mb-3">
                  {t("banTo")} {date}
                </Typography>

                <Typography
                  size={14}
                  weight={400}
                  color={COLORS_TEXT.gray100}
                  className="mb-3"
                >
                  {t("selectTimeOrAllDay")}
                </Typography>

                <label className="flex items-center justify-between mb-4">
                  {t("unavailableAllDay")}
                  <Switch
                    type="checkbox"
                    checked={dateSettings[date]?.allDay || false}
                    onChange={toggleAllDay}
                    className="w-6 h-6"
                  />
                </label>

                {!dateSettings[date]?.allDay && serviceTime.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {serviceTime.map((time, index) => {
                      const isTimeSelected = selectedTimes.includes(time);

                      return (
                        <button
                          key={`${date}-service-${time}-${index}`}
                          onClick={() => toggleTimeSelection(time)}
                          className={`border rounded-2xl px-7 py-2 ${
                            isTimeSelected
                              ? "border-red text-red-500"
                              : "border-blue200"
                          }`}
                        >
                          {time}
                        </button>
                      );
                    })}
                  </div>
                )}

                <div className="flex justify-between mt-4 flex-col gap-2">
                  <Button
                    onClick={saveDateSettings}
                    className="text-white"
                    disabled={
                      !dateSettings[date]?.allDay && selectedTimes.length === 0
                    }
                  >
                    {t("saveBtn")}
                  </Button>
                  <Button
                    onClick={async () => {
                      const banDateId = dateSettings[date]?.id;

                      if (banDateId) {
                        // Если есть ID - удаляем на сервере
                        try {
                          await apiService.delete({
                            url: `/booking-ban-date/${banDateId}`,
                          });
                        } catch (error) {
                          console.error("Ошибка при удалении даты:", error);
                        }
                      }

                      // Удаляем из локального состояния
                      setDates((prev) => prev.filter((item) => item !== date));
                      const newSettings = { ...dateSettings };
                      delete newSettings[date];
                      setDateSettings(newSettings);
                      setShowModals((prev) => ({ ...prev, [date]: false }));
                    }}
                    mode="border"
                  >
                    {t("deleteBtn")}
                  </Button>
                </div>
              </div>
            </div>
          ) : null
        )}

      {/* Модальное окно подтверждения при наличии активных бронирований */}
      {showConfirmModal && hasActiveBookings && announcement && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1400]">
          <div className="bg-white rounded-lg p-6 w-11/12 max-w-md">
            <Typography
              size={16}
              weight={500}
              color={COLORS_TEXT.red}
              className="text-center mb-6"
            >
              {t("activeBookingsConfirmTitle")}
            </Typography>

            <div className="flex flex-col gap-3">
              <Button
                onClick={async () => {
                  setShowConfirmModal(false);
                  await saveChanges();
                }}
                mode="default"
              >
                {t("saveBtn")}
              </Button>
              <Button
                onClick={() => {
                  setShowConfirmModal(false);
                  navigate({
                    to: "/announcements",
                  });
                }}
                mode="border"
              >
                {t("cancelBtn")}
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full z-10">
        <Button onClick={handleSubmit} mode="default">
          {announcement ? t("saveBtn") : t("continueBtn")}
        </Button>
      </div>
    </main>
  );
};
