import {
  faLocationDot,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import image1 from "../assets/image1.png";
import image2 from "../assets/image2.png";
import image4 from "../assets/image4.webp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faInstagram,
  faWhatsapp,
} from "@fortawesome/free-brands-svg-icons";

function About() {
  const phoneNumber = "96103219099"; // Replace with the desired phone number
  const message = "salam"; // Default message
  const location = "https://maps.app.goo.gl/Q11gmmDWxdkkQtKx5";
  const whatsAppLink = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
    message
  )}`;

  return (
    <div className="flex flex-col flex-1 relative ">
      {/* Cross Bubble Layout */}
      <div className="relative w-full h-screen md:h-[80vh] lg:h-[70vh] xl:h-[60vh]">
        {/* Image 1 */}
        <div className="absolute left-1/4 top-1/4 md:left-1/3 md:top-1/4 lg:left-1/4 lg:top-1/4 xl:left-1/4 xl:top-1/4 animate-bounce-slow">
          <img
            src={image4}
            alt="Delta Bubble 1"
            className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 object-cover rounded-full shadow-lg"
          />
        </div>
        {/* Image 4 */}
        <div className="absolute right-1/4 top-full md:right-1/3 md:bottom-1/4 lg:right-1/4 lg:bottom-1/4 xl:right-1/4 xl:bottom-1/4 animate-bounce-slow">
          <img
            src={image2}
            alt="Delta Bubble 4"
            className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 object-cover rounded-full shadow-lg"
          />
        </div>
      </div>

      {/* Text content */}
      <div className="w-full max-w-6xl mx-auto px-4 z-10 mt-5">
        <div className="text-center">
          <h2 className="my-4 font-bold text-3xl sm:text-4xl">
            About <span className="text-indigo-600">Our Company</span>
          </h2>
          <p className="text-gray-700 dark:text-slate-200">
          At <span className="font-mono font-bold text-xl">Delta</span>,
                we specialize in delivering top-quality electrical industry
                products while offering cutting-edge web development services.
                Our unique blend of expertise bridges the worlds of hardware and
                software, catering to a diverse range of client needs. Whether
                it&apos;s providing reliable electrical solutions or creating
                innovative digital experiences, we thrive on synergy and
                collaboration. Our workspace reflects this harmony, where the
                precision of our products meets the creativity of our web
                services, all driven by a commitment to excellence and customer
                satisfaction. The flowing, dynamic designs represent
                Delta&apos;s continuous pursuit of innovation and progress
                across industries.
          </p>
        </div>
      </div>
      <footer className=" border-t-2 border-zinc-600  m-4">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="flex flex-col sm:flex-col md:flex-col lg:flex-row lg:justify-between">
            <a
              href={location}
              className="flex items-center mb-4 mx-auto sm:mx-auto space-x-3 rtl:space-x-reverse"
            >
              <img
                src={image1}
                className="h-40 rounded-full"
                alt="Salame Logo"
              />
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
}

export default About;
