import  { FC } from 'react';
import { Typography } from '../../shared/ui/Typography';
import { NewNavMenu } from '../../shared/ui/NewNavMenu';

interface Props {

}

export const Map: FC<Props> = function Map() {
  return (
    <div>
      <Typography>{"карта"}</Typography>
      <NewNavMenu/>
    </div>
  )
};