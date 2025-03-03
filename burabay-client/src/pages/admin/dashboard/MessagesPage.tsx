import { useEffect, useRef, useState } from "react";
import SideNav from "../../../components/admin/SideNav";
import { apiService } from "../../../services/api/ApiService";
import authBg from "../../../app/icons/bg_auth.png";
import message from "../../../app/icons/Message.png";

interface Message {
  id: string;
  text: string;
  time: string;
  date: string;
}

export default function MessagesPage() {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await apiService.get<{ messages: Message[] }>({
          url: "/messages",
        });

        const groupedMessages = response.data.messages.reduce(
          (acc, message) => {
            if (!acc[message.date]) acc[message.date] = [];
            acc[message.date].push(message);
            return acc;
          },
          {} as Record<string, Message[]>
        );

        setMessages(groupedMessages);
      } catch (error) {
        console.error("Ошибка загрузки сообщений: ", error);
      } finally {
        setLoading(false);
        scrollToBottom();
      }
    };

    fetchMessages();
  }, []);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const messageData: Message = {
      id: crypto.randomUUID(),
      text: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      date: new Date().toISOString().split("T")[0],
    };

    try {
      await apiService.post({
        url: "/messages",
        dto: messageData,
      });

      setMessages((prev) => ({
        ...prev,
        [messageData.date]: [...(prev[messageData.date] || []), messageData],
      }));

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Ошибка отправки сообщения: ", error);
    }
  };

  return (
    <div className="relative flex min-h-screen">
      {/* Фон цветом */}
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-35"></div>
      {/* Фоновая картинка */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${authBg})` }}
      ></div>

      {/* SideNav (фиксируем слева) */}
      <div className="relative z-50">
        <SideNav />
      </div>

      {/* Контент (с отступом слева) */}
      <div className="relative z-10 flex flex-col w-full p-6 ml-[94px]">
        {/* Контейнер для сообщений с прокруткой */}
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-120px)] p-6 pt-0">
          {loading ? (
            <p className="text-center text-gray-200">Загрузка сообщений...</p>
          ) : (
            Object.entries(messages).map(([date, messages]) => (
              <div key={date} className="mb-6">
                {/* Дата сообщений */}
                <div className="text-center text-lg font-semibold text-black mb-4">
                  {date}
                </div>

                {/* Блок сообщений */}
                <div className="flex flex-col items-start gap-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="relative w-full max-w-[1200px] backdrop-blur-md bg-white bg-opacity-90 p-4 rounded-xl flex flex-col justify-between shadow-md break-words"
                    >
                      <div className="text-lg font-medium text-black">
                        Burabay администратор
                      </div>
                      <div className="text-black break-words overflow-hidden">
                        {msg.text}
                      </div>
                      <div className="absolute bottom-2 right-4 text-sm text-gray-600">
                        {msg.time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Блок ввода сообщения (фиксирован внизу) */}
        <div className="sticky bottom-0 left-0 right-0 flex items-center max-w-[2200px] p-4 bg-white backdrop-blur-lg shadow-md rounded-xl">
          <input
            type="text"
            className="flex-1 max-w-[100%] px-4 py-2 border border-[#EDECEA] rounded-lg bg-[#FAF9F7]"
            placeholder="Введите сообщение..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="w-[52px] h-[52px] rounded-full bg-[#0A7D9E] transition bg-cover bg-center ml-3"
            onClick={handleSendMessage}
            style={{
              backgroundImage: `url(${message})`,
              backgroundSize: "22px 22px",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          />
        </div>
      </div>
    </div>
  );
}
