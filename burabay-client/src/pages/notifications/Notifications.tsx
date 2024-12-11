import  { FC } from 'react';
import { Typography } from '../../shared/ui/Typography';
import { NavMenuOrg } from '../../shared/ui/NavMenuOrg';

interface Props {

}

export const Notifications: FC<Props> = function Notifications() {
  return (
    <div><Typography>{"уведомления"}</Typography>
    <NavMenuOrg/>
    </div>
  )
};