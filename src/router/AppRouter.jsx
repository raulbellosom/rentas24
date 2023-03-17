import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Article from "../components/articles/Article";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";
import Home from "../components/home/Home";
import Sidebar from "../components/sidebar/Sidebar";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="*" element={<AppRoutes />} />
        <Route path="*" element={<AuthRoutes />} />
      </Routes>
    </Router>
  );
};

const AuthRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

const AppRoutes = () => {
  return (
    <Sidebar>
      <Routes>
        <Route path="/article" element={<Article />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Sidebar>
  );
};

export default AppRouter;
