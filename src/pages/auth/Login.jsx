import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import { Brand, Spinner } from "../../shared/ui";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { getSignIn } from "../../features/auth/authSlice";
import { handleResendVerificationEmail, handleSignIn } from "../../app/api";
import { routes } from "../../router/paths";

const heroImage =
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1400&q=80";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const RESEND_COOLDOWN_SECONDS = 180;
const LAST_UNVERIFIED_EMAIL_KEY = "r24-email-verification-last-email";
const RESEND_UNTIL_PREFIX = "r24-email-verification-resend-until::";

const cooldownKeyForEmail = (email) =>
  `${RESEND_UNTIL_PREFIX}${String(email || "").trim().toLowerCase()}`;

const readStoredUnverifiedEmail = () => {
  try {
    return String(window.localStorage.getItem(LAST_UNVERIFIED_EMAIL_KEY) || "")
      .trim()
      .toLowerCase();
  } catch {
    return "";
  }
};

const readCooldownUntil = (email) => {
  if (!email) return 0;
  try {
    const raw = window.localStorage.getItem(cooldownKeyForEmail(email));
    const until = Number(raw || 0);
    if (!Number.isFinite(until) || until <= Date.now()) {
      window.localStorage.removeItem(cooldownKeyForEmail(email));
      return 0;
    }
    return until;
  } catch {
    return 0;
  }
};

const writeCooldownUntil = (email, until) => {
  if (!email) return;
  try {
    if (until > Date.now()) {
      window.localStorage.setItem(cooldownKeyForEmail(email), String(until));
      return;
    }
    window.localStorage.removeItem(cooldownKeyForEmail(email));
  } catch {
    // noop
  }
};

