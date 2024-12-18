import { FC, useState } from "react";
import { Header } from "../../../components/Header";
import { IconContainer } from "../../../shared/ui/IconContainer";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import { useTranslation } from "react-i18next";
import { Typography } from "../../../shared/ui/Typography";
import BackIcon from "../../../app/icons/back-icon.svg";
import CrossIcon from "../../../app/icons/cross.svg";
import SuccessIcon from "../../../app/icons/success-delete.svg";
import { Button } from "../../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";

export const SuccessDelete: FC = function SuccessDelete() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <Header>
        <div className="flex justify-between items-center">
          <IconContainer
            align="start"
            action={() =>
              navigate({
                to: "/auth",
              })
            }
          >
            <img src={BackIcon} />
          </IconContainer>
          <IconContainer
            align="end"
            action={() =>
              navigate({
                to: "/auth",
              })
            }
          >
            <img src={CrossIcon} />
          </IconContainer>
        </div>
      </Header>
      <section className="px-4">
        <div className="flex flex-col items-center gap-8 my-8">
          <img src={SuccessIcon} alt="" />
          <Typography size={18} weight={700} color={COLORS_TEXT.blue200}>
            {t("successDelete")}
          </Typography>
        </div>
        <div className="fixed bottom-0 left-0 px-4 py-2 w-full">
          <Button onClick={() => navigate({
            to:"/auth"
          })}>{t("goToAuth")}</Button>
        </div>
      </section>
    </div>
  );
};
