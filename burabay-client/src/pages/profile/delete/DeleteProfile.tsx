import { FC, useState } from "react";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import { Typography } from "../../../shared/ui/Typography";
import BackIcon from "../../../app/icons/back-icon.svg";
import CrossIcon from "../../../app/icons/cross.svg";
import WarningIcon from "../../../app/icons/delete-account.svg";
import { Button } from "../../../shared/ui/Button";
import { Hint } from "../../../shared/ui/Hint";
import { apiService } from "../../../services/api/ApiService";
import { HTTP_STATUS } from "../../../services/api/ServerData";
import { useNavigate } from "@tanstack/react-router";

export const DeleteProfile: FC = function DeleteProfile() {
  const { t } = useTranslation();
  const [isErorr, setIsError] = useState<boolean>(false);
  const navigate = useNavigate()
  const handleDeleteUser = async () => {
    const response = await apiService.delete({
      url: "/users/delete-account",
    });
    if(response.data == HTTP_STATUS.OK){
        navigate({
            to:'/profile/security/success-delete'
        })
    }
    else{
        setIsError(true)
        setTimeout(() =>{
            setIsError(false)
        },3000)
    }
  };
  return (
    <div className="min-h-screen bg-white">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <IconContainer align="end" action={() => history.back()}>
            <img src={CrossIcon} alt="Подтвердить" />
          </IconContainer>
        </div>
      </Header>
      <section className="px-4">
        <div className="flex flex-col items-center gap-8 my-8">
          <img src={WarningIcon} alt="" />
          <Typography size={18} weight={700} color={COLORS_TEXT.red}>
            {t("deleteAccount")}
          </Typography>
        </div>
        <div className="flex flex-col gap-4">
          <Typography>{t("deleteAccountData")}</Typography>
          <Typography>{t("changeEmailWarning")}</Typography>
        </div>
        {isErorr && (
          <div className="mt-8">
            <Hint
              title={t("defaultError")}
              mode="error"
              className="flex items-center justify-center"
            />
          </div>
        )}
        <div className="fixed bottom-0 left-0 px-4 py-2 w-full">
          <Button mode="red" className="mb-2" onClick={handleDeleteUser}>
            {t("deleteProfile")}
          </Button>
          <Button mode="border" onClick={() => navigate({
            to:"/profile/security/change-email"
          })}>{t("changeEmailAddress")}</Button>
        </div>
      </section>
    </div>
  );
};
