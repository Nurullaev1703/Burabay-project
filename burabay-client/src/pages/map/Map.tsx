import { FC, useRef, useState } from 'react';
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
import { DefaultForm } from '../auth/ui/DefaultForm';
import { Controller, useForm } from 'react-hook-form';
import { TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useMask } from '@react-input/mask';
import { ProgressSteps } from '../announcements/ui/ProgressSteps';
import  imageSvg from "../../app/icons/announcements/image.svg"

interface Props {

}

export const Map: FC<Props> = function Map() {
  const navigate = useNavigate();
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
                {"Оформите объявление"}
              </Typography>
            </div>
            <IconContainer align='end' action={() => history.back()}>
              <img src={XIcon} alt="" />
            </IconContainer>
          </div>
          <ProgressSteps currentStep={4} totalSteps={9}></ProgressSteps>
        </Header>
        <div className='fixed left-0 bottom-0 mb-2 mt-2 px-2 w-full'>
          <Button onClick={() => navigate({
          to: `/map`,
        })} mode='default'>{"Продолжить"}</Button>
        </div>
    </section>
  )
};