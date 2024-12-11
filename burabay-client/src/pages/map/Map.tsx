import  { FC } from 'react';
import { Typography } from '../../shared/ui/Typography';
import { NavMenuOrg } from '../../shared/ui/NavMenuOrg';

interface Props {

}

export const Map: FC<Props> = function Map() {
  return (
    <div>
      <Typography>{"карта"}</Typography>
      <NavMenuOrg/>
    </div>
  )
};