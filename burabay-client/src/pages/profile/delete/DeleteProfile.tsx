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
import { useNavigate } from "@tanstack/react-router";

export const DeleteProfile: FC = function DeleteProfile() {
  const { t } = useTranslation();
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleDeleteUser = async () => {
    try {
      const response = await apiService.delete<{
        message?: string;
        status?: number;
      }>({
        url: "/users/delete-account",
      });

      if (response.status === 200) {
        navigate({
          to: "/profile/security/success-delete",
        });
      } else if (response.status === 400 || response.data?.status === 400) {
        // Ошибка из-за активных бронирований
        setErrorMessage(
          response.data?.message || t("cannotDeleteAccountWithBookings")
        );
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 5000);
      } else {
        setErrorMessage(t("defaultError"));
        setIsError(true);
        setTimeout(() => {
          setIsError(false);
        }, 3000);
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || t("defaultError"));
      setIsError(true);
      setTimeout(() => {
        setIsError(false);
      }, 3000);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header>
        <div className="flex items-center gap-4">
          <IconContainer
            align="center"
            action={() => navigate({ to: "/profile/security" })}
          >
            <img src={BackIcon} alt="back" />
          </IconContainer>
          <Typography>
          </Typography>
          <IconContainer
            align="center"
            className="ml-auto"
            action={() => navigate({ to: "/" })}
          >
            <img src={CrossIcon} alt="close" />
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
        {isError && (
          <div className="mt-8">
            <Hint
              title={errorMessage || t("defaultError")}
              mode="error"
              className="flex items-center justify-center"
            />
          </div>
        )}
        <div className="fixed bottom-0 left-0 px-4 py-2 w-full z-10">
          <Button mode="red" className="mb-2" onClick={handleDeleteUser}>
            {t("deleteProfile")}
          </Button>
          <Button
            mode="border"
            onClick={() =>
              navigate({
                to: "/profile/security/change-email",
              })
            }
          >
            {t("changeEmailAddress")}
          </Button>
        </div>
      </section>
    </div>
  );
};
