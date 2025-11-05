import { FC, useState } from "react";
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
  const match = useMatch({
    from: "/announcements/bookingBan/$adId",
  });
  const searchParams = new URLSearchParams(match.search);
  const serviceTimeParam = searchParams.get("serviceTime");
  const serviceTime = serviceTimeParam ? serviceTimeParam.split(",") : [];
  const { t, i18n } = useTranslation();

  const [dates, setDates] = useState<string[]>(() => {
    const result =
      announcement?.bookingBanDate
        ?.filter((item) => item.date && !isNaN(new Date(item.date).getTime()))
        ?.map((item) => dayjs(item.date).format("DD.MM.YYYY")) || [];
    console.log("Инициализация дат:", result);
    return result;
  });

  const [dateSettings, setDateSettings] = useState<
    Record<string, DateSettings>
  >(() => {
    const result = transformData(announcement?.bookingBanDate || []) || {};
    console.log("Инициализация настроек дат:", result);
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

  // Получаем локаль для календаря
  const locale =
    i18n.language === "kk" ? "kk" : i18n.language === "en" ? "en" : "ru";

  const addDate = (newDate: string) => {
    if (!dates.includes(newDate)) {
      setDates([...dates, newDate]);
      setDateSettings({
        ...dateSettings,
        [newDate]: { allDay: false, times: [] }, // Изначально нет заблокированных времен, нет ID (новая дата)
      });
    }
  };

  // Обработчик выбора даты из календаря
  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      const formattedDate = date.format("DD.MM.YYYY");
      addDate(formattedDate);
      setCurrentSelectedDate(date);
      // Закрываем календарь и открываем модальное окно выбора времени
      setShowCalendar(false);
      openModalForDate(formattedDate);
    }
  };

  // Проверка, заблокирована ли дата
  const shouldDisableDate = (date: Dayjs) => {
    const formattedDate = date.format("DD.MM.YYYY");
    // Блокируем прошедшие даты и уже выбранные
    return date.isBefore(dayjs(), "day") || dates.includes(formattedDate);
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
        acc[formattedDate].times.push(...item.times);
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
    // Массив, который содержит все данные для отправки
    const datesToSend = dates.map((date) => ({
      adId: adId,
      date: convertToISODate(date), // Конвертируем в ISO формат
      allDay: dateSettings[date].allDay,
      times: dateSettings[date].times, // Отправляем заблокированные времена
    }));

    console.log("Отправка дат на сервер:", datesToSend);

    // Отправляем один запрос с массивом всех дат
    const response = await apiService.post<string>({
      url: `/booking-ban-date`,
      dto: datesToSend, // отправляем массив с датами
    });

    console.log("Ответ сервера:", response);

    // После успешного ответа редиректим пользователя
    if (response.data) {
      navigate({
        to: "/announcements/newService/$adId",
        params: {
          adId: adId,
        },
      });
    }
  };

  return (
    <main className="min-h-screen bg-[#F1F2F6]">
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
              {t("bookingban")}
            </Typography>
            <Typography
              size={14}
              weight={400}
              color={COLORS_TEXT.blue200}
              align="center"
            >
              {t("optional")}
            </Typography>
          </div>
          <IconContainer align="end" action={() => setShowModal(true)}>
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={7} totalSteps={9} />
      </Header>
      {showModal && (
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
                  await apiService.delete({
                    url: `/ad/${adId}`,
                  });
                  navigate({
                    to: "/announcements",
                  });
                }}
              >
                {t("delete")}
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
            {t("addDateToBan")}
          </Typography>
        </button>

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
            key={date}
            className="p-3 bg-white border rounded shadow mb-2 flex justify-between items-start"
          >
            <div className="w-full">
              <div className="w-full flex items-center justify-between">
                <Typography size={18} weight={500}>
                  {date}
                </Typography>
                <IconContainer
                  action={() => openModalForDate(date)}
                  align="center"
                >
                  <img src={editIcon} alt="" />
                </IconContainer>
              </div>
              {dateSettings[date]?.allDay ? (
                <Typography size={16} weight={400} className="mt-3">
                  {t("unavailableAllDay")}
                </Typography>
              ) : (
                <div className="flex overflow-x-scroll gap-1 mt-1">
                  {dateSettings[date]?.times.map((time) => (
                    <Typography
                      color={COLORS_TEXT.gray100}
                      key={time}
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

      {dates.map((date) =>
        showModals[date] && dateSettings[date] ? (
          <div
            key={date}
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
                  {serviceTime.map((time) => {
                    const isTimeSelected = selectedTimes.includes(time);

                    return (
                      <button
                        key={time}
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

      <div className="fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full z-10">
        <Button onClick={handleSubmit} mode="default">
          {t("continueBtn")}
        </Button>
      </div>
    </main>
  );
};
