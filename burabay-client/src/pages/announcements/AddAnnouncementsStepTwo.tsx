import { FC, useState } from "react";
import { Category } from "./model/announcements";
import { Header } from "../../components/Header";
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Typography } from "../../shared/ui/Typography";
import { COLORS_TEXT } from "../../shared/ui/colors";
import { IconContainer } from "../../shared/ui/IconContainer";
import { baseUrl } from "../../services/api/ServerData";
import defaultImage from "../../app/icons/main/health.svg";
import { Button } from "../../shared/ui/Button";
import { useNavigate } from "@tanstack/react-router";
import { ProgressSteps } from "./ui/ProgressSteps";
import { Radio, RadioGroup } from "@mui/material";
import { useTranslation } from "react-i18next";

interface Props {
  category: Category;
}

export const AddAnnouncementsStepTwo: FC<Props> =
  function AddAnnouncementsStepTwo({ category }) {
    const { t } = useTranslation();
    const [imgSource, setImgSource] = useState<string>(
      baseUrl + category.imgPath
    );
    const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<
      string | null
    >(category.subcategories.length > 0 ? category.subcategories[0].id : null);
    const navigate = useNavigate();

    const handleRadioChange = (id: string) => {
      setSelectedSubcategoryId(id);
    };

    const handleContinue = () => {
      if (selectedSubcategoryId) {
        navigate({
          to: `/announcements/choiseDetails/${category.id}/${selectedSubcategoryId}`,
        });
      }
    };

    return (
      <section className="min-h-screen">
        <Header>
          <div className="flex justify-between items-center text-center">
            <IconContainer align="start" action={() => history.back()}>
              <img src={BackIcon} alt="" />
            </IconContainer>
            <div>
              <Typography
                size={18}
                weight={500}
                color={COLORS_TEXT.blue200}
                align="center"
              >
                {t("addNewAd")}
              </Typography>
              <Typography
                size={14}
                weight={400}
                color={COLORS_TEXT.blue200}
                align="center"
              >
                {t("choiseSubcategory")}
              </Typography>
            </div>
            <IconContainer align='end' action={async() =>  navigate({
        to: "/announcements"
      })}>
      <img src={XIcon} alt="" />
      </IconContainer>
          </div>
          <ProgressSteps currentStep={2} totalSteps={9}></ProgressSteps>
        </Header>

        <div className="space-y-4 px-4">
          <div className="flex items-center text-center gap-4">
            <img
              src={imgSource}
              onError={() => setImgSource(defaultImage)}
              alt=""
            />
            <Typography size={22} weight={500}>
              {t(category.name)}
            </Typography>
          </div>
          <ul>
            {category.subcategories.map((subcategory) => (
              <li
                onChange={() => handleRadioChange(subcategory.id)}
                key={subcategory.id}
                className="py-2"
              >
                <label htmlFor={subcategory.id} className="flex items-center">
                  <RadioGroup
                    aria-labelledby="demo-controlled-radio-buttons-group"
                    name="controlled-radio-buttons-group"
                    value={subcategory.id}
                    onChange={() => handleRadioChange(subcategory.id)}
                  >
                    <Radio
                      checked={selectedSubcategoryId === subcategory.id}
                      id={subcategory.id}
                      sx={{
                        padding: 0,
                        "& .MuiSvgIcon-root": {
                          fontSize: 20,
                        },
                      }}
                    />
                  </RadioGroup>
                    <Typography
                      size={16}
                      weight={400}
                      className="ml-3 text-lg text-black"
                    >
                      {t(subcategory.name)}
                    </Typography>
                </label>
              </li>
            ))}
          </ul>
        </div>
        <div className="fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full z-10">
          <Button onClick={handleContinue} mode="default">
            {t("continueBtn")}
          </Button>
        </div>
      </section>
    );
  };
