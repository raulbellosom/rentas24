import React, { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  FileText,
  House,
  LayoutDashboard,
  ListChecks,
  LogIn,
  LogOut,
  Menu,
  Search,
  Settings,
  Store,
  UserCircle2,
  UserPlus2,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
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

const Avatar = ({ user, className = "h-9 w-9", iconSize = 20 }) => {
  if (user?.photos?.profile) {
    return (
      <img
        className={`${className} rounded-full border border-brand-200 object-cover`}
        src={user.photos.profile}
        alt="Foto de perfil"
      />
    );
  }
  return (
    <span className={`${className} inline-flex items-center justify-center rounded-full bg-brand-100`}>
      <UserCircle2 size={iconSize} className="text-brand-500" />
    </span>
  );
};

const UserMenuDropdown = ({ user, onSignout, compact = false }) => {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const hasSession = Boolean(user?.id);
  const fullName = `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Usuario";
  const email = String(user?.email || "").trim() || "sin-correo@rentas24.com";

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const onEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onEscape);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onEscape);
    };
  }, [open]);

  if (!hasSession) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`inline-flex items-center rounded-xl border border-brand-200/80 bg-white text-brand-900 shadow-sm transition hover:border-brand-300 hover:bg-brand-50 ${
          compact
            ? "h-10 w-10 justify-center p-0"
            : "h-12 min-w-[18rem] max-w-[24rem] gap-2 px-2.5"
        }`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <Avatar user={user} className={`${compact ? "h-8 w-8" : "h-9 w-9"} shrink-0`} iconSize={18} />
        {!compact ? (
          <>
            <span className="min-w-0 flex-1 text-left">
              <span className="block truncate text-sm font-semibold leading-tight text-brand-900">
                {fullName}
              </span>
              <span className="block truncate text-xs leading-tight text-brand-600">{email}</span>
            </span>
            <ChevronDown size={15} className={`shrink-0 transition ${open ? "rotate-180" : ""}`} />
          </>
        ) : null}
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 z-[70] mt-2 w-[min(92vw,22rem)] overflow-hidden rounded-2xl border border-brand-200 bg-white p-1.5 shadow-2xl"
            role="menu"
          >
            <div className="mb-1 rounded-xl bg-brand-100/70 px-3 py-2">
              <p className="truncate text-sm font-semibold text-brand-950">{fullName}</p>
              <p className="truncate text-xs text-brand-700">{email}</p>
            </div>

            <Link
              to={routes.ownerProfile}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-brand-800 transition hover:bg-brand-100 hover:text-brand-950"
              role="menuitem"
            >
              <Settings size={15} className="shrink-0" />
              <span className="truncate">Editar perfil</span>
            </Link>

            <button
              type="button"
              disabled
              className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-brand-500 transition hover:bg-brand-100/70"
              role="menuitem"
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                <CircleHelp size={15} className="shrink-0" />
                Ayuda
              </span>
              <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-600">
                Proximamente
              </span>
            </button>

            <button
              type="button"
              disabled
              className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm font-medium text-brand-500 transition hover:bg-brand-100/70"
              role="menuitem"
            >
              <span className="inline-flex min-w-0 items-center gap-2">
                <FileText size={15} className="shrink-0" />
                <span className="truncate">Terminos y condiciones</span>
              </span>
              <span className="shrink-0 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-brand-600">
                Proximamente
              </span>
            </button>

            <button
              type="button"
              onClick={async () => {
                setOpen(false);
                await onSignout();
              }}
              className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50"
              role="menuitem"
            >
              <LogOut size={15} className="shrink-0" />
              Cerrar sesion
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

const Sidebar = ({ children, user = {} }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const hasSession = Boolean(user?.id);

  useEffect(() => {
    if (!showMenu) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [showMenu]);

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
      { label: "Dashboard", to: routes.owner, icon: LayoutDashboard },
      { label: "Actividad", to: routes.ownerActivity, icon: ListChecks },
    ];
  }, [hasSession]);

  const handleSignout = async () => {
    await handleSignOut();
    dispatch(getSignOut());
  };

  const isLinkActive = (to) => {
    const current = location.pathname;
    if (to === routes.home) return current === routes.home;
    if (to === routes.ownerProperties) return current.startsWith(routes.ownerProperties);
    return current === to;
  };

  const sidebarWidthClass = isCollapsed ? "md:w-20" : "md:w-72";
  const contentOffsetClass = isCollapsed ? "md:ml-20" : "md:ml-72";
  const topbarOffsetClass = isCollapsed ? "md:left-20" : "md:left-72";

  return (
    <div className="r24-min-h-dvh bg-brand-50">
      <aside
        className={`r24-h-dvh fixed inset-y-0 left-0 z-40 hidden border-r border-brand-200/70 bg-white md:flex md:flex-col ${sidebarWidthClass} transition-[width] duration-300 ease-in-out`}
      >
        <div className="flex h-16 items-center border-b border-brand-200/70 px-3">
          <Link
            to={routes.home}
            className="flex w-full items-center rounded-xl px-2 py-2 transition hover:bg-brand-100"
            title={isCollapsed ? "Rentas24" : undefined}
          >
            <Brand
              theme="light"
              showSlogan={false}
              iconClassName="h-7 w-7 shrink-0"
              textClassName={navLabelClass(isCollapsed)}
            />
          </Link>
        </div>

        <nav className="mt-3 min-h-0 flex-1 space-y-1 overflow-x-visible overflow-y-auto pb-3">
          {links.map((item) => {
            const Icon = item.icon;
            const active = isLinkActive(item.to);
            return (
              <div key={item.label} className="group/nav relative mx-2">
                <Link
                  to={item.to}
                  title={isCollapsed ? item.label : undefined}
                  className={`group relative flex items-center rounded-xl transition ${
                    active
                      ? "bg-brand-950 text-white shadow-sm"
                      : "text-brand-700 hover:bg-brand-100 hover:text-brand-900"
                  }`}
                >
                  <div className="flex h-11 w-12 shrink-0 items-center justify-center">
                    <Icon size={isCollapsed ? 20 : 18} />
                  </div>
                  <div className={navLabelClass(isCollapsed)}>
                    <span className="min-w-0 overflow-hidden whitespace-nowrap pr-3 text-sm font-medium">
                      {item.label}
                    </span>
                  </div>
                </Link>

                {isCollapsed ? (
                  <div className="pointer-events-none absolute left-[calc(100%+10px)] top-1/2 z-50 -translate-y-1/2 translate-x-1 rounded-xl border border-brand-200/30 bg-brand-950 px-3 py-1.5 text-xs font-semibold text-brand-50 opacity-0 shadow-xl transition group-hover/nav:translate-x-0 group-hover/nav:opacity-100">
                    {item.label}
                  </div>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div
          className={`flex ${FOOTER_STRIP_CLASS} items-center border-t border-brand-800/70 bg-brand-950 px-2`}
        >
          <button
            type="button"
            className="inline-flex h-10 w-full items-center rounded-xl text-brand-100 transition hover:bg-brand-900/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-400/60"
            onClick={() => setIsCollapsed((prev) => !prev)}
            aria-label={isCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
          >
            <span className="flex h-10 w-12 shrink-0 items-center justify-center">
              {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </span>
            <span className={navLabelClass(isCollapsed)}>
              <span className="text-sm font-semibold">
                {isCollapsed ? "Expandir" : "Colapsar"}
              </span>
            </span>
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-brand-200/70 bg-white/90 backdrop-blur-xl md:hidden r24-safe-pt">
        <div className="flex h-16 items-center gap-3 px-4">
          <button
            type="button"
            className="rounded-xl border border-brand-200 bg-brand-50/80 p-2 text-brand-700 transition hover:border-brand-300 hover:bg-brand-100"
            onClick={() => setShowMenu(true)}
            aria-label="Abrir menu"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <Brand theme="light" showSlogan={false} />
          </div>

          {hasSession ? (
            <UserMenuDropdown user={user} onSignout={handleSignout} compact />
          ) : (
            <div className="w-9" />
          )}
        </div>
      </header>

      <AnimatePresence>
        {showMenu ? (
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
              className="r24-h-dvh flex w-[min(86vw,20rem)] flex-col border-r border-brand-200 bg-white p-3 shadow-2xl r24-safe-pb"
            >
              <div className="flex items-center justify-between">
                <p className="font-semibold text-brand-950">Menu</p>
                <button
                  type="button"
                  className="rounded-lg border border-brand-200 p-2 text-brand-700"
                  onClick={() => setShowMenu(false)}
                  aria-label="Cerrar menu"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="r24-input-shell mt-4">
                <Search size={16} className="text-brand-500" />
                <input className="r24-input-base" type="text" placeholder="Buscar..." />
              </div>

              <nav className="mt-4 min-h-0 flex-1 space-y-1 overflow-y-auto pr-1">
                {links.map((item) => {
                  const Icon = item.icon;
                  const active = isLinkActive(item.to);
                  return (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={() => setShowMenu(false)}
                      className={`flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition ${
                        active
                          ? "bg-brand-950 text-white shadow-sm"
                          : "text-brand-800 hover:bg-brand-100"
                      }`}
                    >
                      <Icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <div className={`r24-min-h-dvh flex flex-col transition-[margin-left] duration-300 ease-in-out ${contentOffsetClass}`}>
        <header
          className={`fixed right-0 top-0 z-30 hidden h-16 border-b border-brand-200/70 bg-white/85 backdrop-blur-xl md:block ${topbarOffsetClass} transition-[left] duration-300 ease-in-out`}
        >
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
            className="flex h-full items-center gap-4 px-4 md:px-6"
          >
            <div className="r24-input-shell w-full max-w-2xl">
              <Search size={16} className="text-brand-500" />
              <input
                className="r24-input-base"
                type="text"
                placeholder="Buscar propiedades, ubicaciones, IDs..."
              />
            </div>
            {hasSession ? <UserMenuDropdown user={user} onSignout={handleSignout} /> : null}
          </motion.div>
        </header>

        <main className="flex min-h-0 flex-1 flex-col md:pt-16 md:pb-14">
          <div className="flex-1 overflow-y-auto r24-safe-pb">{children}</div>
          <div className="shrink-0 md:hidden">
            <Footer compact />
          </div>
        </main>
      </div>

      <div
        className={`fixed bottom-0 right-0 z-30 hidden ${topbarOffsetClass} transition-[left] duration-300 ease-in-out md:block`}
      >
        <Footer compact />
      </div>
    </div>
  );
};

export default Sidebar;
