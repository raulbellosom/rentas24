import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import AppRouter from "./router/AppRouter";

function App() {
  return (
    <div className="min-h-screen">
      <AppRouter />
    </div>
  );
}

export default App;
