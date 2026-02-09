import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye, EyeOff, Lock, Mail, Phone, UserRound } from "lucide-react";
import { parsePhoneNumberFromString } from "libphonenumber-js/min";
import { Brand, Spinner } from "../../shared/ui";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import SelectCountryInput from "../../components/inputs/SelectCountryInput";
import { handleSignUp } from "../../app/api";
import { routes } from "../../router/paths";

const heroImage =
  "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1400&q=80";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const getPasswordStrength = (password = "") => {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  const levels = [
    { label: "Muy debil", textClass: "text-rose-300", barClass: "bg-rose-500" },
    { label: "Debil", textClass: "text-rose-300", barClass: "bg-rose-500" },
    { label: "Basica", textClass: "text-amber-300", barClass: "bg-amber-500" },
    { label: "Media", textClass: "text-yellow-300", barClass: "bg-yellow-500" },
    { label: "Fuerte", textClass: "text-emerald-300", barClass: "bg-emerald-500" },
    { label: "Muy fuerte", textClass: "text-emerald-300", barClass: "bg-emerald-400" },
  ];

  const level = levels[score] || levels[0];
  return {
    score,
    percent: Math.round((score / 5) * 100),
    ...level,
  };
};

const isValidPhoneNumber = ({ phone, phoneCode, iso2 }) => {
  const digits = String(phone || "").replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return false;

  try {
    if (iso2) {
      const parsedLocal = parsePhoneNumberFromString(digits, iso2);
      if (parsedLocal?.isValid()) return true;
    }

    if (phoneCode) {
      const parsedIntl = parsePhoneNumberFromString(`${phoneCode}${digits}`);
      if (parsedIntl?.isValid()) return true;
    }
  } catch {
    return false;
  }

  return false;
};

