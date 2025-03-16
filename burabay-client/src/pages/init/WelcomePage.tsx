import  { FC, useEffect } from 'react';
import BurabayLogo from "../../app/icons/burabay-logo.svg"
import BgImage from "../../app/icons/abstract-bg-1.svg"
import { COLORS } from '../../shared/ui/colors';
import { RotatingLines } from "react-loader-spinner";
import { useNavigate } from '@tanstack/react-router';

export const WelcomePage: FC = function WelcomePage() {
    const navigate = useNavigate()
    useEffect(()=>{
        setTimeout(()=>{
            navigate({
                to:"/auth"
            })
        },2000)
    },[])
  return (
    <div className="min-h-screen overflow-hidden ">
      <div className="w-full h-[100vh] relative flex flex-col justify-center items-center">
        <img
          src={BgImage}
          alt=""
          className="absolute top-o left-0 w-full h-full object-cover bg-blue200 -z-10"
        />
        <img src={BurabayLogo} alt="" className='mb-[10%]'/>
        <RotatingLines strokeColor={COLORS.white} width="48px"/>
      </div>
    </div>
  );
};