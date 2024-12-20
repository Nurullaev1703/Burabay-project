import  { FC, useState } from 'react';
import { Header } from '../../components/Header';
import { COLORS_TEXT } from '../../shared/ui/colors';
import { IconContainer } from '../../shared/ui/IconContainer';
import { ProgressSteps } from './ui/ProgressSteps';
import { Typography } from '../../shared/ui/Typography';
import BackIcon from "../../app/icons/announcements/blueBackicon.svg";
import XIcon from "../../app/icons/announcements/blueKrestik.svg";
import { Switch } from '@mui/material';
import { Button } from '../../shared/ui/Button';
import { useNavigate } from '@tanstack/react-router';

interface Props {

}

export const NewService: FC<Props> = function NewService() {
    const [unlimitedClients, setUnlimitedClients] = useState(false);
    const [adultsCount, setAdultsCount] = useState(2);
    const [childrenCount, setChildrenCount] = useState(2);
    const [ageLimit, setAgeLimit] = useState(14);
    const [petsAllowed, setPetsAllowed] = useState(false);
    const navigate = useNavigate()
  return (
    <main className='min-h-screen'>
      <Header>
        <div className="flex justify-between items-center text-center">
          <IconContainer align="start" action={() => history.back()}>
            <img src={BackIcon} alt="" />
          </IconContainer>
          <div>
            <Typography size={18} weight={500} color={COLORS_TEXT.blue200} align="center">
              {"Новая слуга"}
            </Typography>
          </div>
          <IconContainer align="end" action={() => history.back()}>
            <img src={XIcon} alt="" />
          </IconContainer>
        </div>
        <ProgressSteps currentStep={8} totalSteps={9} />
      </Header>
      <div className="p-4 space-y-6 ">
      {/* блок c клиентами */}
      <div className='flex justify-between items-center'>
        <div className="flex flex-col">
          <Typography size={16} weight={400} className="tracking-normal">Неограниченное количество клиентов</Typography>
          <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="">
          Данной услугой или местом посещения единовременно могут воспользоваться неограниченное количество людей
        </Typography>
        </div>

        <Switch
              checked={unlimitedClients}
              onChange={() => setUnlimitedClients(!unlimitedClients)}
              className="sr-only"
            />
      </div>

      {/* Блок Взрослые */}
      {!unlimitedClients && (
        <div>
          <Typography size={16} weight={400} className="">Взрослые</Typography>
          <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="mt-1">
            Максимальное количество взрослых, которые могут воспользоваться услугой одновременно.
          </Typography>
          <div className="flex justify-between items-center border-b pb-2 w-[90%] mt-2">
            <Typography size={12} weight={400}>{"Количество"}</Typography>
            <div className='flex  items-center gap-4'>
            <button
              onClick={() => setAdultsCount((prev) => Math.max(0, prev - 1))}
              className="text-2xl"
            >
              —
            </button>
            <Typography size={16} weight={400} className="border-b w-[72px] text-center">{adultsCount}</Typography>
            <button
              onClick={() => setAdultsCount((prev) => prev + 1)}
              className="text-2xl"
            >
              +
            </button>
            </div>
          </div>
        </div>
      )}

      {/* Блок Дети */}
      {!unlimitedClients && (
        <div>
          <Typography size={16 } weight={400} className="">Дети</Typography>
          <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="mb-2 mt-1">
          Максимальное количество детей, которые могут воспользоваться услугой одновременно. Дети старше указанного возраста будут считаться как взрослые. 
          </Typography>
          <div className="flex justify-between items-center border-b pb-2 w-[90%]">
          <Typography size={12} weight={400} className="">Количество</Typography>
          <div className='flex  items-center gap-4'>
            <button
              onClick={() => setChildrenCount((prev) => Math.max(0, prev - 1))}
              className="text-2xl"
            >
              —
            </button>
            <Typography size={16} weight={400} className="border-b w-[72px] text-center">{childrenCount}</Typography>
            <button
              onClick={() => setChildrenCount((prev) => prev + 1)}
              className="text-2xl"
            >
              +
            </button>
            </div>
          </div>
          <div className="mt-2 flex justify-between items-center border-b pb-2 w-[90%]">
            <Typography size={12} weight={400} className="">Возраст до</Typography>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setAgeLimit((prev) => Math.max(1, prev - 1))}
                className="text-2xl"
              >
                —
              </button>
              <Typography size={16} weight={400} className="border-b w-[72px] text-center">{ageLimit}</Typography>
              <button
                onClick={() => setAgeLimit((prev) => prev + 1)}
                className="text-2xl"
              >
                +
              </button>
            </div>
          </div>
        </div>
      )}

      {/* в мире животных */}
      <div className='flex justify-between items-center'>
        <div className="flex flex-col">
          <Typography size={16} weight={400} className="">Можно с животными</Typography>
          <Typography size={12} weight={400} color={COLORS_TEXT.gray100} className="">
          На территории предоставления услуги разрешено находиться с животными.
        </Typography>
        </div>
        <Switch
              checked={petsAllowed}
              onChange={() => setPetsAllowed(!petsAllowed)}
              className="sr-only"
            />
      </div>
    </div>
    <div className='fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full'>
        <Button onClick={() => navigate({
          to: `/announcements/priceService`,
        })} mode='default'>{"Продолжить"}</Button>
      </div>

    </main>
)
};