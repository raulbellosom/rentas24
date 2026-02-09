import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, CircleAlert } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { Brand, Spinner } from "../../shared/ui";
import { handleVerifyEmailToken } from "../../app/api";
import { routes } from "../../router/paths";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = String(searchParams.get("token") || "").trim();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Validando tu enlace de verificacion...");

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
    <div className="min-h-screen bg-brand-950 px-6 py-8 text-brand-50 sm:px-10 lg:px-14 lg:py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mx-auto w-full max-w-lg rounded-3xl bg-brand-950/72 p-6 shadow-2xl shadow-brand-950/30 backdrop-blur-sm sm:p-8"
      >
        <Link to={routes.home} className="mb-8 inline-block">
          <Brand theme="dark" />
        </Link>

        {status === "loading" ? (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <Spinner size="lg" ariaLabel="Verifying email" />
            <p className="text-sm text-brand-100/80">{message}</p>
          </div>
        ) : null}

        {status === "success" ? (
          <div className="py-2">
            <div className="mb-4 inline-flex rounded-full bg-emerald-500/20 p-3 text-emerald-300">
              <CheckCircle2 size={28} />
            </div>
            <h1 className="text-2xl font-semibold">Correo verificado</h1>
            <p className="mt-2 text-sm text-brand-100/80">{message}</p>
            <Link
              to={routes.login}
              replace
              className="mt-6 inline-flex rounded-xl bg-accent-500 px-4 py-2 font-semibold text-brand-950 transition hover:bg-accent-400"
            >
              Ir a iniciar sesion
            </Link>
          </div>
        ) : null}

        {status === "error" ? (
          <div className="py-2">
            <div className="mb-4 inline-flex rounded-full bg-rose-500/20 p-3 text-rose-300">
              <CircleAlert size={28} />
            </div>
            <h1 className="text-2xl font-semibold">No fue posible verificar</h1>
            <p className="mt-2 text-sm text-brand-100/80">{message}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to={routes.login}
                className="inline-flex rounded-xl bg-accent-500 px-4 py-2 font-semibold text-brand-950 transition hover:bg-accent-400"
              >
                Ir a iniciar sesion
              </Link>
              <Link
                to={routes.register}
                className="inline-flex rounded-xl border border-brand-200/30 px-4 py-2 font-semibold text-brand-100 transition hover:border-brand-200/50"
              >
                Crear otra cuenta
              </Link>
            </div>
          </div>
        ) : null}
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
