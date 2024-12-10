import { FC } from "react";
import { useTranslation } from "react-i18next";
import ProfileMark from "../../../app/icons/profile/profile.svg";

export const HintTourist: FC = function HintTourist() {
  const { t } = useTranslation();
  return (
    <div className="mb-2">
        <div
          className={`relative w-full bg-gradient-to-r from-[#FFB863] to-[#FF7A2F] rounded-2xl`}
        >
          <div className="max-w-72 py-3 pl-4">
            <span className={`tracking-tighter font-semibold text-white`}>
              {t("fillProfile")}
            </span>
            <button
              className={`mt-2.5 font-semibold text-white border-solid border-2 rounded-lg py-1 px-3.5 border-white`}
            >
              {t("fill")}
            </button>
          </div>
          <img
            className="absolute right-4 bottom-1/4"
            src={ProfileMark}
            alt="Профиль"
          />
        </div>
    </div>
  );
};
