import { useQuery } from "@tanstack/react-query"
import { apiService } from "../../services/api/ApiService"
import { Profile as ProfileType } from "./model/profile"
import { tokenService } from "../../services/storage/Factory";

export function useGetProfile() {
  // изменение токена должно отражаться на профиле
  const token = tokenService.hasValue() ? tokenService.getValue() : null
    return useQuery({
      queryKey: ['profile', token],
      queryFn: async () => {
        try {
          const response = await apiService.get<ProfileType>({
            url: "/profile",
          });

          // Бэкенд может возвращать 401/код в теле с сообщением о блокировке организации.
          const respMsg = (response as any).data?.message || "";
          const respCode = (response as any).data?.statusCode || (response as any).status;
          if ((respCode === 401) && /заблок/i.test(String(respMsg))) {
            // Удаляем токен и отправляем на страницу авторизации
            try {
              tokenService.deleteValue();
            } catch (e) {
              // ignore
            }
            // Навигация через location, т.к. это хук, вызываемый вне компонента
            window.location.assign('/auth');
            // не возвращаем профиль
            return null as any;
          }

          return response.data;
        } catch (error: any) {
          const errMsg = error?.response?.data?.message || error?.message || "";
          const status = error?.response?.status;
          if (status === 401 && /заблок/i.test(String(errMsg))) {
            try {
              tokenService.deleteValue();
            } catch (e) {
              // ignore
            }
            window.location.assign('/auth');
            return null as any;
          }
          throw error;
        }
      },
    });
}