import { tokenService } from "../storage/Factory";
import { baseUrl } from "./ServerData";

// Данные необходимые для запроса
interface RequestOptions {
  url: string;
  dto?: any;
}
// Данные, которые приходят в результате запроса
interface RequestResponse<T> extends Pick<Response, "status"> {
  data: T;
}

class ImageService {
  bearerToken: Record<string, string> = {};

  // стандартный запрос на сервер
  private async _serverRequest<T>(
    options: RequestOptions,
    method: string
  ): Promise<RequestResponse<T>> {
    return fetch(baseUrl + options.url, {
      method: method,
      body: options.dto,
      headers: {
         Authorization: `Bearer ${tokenService.getValue().token}`
      },
    }).then(async (response) => {
      const data = await response.json();
      return {
        status: response.status,
        data,
      };
    });
  }

  // методы для получения данных
  async post<T extends unknown>(options: RequestOptions) {
    return this._serverRequest<T>(options, "POST");
  }
  async delete<T extends unknown>(options: RequestOptions) {
    return this._serverRequest<T>(options, "DELETE");
  }
}

export const imageService = new ImageService();
