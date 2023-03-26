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
  ArrowLongRightIcon,
} from "@heroicons/react/24/solid";
import { TbDoorExit, TbDoorEnter } from "react-icons/tb";
import icon from "../../assets/icon_color_alter.svg";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getSignOut } from "../../features/auth/authSlice";

export default function Sidebar({ children, user = {} }) {
  const dispatch = useDispatch();
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

  const handleSignout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    dispatch(getSignOut());
    window.location.reload();
  };

  return (
    <div className="min-h-screen h-screen overflow-hidden">
      <div className="flex md:grid md:grid-cols-12 justify-between items-center bg-gray-800 px-5 py-3">
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
      <div className="flex h-full">
        <div
          className={`flex flex-col gap-2 p-3 fixed md:relative min-h-full bg-gray-800 text-slate-300 ${
            isOpenMenu ? "w-72" : "w-20"
          } ${
            showMenu ? "translate-x-0" : "-translate-x-96 md:translate-x-0"
          } transition ease-in-out delay-75 duration-200`}
        >
          {user?.firstName && (
            <div className="flex items-center gap-2 p-2 pb-3 border-b border-slate-700 hover:rounded-md cursor-pointer hover:bg-slate-700 hover:text-white">
              {user?.photo ? (
                <img
                  className="w-8 h-8 rounded-full"
                  src={user.photo}
                  alt="user_photo"
                />
              ) : (
                <span>
                  <UserCircleIcon className="w-8 h-8" />
                </span>
              )}
              <div
                className={`flex flex-col justify-center whitespace-nowrap ${
                  !isOpenMenu && "scale-0"
                } delay-50 duration-100 origin-lef`}
              >
                <span className="text-sm font-bold">
                  {/* concat firstName and lastName and get a substring 20 */}
                  {`${user.firstName} ${user.lastName}`.length > 25
                    ? `${user.firstName} ${user.lastName}`
                        .substring(0, 25)
                        .concat("...")
                    : `${user.firstName} ${user.lastName}`}
                </span>
                <span className="text-xs flex gap-2 items-center" >
                  <Link to="/edit-user">
                  <p>Editar perfil</p>{" "}
                  <ArrowLongRightIcon className="h-3 w-3" />
                  </Link>
                </span>
              </div>
            </div>
          )}
          <CardMenu
            icon={<HomeIcon className="w-6 h-6" />}
            title="Inicio"
            isOpenMenu={isOpenMenu}
            handleClick={() => setShowMenu(false)}
          />
          <CardMenu
            icon={<ChartPieIcon className="w-6 h-6" />}
            title="Dashboard"
            isOpenMenu={isOpenMenu}
            notification={2}
            handleClick={() => setShowMenu(false)}
          />
          <CardMenu
            icon={<ViewColumnsIcon className="w-6 h-6" />}
            title="Kanban"
            isOpenMenu={isOpenMenu}
            handleClick={() => setShowMenu(false)}
          />
          <CardMenu
            icon={<InboxIcon className="w-6 h-6" />}
            title="Inbox"
            isOpenMenu={isOpenMenu}
            notification={10}
            handleClick={() => setShowMenu(false)}
          />
          <CardMenu
            icon={<ShoppingBagIcon className="w-6 h-6" />}
            title="Products"
            isOpenMenu={isOpenMenu}
            handleClick={() => setShowMenu(false)}
          />
          {user?.firstName ? (
            <CardMenu
              icon={<TbDoorExit className="w-6 h-6" />}
              title="Cerrar sesión"
              isOpenMenu={isOpenMenu}
              handleClick={handleSignout}
            />
          ) : (
            <CardMenu
              icon={<TbDoorEnter className="w-6 h-6" />}
              title="Sign In"
              isOpenMenu={isOpenMenu}
              redirectTo="/login"
              handleClick={() => setShowMenu(false)}
            />
          )}
        </div>
        <div className="w-full bg-slate-100 max-h-[92vh] overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
}

const CardMenu = ({
  title,
  icon,
  notification,
  isOpenMenu,
  redirectTo,
  handleClick,
}) => {
  return (
    <div onClick={handleClick}>
      <Link to={redirectTo ?? "/"}>
        <div className="flex justify-between gap-2 cursor-pointer p-3 rounded-md items-center hover:bg-slate-700 hover:text-white">
          <div className="flex justify-center items-center gap-3">
            <span className="flex">
              {icon}
              {!isOpenMenu && notification && (
                <div className="bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
                  <p className="text-white text-xs">{notification}</p>
                </div>
              )}
            </span>
            <h2
              id="title"
              className={`whitespace-nowrap ${
                !isOpenMenu && "scale-0"
              } delay-50 duration-100 origin-left`}
            >
              {title}
            </h2>
          </div>
          {notification && isOpenMenu && (
            <div className="bg-red-500 rounded-full w-4 h-4 flex items-center justify-center delay-50 duration-100 origin-lefts">
              <p className="text-white text-xs">{notification}</p>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};
