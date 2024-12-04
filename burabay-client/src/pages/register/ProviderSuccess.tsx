import { FC } from "react";
import CheckMark from "../../app/img/RegFinish.png";
import { Button } from "../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";

export const ProviderSuccess: FC = function ProviderSuccess() {
  const navigate = useNavigate();
  const { t } = useTranslation()

  return (
    <section className="flex flex-col justify-between h-screen px-4">
      <div className={"flex flex-col justify-center items-center my-40"}>
        <img src={CheckMark} alt="check-mark" />
        <h1 className={"text-xl font-extrabold text-center mt-8 mb-2"}>
          {t('registerSuccess')}
        </h1>
        <p className={"font-medium text-center leading-5 max-w-96"}>
          {t("moveToProfile")}
        </p>
      </div>
      <div>
        <Button
          onClick={() => navigate({ to: "/what-next" })}
          className={"mb-8"}
        >
          {t('whatNext')}
        </Button>
      </div>
    </section>
  );
};
