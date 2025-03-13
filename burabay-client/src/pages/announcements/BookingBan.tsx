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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { apiService } from "../../services/api/ApiService";
import { Announcement, BookingBanDate } from "./model/announcements";
import { format } from "date-fns";

interface Props {
  adId: string;
  announcement?: Announcement;
}

interface DateSettings {
  allDay: boolean;
  times: string[];
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
  const { t } = useTranslation();

  const [dates, setDates] = useState<string[]>(
    announcement?.bookingBanDate
      ?.filter((item) => item.date && !isNaN(new Date(item.date).getTime())) // фильтруем нормальные даты
      ?.map((item) => format(new Date(item.date), "dd.MM.yyyy")) || []
  );

  const [dateSettings, setDateSettings] = useState<
    Record<string, DateSettings>
  >(transformData(announcement?.bookingBanDate || []) || {});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModals, setShowModals] = useState<Record<string, boolean>>({});
  const [selectedDateTwo, setSelectedDateTwo] = useState<Date | null>(null);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const navigate = useNavigate();

  const addDate = (newDate: string) => {
    if (!dates.includes(newDate)) {
      setDates([...dates, newDate]);
      setDateSettings({
        ...dateSettings,
        [newDate]: { allDay: false, times: [...serviceTime] },
      });
    }
  };
  function transformData(data: BookingBanDate[]): TransformedData {
    return data.reduce<TransformedData>((acc, item) => {
      if (!item.date || isNaN(new Date(item.date).getTime())) {
        console.warn("Некорректная дата в bookingBanDate:", item);
        return acc;
      }

      const formattedDate = format(new Date(item.date), "dd.MM.yyyy");

      if (!acc[formattedDate]) {
        acc[formattedDate] = {
          allDay: item.allDay,
          times: [...item.times],
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
      setDateSettings({
        ...dateSettings,
        [selectedDate]: {
          allDay: !dateSettings[selectedDate]?.allDay,
          times: !dateSettings[selectedDate]?.allDay ? [] : [...serviceTime],
        },
      });
    }
  };

  const saveDateSettings = () => {
    if (selectedDate) {
      setDateSettings({
        ...dateSettings,
        [selectedDate]: {
          ...dateSettings[selectedDate],
          times: dateSettings[selectedDate].times.filter(
            (time) => !selectedTimes.includes(time)
          ),
        },
      });
    }
    setShowModals((prev) => ({ ...prev, [selectedDate!]: false }));
    setSelectedDate(null);
    setSelectedTimes([]);
  };

  const openModalForDate = (date: string) => {
    setSelectedDate(date);
    setShowModals((prev) => ({ ...prev, [date]: true }));
    setSelectedTimes([]);
  };

  const handleSubmit = async () => {
    // Массив, который содержит все данные для отправки
    const datesToSend = dates.map((date) => ({
      adId: adId,
      date: date,
      allDay: dateSettings[date].allDay,
      times: dateSettings[date].allDay
        ? []
        : dateSettings[date].times.length > 0
          ? dateSettings[date].times
          : serviceTime,
    }));

    // Отправляем один запрос с массивом всех дат
    const response = await apiService.post<string>({
      url: `/booking-ban-date`,
      dto: datesToSend, // отправляем массив с датами
    });

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
          <IconContainer
            align="end"
            action={() => setShowModal(true)}
          >
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={7} totalSteps={9} />
      </Header>
      {showModal && (
        <Modal className="flex w-full h-full justify-center items-center p-4" open={showModal} onClose={() => setShowModal(false)}>
          <div className="relative w-full flex flex-col bg-white p-4 rounded-lg">
          <Typography size={16} weight={400} className="text-center">
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
      <div className="p-4 cursor-none">
        <label className="w-full relative flex items-center border bg-white rounded-lg p-4 h-20 mb-4 cursor-none">
          <img src={PlusIcon} alt="Добавить" />
          <DatePicker
            selected={selectedDateTwo}
            onChange={(date: Date | null) => {
              if (date) {
                const formattedDate = date.toLocaleDateString();
                addDate(formattedDate);
                setSelectedDateTwo(date);
              }
            }}
            wrapperClassName="w-full h-full"
            className="w-0 bg-transparent outline-none cursor-none select-none h-full"
            dateFormat="yyyy-MM-dd"
            minDate={new Date()}
          />
          <Typography
            size={16}
            weight={600}
            color={COLORS_TEXT.blue200}
            className="w-[calc(100% - 84px)] absolute top-1/2 -translate-y-1/2 left-[52px]"
          >
            {t("addDateToBan")}
          </Typography>
        </label>

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

              <label className="flex items-center justify-between mb-4">
                {t("unavailableAllDay")}
                <Switch
                  type="checkbox"
                  checked={dateSettings[date]?.allDay || false}
                  onChange={toggleAllDay}
                  className="w-6 h-6"
                />
              </label>

              {!dateSettings[date]?.allDay && (
                <div className="flex flex-wrap gap-2">
                  {dateSettings[date]?.times.map((time) => {
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
                <Button onClick={saveDateSettings} className="text-white">
                  {t("saveBtn")}
                </Button>
                <Button
                  onClick={async () => {
                    const banDateId = announcement?.bookingBanDate[0]?.id;
                    try {
                      await apiService.delete({
                        url: `/booking-ban-date/${banDateId}`, 
                        dto: { date }, 
                      });


                      setDates((prev) => prev.filter((item) => item !== date));
                    } catch (error) {
                      console.error("Ошибка при удалении даты:", error);
                    }
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
