import  { FC } from 'react';
import { Typography } from '../../shared/ui/Typography';
import { NewNavMenu } from '../../shared/ui/NewNavMenu';

interface Props {

}

export const Notifications: FC<Props> = function Notifications() {
  return (
    <div><Typography>{"уведомления"}</Typography>
    <NewNavMenu/>
    </div>
  )
};