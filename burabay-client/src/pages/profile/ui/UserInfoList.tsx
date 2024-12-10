import { Link } from "@tanstack/react-router";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../shared/ui/Button";
import { COLORS_TEXT } from "../../../shared/ui/colors";
import ArrowRight from "../../../app/icons/arrow-right.svg";
import ConfirmedIcon from "../../../app/icons/profile/confirmed.svg";
import { accountStatus } from "./Hint";

export const paramsOrganizator: string[] = [
  "organizationName",
  "organizationAbout",
  "emailToLogin",
  "phone",
  "site",
];
export const paramsTourist: string[] = ["name", "emailToLogin", "phone"];

export let userInfo: any = {
  organizationName: "Бурабай курорт",
  organizationAbout:
    "Добро пожаловать в наш уютный отель, расположенный в самом сердце курортной зоны «Бурабай» — месте, где природа поражает своей красотой, а отдых становится поистине незабываемым. Наш отель окружён величественными горами, густыми хвойными лесами и кристально чистыми озёрами!",
  emailToLogin: "burabay_currort_2024@gmail.com",
  phone: "",
  site: "",
};

export const UserInfoList: FC = function UserInfoList() {
  const { t } = useTranslation();
  const [params, setParams] = useState<string[]>(paramsOrganizator);
  const [accountStatus, setAccountStatus] =
    useState<accountStatus>("unconfirmed");
  return (
    <div>
      <ul>
        {params.map((param, index) => (
          <li key={index} className="border-b border-[#999999] py-3 mb-2">
            <Link
              to={"/profile/edit"}
              className={`${param === "organizationAbout" || accountStatus === "confirmed" ? "flex justify-between" : ""}`}
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

              {accountStatus === "confirmed" &&
                param === "organizationName" && (
                  <img src={ConfirmedIcon} alt="Галочка" />
                )}
            </Link>
          </li>
        ))}
      </ul>
      <Button
        mode={"red"}
        className={`mb-[42px] ${COLORS_TEXT.error}`}
        // onClick={() => {
        //   tokenService.deleteValue();
        //   navigate({ to: "/auth" });
        // }}
      >
        {t("logoutFromAccount")}
      </Button>
    </div>
  );
};
