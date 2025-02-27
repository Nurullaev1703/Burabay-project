import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Header from "../../../components/admin/Header";
import "../../../app/styles/index.css"
import authBg from '../../../app/icons/bg_auth.png'

interface AuthFormData {
  username: string;
  email: string;
  password: string;
}

const AuthPage: React.FC = () => {
  console.log("Rendering AuthForm");
  const [formData, setFormData] = useState<AuthFormData>({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Регистрация успешна!");
      } else {
        setMessage("Ошибка регистрации");
      }
    } catch (error) {
      setMessage("Ошибка сервера");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen relative">
      <Header />
      <div className="absolute inset-0 bg-[#0A7D9E] opacity-[0.35]"></div>
      <div style={{ backgroundImage: `url(${authBg})` }} className="absolute inset-0 bg-adminAuthBg bg-cover bg-no-repeat opacity-[0.25]"></div>

      <div className="relative flex flex-col justify-center items-center gap-[32px] w-[620px] h-[445px] bg-[#0A7D9E] rounded-lg shadow-md p-6">
        <h2 className="text-[32px] font-roboto text-white">Авторизация</h2>

        <form onSubmit={handleSubmit} className="space-y-2 w-full">
          <div className="space-y-2 w-full">
            <div className="relative w-full">
              <select
                id="username"
                name="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    username: e.target.value,
                  }))
                }
                className="block bg-[white] text-[#999999] font-roboto gap-10 pt-[35px] text-[16px] w-[556px] h-[69px] border border-gray-300 pt-3 pr-3 pl-3 pb-[14px] rounded-[8px] shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mx-auto"
                required
              >
                <option value="" disabled selected>
                  Выберите район
                </option>
                <option value="район1">Район 1</option>
                <option value="район2">Район 2</option>
                <option value="район3">Район 3</option>
                <option value="район4">Район 4</option>
              </select>
              <span className="absolute text-[#999999] top-2 left-5 pointer-events-none">
                <span className="block font-roboto text-xs">Район</span>
              </span>
            </div>

            <div className="relative w-full">
              <input
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="block bg-[white] text-[#999999] font-roboto gap-10 pt-[35px] text-[16px] w-[556px] h-[69px] border border-gray-300 pt-3 pr-3 pl-3 pb-[14px] rounded-[8px] shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mx-auto"
                placeholder="Введите адрес электронной почты"
                required
              />
              <span className="absolute text-[#999999] top-2 left-5 pointer-events-none">
                <span className="block font-roboto text-xs">Почта</span>
              </span>
            </div>

            <div className="relative w-full">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="block bg-[white] text-[#999999] font-roboto gap-10 pt-[35px] text-[16px] w-[556px] h-[69px] border border-gray-300 pt-3 pr-3 pl-3 pb-[14px] rounded-[8px] shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm mx-auto"
                placeholder="Введите пароль"
                required
              />
              <span className="absolute text-[#999999] top-2 left-5 pointer-events-none">
                <span className="block font-roboto text-xs">Пароль</span>
              </span>
            </div>
          </div>
        </form>

        <button
          type="submit"
          className={`w-[400px] h-[54px] font-roboto py-2 px-4 text-white font-semibold rounded-[32px] shadow-sm bg-[#0A7D9E] border-[3px] border-[#FFFFFF] ${
            loading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-[#0A7D9E]"
          }`}
          disabled={loading}
        >
          {loading ? "Загрузка..." : "Войти"}
        </button>
      </div>
    </div>
  );
};

export default AuthPage;
