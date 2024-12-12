
import  { FC } from 'react';
import { Category } from './model/announcements';
import { Header } from '../../components/Header';
import BackIcon from "../../app/icons/announcements/blueBackicon.svg"
import XIcon from "../../app/icons/announcements/blueKrestik.svg"
import { Typography } from '../../shared/ui/Typography';
import { COLORS_TEXT } from '../../shared/ui/colors';
import { IconContainer } from '../../shared/ui/IconContainer';
import RightArrow from "../../app/icons/announcements/arrowRight.svg"
import house from "../../app/icons/main/house.svg"



interface Props {
category: Category[]
}

export const AddAnnouncements: FC<Props> = function AddAnnouncements(category) {

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
    </Header>
    <div className="space-y-4 px-4 ">

  <div className="flex items-center justify-between border-b-[1px] rounded-xl">
    <div className="flex items-center gap-4">
      <div className="w-[20%]">
        <img src={house} className='w-[34px] h-[34px]' alt="" />
      </div>
      <div className='gap-1'>
        <Typography size={16} weight={400} className="text-black">Отдых</Typography>
        <Typography size={14} weight={400} color={COLORS_TEXT.gray100} className="mb-4">
          Туристическая тропа, грибное место, зона для отдыха и пикников, и т.д.
        </Typography>
      </div>
    </div>
    <div className="">
    <img src={RightArrow} alt="" />
    </div>
  </div>
</div>

    </section>
  )
  
};