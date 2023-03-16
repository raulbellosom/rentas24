import { Label, Select } from "flowbite-react";
import React from "react";
import Cards from "../cards/Cards";

function Home() {
  return (
    <div>
      <div>
        <h1 className="px-3 text-xl font-bold mt-4 text-primary">Bienvenido</h1>
        <div className="px-3 flex items-center gap-10">
          <h2>Todos los articulos</h2>
          <div id="select" className="flex gap-2 items-center">
            <div className="mb-2 block">
              <Label htmlFor="countries" value="Ordenar por" />
            </div>
            <Select id="countries" required={true}>
              <option>Mas populares</option>
              <option>Mejor valorados</option>
              <option>Más recientes</option>
              <option>Más antiguos</option>
            </Select>
          </div>
          <div id="select" className="flex gap-2 items-center">
            <div className="mb-2 block">
              <Label htmlFor="countries" value="Ordenar por" />
            </div>
            <Select id="countries" required={true}>
              <option>Mas populares</option>
              <option>Mejor valorados</option>
              <option>Más recientes</option>
              <option>Más antiguos</option>
            </Select>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 justify-items-center lg:grid-cols-3 xl:grid-cols-4 gap-4 m-2 mt-4">
        <Cards />
      </div>
    </div>
  );
}

export default Home;
