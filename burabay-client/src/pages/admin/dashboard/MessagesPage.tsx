import { useEffect, useRef, useState } from "react";
import SideNav from "../../../components/admin/SideNav";
import { apiService } from "../../../services/api/ApiService";
import authBg from "../../../app/icons/bg_auth.png";
import message from "../../../app/icons/Message.png";
import { Loader } from "../../../components/Loader";

interface Notification {
  id: string;
  message: string;
  createdAt: string;
}

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
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await apiService.get<Notification[]>({
        url: "/notification/all",
      });

      if (!Array.isArray(response.data)) {
        console.error(
          "Ошибка: Ожидался массив уведомлений, но получено другое значение",
          response.data
        );
        return;
      }

      const notificationsAsMessages = response.data
        .map((notif) => ({
          id: notif.id,
          text: notif.message,
          time: new Date(notif.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(notif.createdAt).toISOString().split("T")[0],
        }))
        .sort(
          (a, b) =>
            new Date(a.date + " " + a.time).getTime() -
            new Date(b.date + " " + b.time).getTime()
        );

      setMessages(groupMessagesByDate(notificationsAsMessages));
    } catch (error) {
      console.error("Ошибка загрузки уведомлений: ", error);
    } finally {
      setLoading(false);
      scrollToBottom();
    }
  };

  const handleSendNotification = async () => {
    if (!newMessage.trim()) return;

    try {
      await apiService.post({
        url: "/notification/all",
        dto: { type: "позитивное", message: newMessage },
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer ТВОЙ_ТОКЕН",
        },
      });

      const newMsg: Message = {
        id: Date.now().toString(),
        text: newMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date().toISOString().split("T")[0],
      };

      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        if (!updatedMessages[newMsg.date]) {
          updatedMessages[newMsg.date] = [];
        }
        updatedMessages[newMsg.date].push(newMsg);
        updatedMessages[newMsg.date].sort(
          (a, b) =>
            new Date(a.date + " " + a.time).getTime() -
            new Date(b.date + " " + b.time).getTime()
        );
        return updatedMessages;
      });

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Ошибка отправки уведомления: ", error);
    }
  };

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    }, 100);
  };

  const groupMessagesByDate = (messages: Message[]) =>
    messages.reduce(
      (acc, message) => {
        if (!acc[message.date]) acc[message.date] = [];
        acc[message.date].push(message);
        acc[message.date].sort(
          (a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()
        );
        return acc;
      },
      {} as Record<string, Message[]>
    );

  return (
    <div className="relative flex min-h-screen">
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-35"></div>
      <div
        className="absolute inset-0 bg-cover bg-center opacity-25"
        style={{ backgroundImage: `url(${authBg})` }}
      ></div>

      <div className="relative z-50">
        <SideNav />
      </div>

      <div className="relative z-10 flex flex-col w-full p-6 ml-[94px]">
        <div className="flex-1 overflow-y-auto max-h-[calc(100vh-120px)] p-6 pt-0">
          {loading ? (
            <Loader />
          ) : (
            Object.entries(messages)
              .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
              .map(([date, messages]) => (
                <div key={date} className="mb-6">
                  <div className="text-center text-lg font-semibold text-black mb-4">
                    {date}
                  </div>
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

        <div className="sticky bottom-0 left-0 right-0 flex items-center max-w-[2200px] p-4 bg-white backdrop-blur-lg shadow-md rounded-xl">
          <input
            type="text"
            className="flex-1 max-w-[100%] px-4 py-2 border border-[#EDECEA] rounded-lg bg-[#FAF9F7]"
            placeholder="Введите уведомление..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="w-[52px] h-[52px] rounded-full bg-[#0A7D9E] transition bg-cover bg-center ml-3"
            onClick={handleSendNotification}
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
