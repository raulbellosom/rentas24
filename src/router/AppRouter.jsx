import { Suspense, lazy, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Article from "../pages/articles/Article";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/home/Home";
import Loading from "../utils/Loading";
import Ads from "../pages/ads/Ads";
import { PrivateRoute } from "./RoutesSettings";
import { getTypes } from "../features/articleTypes/typesSlice";
import { handleGetTypes } from "../app/api";
import { getRecurrencies } from "../features/recurrencies/recurrenciesSlice";

const Sidebar = lazy(() => import("../components/sidebar/Sidebar"));
const Articles = lazy(() => import("../pages/articles/Articles"));
const ShowArticles = lazy(() => import("../pages/articles/ShowArticles"));
const CreateArticle = lazy(() => import("../pages/articles/CreateArticle"));
const UpdateArticle = lazy(() => import("../pages/articles/UpdateArticle"));
const Users = lazy(() => import("../pages/users/Users"));

const AppRouter = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const types = articleTypesAndRecurrencies();
    types.then((res) => {
      dispatch(getTypes(res));
      dispatch(getRecurrencies(res));
    });
  }, []);

  const articleTypesAndRecurrencies = async () => {
    const response = await handleGetTypes();
    return response;
  };

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
        <Route path="/mis-articulos" element={<Articles />} />
        <Route path="/crear-articulo" element={<CreateArticle />} />
        <Route path="/editar-articulo/:id" element={<UpdateArticle />} />
        <Route path="/ver-articulo/:id" element={<ShowArticles />} />
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
