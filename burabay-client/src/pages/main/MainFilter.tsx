import  { FC } from 'react';
import { Header } from '../../components/Header';
import { MainPageFilter } from './model/mainpage-types';

interface Props {
    filters: MainPageFilter
}

export const MainFilter: FC<Props> = function MainFilter({ filters}) {
    return <div className='bg-white min-h-screen'>
        <Header></Header>
    </div>
};