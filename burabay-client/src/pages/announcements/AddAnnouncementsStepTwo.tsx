import { FC, useState } from 'react';
import { Category } from './model/announcements';
import { Header } from '../../components/Header';
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Typography } from '../../shared/ui/Typography';
import { COLORS_TEXT } from '../../shared/ui/colors';
import { IconContainer } from '../../shared/ui/IconContainer';
import { baseUrl } from "../../services/api/ServerData";
import defaultImage from "../../app/icons/main/health.svg";
import { Button } from '../../shared/ui/Button';
import { useNavigate } from '@tanstack/react-router';
import { ProgressSteps } from './ui/ProgressSteps';

interface Props {
  category: Category;
}

export const AddAnnouncementsStepTwo: FC<Props> = function AddAnnouncementsStepTwo({ category }) {
  const [imgSource, setImgSource] = useState<string>(baseUrl + category.imgPath);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRadioChange = (id: string) => {
    setSelectedSubcategoryId(id);
  };

  const handleContinue = () => {
    if (selectedSubcategoryId) {
      navigate({
        to: `/announcements/choiseDetails/${category.id}/${selectedSubcategoryId}`,
      });
    } else {
      alert("Выберите подкатегорию перед продолжением!");
    }
  };

  return (
    <section className='min-h-screen'>
      <Header>
        <div className='flex justify-between items-center text-center'>
          <IconContainer align='start' action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography size={18} weight={500} color={COLORS_TEXT.blue200} align='center'>
              {"Новое обьявление"}
            </Typography>
            <Typography size={14} weight={400} color={COLORS_TEXT.blue200} align='center'>
              {"Выберите подкатегорию"}
            </Typography>
          </div>
          <IconContainer align='end' action={() => history.back()}>
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={2} totalSteps={10}></ProgressSteps>
      </Header>
      

      <div className="space-y-4 px-4">
        <div className='flex items-center text-center gap-4'>
          <img
            src={imgSource}
            onError={() => setImgSource(defaultImage)}
            alt=""
          />
          <Typography size={22} weight={500}>{category.name}</Typography>
        </div>
        <ul className="space-y-4">
          {category.subcategories.map((subcategory) => (
            <li key={subcategory.id} className="flex items-center">
              <input
                type="radio"
                name="subcategory"
                value={subcategory.id}
                checked={selectedSubcategoryId === subcategory.id}
                onChange={() => handleRadioChange(subcategory.id)}
                className="w-5 h-5 text-blue200 border-gray300 focus:ring-blue200 rounded-full"
              />
              <Typography
                size={16}
                weight={400}
                className="ml-3 text-lg text-black"
              >
                {subcategory.name}
              </Typography>
            </li>
          ))}
        </ul>
      </div>
      <div className='fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full'>
        <Button onClick={handleContinue} mode='default'>{"Продолжить"}</Button>
      </div>
    </section>
  );
};
