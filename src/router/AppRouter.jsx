import { Suspense, lazy, useEffect } from "react";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import VerifyEmail from "../pages/auth/VerifyEmail";
import Loading from "../utils/Loading";
import { PrivateRoute, PublicOnlyRoute } from "./RoutesSettings";
import { getTypes } from "../features/articleTypes/typesSlice";
import { handleGetTypes } from "../app/api";
import { getRecurrencies } from "../features/recurrencies/recurrenciesSlice";
import { hasPublicAppwriteConfig } from "../env";
import AppErrorView from "../components/error/AppErrorView";
import { legacyRoutes, routes } from "./paths";
import AuthLayout from "../app/layouts/AuthLayout";
import AppLayout from "../app/layouts/AppLayout";

const Home = lazy(() => import("../pages/home/Home"));
const Announce = lazy(() => import("../pages/announces/Announce"));
const Articles = lazy(() => import("../pages/articles/Articles"));
const ShowArticles = lazy(() => import("../pages/articles/ShowArticles"));
const CreateArticle = lazy(() => import("../pages/articles/CreateArticle"));
const UpdateArticle = lazy(() => import("../pages/articles/UpdateArticle"));
const Users = lazy(() => import("../pages/users/Users"));

const LegacyPropertyRedirect = () => {
  const { id } = useParams();
  return <Navigate to={routes.propertyDetail(id)} replace />;
};

const LegacyOwnerPropertyEditRedirect = () => {
  const { id } = useParams();
  return <Navigate to={routes.ownerPropertyEdit(id)} replace />;
};

const LegacyOwnerPropertyViewRedirect = () => {
  const { id } = useParams();
  return <Navigate to={routes.ownerPropertyView(id)} replace />;
};

const AppRouter = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const hasSession = Boolean(
    token && user?.id && user?.enabled !== false && user?.emailVerified
  );

  useEffect(() => {
    if (!hasPublicAppwriteConfig) return;
    const hydrateTaxonomies = async () => {
      const res = await handleGetTypes();
      if (res.ok) {
        dispatch(getTypes(res));
        dispatch(getRecurrencies(res));
      }
    };
    hydrateTaxonomies();
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <Loading
          title="Cargando seccion"
          message="Estamos abriendo el modulo que solicitaste."
        />
      }
    >
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path={routes.verifyEmail} element={<VerifyEmail />} />
            <Route element={<PublicOnlyRoute user={hasSession} redirectTo={routes.ownerProperties} />}>
              <Route path={routes.login} element={<Login />} />
              <Route path={routes.register} element={<Register />} />
            </Route>
          </Route>

          <Route element={<AppLayout user={hasSession ? user : {}} />}>
            <Route index element={<Home />} />
            <Route path={routes.properties} element={<Home />} />
            <Route path={routes.propertyDetail()} element={<Announce />} />

            <Route element={<PrivateRoute user={hasSession} redirectTo={routes.login} />}>
              <Route path={routes.owner} element={<Home />} />
              <Route path={routes.ownerActivity} element={<Home />} />
              <Route path={routes.ownerProperties} element={<Articles />} />
              <Route path={routes.ownerPropertyNew} element={<CreateArticle />} />
              <Route path={routes.ownerPropertyEdit()} element={<UpdateArticle />} />
              <Route path={routes.ownerPropertyView()} element={<ShowArticles />} />
              <Route path={routes.ownerProfile} element={<Users />} />
            </Route>

            <Route path={legacyRoutes.myArticles} element={<Navigate to={routes.ownerProperties} replace />} />
            <Route path={legacyRoutes.createArticle} element={<Navigate to={routes.ownerPropertyNew} replace />} />
            <Route path={legacyRoutes.profile} element={<Navigate to={routes.ownerProfile} replace />} />
            <Route path={legacyRoutes.announce} element={<LegacyPropertyRedirect />} />
            <Route path={legacyRoutes.article} element={<LegacyPropertyRedirect />} />
            <Route path={legacyRoutes.editArticle} element={<LegacyOwnerPropertyEditRedirect />} />
            <Route path={legacyRoutes.viewArticle} element={<LegacyOwnerPropertyViewRedirect />} />

            <Route path="*" element={<AppErrorView code={404} />} />
          </Route>
        </Routes>
      </Router>
    </Suspense>
  );
};

export default AppRouter;