const Register = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({});
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [triedSubmit, setTriedSubmit] = useState(false);
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone_code: "",
    phone: "",
    remember: false,
    terms: false,
  });

  const notifyError = (text) => toast.error(text);

  const firstName = user.firstName.trim();
  const lastName = user.lastName.trim();
  const normalizedEmail = user.email.trim().toLowerCase();
  const phoneDigits = user.phone.replace(/\D/g, "");

  const passwordStrength = useMemo(() => getPasswordStrength(user.password), [user.password]);
  const hasConfirm = confirmPassword.length > 0;
  const passwordsMatch = hasConfirm && user.password === confirmPassword;

  const emailTouched = normalizedEmail.length > 0;
  const emailValid = EMAIL_REGEX.test(normalizedEmail);
  const emailError = emailTouched && !emailValid ? "Formato de correo invalido" : "";

  const hasPhone = phoneDigits.length > 0;
  const hasCountryCode = Boolean(user.phone_code && selectedCountry?.iso2);
  const phoneValid = hasPhone && hasCountryCode
    ? isValidPhoneNumber({ phone: phoneDigits, phoneCode: user.phone_code, iso2: selectedCountry.iso2 })
    : false;

  let phoneMessage = "";
  let phoneMessageClass = "text-brand-300";
  if (hasPhone && !hasCountryCode) {
    phoneMessage = "Si escribes telefono, debes seleccionar codigo de pais";
    phoneMessageClass = "text-rose-300";
  } else if (hasPhone && hasCountryCode && !phoneValid) {
    phoneMessage = "Numero invalido para el pais seleccionado";
    phoneMessageClass = "text-rose-300";
  } else if (hasPhone && phoneValid) {
    phoneMessage = "Telefono valido";
    phoneMessageClass = "text-emerald-300";
  } else {
    phoneMessage = "Telefono opcional";
  }

  const requiredFieldsOk = Boolean(firstName && lastName && normalizedEmail && user.password && confirmPassword);
  const passwordLengthOk = user.password.length >= 8;
  const passwordsOk = user.password === confirmPassword;
  const phoneRuleOk = !hasPhone || (hasCountryCode && phoneValid);
  const termsOk = user.terms;

  const canSubmit =
    !isLoading &&
    requiredFieldsOk &&
    emailValid &&
    passwordLengthOk &&
    passwordsOk &&
    phoneRuleOk &&
    termsOk;

  const getPhoneCode = (country) => {
    setSelectedCountry(country);
    setUser({ ...user, phone_code: `+${country.phone_code}` });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTriedSubmit(true);

    if (!requiredFieldsOk) {
      notifyError("Completa los campos obligatorios");
      return;
    }
    if (!emailValid) {
      notifyError("Ingresa un correo electronico valido");
      return;
    }
    if (!passwordLengthOk) {
      notifyError("La contrasena debe tener al menos 8 caracteres");
      return;
    }
    if (!passwordsOk) {
      notifyError("Las contrasenas no coinciden");
      return;
    }
    if (!phoneRuleOk) {
      notifyError("Verifica telefono y codigo de pais");
      return;
    }
    if (!termsOk) {
      notifyError("Debes aceptar terminos y condiciones");
      return;
    }

    setIsLoading(true);

    const payload = {
      ...user,
      firstName,
      lastName,
      email: normalizedEmail,
      phone: phoneDigits,
      phone_code: hasPhone ? user.phone_code : "",
    };

    const res = await handleSignUp(payload);
    if (res.ok) {
      toast.success("Cuenta creada. Revisa tu correo y luego inicia sesion.");
      navigate(routes.login, {
        replace: true,
        state: {
          email: payload.email,
          reason: "EMAIL_NOT_VERIFIED",
          fromRegister: true,
        },
      });
      setIsLoading(false);
      return;
    }

    notifyError(res?.data?.message || res.error || "No se pudo crear la cuenta");
    setIsLoading(false);
  };

  return (
    <div className="r24-min-h-dvh overflow-x-clip bg-brand-950 text-brand-50 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(520px,45%)]">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="r24-min-h-dvh flex items-start px-4 py-6 sm:px-8 lg:px-14 lg:py-10 r24-safe-pt r24-safe-pb"
      >
        <div className="mx-auto w-full max-w-2xl rounded-3xl bg-brand-950/72 p-5 shadow-2xl shadow-brand-950/30 backdrop-blur-sm sm:p-8">
          <Link to={routes.home} className="mb-8 inline-block">
            <Brand theme="dark" />
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight">Crea tu cuenta</h1>
          <p className="mt-2 text-sm text-brand-100/70">
            Registrate para publicar propiedades y gestionar tus anuncios.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs uppercase tracking-wide text-brand-200/70">Nombre</span>
                <div className="r24-input-shell r24-input-shell-dark mt-2">
                  <UserRound size={16} className="text-brand-300/70" />
                  <input
                    type="text"
                    required
                    minLength={2}
                    className="r24-input-base r24-input-base-dark"
                    placeholder="Nombre(s)"
                    value={user.firstName}
                    onChange={(e) => setUser({ ...user, firstName: e.target.value })}
                  />
                </div>
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-wide text-brand-200/70">Apellido</span>
                <div className="r24-input-shell r24-input-shell-dark mt-2">
                  <UserRound size={16} className="text-brand-300/70" />
                  <input
                    type="text"
                    required
                    minLength={2}
                    className="r24-input-base r24-input-base-dark"
                    placeholder="Apellido(s)"
                    value={user.lastName}
                    onChange={(e) => setUser({ ...user, lastName: e.target.value })}
                  />
                </div>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-5">
              <div className="sm:col-span-2">
                <span className="text-xs uppercase tracking-wide text-brand-200/70">Codigo</span>
                <div className="mt-2">
                  <SelectCountryInput
                    getPhoneCode={getPhoneCode}
                    selectedCountry={selectedCountry}
                  />
                </div>
              </div>

              <label className="block sm:col-span-3">
                <span className="text-xs uppercase tracking-wide text-brand-200/70">Telefono</span>
                <div className="r24-input-shell r24-input-shell-dark mt-2">
                  <Phone size={16} className="text-brand-300/70" />
                  <input
                    type="tel"
                    minLength={7}
                    maxLength={15}
                    inputMode="numeric"
                    autoComplete="tel-national"
                    pattern="[0-9]{7,15}"
                    className="r24-input-base r24-input-base-dark"
                    placeholder="Numero"
                    value={user.phone}
                    onChange={(e) =>
                      setUser({
                        ...user,
                        phone: e.target.value.replace(/\D/g, "").slice(0, 15),
                      })
                    }
                  />
                </div>
                <p className={`mt-1 text-[11px] ${phoneMessageClass}`}>{phoneMessage}</p>
              </label>
            </div>

            <label className="block">
              <span className="text-xs uppercase tracking-wide text-brand-200/70">Correo electronico</span>
              <div className="r24-input-shell r24-input-shell-dark mt-2">
                <Mail size={16} className="text-brand-300/70" />
                <input
                  type="email"
                  required
                  className="r24-input-base r24-input-base-dark"
                  placeholder="tu@email.com"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                  onBlur={(e) => setUser({ ...user, email: e.target.value.trim() })}
                />
              </div>
              {emailTouched ? (
                <p className={`mt-1 text-[11px] ${emailValid ? "text-emerald-300" : "text-rose-300"}`}>
                  {emailValid ? "Correo valido" : emailError}
                </p>
              ) : null}
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wide text-brand-200/70">Contrasena</span>
              <div className="r24-input-shell r24-input-shell-dark mt-2">
                <Lock size={16} className="text-brand-300/70" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="r24-input-base r24-input-base-dark"
                  placeholder="********"
                  value={user.password}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
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

              <div className="mt-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-brand-200/75">Nivel de seguridad</span>
                  <span className={`font-semibold ${passwordStrength.textClass}`}>
                    {passwordStrength.label}
                  </span>
                </div>
                <div className="mt-1 h-2 overflow-hidden rounded-full bg-brand-900/80">
                  <motion.div
                    initial={false}
                    animate={{ width: `${passwordStrength.percent}%` }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`h-full rounded-full ${passwordStrength.barClass}`}
                  />
                </div>
              </div>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-wide text-brand-200/70">Repetir contrasena</span>
              <div className="r24-input-shell r24-input-shell-dark mt-2">
                <Lock size={16} className="text-brand-300/70" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="r24-input-base r24-input-base-dark"
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={showConfirmPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
                  className="text-brand-300/80 transition hover:text-brand-100"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                >
                  {showConfirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>

              {hasConfirm ? (
                <p className={`mt-1 text-[11px] ${passwordsMatch ? "text-emerald-300" : "text-rose-300"}`}>
                  {passwordsMatch ? "Las contrasenas coinciden" : "Las contrasenas no coinciden"}
                </p>
              ) : null}
            </label>

            <label className="inline-flex items-center gap-2 text-sm text-brand-100/70">
              <input
                type="checkbox"
                required
                className="r24-checkbox"
                checked={user.terms}
                onChange={(e) => setUser({ ...user, terms: e.target.checked })}
              />
              Acepto terminos y condiciones
            </label>

            {triedSubmit && !termsOk ? (
              <p className="-mt-2 text-[11px] text-rose-300">Debes aceptar terminos y condiciones</p>
            ) : null}

            <button
              type="submit"
              disabled={!canSubmit}
              className="w-full rounded-xl bg-accent-500 py-3 font-semibold text-brand-950 transition hover:bg-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <span className="flex justify-center">
                  <Spinner size="sm" ariaLabel="Creating account" />
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  Crear cuenta
                  <ArrowRight size={16} />
                </span>
              )}
            </button>
          </form>

          <p className="mt-6 text-sm text-brand-100/70">
            Ya tienes cuenta?{" "}
            <Link to={routes.login} className="font-medium text-accent-400 hover:text-accent-300">
              Inicia sesion
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
          <div className="absolute inset-0 bg-gradient-to-b from-accent-600/20 via-brand-950/35 to-brand-950" />
          <div className="absolute inset-0 flex items-end px-8 py-8 xl:px-10 xl:py-10">
            <div className="w-full max-w-[38rem] rounded-2xl border border-brand-200/20 bg-brand-950/45 p-5 backdrop-blur-sm xl:p-6">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-200/90">
                New Owner Experience
              </p>
              <h2 className="mt-3 text-2xl font-semibold leading-tight text-white xl:text-3xl">
                Publica mas rapido con un flujo conectado a Appwrite.
              </h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
