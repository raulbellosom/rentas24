import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import Logo from "../../assets/icon.svg";
import { handleSignUp } from "../../app/api";
import { useDispatch } from "react-redux";
import { getSignIn } from "../../features/auth/authSlice";
import { toast } from "react-hot-toast";
import { Spinner } from "flowbite-react";
import SelectCountryInput from "../../components/inputs/SelectCountryInput";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState([]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user.firstName || !user.lastName || !user.email || !user.password) {
      return notifyError("Todos los campos son obligatorios");
    }
    if (user.password.length < 8) {
      return notifyError("La contraseña debe tener al menos 8 caracteres");
    }
    if (!user.terms) {
      return notifyError("Debes aceptar los términos y condiciones");
    }

    setIsLoading(true);
    const res = await handleSignUp(user);

    if (
      res?.response?.status === 400 ||
      res?.response?.status === 401 ||
      res?.response?.status === 404
    ) {
      notifyError(res.response.data.message);
      setIsLoading(false);
    }

    if (res?.response?.status > 404) {
      notifyError(
        "Ocurrió un error, intente nuevamente. Si el problema persiste, contacte al administrador."
      );
      setIsLoading(false);
    }

    if (res?.status === 200) {
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch(getSignIn(res));
      setIsLoading(false);
      navigate("/");
    }
  };

  const getPhoneCode = (country) => {
    setSelectedCountry(country);
    setUser({ ...user, phone_code: "+" + country.phone_code });
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-primary-100 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-2">
          <div>
            <Link to="/">
              <img className="mx-auto h-14 w-auto" src={Logo} alt="Workflow" />
            </Link>
            <h2 className="mt-3 text-center text-3xl font-extrabold text-primary-700">
              Regístrate
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Accede a miles de anuncios de alquileres de todo el país.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
            method="POST"
          >
            <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-2">
              <div>
                <label htmlFor="firstName" className="text-sm">
                  Nombre
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="firstName"
                  required
                  minLength={3}
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:text-primary-500 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${
                    user.firstName.length >= 1
                      ? "invalid:border-red-500 invalid:border-2"
                      : "invalid:border-gray-300"
                  }`}
                  placeholder="Nombre (s)"
                  value={user.firstName}
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="lastName" className="text-sm">
                  Apellido (s)
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="lastName"
                  minLength={3}
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:text-primary-500 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${
                    user.lastName.length >= 1
                      ? "invalid:border-red-500 invalid:border-2"
                      : "invalid:border-gray-300"
                  }`}
                  placeholder="Apellido (s)"
                  value={user.lastName}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                />
              </div>
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-2">
                  <label htmlFor="phone_code" className="text-sm">
                    Código de país
                  </label>
                  <SelectCountryInput
                    getPhoneCode={getPhoneCode}
                    selectedCountry={selectedCountry}
                  />
                </div>
                <div className="col-span-3">
                  <label htmlFor="phone" className="text-sm">
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="phone"
                    minLength={10}
                    pattern="[0-9]{10}"
                    required
                    className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:text-primary-500 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${
                      user.phone.length >= 1
                        ? "invalid:border-red-500 invalid:border-2"
                        : "invalid:border-gray-300"
                    }`}
                    placeholder="Teléfono"
                    value={user.phone}
                    onChange={(e) =>
                      setUser({ ...user, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email-address" className="text-sm">
                  Correo electrónico
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:text-primary-500 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${
                    user.email.length >= 1
                      ? "invalid:border-red-500 invalid:border-2"
                      : "invalid:border-gray-300"
                  }`}
                  placeholder="Correo electrónico"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm">
                  Contraseña
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:text-primary-500 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${
                    user.password.length >= 1
                      ? "invalid:border-red-500 invalid:border-2"
                      : "invalid:border-gray-300"
                  }`}
                  placeholder="Contraseña"
                  value={user.password}
                  onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  value={user.remember}
                  onChange={(e) =>
                    setUser({ ...user, remember: e.target.checked })
                  }
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Mantener sesión iniciada
                </label>
              </div>
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-primary-600 hover:text-primary-500"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  value={user.terms}
                  onChange={(e) =>
                    setUser({ ...user, terms: e.target.checked })
                  }
                />
                <label
                  htmlFor="terms"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Acepto los{" "}
                  <a
                    href="#"
                    className="font-medium text-primary-600 hover:text-primary-500"
                  >
                    términos y condiciones
                  </a>
                </label>
              </div>
            </div>
            <div>
              {!isLoading ? (
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <MdOutlineArrowCircleRight
                      size={24}
                      className="text-primary-500 group-hover:text-primary-400"
                    />
                  </span>
                  Registrarse
                </button>
              ) : (
                <div className="flex justify-center">
                  <Spinner
                    aria-label="Extra large spinner example"
                    color={"info"}
                    size="xl"
                  />
                </div>
              )}
            </div>
          </form>
          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-600">¿Ya tienes una cuenta?</p>
            <Link
              to="/login"
              className="ml-2 text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
