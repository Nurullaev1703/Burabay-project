import { FC, useEffect} from "react";
import { useAuth } from "../../features/auth";
import { useNavigate } from "@tanstack/react-router";
import { apiService } from "../../services/api/ApiService";
import { Profile } from "../profile/model/profile";
import { Loader } from "../../components/Loader";
import { roleService } from "../../services/storage/Factory";
interface Props {}

export const InitPage: FC<Props> = function InitPage() {
  const { token, resetToken, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;

    (async () => {
      try {
        const response = await apiService.get<Profile>({
          url: "/profile",
        });
        if (response.data.email) {
          roleService.setValue(response.data.role)
          setUser(response.data);
        }
        else{
          resetToken()
          roleService.deleteValue()
          navigate({ to: "/welcome" });
        }
      } catch (error) {
        resetToken();
        roleService.deleteValue()
        navigate({ to: "/welcome" });
      }
    })();
  }, [token]);

  return (
    <Loader />
  );
};
