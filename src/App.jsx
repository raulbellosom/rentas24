import { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import { handleGetArticles, handleProfile } from "./app/api";
import { getProfile, getSignOut } from "./features/auth/authSlice";
import AppRouter from "./router/AppRouter";
import { getArticles } from "./features/articles/articleSlice";
import { hasPublicAppwriteConfig } from "./env";
import AppErrorBoundary from "./components/error/AppErrorBoundary";
import { R24Toaster } from "./shared/ui";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const bootstrap = async () => {
      if (hasPublicAppwriteConfig) {
        await getUser();
        const response = await handleGetArticles();
        if (response.ok) {
          dispatch(getArticles(response));
        }
      }
    };
    bootstrap();
  }, []);

  const getUser = async () => {
    const current = window.localStorage.getItem("user");
    if (!current) return;

    const data = JSON.parse(current);
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
    <div className="min-h-screen">
      <AppErrorBoundary>
        <AppRouter />
      </AppErrorBoundary>
      <R24Toaster />
    </div>
  );
}

export default App;
