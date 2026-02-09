import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, CircleAlert, Loader2, ShieldCheck } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Brand } from "../../shared/ui";
import { handleVerifyEmailToken } from "../../app/api";
import { routes } from "../../router/paths";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = String(searchParams.get("token") || "").trim();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Validando tu enlace de verificacion...");
  const tokenPreview = token ? `${token.slice(0, 6)}...${token.slice(-4)}` : "sin token";

  const statusTheme =
    status === "success"
      ? {
          badge: "Verificacion exitosa",
          title: "Tu correo ya esta listo",
          ring: "from-emerald-500/35 via-teal-400/20 to-emerald-500/5",
          iconBg: "bg-emerald-500/18 text-emerald-200",
          icon: <CheckCircle2 size={34} />,
          border: "border-emerald-300/35",
        }
      : status === "error"
        ? {
            badge: "No se pudo verificar",
            title: "Hubo un problema con el enlace",
            ring: "from-rose-500/35 via-rose-400/18 to-rose-500/5",
            iconBg: "bg-rose-500/16 text-rose-200",
            icon: <CircleAlert size={34} />,
            border: "border-rose-300/35",
          }
        : {
            badge: "Validando token",
            title: "Estamos confirmando tu correo",
            ring: "from-cyan-500/35 via-accent-400/16 to-cyan-500/5",
            iconBg: "bg-cyan-500/16 text-cyan-100",
            icon: <Loader2 size={34} className="animate-spin" />,
            border: "border-cyan-300/35",
          };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!token) {
        if (cancelled) return;
        setStatus("error");
        setMessage("El enlace de verificacion es invalido o no tiene token.");
        return;
      }

      const res = await handleVerifyEmailToken(token);
      if (cancelled) return;

      if (res.ok) {
        setStatus("success");
        setMessage(
          res?.data?.message || "Tu correo se verifico correctamente. Ya puedes iniciar sesion."
        );
        return;
      }

      setStatus("error");
      setMessage(
        res?.data?.error ||
          res?.data?.message ||
          res.error ||
          "No se pudo validar el token de verificacion."
      );
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <div className="relative r24-min-h-dvh overflow-hidden bg-[#040f28] text-brand-50">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-0 h-80 w-80 rounded-full bg-cyan-400/12 blur-3xl" />
        <div className="absolute bottom-[-120px] right-[-60px] h-96 w-96 rounded-full bg-brand-300/12 blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_25%,rgba(66,212,234,0.08),transparent_45%),radial-gradient(circle_at_80%_75%,rgba(24,69,101,0.28),transparent_48%)]" />
      </div>

      <main className="relative z-10 mx-auto flex r24-min-h-dvh w-full max-w-7xl items-center px-5 py-7 sm:px-8 md:py-10 lg:px-14 r24-safe-pt r24-safe-pb">
        <div className="grid w-full items-stretch gap-6 lg:grid-cols-[minmax(280px,0.95fr)_minmax(0,1.15fr)] lg:gap-8">
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="rounded-3xl border border-brand-200/15 bg-white/[0.03] p-6 backdrop-blur-xl sm:p-7"
          >
            <Link to={routes.home} className="inline-block">
              <Brand theme="dark" />
            </Link>

            <div className="mt-7 space-y-4">
              <p className="inline-flex items-center rounded-full border border-brand-200/20 bg-brand-50/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-accent-300">
                Seguridad de cuenta
              </p>
              <h1 className="text-3xl font-semibold leading-tight sm:text-4xl">
                Verificacion de correo Rentas24
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-brand-100/80">
                Este paso confirma tu identidad para activar el acceso completo al
                panel y proteger tus publicaciones.
              </p>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-brand-200/20 bg-brand-950/45 p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-brand-300/85">
                  Token
                </p>
                <p className="mt-2 font-mono text-sm text-brand-50/95">{tokenPreview}</p>
              </div>
              <div className="rounded-2xl border border-brand-200/20 bg-brand-950/45 p-4">
                <p className="text-[11px] uppercase tracking-[0.12em] text-brand-300/85">
                  Estado
                </p>
                <p className="mt-2 text-sm font-semibold text-brand-50/95">
                  {status === "loading"
                    ? "En proceso"
                    : status === "success"
                      ? "Validado"
                      : "Requiere nueva accion"}
                </p>
              </div>
            </div>
          </motion.aside>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.08 }}
            className={`relative overflow-hidden rounded-3xl border bg-white/[0.05] p-6 backdrop-blur-2xl sm:p-8 lg:p-10 ${statusTheme.border}`}
          >
            <div className="pointer-events-none absolute -right-28 -top-28 h-72 w-72 rounded-full bg-accent-400/12 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 left-10 h-56 w-56 rounded-full bg-brand-400/10 blur-3xl" />

            <div
              className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${statusTheme.ring}`}
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full border border-brand-100/25 bg-brand-50/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-brand-100">
                <ShieldCheck size={13} className="text-accent-300" />
                {statusTheme.badge}
              </div>

              <div className="mt-7 flex flex-col items-start gap-5 sm:flex-row sm:items-center">
                <motion.div
                  animate={
                    status === "loading"
                      ? { scale: [1, 1.04, 1] }
                      : { scale: [1, 1.02, 1] }
                  }
                  transition={{
                    duration: status === "loading" ? 1.4 : 2.2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                  className={`inline-flex h-20 w-20 items-center justify-center rounded-2xl border border-brand-100/25 shadow-xl ${statusTheme.iconBg}`}
                >
                  {statusTheme.icon}
                </motion.div>

                <div className="max-w-xl">
                  <h2 className="text-3xl font-semibold leading-tight sm:text-[2.1rem]">
                    {statusTheme.title}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-brand-100/85">
                    {message}
                  </p>
                </div>
              </div>

              <div className="mt-9 flex flex-wrap gap-3">
                {status !== "loading" ? (
                  <Link
                    to={routes.login}
                    replace
                    className="inline-flex items-center gap-2 rounded-xl bg-accent-500 px-5 py-3 text-sm font-semibold text-brand-950 transition hover:bg-accent-400"
                  >
                    Ir a iniciar sesion
                    <ArrowRight size={15} />
                  </Link>
                ) : null}

                {status === "error" ? (
                  <Link
                    to={routes.register}
                    className="inline-flex items-center gap-2 rounded-xl border border-brand-100/35 bg-brand-950/35 px-5 py-3 text-sm font-semibold text-brand-100 transition hover:border-brand-100/60 hover:bg-brand-950/55"
                  >
                    Crear otra cuenta
                  </Link>
                ) : null}
              </div>
            </div>
          </motion.section>
        </div>
      </main>
    </div>
  );
};

export default VerifyEmail;
