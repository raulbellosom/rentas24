import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Article from "../pages/articles/Article";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/home/Home";
import Loading from "../utils/Loading";
import Ads from "../pages/ads/Ads";
import { AlreadyLoginRoute, PrivateRoute } from "./RoutesSettings";

const Sidebar = lazy(() => import("../components/sidebar/Sidebar"));
const Users = lazy(() => import("../pages/users/Users"));
const AppRouter = () => {
  const { token, user } = useSelector((state) => state.auth);
  let status = token ? true : false;
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Sidebar user={user}>
          <Routes>
            {!token ? (
              <Route
                path="*"
                element={
                  <AlreadyLoginRoute status={status}>
                    <AuthRoutes />
                  </AlreadyLoginRoute>
                }
              />
            ) : (
              <Route
                path="*"
                element={
                  <PrivateRoute status={status}>
                    <AppAuthRoutes />
                  </PrivateRoute>
                }
              />
            )}
            <Route path="/" element={<Home />} />
            <Route path="/article" element={<Article />} />
          </Routes>
        </Sidebar>
      </Router>
    </Suspense>
  );
};

const AppAuthRoutes = ({ user }) => {
  return (
    <Routes>
      <Route path="/perfil" element={<Users />} />
      <Route path="/anuncios" element={<Ads />} />
    </Routes>
  );
};

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};

export default AppRouter;
