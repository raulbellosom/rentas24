import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import { handleGetArticles, handleProfile } from "./app/api";
import { getProfile, getSignOut } from "./features/auth/authSlice";
import AppRouter from "./router/AppRouter";
import { getArticles } from "./features/articles/articleSlice";
import { hasPublicAppwriteConfig } from "./env";
import AppErrorBoundary from "./components/error/AppErrorBoundary";
import { R24Toaster } from "./shared/ui";
import Loading from "./utils/Loading";

function App() {
  const dispatch = useDispatch();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    let isCancelled = false;

    const bootstrap = async () => {
      try {
        if (hasPublicAppwriteConfig) {
          await getUser();
        }
      } finally {
        if (!isCancelled) {
          setIsBootstrapping(false);
        }
      }

      if (hasPublicAppwriteConfig) {
        const response = await handleGetArticles();
        if (!isCancelled && response.ok) {
          dispatch(getArticles(response));
        }
      }
    };

    bootstrap();
    return () => {
      isCancelled = true;
    };
  }, [dispatch]);

  const getUser = async () => {
    const current = window.localStorage.getItem("user");
    if (!current) return;

    let data = null;
    try {
      data = JSON.parse(current);
    } catch {
      dispatch(getSignOut());
      return;
    }

    if (!data?.token) {
      dispatch(getSignOut());
      return;
    }

    const res = await handleProfile(data.token);
    if (res.ok) {
      const user = { token: data.token, user: res.data };
      window.localStorage.setItem("user", JSON.stringify(user));
      dispatch(getProfile(user));
      return;
    }

    dispatch(getSignOut());
  };

  return (
    <div className="r24-min-h-dvh">
      <AppErrorBoundary>
        {isBootstrapping ? (
          <Loading
            title="Recuperando sesion"
            message="Validando credenciales y preparando tu panel."
          />
        ) : (
          <AppRouter />
        )}
      </AppErrorBoundary>
      <R24Toaster />
    </div>
  );
}

export default App;
