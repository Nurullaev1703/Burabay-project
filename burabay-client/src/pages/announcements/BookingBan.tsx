import { FC, useState } from "react";
import { Header } from "../../components/Header";
import { IconContainer } from "../../shared/ui/IconContainer";
import { Typography } from "../../shared/ui/Typography";
import { ProgressSteps } from "./ui/ProgressSteps";
import { COLORS_TEXT } from "../../shared/ui/colors";
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Button } from "../../shared/ui/Button";
import PlusIcon from "../../app/icons/announcements/bluePlus.svg"
import editIcon from "../../app/icons/announcements/edit.svg"
import { Switch } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";

interface DateSettings {
  allDay: boolean;
  times: string[];
}

export const BookingBan: FC = function BookingBan() {
  const defaultTimes = ["09:00", "11:00", "13:00", "15:00", "16:00", "17:00", "19:00"];
  const [dates, setDates] = useState<string[]>([]);
  const [dateSettings, setDateSettings] = useState<Record<string, DateSettings>>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate()

  // Добавить новую дату
  const addDate = () => {
    const newDate = new Date().toLocaleDateString();
    if (!dates.includes(newDate)) {
      setDates([...dates, newDate]);
      setDateSettings({
        ...dateSettings,
        [newDate]: { allDay: false, times: [...defaultTimes] },
      });
    }
  };

  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  
  // Функция для переключения выбора времени
  const toggleTimeSelection = (time: string) => {
    setSelectedTimes((prev) =>
      prev.includes(time) ? prev.filter((t) => t !== time) : [...prev, time]
    );
  };

  // Обновить настройки "Недоступно весь день"
  const toggleAllDay = () => {
    if (selectedDate) {
      setDateSettings({
        ...dateSettings,
        [selectedDate]: {
          ...dateSettings[selectedDate],
          allDay: !dateSettings[selectedDate].allDay,
          times: dateSettings[selectedDate].allDay ? [...defaultTimes] : [],
        },
      });
    }
  };

  // Удалить конкретное время
  const deleteTime = (time: string) => {
    if (selectedDate) {
      setDateSettings({
        ...dateSettings,
        [selectedDate]: {
          ...dateSettings[selectedDate],
          times: dateSettings[selectedDate].times.filter((t) => t !== time),
        },
      });
    }
  };

  // Сохранить настройки и закрыть модалку
  const saveDateSettings = () => {
    setShowModal(false);
    setSelectedDate(null);
  };

  return (
    <main className="min-h-screen bg-[#F1F2F6]">
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography size={18} weight={500} color={COLORS_TEXT.blue200} align="center">
              {"Запрет бронирования"}
            </Typography>
            <Typography size={14} weight={400} color={COLORS_TEXT.blue200} align="center">
              {"Необязательно"}
            </Typography>
          </div>
          <IconContainer align="end" action={() => history.back()}>
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={8} totalSteps={9} />
      </Header>
      <div className="p-4">
        <Button 
          mode="border"
          className="w-full active:bg-white  border-white bg-white  rounded-lg p-4 mb-4"
          onClick={addDate}
        >
            <img src={PlusIcon} alt="" />
          {"Добавить дату, недоступную для бронирования"}
        </Button>

        {/* Список дат */}
        {dates.map((date) => (
          <div
            key={date}
            className="p-3 bg-white border rounded shadow mb-2 flex justify-between items-start"
          >
            <div className="w-full">
              {/* Дата */}
              <div className="w-full flex items-center justify-between">
              <Typography size={18} weight={500}>{date}</Typography>
              <IconContainer action={() =>{
                    setSelectedDate(date);
                    setShowModal(true);
                }} align="center">
              <img src={editIcon} alt="" />
              </IconContainer>
              </div>
              
              {/* Логика для отображения доступности */}
              {dateSettings[date]?.allDay ? (
                <Typography size={16} weight={400} className="mt-3">Недоступно весь день</Typography>
              ) : (
                <div className="flex overflow-x-scroll gap-1 mt-1">
                  {dateSettings[date]?.times.map((time) => (
                    !selectedTimes.includes(time) && (
                      <Typography color={COLORS_TEXT.gray100} key={time} className="border-gray100 border px-10 py-2.5 rounded-2xl mr-2">
                        {time}
                      </Typography>
                      
                    )
                  ))}
                </div>
              )}
            </div>




          </div>
        ))}
      </div>

      {/* Модальное окно */}
      {showModal && selectedDate && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-11/12 max-w-md">
            <Typography size={18} weight={500} className="mb-3">
              Запрет бронирования на {selectedDate}
            </Typography>

            {/* Переключатель "Недоступно весь день" */}
            <label className="flex items-center justify-between mb-4">
              Недоступно весь день
              <Switch
                type="checkbox"
                checked={dateSettings[selectedDate]?.allDay || false}
                onChange={toggleAllDay}
                className="w-6 h-6"/>
            </label>

            {/* Список времени */}
            {!dateSettings[selectedDate]?.allDay && (
              <div className="flex flex-wrap gap-2">
                {dateSettings[selectedDate]?.times.map((time) => (
                  <button
                    key={time}
                    onClick={() => toggleTimeSelection(time)} // Меняем выбор времени
                    className={`border rounded-2xl px-7 py-2 ${
                      selectedTimes.includes(time)
                        ? "border-red" // Если время выбрано, кнопка красная
                        : "border-blue200" // Если не выбрано, кнопка синяя
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            )}

            <div className="flex justify-between mt-4 flex-col gap-2">
              <Button
                onClick={saveDateSettings}
                className=" text-white"
              >
                Сохранить
              </Button>
              <Button
                onClick={() => setShowModal(false)}
                mode="border"
                className=""
              >
                Удалить
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className='fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full'>
        <Button onClick={() => navigate({
          to: `/announcements/newService`,
        })} mode='default'>{"Продолжить"}</Button>
      </div>
    </main>
  );
};
