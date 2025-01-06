import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../components/ThemeToggle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBarsStaggered,
  faBoltLightning,
  faHome,
  faSortDown,
  faTableCellsLarge,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../assets/logo.svg";
import { useAuthStore } from "../store/auth";
import { faReadme, faSalesforce } from "@fortawesome/free-brands-svg-icons";
import { faSun } from "@fortawesome/free-solid-svg-icons/faSun";
function SideNav() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = "https://maps.app.goo.gl/Q11gmmDWxdkkQtKx5";
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout();
  };
  // Ref for the sidebar container
  const sidebarRef = useRef(null);
  // Handle clicks outside the sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only handle outside clicks on mobile screens
      if (window.innerWidth < 640) {
        // Tailwind's sm breakpoint is 640px
        // Check if sidebar is open and click is outside sidebar
        if (
          isSidebarOpen &&
          sidebarRef.current &&
          !sidebarRef.current.contains(event.target)
        ) {
          setIsSidebarOpen(false);
        }
      }
    };

    // Add event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  return (
    <>
      <nav className="fixed top-0 z-50 w-full bg-[#dcdcdd] border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button
                onClick={toggleSidebar}
                data-drawer-target="logo-sidebar"
                data-drawer-toggle="logo-sidebar"
                aria-controls="logo-sidebar"
                type="button"
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
                  className="h-10 w-10 me-3"
                  alt="FlowBite Logo"
                />
                <span className="self-center text-xl font-semibold font-sans sm:text-2xl whitespace-nowrap text-[#4c5c68] dark:text-white">
                  <FontAwesomeIcon
                    icon={faBoltLightning}
                    className="w-5 h-5 "
                  />
                  Salame Electric
                </span>
              </a>
            </div>
            <div className="flex items-center flex-row gap-1">
              <div>
                <ThemeToggle />
              </div>
              {isAuthenticated && (
                <div className="flex items-center ms-3">
                  <div>
                    <button
                      type="button"
                      className="flex text-sm dark:bg-gray-800 bg-[#1985a1] p-2 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                      aria-expanded={isProfileDropdownOpen}
                      onClick={() =>
                        setIsProfileDropdownOpen(!isProfileDropdownOpen)
                      }
                    >
                      <span className="sr-only">Open user menu</span>
                      <FontAwesomeIcon
                        icon={faUser}
                        className="w-5 h-5 text-white rounded-full"
                      />
                    </button>
                  </div>
                  <div
                    className={`z-50 ${
                      isProfileDropdownOpen ? "" : "hidden"
                    } absolute right-0 top-full mt-2 my-4 text-base list-none bg-[#dcdcdd] text-[#2a2d2f] divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600`}
                    id="dropdown-user"
                  >
                    <div className="px-4 py-3" role="none">
                      <p
                        className="text-sm inline-flex items-center dark:text-white"
                        role="none"
                      >
                        <FontAwesomeIcon
                          icon={faUser}
                          className="w-3 h-3 mx-1 p-1 bg-slate-200 rounded-full"
                        />
                        {user.username}
                      </p>
                    </div>
                    <ul className="py-1" role="none">
                      {/* <li>
                      <a
                        href="/app"
                        className="block px-4 py-2 text-[#4c5c68] text-sm  hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 hover:text-[#1985a1] dark:hover:text-white"
                        role="menuitem"
                      >
                        dashboard
                      </a>
                    </li>*/}
                    {/* {user.isPrime &&(<li>
                      <a
                        href="/app/manage"
                        className="block px-4 py-2 text-[#4c5c68] text-sm  hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 hover:text-[#1985a1] dark:hover:text-white"
                        role="menuitem"
                      >
                        Manage users
                      </a>
                    </li>)} */}
                      <li>
                        <a
                          className="block cursor-pointer px-4 py-2 text-[#4c5c68] text-sm hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 hover:text-[#1985a1] dark:hover:text-white"
                          role="menuitem"
                          onClick={handleLogout}
                        >
                          Sign out
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-56 h-screen pt-28 transition-transform bg-[#dcdcdd] border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        aria-label="Sidebar"
        ref={sidebarRef}
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-[#dcdcdd]  font-sans dark:bg-gray-800 dark:text-slate-50">
          <ul className="space-y-2 font-bold ">
            <li>
              <Link
                to="/app"
                className="flex items-center rounded-lg w-full p-2  hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 group"
              >
                <FontAwesomeIcon
                  icon={faHome}
                  className="w-6 dark:text-gray-200 text-[#1985a1] h-6"
                />
                <span className="flex-1 dark:text-gray-200 ms-3 text-[#46494c] whitespace-nowrap">
                  Home
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/app/categories"
                className="flex items-center rounded-lg w-full p-2  hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 group"
              >
                <FontAwesomeIcon
                  icon={faTableCellsLarge}
                  className="w-6 dark:text-gray-200 text-[#1985a1] h-6"
                />
                <span className="flex-1 dark:text-gray-200 ms-3 text-[#46494c] whitespace-nowrap">
                  Categories
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/app/offers"
                className="flex items-center rounded-lg w-full p-2  hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 group"
              >
                <FontAwesomeIcon
                  icon={faSalesforce}
                  className="w-6 dark:text-gray-200 text-[#1985a1] h-6"
                />
                <span className="flex-1 dark:text-gray-200 ms-3 text-[#46494c] whitespace-nowrap">
                  Offers
                </span>
              </Link>
            </li>
            <li>
              <Link
                to="/app/about"
                className="flex items-center rounded-lg w-full p-2  hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-gray-200 group"
              >
                <FontAwesomeIcon
                  icon={faReadme}
                  className="w-6 dark:text-gray-200 text-[#1985a1] h-6"
                />
                <span className="flex-1 dark:text-gray-200 ms-3 text-[#46494c] whitespace-nowrap">
                  About
                </span>
              </Link>
            </li>
            {isSidebarOpen && (
              <>
                <li
                  onClick={toggleDropdown}
                  aria-controls="dropdown-example"
                  className="flex flex-row items-center  rounded-lg cursor-pointer justify-between hover:bg-gray-100 dark:hover:bg-gray-700 dark:hover:text-gray-200"
                  data-collapse-toggle="dropdown-example"
                >
                  <div className="flex flex-row items-center">
                    <FontAwesomeIcon
                      icon={faSun}
                      className="w-6 pl-2 dark:text-gray-200 text-[#1985a1] h-6"
                    />
                    <a className="flex items-center py-2  dark:text-gray-300  group">
                      <span className="flex-1 ms-3 dark:text-gray-200 text-[#46494c] whitespace-nowrap">
                        Toggle Theme
                      </span>
                    </a>
                  </div>
                  <FontAwesomeIcon
                    icon={faSortDown}
                    className="w-3 dark:text-gray-200 text-[#1985a1] h-3"
                  />
                </li>
                <li
                  id="dropdown-example"
                  className={`${
                    isDropdownOpen ? "" : "hidden"
                  } py-2 space-y-2 pl-10`}
                >
                  <ThemeToggle />
                </li>
              </>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
}

export default SideNav;
