import { FC, useEffect, useRef, useState } from "react";
import SideNav from "../../../components/admin/SideNav";
import { apiService } from "../../../services/api/ApiService";
import authBg from "../../../app/icons/bg_auth.png";
import message from "../../../app/icons/Message.png";
import { Loader } from "../../../components/Loader";
import { categoryBgColors, COLORS_TEXT, COLORS } from "../../../shared/ui/colors";
import { RotatingLines } from "react-loader-spinner";
import { baseUrl } from "../../../services/api/ServerData";
import { Typography } from "../../../shared/ui/Typography";
import cancel from "../../../app/icons/announcements/xCancel.svg";
import Down from "/down-arrow.svg?url";
import { Category } from "../../announcements/model/announcements";
import { RoleType } from "./model/user-filter";
import UsersIcon from "../../../app/icons/admin/users.svg";

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
interface Props {
  categories: Category[];
}

const MessagesPage: FC<Props> = ({ categories }) => {
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [categoryNames, setCategoryNames] = useState<Category[]>([]);
  const [isSelect, setIsSelect] = useState<boolean>(false);
  const [selectedRole, setSelectedRole] = useState<string>("Все пользователи");

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (Object.keys(messages).length > 0 && !loading) {
      scrollToBottom();
    }
  }, [messages, loading]);

  const fetchNotifications = async () => {
    try {
      const response = await apiService.get<Notification[]>({
        url: "/notification/all",
      });

      if (!Array.isArray(response.data)) {
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
    } finally {
      setLoading(false);
    }
  };

  const handleSendNotification = async () => {
    if (!newMessage.trim()) return;

    setIsSending(true);
    try {
      if (categoryNames.length > 0 && selectedRole.toLowerCase() !== "бизнес") {
        const categoryId = categoryNames.map((c) => c.id)
        // Отправка уведомления одним запросом с массивом id выбранных категорий
        // Предположение: бэк ожидает поле `categories` как массив id
        await apiService.post({
          url: "/notification/category",
          dto: {
            type: "позитивное",
            message: newMessage,
            categoryIds: categoryId,
          },
        });
      } else if (selectedRole.toLowerCase() === "бизнес") {
        await apiService.post({
          url: "/notification/organizations",
          dto: { type: "позитивное", message: newMessage },
        });
      } else if (
        categoryNames.length === 0 &&
        selectedRole.toLowerCase() === "турист"
      ) {
        await apiService.post({
          url: "/notification/tourists",
          dto: { type: "позитивное", message: newMessage },
        });
      } else {
        await apiService.post({
          url: "/notification/all",
          dto: { type: "позитивное", message: newMessage },
        });
      }

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
      console.error("Ошибка при отправке уведомления:", error);
      alert("Не удалось отправить уведомление. Попробуйте снова.");
    } finally {
      setIsSending(false);
    }
  };

  const scrollToBottom = () => {
    const scrollContainer = document.getElementById("messages-container");
    if (scrollContainer) {
      // Используем requestAnimationFrame для более надёжного скролла
      requestAnimationFrame(() => {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      });
    }
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
      </div>{" "}
      <div className="relative z-10 flex flex-col w-full p-4 ml-[94px] h-screen">
        <div
          className="flex-1 overflow-y-auto mb-[84px] admin-scrollbar"
          id="messages-container"
        >
          {loading ? (
            <Loader />
          ) : (
            Object.entries(messages)
              .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
              .map(([date, messages]) => (
                <div key={date} className="mb-4">
                  <div className="flex justify-center items-center">
                    <div className="flex justify-center items-center text-center w-[88px] h-[24px] text-[14px] rounded-xl bg-[#FFFFFF80]/50 font-semibold text-[#999999] mb-4">
                      {date}
                    </div>
                  </div>
                  <div className="flex flex-col items-start gap-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className="relative w-full max-w-[1200px] backdrop-blur-[10px] bg-[#FFFFFFBF]/75 p-4 rounded-xl flex flex-col justify-between break-words"
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
          <div ref={messagesEndRef} className="" />
        </div>

        {/* Fixed bottom panel */}
        <div className="fixed bottom-0 left-[94px] right-0 z-20 backdrop-blur-lg px-4 py-2">
          {selectedRole.toLowerCase() == "турист" && (
            <div className="w-full pb-2">
              <div className="flex flex-wrap gap-2 overflow-x-auto admin-scrollbar max-h-[80px]">
                {categories.map((item) => {
                  return (
                    <button
                      type="button"
                      key={item.id}
                      onClick={() => {
                        if (categoryNames?.includes(item)) {
                          setCategoryNames(
                            categoryNames.filter(
                              (category) => category.name !== item.name
                            )
                          );
                        } else {
                          setCategoryNames([...categoryNames, item]);
                        }
                      }}
                      className={`
                flex-shrink-0 w-fit
                rounded-full justify-between flex items-center p-1 pr-4 gap-2 ${categoryNames?.includes(item) ? categoryBgColors[item.name] : "bg-white"} `}
                    >
                      <div
                        className={`relative min-w-7 min-h-7 rounded-full ${categoryBgColors[item.name]}`}
                      >
                        <img
                          src={baseUrl + item.imgPath}
                          className="absolute top-1/2 left-1/2 w-4 h-4 mr-2 -translate-x-1/2 -translate-y-1/2 brightness-[25] z-[0]"
                        />
                      </div>
                      <Typography
                        size={16}
                        weight={400}
                        color={
                          categoryNames?.includes(item) ? COLORS_TEXT.white : ""
                        }
                        className={`text-center line-clamp-1 whitespace-nowrap`}
                      >
                        {item.name}
                      </Typography>

                      {categoryNames?.includes(item) && (
                        <div className="w-3">
                          <img src={cancel} alt="Close" className="" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="w-full p-4 rounded-xl bg-white">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative flex-shrink-0 w-full sm:w-[256px]">
                <button
                  type="button"
                  className="flex items-center justify-between text-[#0A7D9E] font-roboto py-3 px-4 border-[1px] rounded-[8px] border-[#0A7D9E] bg-white w-full"
                  onClick={() => setIsSelect(!isSelect)}
                >
                  <img src={UsersIcon} className="min-w-6 min-h-6 mr-4" />
                  <span className="capitalize flex-1 text-left">
                    {selectedRole}
                  </span>
                  <img
                    src={Down}
                    alt=""
                    className="ml-4 w-[16px] h-[16px] flex-shrink-0"
                  />
                </button>
                {isSelect && (
                  <div className="absolute left-0 bottom-16 mt-1 bg-white morph rounded shadow-md z-30 border w-full min-w-[256px]">
                    <label className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
                      <input
                        type="radio"
                        name="roleFilter"
                        className="mr-2 h-5 w-5 accent-[#0A7D9E] cursor-pointer"
                        checked={selectedRole === "Все пользователи"}
                        onChange={() => {
                          setSelectedRole("Все пользователи");
                          setIsSelect(false);
                        }}
                      />
                      {"Все пользователи"}
                    </label>
                    {Object.values(RoleType)
                      .filter((roleValue) => roleValue !== "admin")
                      .map((roleValue) => (
                        <label
                          key={roleValue}
                          className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer capitalize"
                        >
                          <input
                            type="radio"
                            name="roleFilter"
                            value={roleValue}
                            className="mr-2 h-5 w-5 accent-[#0A7D9E] cursor-pointer"
                            checked={selectedRole === roleValue}
                            onChange={() => {
                              setSelectedRole(roleValue);
                              setIsSelect(false);
                            }}
                          />
                          {roleValue}
                        </label>
                      ))}
                  </div>
                )}
              </div>
              <div className="flex flex-1 items-center gap-3 ">
                <input
                  type="text"
                  className={`flex-1 min-w-0 px-4 py-3 border border-[#EDECEA] rounded-lg bg-[#FAF9F7] focus:border-blue200 focus:outline-none ${isSending ? "opacity-60 cursor-not-allowed" : ""}`}
                  placeholder="Введите уведомление..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  disabled={isSending}
                />
                <button
                  className={`w-[52px] h-[52px] flex-shrink-0 rounded-full flex items-center justify-center transition ${isSending ? "bg-[#0A7D9E] opacity-90 cursor-wait" : "bg-[#0A7D9E]"}`}
                  onClick={handleSendNotification}
                  disabled={isSending}
                  aria-busy={isSending}
                  aria-label={isSending ? "Отправка" : "Отправить сообщение"}
                  style={isSending ? {} : {
                    backgroundImage: `url(${message})`,
                    backgroundSize: "22px 22px",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                  }}
                >
                  {isSending ? (
                    <RotatingLines strokeColor={COLORS.white} width="20" />
                  ) : null}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MessagesPage;
