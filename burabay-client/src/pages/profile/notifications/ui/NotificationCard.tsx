import  { FC } from 'react';
import { Typography } from '../../../../shared/ui/Typography';
import { Card } from '../../../../shared/ui/Card';
import { COLORS_TEXT } from '../../../../shared/ui/colors';
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface Props {
    date: Date,
    title: string
}

export const NotificationCard: FC<Props> = function NotificationCard(props) {
  return <li className='p-4 flex flex-col gap-4'>
    <Typography size={20} weight={800}>{format(props.date, "dd MMMM",{
        locale: ru
    })}</Typography>
    <Card className='bg-[#f5f5f5] w-full'>
        <Typography>
            {props.title}
        </Typography>
        <Typography color={COLORS_TEXT.secondary}>
            {format(props.date, "k:mm")}
        </Typography>
    </Card>
  </li>
};