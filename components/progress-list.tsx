import { useState } from "react";
import { Check } from "lucide-react";

interface ProgressListProps {
  progress: string[]; // Array of HTML strings
}

const ProgressList: React.FC<ProgressListProps> = ({ progress }) => {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(new Array(progress.length).fill(false));

  

  return (
    <div className="flex flex-col items-start space-y-4 mt-5">
      {progress.map((item, index) => (
        <div key={index} className="flex items-center space-x-4 relative ml-8">


          {/* Checkbox and HTML content */}
          <div
            className={`cursor-pointer p-2 rounded-full bg-blue-500 text-white`}
          >
            <Check size={24} />
          </div>
          <div
            className="ml-8 p-2 rounded-lg w-full"
            dangerouslySetInnerHTML={{ __html: item }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default ProgressList;
