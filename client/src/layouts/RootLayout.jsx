import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

const RootLayout = () => {
    return (
      <div className="flex h-screen w-screen flex-row">
        <div className="flex w-0 sm:w-56 ">
          <SideNav/>
        </div>
  
        <div className="flex flex-1 px-1 dark:bg-[#2e3440] bg-[#ececec] pt-24 sm:px-1 md:px-4 lg:px-8 overflow-auto">
          <Outlet />
        </div>
      </div>
    );
  };

  export default RootLayout;