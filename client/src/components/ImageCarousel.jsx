import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGift } from "@fortawesome/free-solid-svg-icons";
import {useNavigate} from "react-router-dom"

const ImageCarousel = ({ offers = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState("next");
  const [slides, setSlides] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    // Initialize slides when offers change
    const images = offers.map((offer) => offer.image);
    setSlides(images);
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
      <div className="relative w-full flex-col flex items-center justify-center bg-gray-100 py-5 dark:bg-gray-800">
        <FontAwesomeIcon icon={faGift} className="w-7 h-7 text-gray-700 dark:text-gray-300"/>
        <p className="text-gray-500 dark:text-gray-300">No Offers available at the moment</p>
      </div>
    );
  }

  return (
    <div className="relative w-11/12 sm:w-11/12 md:w-2/3 lg:w-2/3 mx-auto">
      <div className="relative h-56 overflow-hidden rounded-lg lg:h-96">
        {slides.map((slide, index) => (
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
            <img
              src={slide}
              onClick={()=>{navigate("/app/offers")}}
              className="absolute block cursor-pointer hover:scale-110 duration-300 max-w-full max-h-full w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
            />
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

export default ImageCarousel;
