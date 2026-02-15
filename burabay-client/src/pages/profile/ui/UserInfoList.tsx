import { Link } from "@tanstack/react-router";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../shared/ui/Button";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import ArrowRight from "../../../app/icons/arrow-right.svg";
import ConfirmedIcon from "../../../app/icons/profile/confirmed.svg";
import { accountStatus } from "./Hint";
import { useAuth } from "../../../features/auth";
import { ModalExit } from "./ModalExit";

interface Props {
  accountStatus: accountStatus;
}

export const paramsOrganizator: string[] = [
  "organizationName",
  "organizationAbout",
  "emailToLogin",
  "site",
];
export const paramsTourist: string[] = ["name", "emailToLogin", "phone"];

export const UserInfoList: FC<Props> = function UserInfoList({
  accountStatus,
}) {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [copiedSiteUrl, setCopiedSiteUrl] = useState(false);
  const [params, _setParams] = useState<string[]>(
    user?.role === "бизнес" ? paramsOrganizator : paramsTourist
  );

  const userInfo: any = {
    organizationName: user?.organization?.name,
    organizationAbout: user?.organization?.description,
    emailToLogin: user?.email,
    phone: user?.phoneNumber,
    site: user?.organization?.siteUrl,
    name: user?.fullName,
  };

  const handleCopySiteUrl = async () => {
    if (userInfo.site) {
      try {
        await navigator.clipboard.writeText(userInfo.site);
        setCopiedSiteUrl(true);
        setTimeout(() => setCopiedSiteUrl(false), 2000);
      } catch (err) {
        console.error("Failed to copy site URL:", err);
      }
    }
  };

  return (
    <div>
      <ul>
        {params.map((param, index) => (
          <li key={index} className="border-b border-[#999999] py-3 mb-2">
            {param === "site" ? (
              // Для сайта используем div с копированием
              <div
                onClick={handleCopySiteUrl}
                className={`flex justify-between items-start cursor-pointer hover:opacity-70 transition-opacity select-none ${!userInfo[param] ? 'cursor-default hover:opacity-100' : ''}`}
                title={userInfo[param] ? t("clickToCopy") : ""}
              >
                <div className="flex-1 pr-2 min-w-0">
                  <p className="break-words whitespace-normal overflow-wrap-anywhere">
                    {userInfo[param] || t("notFiled")}
                  </p>
                  <span className={`text-xs text-[#999999]`}>{copiedSiteUrl ? t("copiedToClipboard") : t(param)}</span>
                </div>
              </div>
            ) : (
              // Для остальных полей используем Link
              <Link
                to={"/profile/edit"}
                className={`flex justify-between items-start ${param === "organizationAbout" || accountStatus === "done" ? "" : ""}`}
              >
                <div className="flex-1 pr-2 min-w-0">
                  <p className="break-words whitespace-normal overflow-wrap-anywhere">
                    {userInfo[`${param}`] || t("notFiled")}
                  </p>
                  <span className={`text-xs text-[#999999]`}>{t(param)}</span>
                </div>
                {param === "organizationAbout" && (
                  <img src={ArrowRight} alt="Стрелка" className="flex-shrink-0" />
                )}

                {accountStatus === "done" &&
                  param === "organizationName" && (
                    <img src={ConfirmedIcon} alt="Галочка" className="flex-shrink-0" />
                  )}
              </Link>
            )}
          </li>
        ))}
      </ul>
      <Button
        mode={"red"}
        className={`mb-[42px] ${COLORS_TEXT.red}`}
        onClick={() => {
        setShowModal(true)
        }}
      >
        {t("logoutFromAccount")}
      </Button>
      {showModal && (
        <ModalExit open={showModal} onClose={() => setShowModal(false)} />
      )}
    </div>
  );
};
