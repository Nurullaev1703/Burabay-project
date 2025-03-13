import { FC } from "react";
import { useTranslation } from "react-i18next";
import ProfileMark from "../../../app/icons/profile/profile.svg";
import { Link } from "@tanstack/react-router";

export const HintTourist: FC = function HintTourist() {
  const { t } = useTranslation();
  return (
    <div className="mb-2">
      <div
        className={`relative w-full bg-gradient-to-r from-[#FFB863] to-[#FF7A2F] rounded-2xl`}
      >
        <div className="max-w-72 py-3 pl-4 flex flex-col">
          <span
            className={`tracking-tighter font-semibold text-white leading-4`}
          >
            {t("fillProfile")}
          </span>
          <Link
            to={"/profile/edit"}
            className={`mt-2.5 font-semibold text-white border-solid border-2 rounded-lg py-1 px-3.5 border-white w-28`}
          >
            {t("fill")}
          </Link>
        </div>
        <img
          className="absolute right-4 bottom-[20%]"
          src={ProfileMark}
          alt="Профиль"
        />
      </div>
    </div>
  );
};
