import { FC } from "react";
import { useTranslation } from "react-i18next";
import CheckMark from "../../../app/icons/check-mark.svg";
import WaitingMark from "../../../app/icons/waiting-mark.svg";

export type accountStatus = "unconfirmed" | "waiting" | "notFilled" | "confirmed";

interface Props {
  accountStatus: accountStatus;
}

export const Hint: FC<Props> = function Hint({ accountStatus }) {
  const { t } = useTranslation();
  return (
    <div className="mb-2">
      {accountStatus === "unconfirmed" && (
        <div
          className={`relative w-full bg-gradient-to-r from-[#FFB863] to-[#FF7A2F] rounded-2xl`}
        >
          <div className="max-w-72 py-3 pl-4">
            <span className={`tracking-tighter font-semibold text-white`}>
              {t("accountConfirm")}
            </span>
            <button
              className={`mt-2.5 font-semibold text-white border-solid border-2 rounded-lg py-1 px-3.5 border-white`}
            >
              {t("details")}
            </button>
          </div>
          <img
            className="absolute right-0 bottom-0"
            src={CheckMark}
            alt="Галочка"
          />
        </div>
      )}
      {accountStatus === "waiting" && (
        <div
          className={`relative w-full bg-gradient-to-r from-[#2A9DBE] to-[#035F7C] rounded-2xl`}
        >
          <div className="max-w-72 py-3 pl-4">
            <span className={`tracking-tighter font-semibold text-white`}>
              {t("accountWaiting")}
            </span>
          </div>
          <img
            className="absolute right-0 bottom-0"
            src={WaitingMark}
            alt="Ожидание"
          />
        </div>
      )}
    </div>
  );
};
