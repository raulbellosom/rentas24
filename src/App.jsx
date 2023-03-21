import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import "./App.css";
import { getSignIn, getSignOut } from "./features/auth/authSlice";
import AppRouter from "./router/AppRouter";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const user = window.localStorage.getItem("user");
    if (user) {
      const data = JSON.parse(user);
      dispatch(getSignIn({ data }));
    } else {
      dispatch(getSignOut());
    }
  }, []);

  return (
    <div className="min-h-screen">
      <AppRouter />
      <Toaster />
    </div>
  );
}

export default App;
