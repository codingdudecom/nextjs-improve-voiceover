import React from 'react';

interface ProgressProps {
  /**
   * The percentage of progress (between 0 and 100)
   */
  step: number;
  onStepChange: (newStep: number) => void;
}

const Progress: React.FC<ProgressProps> = ({
  step,
  onStepChange
}) => {
  

  return (
    
        <ol className="max-w-lg flex items-center w-full text-sm font-small text-center text-gray-500 dark:text-gray-400 sm:text-base">
            
            <li onClick={() => onStepChange(1)} className={((step == 1)?'font-bold text-blue-600 dark:text-blue-500':'') + " cursor-pointer whitespace-nowrap flex md:w-full items-center sm:after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"}>
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                    <span className="me-2">1</span>
                    Transcribe
                </span>
            </li>
            <li onClick={() => onStepChange(2)}  className={((step == 2)?'font-bold text-blue-600 dark:text-blue-500':'') + " cursor-pointer whitespace-nowrap flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10 dark:after:border-gray-700"}>
                <span className="flex items-center after:content-['/'] sm:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500">
                    <span className="me-2">2</span>
                    Improve
                </span>
            </li>
            <li onClick={() => onStepChange(3)}  className={((step == 3)?'font-bold text-blue-600 dark:text-blue-500':'') +" cursor-pointer whitespace-nowrap flex items-center"}>
                <span className="me-2">3</span>
                <span className="hidden sm:inline-flex sm:ms-2">Audio Export</span>
            </li>
        </ol>
  
  );
};

export default Progress;