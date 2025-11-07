import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Header from "../../../components/admin/Header";
import "../../../app/styles/index.css";
import authBg from "../../../app/icons/bg_auth.png";
import { TextField, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useAuth } from "../../../features/auth";
import { baseUrl } from "../../../services/api/ServerData";

interface AuthFormData {
  email: string;
  password: string;
}

const AuthPage: React.FC = () => {
  const { t } = useTranslation();
  const { setToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onBlur",
  });

  const onSubmit = async (formData: AuthFormData) => {
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(baseUrl + "/auth/admin/", {
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
        const data = await response.text();

        // Проверяем, что пришло от сервера
        try {
          const parsedData = JSON.parse(data);

          // Если это число (HTTP статус код)
          if (typeof parsedData === "number") {
            if (parsedData === 409) {
              // CONFLICT - неверный пароль
              setErrorMessage(t("adminWrongPassword"));
              return;
            }
          } else if (typeof parsedData === "string") {
            // Если это строка - токен
            setToken(parsedData);
            navigate({ to: "/admin/dashboard/complaints" });
            return;
          }
        } catch {
          // Если не удалось распарсить - возможно это уже токен
          setToken(data);
          navigate({ to: "/admin/dashboard/complaints" });
          return;
        }
      } else if (response.status === 404) {
        setErrorMessage(t("adminNotFound"));
      } else if (response.status === 409) {
        setErrorMessage(t("adminWrongPassword"));
      } else {
        setErrorMessage(t("defaultError"));
      }
    } catch (error) {
      console.error("Auth error:", error);
      setErrorMessage(t("defaultError"));
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
        <h2 className="text-[32px] font-bold text-white">{t("auth")}</h2>

        {errorMessage && (
          <div className="w-full bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {errorMessage}
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full flex flex-col items-center"
        >
          <div className="space-y-2 w-full">
            <div className="relative w-full">
              <Controller
                name="email"
                control={control}
                rules={{
                  required: t("requiredField"),
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: t("invalidEmail"),
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type="email"
                    fullWidth
                    variant="outlined"
                    placeholder={t("inputMail")}
                    error={!!errors.email}
                    helperText={errors.email?.message}
                  />
                )}
              />
              <span className="absolute text-[#999999] top-3 left-3 pointer-events-none">
                <span className="block font-roboto text-xs">{t("email")}</span>
              </span>
            </div>

            <div className="relative w-full">
              <Controller
                name="password"
                control={control}
                rules={{
                  required: t("requiredField"),
                  minLength: {
                    value: 6,
                    message: t("passwordMinLength") || "Минимум 6 символов",
                  },
                }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="outlined"
                    placeholder={t("inputPassword") || "Введите пароль"}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={() => setShowPassword(!showPassword)}
                            onMouseDown={(e) => e.preventDefault()}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
              <span className="absolute text-[#999999] top-3 left-3 pointer-events-none">
                <span className="block font-roboto text-xs">
                  {t("password") || "Пароль"}
                </span>
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
            {loading ? t("loading") || "Загрузка..." : t("signIn") || "Войти"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
