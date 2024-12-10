
import  { FC } from 'react';
import { Typography } from '../../shared/ui/Typography';
import { NewNavMenu } from '../../shared/ui/NewNavMenu';

interface Props {

}

export const Reviews: FC<Props> = function Reviews() {
  return (
    <div>
      <Typography>{"отзывы"}</Typography>
      <NewNavMenu/>
    </div>
  )
};