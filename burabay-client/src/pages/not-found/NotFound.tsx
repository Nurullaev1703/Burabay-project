import { FC } from "react";
import { useTranslation } from "react-i18next";
import NotFoundImg from "../../app/icons/404.svg";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { Button } from "../../shared/ui/Button";
import { useRouter } from "@tanstack/react-router";

export const NotFound: FC = function NotFound() {
  const { t } = useTranslation();
  const { history } = useRouter()
  return (
    <section className="flex flex-col items-center min-h-screen">
      <h1
        className={`${COLORS_TEXT.blue200} text-3xl font-bold text-center mb-9 mt-28`}
      >
        {t("pageNotFound")}
      </h1>
      <img
        src={NotFoundImg}
        alt={t("pageNotFound")}
        className="max-w-72 mx-auto"
      />

      <Button
        className="fixed bottom-4 left-3 w-header z-10"
        onClick={() => history.back()}
      >
        {t("back")}
      </Button>
    </section>
  );
};
