import { useEffect } from "react";
import { useCategoryStore } from "../store/category";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import CategoryCard from "../components/CategoryCard";
import logo from "../assets/logo.svg";
import Loader2 from "../components/Loader2";
import { useOfferStore } from "../store/offer";
import ImageCarousel from "../components/ImageCarousel";
import {
  faBoltLightning,
  faCartArrowDown,
  faLocationDot,
  faPhone,
  faShop,
  faTableCellsLarge,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";
const Home = () => {
  const { fetchCategories, categories } = useCategoryStore();
  const navigate = useNavigate();
  const { fetchOffers, offers } = useOfferStore();
  const phoneNumber = "96103219099"; // Replace with the desired phone number
  const message = "salam"; // Default message
  const location = "https://maps.app.goo.gl/Q11gmmDWxdkkQtKx5";
  const whatsAppLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;
  useEffect(() => {
    fetchCategories();
    fetchOffers();
  }, [fetchCategories, fetchOffers]);

  const handleCatClick = (id) => {
    navigate(`/app/categories/${id}`);
  };
  const isNewerThanTwoWeeks = (createdAt) => {
    const currentDate = new Date();
    const categoryDate = new Date(createdAt); // The string is in ISO format, which is compatible with Date
    const timeDifference = currentDate - categoryDate; // Difference in milliseconds
    const twoWeeksInMs = 14 * 24 * 60 * 60 * 1000; // 14 days in milliseconds
    return timeDifference <= twoWeeksInMs;
  };

  const shouldDisplayCategory = (category) => {
    // Check if at least one item in the category has a `createdAt` newer than 2 weeks
    return category.items.some((item) => isNewerThanTwoWeeks(item.createdAt));
  };

  return (
    <div className="flex flex-1 p-1 flex-col">
      <div className="flex z-10 flex-row gap-2 mb-10 items-center">
        <FontAwesomeIcon
          icon={faShop}
          className="w-8 h-8 text-[#FFD700] dark:text-[#ffffff]"
        />
        <label className="text-2xl dark:text-white text-zinc-800 font-semibold font-sans">
          Products And Categories
        </label>
      </div>

      <ImageCarousel offers={offers} />

      <div className="flex flex-col z-10 items-start p-5 flex-wrap mt-5">
        <label className="text-lg text-zinc-800 dark:text-white font-sans font-semibold">
          <FontAwesomeIcon icon={faTableCellsLarge} className="mr-1" />
          Shop By Category
        </label>
        <div className="w-full flex-row flex gap-2">
          {categories.slice(0, 3).map((category) => (
            <CategoryCard
              key={category._id}
              category={category}
              onClick={() => handleCatClick(category._id)}
            />
          ))}
          <div className="w-1/4 aspect-square ">
            <Loader2 onClick={()=>navigate("/app/categories")}/>
          </div>
        </div>
        <button
          onClick={() => navigate("/app/categories")}
          className="mx-auto mt-3 p-2 rounded-lg bg-[#FFD700] hover:bg-[#ffe23d] text-white inline-flex gap-2 items-center justify-center"
        >
          All Categories
          <FontAwesomeIcon icon={faTableCellsLarge} />
        </button>
      </div>
      <div className="flex flex-col z-10 items-start p-5 flex-wrap">
        <label className="text-lg text-zinc-800 dark:text-white font-sans font-semibold">
          <FontAwesomeIcon icon={faCartArrowDown} className="mr-1" />
          New Products
        </label>
        <p className="text-sm font-mono spacing dark:text-slate-100 p-1">New products are available in the following categories!</p>
        <div className="w-full flex-wrap flex gap-2">
          {categories.map(
            (category) =>
              shouldDisplayCategory(category) && (
                <CategoryCard key={category._id} category={category} newFlag={true} onClick={() => handleCatClick(category._id)}/>
              )
          )}
        </div>
      </div>

      <footer className=" border-t-2 border-zinc-600  m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row lg:justify-between">
            <a
              href={location}
              className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse"
            >
              <img src={logo} className="h-8" alt="Salame Logo" />
              <span className="self-center text-xl font-semibold font-sans sm:text-2xl whitespace-nowrap text-[#4c5c68] dark:text-white">
                <FontAwesomeIcon icon={faBoltLightning} className="w-5 h-5 " />
                Salame Electric
              </span>
            </a>
            <div className="text-transparent flex-1">spacer</div>
            <ul className="flex flex-wrap gap-y-2  mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li className="flex w-full mb-2  sm:w-full md:mb-0 lg:mb-0 md:w-fit lg:w-fit items-center">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="bg-red-700 rounded-full p-1 mx-1 text-white"
                />
                <a
                  href={location}
                  className="hover:underline text-black dark:text-slate-100 me-4 md:me-6"
                >
                  Lebanon,dahye,
                  <br />
                  Rweiss, near Dahboul shop
                </a>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="bg-blue-700 rounded-full p-1 mx-1 text-white"
                />
                <a href="#" className="hover:underline me-4 md:me-6">
                  Facebook
                </a>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon
                  icon={faInstagram}
                  className="bg-[#6930c3] p-1 text-white rounded-full mx-1"
                />
                <a href="#" className="hover:underline me-4 md:me-6">
                  Instagram
                </a>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="mx-1 text-white bg-green-500 p-1 rounded-full"
                />
                <a href={whatsAppLink} className="hover:underline me-4 md:me-6">
                  WhatsApp
                </a>
              </li>
              <li className="flex items-center">
                <FontAwesomeIcon
                  icon={faPhone}
                  className="mx-1 text-white bg-gray-600 p-1 rounded-full"
                />
                <a href={whatsAppLink} className="hover:underline me-4 md:me-6">
                  Phone
                </a>
              </li>
            </ul>
          </div>
          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block w-full text-center text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 1995{" "}
            <a href="https://flowbite.com/" className="hover:underline">
              Saleme™
            </a>
            . All Rights Reserved.
          </span>
        </div>
      </footer>
    </div>
  );
};
export default Home;
