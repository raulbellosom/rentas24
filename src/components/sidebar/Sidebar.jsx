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
import { BsFillMegaphoneFill } from "react-icons/bs";
import Footer from "../Footer/Footer";
import { FaStore } from "react-icons/fa";

export default function Sidebar({ children, user = {} }) {
  const dispatch = useDispatch();
  const [isOpenMenu, setIsOpenMenu] = useState(true);
  const [showMenu, setShowMenu] = useState(false);

  function detectTypeOfView() {
    if (window.innerWidth < 768) {
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
      <div className="flex md:grid md:grid-cols-12 justify-between items-center bg-primary-700 px-5 py-3">
        <div className="md:col-span-2 flex gap-4">
          <span>
            <Bars3Icon
              className={`text-white h-10 w-10 cursor-pointer ${
                isOpenMenu && "rotate-180"
              } delay-50 duration-200`}
              onClick={() => detectTypeOfView()}
            />
          </span>
          <span className="bg-primary-600 cursor-pointer p-2 rounded-full md:hidden flex items-center justify-center">
            <MagnifyingGlassIcon className="w-6 h-6 text-white cursor-pointer" />
          </span>
        </div>
        <div className="hidden md:flex md:col-span-5 items-center pl-2 bg-white rounded-full">
          <span>
            <MagnifyingGlassIcon className="w-6 h-6 text-primary-600 cursor-pointer" />
          </span>
          <input
            className="bg-transparent border-none w-full"
            type="text"
            placeholder="Search"
          />
          <span>
            <ArrowRightCircleIcon className="text-primary-500 w-10 h-10 cursor-pointer" />
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
      <div className="flex h-full relative">
        <div
          className={`${
            showMenu ? "bg-black/30 fixed z-40 w-full h-full " : "relative"
          }`}
          onClick={() => setShowMenu(false)}
        >
          <div
            className={`flex flex-col gap-2 p-3 fixed z-50 md:relative min-h-full bg-gradient-to-b from-primary-700 to-primary-600 text-slate-100 ${
              isOpenMenu ? "w-72" : "w-20"
            } ${
              showMenu ? "translate-x-0" : "-translate-x-96 md:translate-x-0"
            } transition ease-in-out delay-75 duration-200`}
          >
            {user?.firstName && (
              <Link className="border-b pb-2 border-primary-300" to="/perfil">
                <div className="flex items-center gap-2 p-2 hover:rounded-md cursor-pointer hover:bg-primary-600/75 hover:text-white">
                  {user?.photos?.profile ? (
                    <img
                      className="w-8 h-8 rounded-full object-cover object-center"
                      src={user.photos.profile}
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
                      {`${user.firstName} ${user.lastName}`.length > 25
                        ? `${user.firstName} ${user.lastName}`
                            .substring(0, 25)
                            .concat("...")
                        : `${user.firstName} ${user.lastName}`}
                    </span>
                    <span className="text-xs flex gap-2 items-center">
                      <p>Editar perfil</p>{" "}
                      <ArrowLongRightIcon className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            )}
            <CardMenu
              icon={<HomeIcon className="w-6 h-6" />}
              title="Inicio"
              isOpenMenu={isOpenMenu}
              handleClick={() => setShowMenu(false)}
            />
            {Object.keys(user).length > 0 && (
              <CardMenu
                icon={<BsFillMegaphoneFill className="w-6 h-6" />}
                title="Mis Anuncios"
                isOpenMenu={isOpenMenu}
                handleClick={() => setShowMenu(false)}
                redirectTo="/anuncios"
              />
            )}
            {Object.keys(user).length > 0 && (
              <CardMenu
                icon={<FaStore className="w-6 h-6" />}
                title="Mis Artitulos"
                isOpenMenu={isOpenMenu}
                handleClick={() => setShowMenu(false)}
                redirectTo="/mis-articulos"
              />
            )}
            {Object.keys(user).length > 0 && (
              <CardMenu
                icon={<ChartPieIcon className="w-6 h-6" />}
                title="Dashboard"
                isOpenMenu={isOpenMenu}
                notification={2}
                handleClick={() => setShowMenu(false)}
              />
            )}
            {Object.keys(user).length > 0 && (
              <CardMenu
                icon={<ViewColumnsIcon className="w-6 h-6" />}
                title="Kanban"
                isOpenMenu={isOpenMenu}
                handleClick={() => setShowMenu(false)}
              />
            )}
            {Object.keys(user).length > 0 && (
              <CardMenu
                icon={<InboxIcon className="w-6 h-6" />}
                title="Inbox"
                isOpenMenu={isOpenMenu}
                notification={10}
                handleClick={() => setShowMenu(false)}
              />
            )}
            <CardMenu
              icon={<ShoppingBagIcon className="w-6 h-6" />}
              title="Productos"
              isOpenMenu={isOpenMenu}
              handleClick={() => setShowMenu(false)}
            />
            {Object.keys(user).length > 0 ? (
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
        </div>
        <div className="w-full bg-slate-100 h-auto max-h-[92vh] overflow-auto relative flex flex-col justify-between">
          <div>{children}</div>
          <Footer />
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
        <div className="flex justify-between gap-2 cursor-pointer p-3 rounded-md items-center hover:bg-primary-600 hover:text-white">
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
                !isOpenMenu && "-translate-x-24 hidden"
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
