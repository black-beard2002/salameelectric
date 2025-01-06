import { useAuthStore } from "../store/auth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import PropTypes from 'prop-types';
function CategoryComponentCard({ item, onUpdate, onDelete }) {
  const phoneNumber = "96103219099"; // Replace with the desired phone number
  const message = `Hello, I want to inquire about ${item.name} with the following specs: ${item.description}`; // Default message
  const whatsAppLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  const { isAuthenticated, user } = useAuthStore();
  let isNew = false;
  const isNewerThanTwoWeeks = (updatedAt) => {
    
    const currentDate = new Date();
    const itemDate = new Date(updatedAt);
    
    // First check if the date is in the future
    if (itemDate > currentDate) {
      return false;
    }
    
    const timeDifference = currentDate - itemDate;
    const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000;
    isNew = timeDifference <= twoWeeksInMs;
    return isNew;
  };

  return (
    <div className="relative flex flex-col gap-1 bg-gray-300 dark:bg-gray-600 rounded-lg p-2 mb-2">
      {isNewerThanTwoWeeks(item.updatedAt) && (
        <div className="absolute top-0 rounded-b-lg left-1/2 transform -translate-x-1/2 bg-green-300/90 text-white px-3 py-1 text-sm font-medium">
          new
        </div>
      )}
      <div
        className={`w-full ${isNew && 'mt-3'} items-center justify-between flex`}
      >
        <div className="flex flex-col ">
          <p
            className={`font-sans ${
              !item.availability ? "line-through" : ""
            } text-zinc-800 dark:text-slate-50 font-bold text-lg`}
          >
            {item.name}
          </p>
          <p className="font-sans text-zinc-800 dark:text-slate-50 break-words text-md ml-2">
            {item.description}
          </p>
        </div>
        <p className="bg-green-500 w-16 text-center p-1 rounded-2xl">
          {item.price}$
        </p>
      </div>
      <div className="w-full mt-2 flex justify-between flex-row items-center">
        {item.availability ? (
          <a
            href={whatsAppLink}
            className="font-sans inline-flex items-center cursor-pointer hover:bg-green-600 duration-300 flex-row gap-1 p-2 rounded-md text-sm text-slate-100 bg-green-500"
          >
            available
            <FontAwesomeIcon icon={faWhatsapp} className="w-4 h-4" />
          </a>
        ) : (
          <span className="font-sans p-1 rounded-md text-sm text-slate-100 bg-red-500">
            unavailable
          </span>
        )}
        {isAuthenticated && user.username !== "guest" && (
          <div className="w-full mt-2 flex gap-2 justify-end items-center">
            <FontAwesomeIcon
              icon={faPenToSquare}
              onClick={onUpdate}
              className="w-5 h-5 cursor-pointer text-blue-500 hover:text-blue-600"
            />
            <FontAwesomeIcon
              icon={faTrashCan}
              onClick={onDelete}
              className="w-5 h-5 cursor-pointer text-red-500 hover:text-red-600"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryComponentCard;

CategoryComponentCard.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string.isRequired,
    availability: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
