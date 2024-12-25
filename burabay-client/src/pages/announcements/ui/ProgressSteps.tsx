import { FC } from "react";

interface ProgressStepsProps {
  currentStep: number; 
  totalSteps: number;  
}

export const ProgressSteps: FC<ProgressStepsProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex items-center gap-2 mt-3">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div
          key={index}
          className={`h-2 flex-1 rounded-full ${
            index + 1 === currentStep ? "bg-blue200" : "bg-gray300"
          }`}
        ></div>
      ))}
    </div>
  );
};
