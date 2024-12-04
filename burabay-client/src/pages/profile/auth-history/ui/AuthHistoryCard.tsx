import  { FC } from 'react';
import { Typography } from '../../../../shared/ui/Typography';
import { format } from "date-fns"
import { ru } from "date-fns/locale"
import { COLORS_BORDER, COLORS_TEXT } from '../../../../shared/ui/colors';
import { useAuth } from '../../../../features/auth';
import { AuthHistory } from '../../model/profile';

interface Props {
    data: AuthHistory
}

export const AuthHistoryCard: FC<Props> = function AuthHistoryCard(props) {
  const { user } = useAuth()
  return <li className={`flex flex-col pb-4 gap-1 border-b ${COLORS_BORDER.light100}`}>
    <Typography weight={600}>
      {(props.data.managerName) ? props.data.managerName : user?.fullName}
    </Typography>
    <Typography color={COLORS_TEXT.secondary}>
      {`${format(props.data.date, "dd MMMM yyyy", {
        locale: ru
      })}, ${props.data.point}`}
    </Typography>
  </li>
};