import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Article from "../components/articles/Article";
import Login from "../components/auth/Login";
// import Register from "../components/auth/Register.jsx";
import Register   from "../components/users/Register.jsx";
import Home from "../components/home/Home";
import Sidebar from "../components/sidebar/Sidebar";

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<AppRoutes />} />
      </Routes>
    </Router>
  );
};

const AppRoutes = () => {
  return (
    <Sidebar>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/add-user" element={<Register />} />
        <Route path="/article" element={<Article />} />
      </Routes>
    </Sidebar>
  );
};

export default AppRouter;
