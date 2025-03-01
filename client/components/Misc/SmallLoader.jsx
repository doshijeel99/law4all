import { FaSpinner } from "react-icons/fa";

const SmallLoader = () => {
  return (
    <div className="w-full h-10 flex-center">
      <FaSpinner className="animate-spin duration-1000 h-6 w-6 text-white" />
    </div>
  );
};

export default SmallLoader;
