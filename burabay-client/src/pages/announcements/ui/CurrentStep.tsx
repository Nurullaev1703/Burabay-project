import  { FC } from 'react';

interface Props {

}

export const CurrentStep: FC<Props> = function CurrentStep() {
  return  ( 
  <div className="flex items-center gap-2 px-4 mb-2">
  <div className="h-2 flex-1 bg-gray300 rounded-full"></div>
  <div className="h-2 flex-1 bg-blue200 rounded-full"></div>
  <div className="h-2 flex-1 bg-gray300 rounded-full"></div>
  <div className="h-2 flex-1 bg-gray300 rounded-full"></div>
  <div className="h-2 flex-1 bg-gray300 rounded-full"></div>
  <div className="h-2 flex-1 bg-gray300 rounded-full"></div>
    </div>
  )
};