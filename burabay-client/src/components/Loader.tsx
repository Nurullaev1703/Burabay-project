import { CircularProgress } from '@mui/material';
import  { FC } from 'react';
import { COLORS } from '../shared/ui/colors';

// загрузчик на весь экран на время выполнения запросов
export const Loader: FC = function Loader() {
  return <div className="flex flex-col h-screen justify-center items-center fixed top-0 left-0 w-full bg-alternate z-50">
  <CircularProgress size={80} sx={{color: COLORS.main200}} />
</div>
};