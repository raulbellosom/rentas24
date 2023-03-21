import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdOutlineArrowCircleRight } from "react-icons/md";
import Logo from "../../assets/icon.svg";
import { handleSignUp } from "../../app/api";
import { useDispatch } from "react-redux";
import { getSignIn } from "../../features/auth/authSlice";
import { toast } from "react-hot-toast";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    remember: false,
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

    const res = await handleSignUp(user);

    if (res?.status === 400 || res?.status === 401 || res?.status === 404) {
      notifyError(res.data.message);
    }

    if (res?.status > 404) {
      notifyError("Ocurrió un error, intente nuevamente");
    }

    if (res?.status === 200) {
      localStorage.setItem("user", JSON.stringify(res.data));
      dispatch(getSignIn(res));
      navigate("/");
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <Link to="/">
              <img className="mx-auto h-14 w-auto" src={Logo} alt="Workflow" />
            </Link>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
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
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="firstName" className="sr-only">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  autoComplete="firstName"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:text-indigo-500 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="First Name"
                  value={user.firstName}
                  onChange={(e) =>
                    setUser({ ...user, firstName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="lastName" className="sr-only">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  autoComplete="lastName"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:text-indigo-500 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Last Name"
                  value={user.lastName}
                  onChange={(e) =>
                    setUser({ ...user, lastName: e.target.value })
                  }
                />
              </div>
              <div>
                <label htmlFor="phone" className="sr-only">
                  Phone
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="phone"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:text-indigo-500 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Phone"
                  value={user.phone}
                  onChange={(e) => setUser({ ...user, phone: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:text-indigo-500 focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  value={user.email}
                  onChange={(e) => setUser({ ...user, email: e.target.value })}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
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
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  value={user.rememberMe}
                  onChange={(e) =>
                    setUser({ ...user, rememberMe: e.target.checked })
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
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <MdOutlineArrowCircleRight
                    size={24}
                    className="text-indigo-500 group-hover:text-indigo-400"
                  />
                </span>
                Sign in
              </button>
            </div>
          </form>
          <div className="flex items-center justify-center">
            <p className="text-sm text-gray-600">¿Ya tienes una cuenta?</p>
            <Link
              to="/login"
              className="ml-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
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
