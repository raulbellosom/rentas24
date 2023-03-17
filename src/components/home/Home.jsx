import React from "react";
import Cards from "../cards/Cards";

function Home() {
  return (
    <div>
      <div>
        <h1 className="px-5 md:px-3 text-xl font-bold pt-4 text-primary">
          Bienvenido
        </h1>
        <div className="px-5 md:px-3 flex flex-wrap items-center gap-10">
          <h2>Todos los articulos</h2>
          <div id="select" className="flex gap-2 items-center"></div>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 justify-items-center lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 pt-4">
        <Cards />
      </div>
    </div>
  );
}

export default Home;
