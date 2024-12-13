import { useState, useEffect, FC, ButtonHTMLAttributes } from 'react';
import { Button } from './Button';
import { useTranslation } from 'react-i18next';

interface TimerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  initialTime: number; // Время в секундах
}

const TimerButton: FC<TimerButtonProps> = (props) => {
  const [timeLeft, setTimeLeft] = useState<number>(props.initialTime);
  const [isTimeout, setIsTimeout] = useState<boolean>(false);
  const {t} = useTranslation()
  useEffect(() => {
    let timerId: NodeJS.Timeout;

    if (timeLeft > 0) {
      timerId = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else {
      setIsTimeout(true);
    }

    return () => clearInterval(timerId);
  }, [timeLeft]);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isTimeout) {
      setTimeLeft(props.initialTime);
      setIsTimeout(false);
    }
    if (props.onClick) {
      props.onClick(event);
    }
  };

  return (
    <Button
      disabled={!isTimeout}
      className={props.className}
      onClick={handleClick}
    >
      {isTimeout ? t('repeatMail') : `${t('repeatMailAfter')} ${timeLeft}`}
    </Button>
  );
};

export default TimerButton;