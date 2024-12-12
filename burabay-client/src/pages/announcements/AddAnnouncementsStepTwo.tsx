
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



interface Props {
category: Category
}

export const AddAnnouncementsStepTwo: FC<Props> = function AddAnnouncementsStepTwo({category}) {
    console.log(category)
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
      <Typography size={14} weight={400} color={COLORS_TEXT.blue200} align='center'>{"Выберите подкатегорию"}</Typography>
      </div>
      <IconContainer align='end' action={async() =>  history.back()}>
      <img src={XIcon} alt="" />
      </IconContainer>
      </div>
    </Header>
    <div className="flex items-center gap-2 px-4 mb-2">
  <div className="h-2 flex-1 bg-gray300 rounded-full"></div>
  <div className="h-2 flex-1 bg-blue200 rounded-full"></div>
  <div className="h-2 flex-1 bg-gray300 rounded-full"></div>
  <div className="h-2 flex-1 bg-gray300 rounded-full"></div>
  <div className="h-2 flex-1 bg-gray300 rounded-full"></div>
  <div className="h-2 flex-1 bg-gray300 rounded-full"></div>
    </div>

    <div className="space-y-4 px-4 ">
    </div>
    <div className='fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full'>
    <Button mode='default'>{"Сохранить"}</Button>
    </div>
    </section>
  )
  
};