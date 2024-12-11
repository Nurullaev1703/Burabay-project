
import  { FC } from 'react';
import { Typography } from '../../shared/ui/Typography';
import { NavMenuOrg } from '../../shared/ui/NavMenuOrg';

interface Props {

}

export const Booking: FC<Props> = function Booking() {
  return (
    <div>
        <Typography>{"Бронирование"}</Typography>
        <NavMenuOrg/>
    </div>
  )
};