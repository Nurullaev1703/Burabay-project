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

  // Функция для правильной обработки URL
  const formatSiteUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    
    // Убираем все пробелы
    let cleanUrl = url.replace(/\s+/g, '');
    
    // Если URL уже начинается с http:// или https://, возвращаем как есть
    if (cleanUrl.startsWith('http://') || cleanUrl.startsWith('https://')) {
      return cleanUrl;
    }
    
    // Если URL начинается с //, добавляем https:
    if (cleanUrl.startsWith('//')) {
      return `https:${cleanUrl}`;
    }
    
    // В остальных случаях добавляем https://
    return `https://${cleanUrl}`;
  };

  return (
    <div>
      <ul>
        {params.map((param, index) => (
          <li key={index} className="border-b border-[#999999] py-3 mb-2">
            {param === "site" ? (
              // Для сайта используем обычный <a> с target="_blank"
              <a
                href={formatSiteUrl(userInfo[param])}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex justify-between items-start ${!userInfo[param] ? 'pointer-events-none' : ''}`}
              >
                <div className="flex-1 pr-2 min-w-0">
                  <p className="break-words whitespace-normal overflow-wrap-anywhere">
                    {userInfo[param] || t("notFiled")}
                  </p>
                  <span className={`text-xs text-[#999999]`}>{t(param)}</span>
                </div>
                {userInfo[param] && (
                  <img src={ArrowRight} alt="Стрелка" className="flex-shrink-0" />
                )}
              </a>
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
