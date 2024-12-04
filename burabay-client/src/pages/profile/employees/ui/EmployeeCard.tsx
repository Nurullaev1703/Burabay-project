import { FC, HTMLAttributes } from 'react';
import { EmployeeType } from '../model/employee-type';
import { Typography } from '../../../../shared/ui/Typography';
import { COLORS_TEXT } from '../../../../shared/ui/colors';
import { useTranslation } from 'react-i18next';
import { IconContainer } from '../../../../shared/ui/IconContainer';
import OptionsIcon from "../../../../app/icons/profile/options.svg";
import { formatPhoneNumber } from '../../../../shared/ui/format-phone';
import { useRouter } from '@tanstack/react-router'; 

interface Props extends HTMLAttributes<HTMLDivElement> {
  employee: EmployeeType;
  action: () => void;
}

export const EmployeeCard: FC<Props> = function EmployeeCard(props) {
  const { t } = useTranslation();
  const { navigate } = useRouter(); 

  const handleEditClick = () => {
    navigate({
      to: `/profile/employees/edit/${props.employee.id}` // Используем ID сотрудника для редактирования
    });
  };

  return (
    <li className='flex flex-col gap-4 border-b pb-4' onClick={props.action}>
      {!Boolean(props.employee.fullName) && (
        <Typography size={20} weight={600}>
          {t('acceptWaiting')}
        </Typography>
      )}
      <div className='w-full flex justify-between items-center'>
        <div>
          <Typography weight={600}>
            {props.employee.fullName || formatPhoneNumber(props.employee.phoneNumber)}
          </Typography>
          <Typography color={COLORS_TEXT.secondary}>
            {props.employee.position}
          </Typography>
        </div>
        <IconContainer align='end'>
          <button onClick={handleEditClick}> 
            <img src={OptionsIcon} alt="" />
          </button>
        </IconContainer>
      </div>
    </li>
  );
};
