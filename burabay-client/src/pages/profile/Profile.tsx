import { FC, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Hint } from "../../shared/ui/Hint";
import { Tile } from "../../components/Tile";
import { useTranslation } from "react-i18next";
import { NewNavMenu } from "../../shared/ui/NewNavMenu";
import NotificationIcon from "../../app/icons/profile/notification.svg";
import BaseLogo from "../../app/icons/profile/baseLogo.svg";
import SettingsIcon from "../../app/icons/profile/settings.svg";
import HelpIcon from "../../app/icons/profile/help.svg";
import EstimateIcon from "../../app/icons/profile/estimate.svg";
import { COLORS_BORDER, COLORS_TEXT } from "../../shared/ui/colors";
import { Profile as ProfileType } from "./model/profile";
import { baseUrl } from "../../services/api/ServerUrl";
import checklist from "../../app/icons/profile/checklist.svg";
import Duty from "../../app/img/ProfileDuty.png";
import Agreement from "../../app/img/Agreement.png";
import Employees from "../../app/img/ProfileEmployees.png";
import Filiall from "../../app/img/ProfileFillial.png";
import { RatingModal } from "../../components/RatingModal";

interface Props {
  user: ProfileType;
}

export const Profile: FC<Props> = function Profile(props) {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [imgSrc,setImgSrc] = useState<string>(baseUrl + props.user.filial?.image)
  return (
    <section className="px-4">
      <div>
        <header className="flex justify-between mb-4 py-2 items-center">
          <div className="flex">
            <div className="img-cover w-12 h-12">
              <img
                src={imgSrc}
                onError={() => {setImgSrc(BaseLogo)}}
                alt="Лого компании"
                className="mr-2 object-cover rounded-full h-full w-full"
              />
            </div>
            <div className="ml-2">
              <h1 className="text-xl font-extrabold line-clamp-1 leading-6">
              {`${props.user?.organization?.type?.toUpperCase() || ""} «${props.user?.organization?.name?.toUpperCase() || ""}»`}
              </h1>
              <span className={`${COLORS_TEXT.secondary}`}>
                {props.user?.position || ""}
              </span>
            </div>
          </div>
          <Link to="/profile/notifications">
            <img src={NotificationIcon} alt="Уведомление" />
          </Link>
        </header>

        <Hint align="center" title={t("waiting1C")}></Hint>
    {/* TODO переделать отступы между блоками */}
        <ul className="flex items-center flex-wrap justify-between my-4 gap-2">
          <li className="w-[48%] aspect-w-16 aspect-h-7">
            <Link>
              <Tile imgUrl={Agreement} title={t("contracts")}></Tile>
            </Link>
          </li>
          <li className="w-[48%] aspect-w-16 aspect-h-7">
            <Link to="/debts">
              <Tile imgUrl={Duty} title={t("debts")}></Tile>
            </Link>
          </li>
          <li className="w-[48%] aspect-w-16 aspect-h-7">
            <Link>
              <Tile imgUrl={Filiall} title={t("branches")}></Tile>
            </Link>
          </li>
          <li className="w-[48%] aspect-w-16 aspect-h-7">
            <Link to="/profile/employees">
              <Tile imgUrl={Employees} title={t("employees")}></Tile>
            </Link>
          </li>
        </ul>

        <ul>
          <li className={`border-t  ${COLORS_BORDER.light100}`}>
            <Link className="flex py-3" to={"/order-history"}>
              <img src={checklist} alt={t("historyOrder")} className="mr-2" />
              <span>{t("historyOrder")}</span>
            </Link>
          </li>
          <li className={`border-t  ${COLORS_BORDER.light100}`}>
            <Link className="flex py-3" to={"/profile/edit"}>
              <img
                src={SettingsIcon}
                alt={t("profileSettings")}
                className="mr-2"
              />
              <span>{t("profileSettings")}</span>
            </Link>
          </li>
          <li className={`border-t  ${COLORS_BORDER.light100}`}>
            <Link className="flex py-3" to="/help">
              <img src={HelpIcon} alt={t("help")} className="mr-2" />
              <span>{t("help")}</span>
            </Link>
          </li>
          <li className={`border-t border-b ${COLORS_BORDER.light100}`}>
            <div
              className="flex py-3 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <img
                src={EstimateIcon}
                alt={t("estimateService")}
                className="mr-2"
              />
              <span>{t("estimateService")}</span>
            </div>
          </li>
          {showModal && (
            <RatingModal open={showModal} onClose={() => setShowModal(false)} user={props.user}/>
          )}
        </ul>
      </div>

      <NewNavMenu></NewNavMenu>
    </section>
  );
};
