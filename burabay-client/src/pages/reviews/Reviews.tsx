
import  { FC } from 'react';
import { Typography } from '../../shared/ui/Typography';
import { NavMenuOrg } from '../../shared/ui/NavMenuOrg';

interface Props {

}

export const Reviews: FC<Props> = function Reviews() {
  return (
    <div>
      <Typography>{"отзывы"}</Typography>
      <NavMenuOrg/>
    </div>
  )
};