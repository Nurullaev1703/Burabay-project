
import  { FC, useState } from 'react';
import { Category } from './model/announcements';
import { Header } from '../../components/Header';
import BackIcon from "../../app/icons/announcements/blueBackicon.svg"
import XIcon from "../../app/icons/announcements/blueKrestik.svg"
import { Typography } from '../../shared/ui/Typography';
import { COLORS_TEXT } from '../../shared/ui/colors';
import { IconContainer } from '../../shared/ui/IconContainer';
import RightArrow from "../../app/icons/announcements/arrowRight.svg"
import { baseUrl } from "../../services/api/ServerData";
import defaultImage from "../../app/icons/main/health.svg"
import { Button } from '../../shared/ui/Button';
import attractions from "../../app/icons/main/attractions.svg"
import entertaiment from "../../app/icons/main/entertaiment.svg"
import extreme from "../../app/icons/main/extreme.svg"
import health from "../../app/icons/main/health.svg"
import house from "../../app/icons/main/house.svg"
import nutrition from "../../app/icons/main/nutrition.svg"
import rental from "../../app/icons/main/rental.svg"
import rest from "../../app/icons/main/rest.svg"
import security from "../../app/icons/main/security.svg"
import { useNavigate } from '@tanstack/react-router';
import { ProgressSteps } from './ui/ProgressSteps';



interface Props {
category: Category[]
}

export const AddAnnouncements: FC<Props> = function AddAnnouncements({category}) {
  const navigate = useNavigate();
  const icons = [
    rest,
    house,
    nutrition,
    attractions,
    health,
    entertaiment,
    extreme,
    rental,
    security
  ]
  return (
    <section className='min-h-screen'>
    <Header>
    <div className='flex justify-between items-center text-center'>
      <IconContainer align='start' action={async() =>  history.back()}>
      <img src={BackIcon} alt="" />
      </IconContainer>
      <div>
      <Typography size={18} weight={500} color={COLORS_TEXT.blue200} align='center'>{"Новое обьявление"}</Typography>
      <Typography size={14} weight={400} color={COLORS_TEXT.blue200} align='center'>{"Выберите категорию"}</Typography>
      </div>
      <IconContainer align='end' action={async() =>  history.back()}>
      <img src={XIcon} alt="" />
      </IconContainer>
      </div>
      <ProgressSteps currentStep={1} totalSteps={10}></ProgressSteps>
    </Header>

    <div className="space-y-4 px-4 ">
    {category.map((item , index) =>{
      const [imgSource , setImgSource] = useState<string>(baseUrl + item.imgPath)
      const icon = icons[index %  icons.length];
      return (
        <div key={item.id} onClick={() => navigate({
          to: `/announcements/addAnnouncementsStepTwo/${item.id}`,
        })} className="flex items-center justify-between border-b-[1px] rounded-xl">
        <div className="flex items-center gap-4">
          <div className="w-[20%]">
            <img src={icon}
            onError={() => setImgSource(defaultImage)}
            className='w-[34px] h-[34px]' alt="" />
          </div>
          <div className='gap-1'>
            <Typography size={16} weight={400} className="text-black">{item.name}</Typography>
            <Typography size={14} weight={400} color={COLORS_TEXT.gray100} className="mb-4">
              {item.description}
            </Typography>
          </div>
        </div>
        <div className="">
        <img src={RightArrow} className='w-7 h-4' alt="" />
        </div>
      </div>
      )
    })}
    </div>
    <div className='mb-2 mt-2 px-2'>
    <Button mode='border' onClick={async() =>  history.back()}>{"Отменить"}</Button>
    </div>
    </section>
  )
  
};