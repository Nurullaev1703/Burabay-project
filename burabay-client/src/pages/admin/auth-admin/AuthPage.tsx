import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import Header from "../../../components/admin/Header";
import "../../../app/styles/index.css";
import authBg from "../../../app/icons/bg_auth.png";
import { TextField } from "@mui/material";

interface AuthFormData {
  email: string;
  password: string;
}

const AuthPage: React.FC = () => {
  console.log("Rendering AuthForm");
  const [formData, setFormData] = useState<AuthFormData>({
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
      const response = await fetch("http://localhost:3000/auth/admin/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          role: "admin",
          email: formData.email,
          password: formData.password,
        }),
      });

      if (response.ok) {
        setMessage("Регистрация успешна!");
        navigate({ to: "/admin/dashboard/complaints" });
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
      <div
        style={{ backgroundImage: `url(${authBg})` }}
        className="absolute inset-0 bg-adminAuthBg bg-cover bg-no-repeat opacity-[0.25]"
      ></div>

      <div className="relative flex flex-col justify-center items-center gap-[32px] w-[620px] h-[445px] bg-[#0A7D9E] rounded-lg shadow-md p-8">
        <h2 className="text-[32px] font-bold text-white">Авторизация</h2>

        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col items-center"
        >
          <div className="space-y-2 w-full">
            <div className="relative w-full">
              <TextField
                type="text"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Введите адрес электронной почты"
                required
              />
              <span className="absolute text-[#999999] top-3 left-3 pointer-events-none">
                <span className="block font-roboto text-xs">Почта</span>
              </span>
            </div>

            <div className="relative w-full">
              <TextField
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                placeholder="Введите пароль"
                required
              />
              <span className="absolute text-[#999999] top-3 left-3 pointer-events-none">
                <span className="block font-roboto text-xs">Пароль</span>
              </span>
            </div>
          </div>

          <button
            type="submit"
            className={`w-[400px] h-[54px] mt-10 font-roboto text-white font-semibold rounded-[32px] shadow-sm bg-[#0A7D9E] border-[3px] border-[#FFFFFF] ${
              loading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-[#0A7D9E]"
            }`}
            disabled={loading}
          >
            {loading ? "Загрузка..." : "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
