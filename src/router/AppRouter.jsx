import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";

import Article from "../pages/articles/Article";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/home/Home";
import Loading from "../utils/Loading";
import Ads from "../pages/ads/Ads";
import { PrivateRoute } from "./RoutesSettings";

const Sidebar = lazy(() => import("../components/sidebar/Sidebar"));
const Users = lazy(() => import("../pages/users/Users"));
const AppRouter = () => {
  const { user } = useSelector((state) => state.auth);

  let status = Object.keys(user).length > 0 ? true : false;
  return (
    <Suspense fallback={<Loading />}>
      <Router>
        <Routes>
          {status ? (
            <Route element={<PrivateRoute user={status} />}>
              <Route path="*" element={<SignedRoutes user={user} />} />
            </Route>
          ) : (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </>
          )}
          <Route path="*" element={<UnsignedRoutes />} />
        </Routes>
      </Router>
    </Suspense>
  );
};

const SignedRoutes = ({ user }) => {
  return (
    <Sidebar user={user}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
        <Route path="/anuncios" element={<Ads />} />
        <Route path="/perfil" element={<Users />} />
      </Routes>
    </Sidebar>
  );
};

const UnsignedRoutes = () => {
  return (
    <Sidebar>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/article/:id" element={<Article />} />
      </Routes>
    </Sidebar>
  );
};

// const AuthenticateRoutes = () => {
//   return (
//     <Routes>

//     </Routes>
//   );
// };

export default AppRouter;
