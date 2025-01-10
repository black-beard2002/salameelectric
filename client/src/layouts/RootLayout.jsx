import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import SideNav from "./SideNav";

const RootLayout = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 640;
      setIsMobile(mobile);
      if (!mobile && isSidebarOpen) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen w-screen flex-row">
      <div
        className={`flex transition-all duration-300 
        ${isMobile ? "w-0" : isHovered ? "w-56" : "w-16"}`}
      >
        <SideNav
          isHovered={isHovered}
          setIsHovered={setIsHovered}
          isMobile={isMobile}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
      </div>

      <div
        className={`flex flex-1 px-1 max-w-screen dark:bg-[#2e3440] bg-[#ececec] pt-20 xs:pt-24 md:px-4 lg:px-8 overflow-auto
        ${isMobile && isSidebarOpen ? "opacity-50" : "opacity-100"}`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default RootLayout;
