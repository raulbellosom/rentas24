import React, { useState } from "react";
import { MdAccountCircle } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../assets/icon.svg";
import { useDispatch } from "react-redux";
import { getSignIn } from "../../features/auth/authSlice";
import { handleSignIn } from "../../app/api";
import toast, { Toaster } from "react-hot-toast";
import { Spinner } from "flowbite-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [data, setData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const notifyError = (text) => toast.error(text);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const res = await handleSignIn(data);

    if (res?.status === 400 || res?.status === 401 || res?.status === 404) {
      notifyError(res.data.message);
      setIsLoading(false);
    }

    if (res?.status > 404) {
      notifyError("Ocurrió un error, intente nuevamente");
      setIsLoading(false);
    }

    if (res?.status === 200) {
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch(getSignIn(res));
      setIsLoading(false);
      navigate("/");
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-primary-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link to="/">
              <img className="mx-auto h-14 w-auto" src={Logo} alt="Workflow" />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-primary-700">
              Inicia sesión
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Accede a miles de anuncios de alquileres de todo el país.
            </p>
          </div>
          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
            action="#"
            method="POST"
          >
            <div className="rounded-md shadow-sm -space-y-px flex flex-col gap-4">
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
                    data.email.length >= 1
                      ? "invalid:border-red-500 invalid:border-2"
                      : "invalid:border-gray-300"
                  }`}
                  placeholder="Correo electrónico"
                  value={data.email}
                  onChange={(e) => {
                    setData({ ...data, email: e.target.value });
                  }}
                />
              </div>
              <div>
                <label htmlFor="password" className="text-sm">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  minLength={8}
                  autoComplete="current-password"
                  required
                  className={`appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:text-primary-500 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${
                    data.password.length >= 1
                      ? "invalid:border-red-500 invalid:border-2"
                      : "invalid:border-gray-300"
                  }`}
                  placeholder="Password"
                  value={data.password}
                  onChange={(e) => {
                    setData({ ...data, password: e.target.value });
                  }}
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
                  value={data.remember}
                  onChange={(e) => {
                    setData({ ...data, remember: e.target.checked });
                  }}
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Recordarme
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
            <div>
              {!isLoading ? (
                <button
                  type="submit"
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <MdAccountCircle
                      size={24}
                      className=" text-primary-500 group-hover:text-primary-400"
                      aria-hidden="true"
                    />
                  </span>
                  Inicar sesión
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
            <p className="text-sm text-gray-600">¿No tienes una cuenta?</p>
            <Link
              to="/register"
              className="ml-2 text-sm font-medium text-primary-600 hover:text-primary-500"
            >
              Regístrate
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
