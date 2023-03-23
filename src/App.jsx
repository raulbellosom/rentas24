import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import "./App.css";
import { handleProfile } from "./app/api";
import { getSignIn, getSignOut } from "./features/auth/authSlice";
import AppRouter from "./router/AppRouter";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const user = window.localStorage.getItem("user");
    if (user) {
      const data = JSON.parse(user);
      const res = await handleProfile(data.token);

      if (res.status === 200) {
        return dispatch(getSignIn({ data }));
      }
      return dispatch(getSignOut());
    }
  };

  return (
    <div className="min-h-screen">
      <AppRouter />
      <Toaster />
    </div>
  );
}

export default App;
