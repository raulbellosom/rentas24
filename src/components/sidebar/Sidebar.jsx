import React, { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  House,
  LayoutDashboard,
  ListChecks,
  LogIn,
  LogOut,
  Menu,
  Search,
  Store,
  UserCircle2,
  UserPlus2,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { getSignOut } from "../../features/auth/authSlice";
import { handleSignOut } from "../../app/api";
import Footer from "../Footer/Footer";
import { routes } from "../../router/paths";
import { Brand } from "../../shared/ui";

const navLabelClass = (collapsed) =>
  `overflow-hidden transition-[max-width,opacity] duration-300 ease-in-out ${
    collapsed ? "max-w-0 opacity-0" : "max-w-[220px] opacity-100"
  }`;

const FOOTER_STRIP_CLASS = "h-14";

const Sidebar = ({ children, user = {} }) => {
  const dispatch = useDispatch();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const hasSession = Boolean(user?.id);

  const links = useMemo(() => {
    const base = [{ label: "Inicio", to: routes.home, icon: House }];

    if (!hasSession) {
      return [
        ...base,
        { label: "Iniciar sesion", to: routes.login, icon: LogIn },
        { label: "Unete gratis", to: routes.register, icon: UserPlus2 },
      ];
    }

    return [
      ...base,
      { label: "Mis propiedades", to: routes.ownerProperties, icon: Store },
      { label: "Perfil", to: routes.ownerProfile, icon: UserCircle2 },
      { label: "Dashboard", to: routes.owner, icon: LayoutDashboard },
      { label: "Actividad", to: routes.ownerProperties, icon: ListChecks },
    ];
  }, [hasSession]);

  const handleSignout = async () => {
    await handleSignOut();
    dispatch(getSignOut());
  };

  const sidebarWidthClass = isCollapsed ? "md:w-20" : "md:w-72";
  const contentOffsetClass = isCollapsed ? "md:ml-20" : "md:ml-72";
  const topbarOffsetClass = isCollapsed ? "md:left-20" : "md:left-72";

  return (
    <div className="min-h-screen bg-brand-50">
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-brand-200/70 bg-white md:flex md:flex-col ${sidebarWidthClass} transition-[width] duration-300 ease-in-out`}
      >
        <div className="flex h-16 items-center border-b border-brand-200/70 px-3">
          <Link
            to={routes.home}
            className={`flex w-full items-center rounded-xl transition ${
              isCollapsed ? "justify-center px-0" : "justify-start px-2"
            } py-2 hover:bg-brand-100`}
            title={isCollapsed ? "Rentas24" : undefined}
          >
            <Brand
              theme="light"
              showSlogan={false}
              iconClassName={`${isCollapsed ? "h-8 w-8" : "h-7 w-7"}`}
              textClassName={navLabelClass(isCollapsed)}
            />
          </Link>
        </div>

        {hasSession && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Link
              to={routes.ownerProfile}
              className="mx-2 mt-3 flex items-center overflow-hidden rounded-xl border border-brand-200 bg-gradient-to-r from-brand-100 to-accent-100"
              title={isCollapsed ? "Perfil" : undefined}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center">
                {user?.photos?.profile ? (
                  <img
                    className="h-10 w-10 rounded-full border border-brand-200 object-cover"
                    src={user.photos.profile}
                    alt="user_photo"
                  />
                ) : (
                  <UserCircle2 size={32} className="text-brand-700" />
                )}
              </div>
              <div className={navLabelClass(isCollapsed)}>
                <div className="min-w-0 overflow-hidden whitespace-nowrap pr-3">
                  <p className="text-sm font-semibold text-brand-950">
                    {`${user.firstName || ""} ${user.lastName || ""}`.trim()}
                  </p>
                  <p className="text-xs text-brand-600">{user.email}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        )}

        <nav className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto pb-3">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                end={item.to === routes.home}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group relative mx-2 flex items-center overflow-hidden rounded-xl transition ${
                    isActive
                      ? "bg-brand-950 text-white shadow-sm"
                      : "text-brand-700 hover:bg-brand-100"
                  }`
                }
              >
                <div className="flex h-11 w-12 shrink-0 items-center justify-center">
                  <Icon size={isCollapsed ? 20 : 18} />
                </div>
                <div className={navLabelClass(isCollapsed)}>
                  <span className="min-w-0 overflow-hidden whitespace-nowrap pr-3 text-sm font-medium">
                    {item.label}
                  </span>
                </div>
              </NavLink>
            );
          })}

          {hasSession && (
            <button
              type="button"
              onClick={handleSignout}
              className="group relative mx-2 flex w-[calc(100%-1rem)] items-center overflow-hidden rounded-xl text-rose-700 transition hover:bg-rose-50"
              title={isCollapsed ? "Cerrar sesion" : undefined}
            >
              <div className="flex h-11 w-12 shrink-0 items-center justify-center">
                <LogOut size={isCollapsed ? 20 : 18} />
              </div>
              <div className={navLabelClass(isCollapsed)}>
                <span className="min-w-0 overflow-hidden whitespace-nowrap pr-3 text-sm font-medium">
                  Cerrar sesion
                </span>
              </div>
            </button>
          )}
        </nav>

        <div
          className={`flex ${FOOTER_STRIP_CLASS} items-center justify-center border-t border-brand-800/70 bg-brand-950 px-2`}
        >
          <button
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-brand-100 transition hover:bg-brand-900/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/60"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 h-16 border-b border-brand-200/70 bg-white/90 backdrop-blur-xl md:hidden">
        <div className="flex h-full items-center justify-between gap-3 px-4">
          <button
            type="button"
            className="rounded-xl border border-brand-200 bg-brand-50/80 p-2 text-brand-700 transition hover:border-brand-300 hover:bg-brand-100"
            onClick={() => setShowMenu(true)}
          >
            <Menu size={18} />
          </button>
          <Brand theme="light" showSlogan={false} />
        </div>
      </header>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-brand-950/55 md:hidden"
          >
            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
              className="h-full w-72 border-r border-brand-200 bg-white p-3 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-brand-950">Menu</p>
                <button
                  type="button"
                  className="rounded-lg border border-brand-200 p-2 text-brand-700"
                  onClick={() => setShowMenu(false)}
                >
                  <X size={16} />
                </button>
              </div>

              <div className="r24-input-shell mt-4">
                <Search size={16} className="text-brand-500" />
                <input className="r24-input-base" type="text" placeholder="Buscar..." />
              </div>

              <nav className="mt-4 space-y-1">
                {links.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setShowMenu(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-brand-800 transition hover:bg-brand-100"
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
                {hasSession && (
                  <button
                    type="button"
                    onClick={handleSignout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-rose-700 transition hover:bg-rose-50"
                  >
                    <LogOut size={18} />
                    Cerrar sesion
                  </button>
                )}
              </nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`flex min-h-screen flex-col transition-[margin-left] duration-300 ease-in-out ${contentOffsetClass}`}>
        <header
          className={`fixed right-0 top-0 z-30 hidden h-16 border-b border-brand-200/70 bg-white/85 backdrop-blur-xl md:block ${topbarOffsetClass} transition-[left] duration-300 ease-in-out`}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex h-full items-center justify-end px-4 md:px-6"
          >
            <div className="r24-input-shell w-full max-w-xl">
              <Search size={16} className="text-brand-500" />
              <input
                className="r24-input-base"
                type="text"
                placeholder="Buscar propiedades, ubicaciones, IDs..."
              />
            </div>
          </motion.div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col md:pt-16">
          <div className="flex-1 overflow-y-auto">{children}</div>
          <div className="shrink-0">
            <Footer compact />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;
