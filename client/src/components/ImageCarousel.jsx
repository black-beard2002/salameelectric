import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const ImageCarousel = ({ offers = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState("next");
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setSlides(offers);
  }, [offers]);

  useEffect(() => {
    if (!slides.length) return;

    const timer = setInterval(() => {
      setDirection("next");
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [slides]);

  const goToSlide = (index) => {
    setDirection(index > currentSlide ? "next" : "prev");
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setDirection("next");
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setDirection("prev");
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  if (!slides.length) {
    return (
      <div className="relative w-3/4 mx-auto xs:w-full flex-col flex items-center justify-center bg-gray-100 py-5 dark:bg-gray-800">
        <FontAwesomeIcon
          icon={faGift}
          className="w-7 h-7 text-gray-700 dark:text-gray-300"
        />
        <p className="text-gray-500 dark:text-gray-300">
          No Offers available at the moment
        </p>
      </div>
    );
  }

  return (
    <div className="relative w-[85%] sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-2/3 mx-auto">
      <div className="relative h-44 xs:h-48 sm:h-56 md:h-72 overflow-hidden rounded-lg lg:h-96 xl:h-[32rem]">
        {slides.map((offer, index) => (
          <div
            key={index}
            className={`absolute w-full h-full flex justify-center transition-all duration-700 ease-in-out ${
              currentSlide === index
                ? "opacity-100 translate-x-0"
                : direction === "next"
                ? index > currentSlide
                  ? "opacity-0 translate-x-full"
                  : "opacity-0 -translate-x-full"
                : index < currentSlide
                ? "opacity-0 -translate-x-full"
                : "opacity-0 translate-x-full"
            }`}
          >
            <div className="relative w-full h-full">
              <img
                src={offer.image}
                onClick={() => {
                  navigate("/app/offers");
                }}
                className="absolute block cursor-pointer hover:scale-105 duration-200 max-w-full max-h-full w-full aspect-square object-fit"
                alt={offer.title}
              />
              {/* Overlay container */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <div className="flex flex-col space-y-1">
                  <h3 className="text-white truncate font-semibold text-lg md:text-xl lg:text-2xl">
                    {offer.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      <span className="text-white font-bold line-through text-base md:text-lg lg:text-xl">
                        ${offer.defaultPrice}
                      </span>
                      <span className="text-white font-bold text-base md:text-lg lg:text-xl">
                        ${offer.price}
                      </span>
                    </div>

                    <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                      View Offer!
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {slides.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSlide === index ? "bg-white scale-125" : "bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
            aria-current={currentSlide === index}
            aria-label={`Slide ${index + 1}`}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute top-0 start-0 z-30 bg-transparent flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none transition-all duration-300 transform group-hover:scale-110">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 1 1 5l4 4"
            />
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        onClick={nextSlide}
        className="absolute top-0 end-0 z-30 bg-transparent flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none transition-all duration-300 transform group-hover:scale-110">
          <svg
            className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

ImageCarousel.propTypes = {
  offers: PropTypes.arrayOf(
    PropTypes.shape({
      image: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      defaultPrice: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ImageCarousel;
