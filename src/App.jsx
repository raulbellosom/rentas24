import "./App.css";
import Cards from "./components/cards/Cards";
import Sidebar from "./components/sidebar/Sidebar";

function App() {
  const Content = () => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center lg:grid-cols-3 xl:grid-cols-4 gap-4 m-2 mt-4">
        <Cards />
      </div>
    );
  };
  return (
    <div className="min-h-screen">
      <Sidebar>
        <Content />
      </Sidebar>
    </div>
  );
}

export default App;
