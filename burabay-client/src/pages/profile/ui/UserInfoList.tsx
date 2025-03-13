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

  return (
    <div>
      <ul>
        {params.map((param, index) => (
          <li key={index} className="border-b border-[#999999] py-3 mb-2">
            <Link
              to={"/profile/edit"}
              className={`${param === "organizationAbout" || accountStatus === "done" ? "flex justify-between" : ""}`}
            >
              <div>
                <p>
                  {userInfo[`${param}`] && userInfo[`${param}`].length > 50
                    ? `${userInfo[`${param}`].slice(0, 50)}...`
                    : userInfo[`${param}`] || t("notFiled")}
                </p>
                <span className={`text-xs text-[#999999]`}>{t(param)}</span>
              </div>
              {param === "organizationAbout" && (
                <img src={ArrowRight} alt="Стрелка" />
              )}

              {accountStatus === "done" &&
                param === "organizationName" && (
                  <img src={ConfirmedIcon} alt="Галочка" />
                )}
            </Link>
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
