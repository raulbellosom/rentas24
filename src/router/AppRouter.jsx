import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Article from "../components/articles/Article";
import Home from "../components/Home/Home";
import Sidebar from "../components/sidebar/Sidebar";

const AppRouter = () => {
  return (
    <Router>
      <Sidebar>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article" element={<Article />} />
        </Routes>
      </Sidebar>
    </Router>
  );
};

export default AppRouter;
