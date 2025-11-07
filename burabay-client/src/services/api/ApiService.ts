import { baseUrl } from "./ServerData";

// Данные необходимые для запроса
interface RequestOptions {
  url: string;
  dto?: unknown;
  headers?: HeadersInit;
}
// Данные, которые приходят в результате запроса
interface RequestResponse<T> extends Pick<Response, "status"> {
  data: T;
}
// Типы запросов, которые отправляются на сервер
type RequestMethod = "GET" | "POST" | "UPDATE" | "DELETE" | "PATCH";

class ApiService {
  // данные по умолчанию для ссылки и токена
  bearerToken: Record<string, string> = {};

  // проверяет на какую точку отправлен запрос
  private _checkNewUrl(url: string) {
    if (url.includes("http://") || url.includes("https://")) {
      return url;
    }
    return baseUrl + url;
  }

  // Проверка необходимости отправки токена
  private _checkBearerNecessity(url: string) {
    if (url.includes("http://") || url.includes("https://")) {
      return null;
    }
    return this.bearerToken;
  }

  // стандартный запрос на сервер
  private async _serverRequest<T>(
    options: RequestOptions,
    method: RequestMethod
  ): Promise<RequestResponse<T>> {
    const url = this._checkNewUrl(options.url);
    return fetch(url, {
      method: method,
      body: JSON.stringify(options.dto),
      headers: {
        "Content-Type": "application/json",
        ...this._checkBearerNecessity(options.url),
      },
    }).then(async (response) => {
      const data = await response.json();

      // Проверка на ошибки блокировки
      if (response.status === 401 && data.message) {
        const message = data.message;
        if (
          message === "Ваш аккаунт заблокирован" ||
          message === "Ваша организация заблокирована"
        ) {
          // Удаляем токен
          this.deleteBearerToken();
          // Очищаем localStorage
          localStorage.clear();
          // Редирект на страницу авторизации
          window.location.href = "/auth";
        }
      }

      return {
        status: response.status,
        data,
      };
    });
  }

  // методы для получения данных
  async get<T>(options: RequestOptions) {
    return this._serverRequest<T>(options, "GET");
  }
  async post<T>(options: RequestOptions) {
    return this._serverRequest<T>(options, "POST");
  }
  async patch<T>(options: RequestOptions) {
    return this._serverRequest<T>(options, "PATCH");
  }
  async delete<T>(options: RequestOptions) {
    return this._serverRequest<T>(options, "DELETE");
  }

  // сохранение токена для отправки на запросы
  saveBearerToken(token: string) {
    this.bearerToken = { Authorization: `Bearer ${token}` };
  }

  // удаление токена из класса
  deleteBearerToken() {
    this.bearerToken = {};
  }
}

export const apiService = new ApiService();
