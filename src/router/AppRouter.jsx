import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Article from "../pages/articles/Article";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/home/Home";
import Loading from "../utils/Loading";

const Sidebar = lazy(() => import("../components/sidebar/Sidebar"));
const EditUser = lazy(() => import("../pages/users/EditUser"));
const Ads = lazy(() => import("../pages/ads/Ads"));
const AppRouter = () => {
  const { token, user } = useSelector((state) => state.auth);

  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Routes>
          {!token && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
          <Route
            path="*"
            element={<AppRoutes isAuth={token ? true : false} user={user} />}
          />
        </Routes>
      </Router>
    </Suspense>
  );
};

const AppRoutes = ({ isAuth, user }) => {
  return (
    <Sidebar user={user}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/edit-user" element={<EditUser />} />
        <Route path="/anuncios" element={<Ads />} />
        {!isAuth && (
          <>
            <Route path="*" element={<Login />} />
          </>
        )}
        {isAuth && <Route path="/article" element={<Article />} />}
      </Routes>
    </Sidebar>
  );
};

export default AppRouter;
