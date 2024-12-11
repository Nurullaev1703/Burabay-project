import { FC, useState } from "react";
import { Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import KeyIcon from "../../app/icons/profile/key.svg";
import BaseLogo from "../../app/icons/profile/settings/image.svg";
import AttentionIcon from "../../app/icons/profile/attention.svg";
import FavouriteIcon from "../../app/icons/profile/favourite.svg";
import StarIcon from "../../app/icons/profile/star.svg";
import LifebuoyIcon from "../../app/icons/profile/lifebuoy.svg";
import { Profile as ProfileType } from "./model/profile";
import LanguageIcon from "../../app/icons/language.svg";
import { RatingModal } from "../../components/RatingModal";
import { baseUrl } from "../../services/api/ServerData";
import { COLORS_BORDER } from "../../shared/ui/colors";
import { accountStatus, Hint } from "./ui/Hint";
import { imageService } from "../../services/api/ImageService";
import { apiService } from "../../services/api/ApiService";
import ChangeImageIcon from "../../app/icons/profile/settings/changeImage.svg";
import ArrowRight from "../../app/icons/arrow-right.svg";
import { UserInfoList } from "./ui/UserInfoList";
import { HintTourist } from "./ui/HintToursit";

interface Props {
  user?: ProfileType;
}

type Language = "RU" | "KZ" | "EN";
export let user = { role: "организация" };

export const Profile: FC<Props> = function Profile() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [imgSrc, setImgSrc] = useState<string>(baseUrl + user?.filial?.image);
  const [accountStatus, setAccountStatus] =
    useState<accountStatus>("confirmed");
  const [language, setLanguage] = useState<Language>("RU");

  // Смена лого
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const imageChange = async (data: File) => {
    if (data) {
      setIsLoading(true);
      const formData = new FormData();
      formData.append("file", data);
      try {
        if (user?.organization?.imgUrl.includes("/image")) {
          // удаление картинки. Принимает на себя путь к картинке
          await apiService.delete({
            url: "/image",
            dto: {
              filepath: user?.organization?.imgUrl,
            },
          });
        }
        // сохранение картинки. В результате получаем ссылку на картинку
        const response = await imageService.post<string>({
          url: "/image/profile",
          dto: formData,
        });
        await apiService.patch({
          url: "/profile",
          dto: {
            organization: {
              imgUrl: response.data,
            },
          },
        });
        setImgSrc(baseUrl + response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    } else {
      console.error("No file selected");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      imageChange(selectedFiles[0]);
    } else {
      console.error("Не выбрано изображение");
    }
  };

  return (
    <section className="px-4">
      <div className="flex justify-center mb-4 py-2 items-center bg-white">
        <div
          className={`relative border-solid border-2 relative w-32 h-32 border-[#0A7D9E] rounded-full flex items-center justify-center`}
        >
          <img
            src={imgSrc}
            onError={() => {
              setImgSrc(BaseLogo);
            }}
            alt="Изображение"
            className="object-cover rounded-full"
          />
          <label
            htmlFor="logo"
            className="absolute bottom-0 right-0 p-1 rounded-full bg-[#0A7D9E] cursor-pointer w-11 h-11 flex items-center justify-center"
          >
            <img src={ChangeImageIcon} alt="" />
          </label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      </div>

      <div>
        <Link className="flex justify-between my-2" to={"/profile/edit"}>
          <span className={`font-semibold text-[#0A7D9E]`}>{t("account")}</span>
          <img src={ArrowRight} alt="Стрелка" />
        </Link>
      </div>

      {user?.role === "организация" && <Hint accountStatus={accountStatus} />}
      {user?.role === "турист" && accountStatus === "notFilled" && (
        <HintTourist />
      )}

      <UserInfoList />

      <ul>
        <li className={`${COLORS_BORDER.gray300}`}>
          <Link className="flex py-3" to={"/"}>
            <img src={KeyIcon} alt={t("safety")} className="mr-2" />
            <span>{t("safety")}</span>
          </Link>
        </li>
        {user?.role === "турист" && (
          <li className={`border-t  ${COLORS_BORDER.gray300}`}>
            <Link className="flex py-3" to={"/"}>
              <img src={FavouriteIcon} alt={t("saved")} className="mr-2" />
              <span>{t("saved")}</span>
            </Link>
          </li>
        )}
        <li className={`border-t  ${COLORS_BORDER.gray300}`}>
          <Link className="flex py-3" to={"/"}>
            <img src={AttentionIcon} alt={t("aboutService")} className="mr-2" />
            <span>{t("aboutService")}</span>
          </Link>
        </li>
        <li className={`border-t  ${COLORS_BORDER.gray300}`}>
          <Link className="flex py-3" to="/help">
            <img src={LifebuoyIcon} alt={t("help")} className="mr-2" />
            <span>{t("help")}</span>
          </Link>
        </li>
        <li className={`border-t border-b ${COLORS_BORDER.gray300}`}>
          <div
            className="flex py-3 cursor-pointer"
            onClick={() => setShowModal(true)}
          >
            <img src={StarIcon} alt={t("estimateService")} className="mr-2" />
            <span>{t("estimateService")}</span>
          </div>
        </li>
        <li className={`border-b  ${COLORS_BORDER.gray300}`}>
          <Link className="flex justify-between py-3" to="/help">
            <div className="flex items-center">
              <img src={LanguageIcon} alt={t("appLanguage")} className="mr-2" />
              <span>{t("appLanguage")}</span>
            </div>
            <span className="font-medium text-lg">{language}</span>
          </Link>
        </li>
        {showModal && (
          <RatingModal
            open={showModal}
            onClose={() => setShowModal(false)}
            user={user}
          />
        )}
      </ul>
    </section>
  );
};
