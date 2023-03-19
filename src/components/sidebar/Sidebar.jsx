import React, { useState } from "react";
import {
  ChartPieIcon,
  ViewColumnsIcon,
  UserCircleIcon,
  ShoppingBagIcon,
  ArrowRightCircleIcon,
  InboxIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import icon from "../../assets/icon_color_alter.svg";
import { Link } from "react-router-dom";

export default function Sidebar({ children }) {
  const [isOpenMenu, setIsOpenMenu] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  function detectTypeOfView() {
    if (window.innerWidth <= 768) {
      setIsOpenMenu(true);
      setShowMenu(!showMenu);
    } else {
      setShowMenu(false);
      setIsOpenMenu(!isOpenMenu);
    }
  }

  return (
    <div>
      <div className="flex md:grid md:grid-cols-12 justify-between items-center bg-gray-800 p-5">
        <div className="md:col-span-2 flex gap-4">
          <span>
            <Bars3Icon
              className={`text-white h-10 w-10 cursor-pointer ${
                isOpenMenu && "rotate-180"
              } delay-50 duration-200`}
              onClick={() => detectTypeOfView()}
            />
          </span>
          <span className="bg-gray-600 cursor-pointer p-2 rounded-full md:hidden flex items-center justify-center">
            <MagnifyingGlassIcon className="w-6 h-6 text-white" />
          </span>
        </div>
        <div className="hidden md:flex md:col-span-5 items-center pl-2 bg-white rounded-full">
          <span>
            <MagnifyingGlassIcon className="w-6 h-6 text-primary" />
          </span>
          <input
            className="bg-transparent border-none w-full"
            type="text"
            placeholder="Search"
          />
          <span>
            <ArrowRightCircleIcon className="text-primary w-10 h-10" />
          </span>
        </div>

        <div className="md:col-span-5 flex justify-end items-center gap-2">
          <img
            className="w-10 h-10 cursor-pointer"
            src={icon}
            alt="rentas24_icon"
          />
          <h1 className="text-white font-bold text-2xl cursor-pointer">
            rentas24
          </h1>
        </div>
      </div>
      <div className="flex min-h-[88vh]">
        <div
          className={`flex flex-col gap-2 p-3 fixed md:relative min-h-[88vh] bg-white h-auto text-primary ${
            isOpenMenu ? "w-72" : "w-20"
          } ${
            showMenu ? "translate-x-0" : "-translate-x-96 md:translate-x-0"
          } transition-all ease-in-out duration-300 border-r`}
        >
          <CardMenu
            icon={<HomeIcon className="w-6 h-6" />}
            title="Inicio"
            isOpenMenu={isOpenMenu}
          />
          <CardMenu
            icon={<ChartPieIcon className="w-6 h-6" />}
            title="Dashboard"
            isOpenMenu={isOpenMenu}
            notification={2}
          />
          <CardMenu
            icon={<ViewColumnsIcon className="w-6 h-6" />}
            title="Kanban"
            isOpenMenu={isOpenMenu}
          />
          <CardMenu
            icon={<InboxIcon className="w-6 h-6" />}
            title="Inbox"
            isOpenMenu={isOpenMenu}
            notification={10}
          />
          <CardMenu
            icon={<ShoppingBagIcon className="w-6 h-6" />}
            title="Products"
            isOpenMenu={isOpenMenu}
          />
          <CardMenu
            icon={<UserCircleIcon className="w-6 h-6" />}
            title="Sign In"
            isOpenMenu={isOpenMenu}
            redirectTo="/login"
          />
        </div>
        <div className="w-full bg-slate-100 max-h-[88vh] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

// create card menu component
const CardMenu = ({ title, icon, notification, isOpenMenu, redirectTo }) => {
  return (
    <Link to={redirectTo ?? "/"}>
      <div className="flex justify-between gap-2 cursor-pointer p-3 rounded-md items-center hover:bg-gray-200">
        <div className="flex justify-center items-center gap-3">
          <span className="flex">
            {icon}
            {!isOpenMenu && notification && (
              <div className="bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                <p className="text-white text-xs">{notification}</p>
              </div>
            )}
          </span>
          <h1
            id="title"
            className={`text-primary whitespace-nowrap ${
              !isOpenMenu && "scale-0"
            } delay-50 duration-100 origin-left`}
          >
            {title}
          </h1>
        </div>
        {notification && isOpenMenu && (
          <div className="bg-red-500 rounded-full w-4 h-4 flex items-center justify-center delay-50 duration-100 origin-lefts">
            <p className="text-white text-xs">{notification}</p>
          </div>
        )}
      </div>
    </Link>
  );
};
