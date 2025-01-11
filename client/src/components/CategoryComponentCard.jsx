import { useAuthStore } from "../store/auth.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPenToSquare,
  faTrashCan,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";
import { useState } from "react";

function CategoryComponentCard({ item, onUpdate, onDelete }) {
  const phoneNumber = "96103219099";
  const [showTooltip, setShowTooltip] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState(null);
  const message = `Hello, I want to inquire about ${item.name} with the following specs: ${item.description}`;
  const whatsAppLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  const { isAuthenticated, user } = useAuthStore();

  // Calculate discount percentage if offerPrice exists
  const discountPercentage =
    item.offerPrice && item.price > item.offerPrice
      ? Math.round(((item.price - item.offerPrice) / item.price) * 100)
      : null;

  // Handle long press for mobile devices
  const handleTouchStart = () => {
    const timer = setTimeout(() => {
      setShowTooltip(true);
    }, 500); // 500ms for long press
    setLongPressTimer(timer);
  };

  const handleTouchEnd = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
    setShowTooltip(false);
  };

  return (
    <div className="bg-white relative rounded-xl shadow-md flex flex-col h-full dark:bg-gray-700 p-4 gap-2">
      {/* Offer Tag */}
      {discountPercentage && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full z-10 animate-bounce">
          -{discountPercentage}%
        </div>
      )}
      {/* Image Container */}
      <div className="aspect-square rounded-t-xl overflow-hidden bg-gray-100">
        {item.image ? (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800 dark:text-slate-300 flex flex-col gap-2 items-center justify-center">
            <span>No image</span>
            <FontAwesomeIcon icon={faImage} />
          </div>
        )}
      </div>

      {/* Content Container */}
      <div className="flex flex-col gap-2 flex-grow">
        {/* Header with Name and Actions */}
        <div className="w-full">
          <h3 className="text-xs sm:text-base font-semibold text-gray-800 dark:text-slate-100 line-clamp-1">
            {item.name}
          </h3>
        </div>

        {/* Description */}
        <div className="relative">
          <p 
            className="text-xs sm:text-sm text-gray-600 line-clamp-2"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            {item.description}
          </p>
          {/* Tooltip */}
          {showTooltip && item.description && (
            <div className="absolute z-50 w-48 sm:w-64 p-2 bg-gray-900 text-white text-xs rounded-lg shadow-lg -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full transition-opacity duration-200">
              {item.description}
              {/* Arrow */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 border-8 border-transparent border-t-gray-900" />
            </div>
          )}
        </div>

        {/* Price and Availability */}
        <div className="mt-auto pt-2">
          <div className="flex justify-between items-center mb-1.5 ">
            <div className="flex flex-col gap-0.5">
              <span
                className={`dark:text-slate-50 ${
                  item.offerPrice > 0 ? "line-through" : ""
                } text-sm sm:text-base font-bold text-gray-900`}
              >
                ${item.price.toFixed(2)}
              </span>
              {item.offerPrice > 0 && (
                <span className="dark:text-slate-50 text-sm sm:text-base font-bold text-gray-900">
                  ${item.offerPrice.toFixed(2)}
                </span>
              )}
            </div>
            <span
              className={`px-1.5 py-0.5 rounded-full text-xs sm:text-sm ${
                item.availability
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {item.availability ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <a
            href={whatsAppLink}
            className={`w-full hover:no-underline text-xs sm:text-sm cursor-pointer py-1.5 inline-flex flex-row gap-2 items-center justify-center hover:bg-green-600 rounded-lg bg-green-500 text-white font-medium transition-colors`}
          >
            <FontAwesomeIcon
              icon={faWhatsapp}
              className="text-slate-50 w-4 h-4"
            />
            More info
          </a>
          {isAuthenticated && user.username!=="guest" &&(
          <div className="flex gap-1 w-full justify-end">
            <button
              onClick={() => onUpdate(item)}
              className=" p-1 rounded-full transition-colors"
            >
              <FontAwesomeIcon icon={faPenToSquare} className="text-blue-600" />
            </button>
            <button
              onClick={() => onDelete()}
              className="p-1 rounded-full transition-colors"
            >
              <FontAwesomeIcon icon={faTrashCan} className="text-red-500" />
            </button>
          </div>)}
        </div>
      </div>
    </div>
  );
}

export default CategoryComponentCard;

CategoryComponentCard.propTypes = {
  item: PropTypes.shape({
    description: PropTypes.string,
    availability: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
    image: PropTypes.string,
    offerPrice: PropTypes.number,
    price: PropTypes.number.isRequired,
    updatedAt: PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};
