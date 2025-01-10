import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUpRightDots } from "@fortawesome/free-solid-svg-icons";
function Loader2({ onClick }) {
  return (
    <div
      className="flex flex-col cursor-pointer bg-neutral-300 w-full h-full animate-pulse rounded-xl p-4 gap-1 xs:gap-4"
      onClick={onClick}
    >
      <div className="bg-neutral-400/50 w-full h-1/2 p-3 lg:p-0 animate-pulse rounded-md flex items-center justify-center">
        <span className=" text-[0.5rem] xs:text-xs lg:text-lg italic text-gray-600"><FontAwesomeIcon icon={faArrowUpRightDots} className="w-4 h-4 text-gray-600 mr-2"/> all categories</span>
      </div>
      <div className="flex flex-col gap-2">
        <div className="bg-neutral-400/50 w-full h-1 lg:h-4 animate-pulse rounded-md"></div>
        <div className="bg-neutral-400/50 w-4/5 h-1 lg:h-4 animate-pulse rounded-md"></div>
        <div className="bg-neutral-400/50 w-2/5 h-1 lg:h-4 animate-pulse rounded-md"></div>
        <div className="bg-neutral-400/50 w-4/5 h-1 xs:h-2 lg:h-4 animate-pulse rounded-md"></div>
      </div>
    </div>
  );
}

export default Loader2;
Loader2.propTypes = {
  onClick: PropTypes.func.isRequired,
};
