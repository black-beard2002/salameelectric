import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faBoltLightning,
  faHome,
  faTableCellsLarge,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { faReadme, faSalesforce } from "@fortawesome/free-brands-svg-icons";
import logo from "../assets/logo.svg";
import { useAuthStore } from "../store/auth";

function SideNav({
  isHovered,
  setIsHovered,
  isMobile,
  setIsSidebarOpen,
  isSidebarOpen,
}) {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = "https://maps.app.goo.gl/Q11gmmDWxdkkQtKx5";

  const handleLogout = () => {
    logout();
  };

  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isMobile &&
        isSidebarOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, isMobile, setIsSidebarOpen]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setIsHovered(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-[#dcdcdd] border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <FontAwesomeIcon
                  icon={faBarsStaggered}
                  className="w-6 h-6 text-[#FFD700]"
                />
              </button>
              <a href={location} className="flex ms-2 md:me-24">
                <img
                  src={logo}
                  className="aspect-square w-6 me-3 xs:w-10"
                  alt="Logo"
                />
                <span className="self-center text-[0.95rem] xs:text-xl font-semibold font-sans sm:text-2xl whitespace-nowrap text-[#4c5c68] dark:text-white">
                  <FontAwesomeIcon
                    icon={faBoltLightning}
                    className="w-3 aspect-square xs:w-5"
                  />
                  Salame Electric
                </span>
              </a>
            </div>
            <div className="flex items-center flex-row gap-2">
              <div className="mt-2">
                <ThemeToggle />
              </div>
              {isAuthenticated && (
                <div className="relative">
                  <button
                    onClick={() =>
                      setIsProfileDropdownOpen(!isProfileDropdownOpen)
                    }
                    className="flex items-center text-sm font-medium rounded-full focus:outline-none dark:text-gray-400"
                  >
                    <span className="sr-only">Open user menu</span>
                    <FontAwesomeIcon
                      icon={faUser}
                      className="w-6 h-6 text-gray-700 dark:text-gray-200"
                    />
                  </button>
                  {isProfileDropdownOpen && (
                    <div className="absolute right-0 z-50 mt-2 w-40 bg-white rounded-md shadow-lg dark:bg-gray-800">
                      <ul>
                        <li>
                          <p className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600">
                            Profile ({user.username})
                          </p>
                        </li>
                        <li>
                          <button
                            onClick={handleLogout}
                            className="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-600"
                          >
                            Logout
                          </button>
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 h-screen pt-28 transition-all duration-300 bg-[#dcdcdd] border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700 
            ${
              isMobile
                ? `${
                    isSidebarOpen ? "translate-x-0 w-48" : "-translate-x-full"
                  }`
                : `${isHovered ? "w-56" : "w-16"} translate-x-0`
            }
          `}
        aria-label="Sidebar"
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-[#dcdcdd] font-sans dark:bg-gray-800 dark:text-slate-50">
          <ul className="space-y-2 font-bold">
            <li onClick={() => isMobile && setIsSidebarOpen(false)}>
              <Link
                to="/app"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center rounded-lg w-full p-2 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 group"
              >
                <FontAwesomeIcon
                  icon={faHome}
                  className="w-6 dark:text-gray-200 text-[#1985a1] h-6"
                />
                <span
                  className={`flex-1 dark:text-gray-200 ms-3 text-[#46494c] whitespace-nowrap transition-opacity duration-300 
                  ${
                    isMobile
                      ? "opacity-100"
                      : isHovered
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/app/categories"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center rounded-lg w-full p-2 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 group"
              >
                <FontAwesomeIcon
                  icon={faTableCellsLarge}
                  className="w-6 dark:text-gray-200 text-[#1985a1] h-6"
                />
                <span
                  className={`flex-1 dark:text-gray-200 ms-3 text-[#46494c] whitespace-nowrap transition-opacity duration-300 ${
                    isMobile
                      ? "opacity-100"
                      : isHovered
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  Categories
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/app/offers"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center rounded-lg w-full p-2 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 group"
              >
                <FontAwesomeIcon
                  icon={faSalesforce}
                  className="w-6 dark:text-gray-200 text-[#1985a1] h-6"
                />
                <span
                  className={`flex-1 dark:text-gray-200 ms-3 text-[#46494c] whitespace-nowrap transition-opacity duration-300 ${
                    isMobile
                      ? "opacity-100"
                      : isHovered
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  Offers
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/app/about"
                onClick={() => setIsSidebarOpen(false)}
                className="flex items-center rounded-lg w-full p-2 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 group"
              >
                <FontAwesomeIcon
                  icon={faReadme}
                  className="w-6 dark:text-gray-200 text-[#1985a1] h-6"
                />
                <span
                  className={`flex-1 dark:text-gray-200 ms-3 text-[#46494c] whitespace-nowrap transition-opacity duration-300 ${
                    isMobile
                      ? "opacity-100"
                      : isHovered
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  About Us
                </span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SideNav;