const formatCountdown = (seconds) => {
  const total = Math.max(0, Number(seconds) || 0);
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");
  return `${mm}:${ss}`;
};

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail =
    String(location.state?.email || "").trim().toLowerCase() ||
    readStoredUnverifiedEmail();
  const initialCooldownUntil = readCooldownUntil(initialEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState(initialEmail);
  const [cooldownUntil, setCooldownUntil] = useState(initialCooldownUntil);
  const [cooldownLeftSeconds, setCooldownLeftSeconds] = useState(
    initialCooldownUntil > 0
      ? Math.max(0, Math.ceil((initialCooldownUntil - Date.now()) / 1000))
      : 0
  );
  const [data, setData] = useState({
    email: initialEmail,
    password: "",
    remember: false,
  });

  const notifyError = (text) => toast.error(text);

  const normalizedEmail = useMemo(() => data.email.trim().toLowerCase(), [data.email]);
  const emailTouched = normalizedEmail.length > 0;
  const emailValid = EMAIL_REGEX.test(normalizedEmail);
  const passwordTouched = data.password.length > 0;
  const passwordValid = data.password.length >= 8;
  const canSubmit = emailValid && passwordValid && !isLoading;
  const isCooldownActive = cooldownLeftSeconds > 0;
  const showVerificationBlocked =
    Boolean(verificationEmail) &&
    (!location.state || location.state.reason === "EMAIL_NOT_VERIFIED");

  useEffect(() => {
    if (!verificationEmail) {
      setCooldownUntil(0);
      setCooldownLeftSeconds(0);
      return;
    }

    const nextUntil = readCooldownUntil(verificationEmail);
    setCooldownUntil(nextUntil);
    setCooldownLeftSeconds(
      nextUntil > 0 ? Math.max(0, Math.ceil((nextUntil - Date.now()) / 1000)) : 0
    );
  }, [verificationEmail]);

  useEffect(() => {
    if (!cooldownUntil || !verificationEmail) {
      return undefined;
    }

    const tick = () => {
      const left = Math.max(0, Math.ceil((cooldownUntil - Date.now()) / 1000));
      setCooldownLeftSeconds(left);
      if (left <= 0) {
        setCooldownUntil(0);
        writeCooldownUntil(verificationEmail, 0);
      }
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, [cooldownUntil, verificationEmail]);

  const setCooldownWindow = (email, seconds) => {
    const safeSeconds = Math.max(1, Math.floor(Number(seconds) || 0));
    const until = Date.now() + safeSeconds * 1000;
    setCooldownUntil(until);
    setCooldownLeftSeconds(safeSeconds);
    writeCooldownUntil(email, until);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!emailValid) {
      notifyError("Ingresa un correo electronico valido");
      return;
    }
    if (!passwordValid) {
      notifyError("La contrasena debe tener al menos 8 caracteres");
      return;
    }

    setIsLoading(true);

    const res = await handleSignIn({ ...data, email: normalizedEmail });
    if (res.ok) {
      window.localStorage.removeItem(LAST_UNVERIFIED_EMAIL_KEY);
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch(getSignIn(res));
      navigate(routes.ownerProperties);
      setIsLoading(false);
      return;
    }

    if (res?.status === 403 && res?.data?.reason === "EMAIL_NOT_VERIFIED") {
      const blockedEmail = String(res?.data?.email || normalizedEmail || "")
        .trim()
        .toLowerCase();
      setVerificationEmail(blockedEmail);
      try {
        window.localStorage.setItem(LAST_UNVERIFIED_EMAIL_KEY, blockedEmail);
      } catch {
        // noop
      }
      notifyError(
        res?.data?.message ||
          "Tu correo aun no esta verificado. Debes verificarlo para entrar."
      );
      setIsLoading(false);
      return;
    }

    notifyError(res?.data?.message || res.error || "No se pudo iniciar sesion");
    setIsLoading(false);
  };

  const onResendVerification = async () => {
    const email = String(verificationEmail || normalizedEmail).trim().toLowerCase();
    if (!EMAIL_REGEX.test(email)) {
      notifyError("Necesitamos un correo valido para reenviar la verificacion");
      return;
    }
    if (isCooldownActive) {
      notifyError(
        `Debes esperar ${formatCountdown(
          cooldownLeftSeconds
        )} antes de reenviar el correo`
      );
      return;
    }

    setIsResending(true);
    const res = await handleResendVerificationEmail(email);
    if (res.ok) {
      try {
        window.localStorage.setItem(LAST_UNVERIFIED_EMAIL_KEY, email);
      } catch {
        // noop
      }
      setVerificationEmail(email);
      setCooldownWindow(email, RESEND_COOLDOWN_SECONDS);
      toast.success("Correo de verificacion reenviado");
    } else if (res?.status === 429) {
      const retryAfterSeconds =
        Number(res?.data?.retryAfterSeconds || 0) || RESEND_COOLDOWN_SECONDS;
      setVerificationEmail(email);
      setCooldownWindow(email, retryAfterSeconds);
      notifyError(
        res?.data?.message ||
          `Debes esperar ${formatCountdown(
            retryAfterSeconds
          )} antes de reenviar`
      );
    } else {
      notifyError(res?.data?.message || res.error || "No se pudo reenviar el correo");
    }
    setIsResending(false);
  };

  return (
    <div className="r24-min-h-dvh overflow-x-clip bg-brand-950 text-brand-50 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(520px,45%)]">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.45 }}
        className="flex items-start px-4 py-6 sm:px-8 lg:items-center lg:px-14 lg:py-10 r24-safe-pt r24-safe-pb"
      >
        <div className="mx-auto w-full max-w-xl rounded-3xl bg-brand-950/72 p-5 shadow-2xl shadow-brand-950/30 backdrop-blur-sm sm:p-8">
          <Link to={routes.home} className="mb-8 inline-block">
            <Brand theme="dark" />
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">Inicia sesion</h1>
          <p className="mt-2 text-sm text-brand-100/70">
            Accede a tu panel para publicar, editar y administrar propiedades.
          </p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-wide text-brand-200/70">
                Correo electronico
              </span>
              <div className="r24-input-shell r24-input-shell-dark mt-2">
                <Mail size={16} className="text-brand-300/70" />
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="r24-input-base r24-input-base-dark"
                  placeholder="tu@email.com"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  onBlur={(e) => setData({ ...data, email: e.target.value.trim() })}
                />
              </div>
              {emailTouched ? (
                <p className={`mt-1 text-[11px] ${emailValid ? "text-emerald-300" : "text-rose-300"}`}>
                  {emailValid ? "Correo valido" : "Formato de correo invalido"}
                </p>
              ) : null}
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wide text-brand-200/70">
                Contrasena
              </span>
              <div className="r24-input-shell r24-input-shell-dark mt-2">
                <Lock size={16} className="text-brand-300/70" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  autoComplete="current-password"
                  required
                  className="r24-input-base r24-input-base-dark"
                  placeholder="********"
                  value={data.password}
                  onChange={(e) => setData({ ...data, password: e.target.value })}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  className="text-brand-300/80 transition hover:text-brand-100"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {passwordTouched && !passwordValid ? (
                <p className="mt-1 text-[11px] text-rose-300">Minimo 8 caracteres</p>
              ) : null}
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-brand-100/70">
              <input
                type="checkbox"
                className="r24-checkbox"
                checked={data.remember}
                onChange={(e) => setData({ ...data, remember: e.target.checked })}
              />
              Mantener sesion iniciada
            </label>

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-xl bg-accent-500 py-3 font-semibold text-brand-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex justify-center">
                  <Spinner size="sm" ariaLabel="Signing in" />
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Iniciar sesion
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          {showVerificationBlocked ? (
            <div className="mt-4 rounded-xl border border-amber-300/40 bg-amber-500/10 p-4 text-sm text-amber-100">
              <p>
                Tu correo aun no esta verificado. No puedes ingresar hasta completar la
                verificacion.
              </p>
              <button
                type="button"
                disabled={isResending || isCooldownActive}
                onClick={onResendVerification}
                className="mt-3 inline-flex items-center rounded-lg bg-amber-300 px-3 py-2 text-xs font-semibold text-brand-950 transition hover:bg-amber-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isResending
                  ? "Reenviando..."
                  : isCooldownActive
                    ? `Reintentar en ${formatCountdown(cooldownLeftSeconds)}`
                    : "Reenviar correo de verificacion"}
              </button>
              {isCooldownActive ? (
                <p className="mt-2 text-xs text-amber-100/85">
                  Solo puedes reenviar una vez cada 3 minutos.
                </p>
              ) : null}
            </div>
          ) : null}

          <p className="mt-6 text-sm text-brand-100/70">
            No tienes una cuenta?{" "}
            <Link to={routes.register} className="font-medium text-accent-400 hover:text-accent-300">
              Registrate
            </Link>
          </p>
        </div>
      </motion.div>

      <div className="relative hidden lg:block">
        <div className="sticky top-0 r24-h-dvh overflow-hidden border-l border-brand-300/15">
          <img
            src={heroImage}
            alt="Rentas24"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-brand-950 via-brand-950/20 to-accent-600/20" />
          <div className="absolute inset-0 flex items-end px-8 py-8 xl:px-10 xl:py-10">
            <div className="w-full max-w-[38rem]">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-200/90">
                Rentas24 Platform
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-white xl:text-3xl">
                Publica y administra propiedades en un solo flujo.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
