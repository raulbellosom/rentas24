import React from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import Table from "../../components/tables/Table";
const headers = [
  {
    name: "Imagen",
    selector: "image",
    sortable: false,
  },
  {
    name: "Nombre",
    selector: "name",
    sortable: true,
  },
  {
    name: "Descripcion",
    selector: "description",
    sortable: true,
  },
  {
    name: "Precio",
    selector: "price",
    sortable: true,
  },
  {
    name: "Categoria",
    selector: "category",
    sortable: true,
  },
  {
    name: "Estado",
    selector: "status",
    sortable: true,
  },
  {
    name: "Fecha de publicacion",
    selector: "createdAt",
    sortable: true,
  },
  {
    name: "Acciones",
    selector: "actions",
    sortable: false,
  },
];

// Cargar datos de la API
const data = [
  {
    image: "https://picsum.photos/200/300",
    name: "Anuncio 1",
    description: "Descripcion del anuncio 1",
    price: "100",
    category: "Categoria 1",
    status: "Activo",
    createdAt: "2021-10-10",
  },
  {
    image: "https://picsum.photos/200/300",
    name: "Anuncio 2",
    description: "Descripcion del anuncio 2",
    price: "200",
    category: "Categoria 2",
    status: "Activo",
    createdAt: "2021-10-10",
  },
  {
    image: "https://picsum.photos/200/300",
    name: "Anuncio 3",
    description: "Descripcion del anuncio 3",
    price: "300",
    category: "Categoria 3",
    status: "Activo",
    createdAt: "2021-10-10",
  },
];

const Ads = () => {
  return (
    <div className="p-5 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-500">Mis anuncios</h2>
        <div className="text-blue-500 flex gap-3">
          <div className="flex justify-end text-blue-500">
            <button className="flex items-center gap-2 bg-white p-2 rounded-full hover:scale-110 hover:bg-blue-600 hover:text-white transition ease-in-out duration-200">
              <span>
                <BsPlusCircleFill className="w-6 h-6" />
              </span>
              <span className="font-bold whitespace-nowrap">Crear anuncio</span>
            </button>
          </div>
          <div>
            <button
              type="button"
              className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800  hover:scale-110 transition ease-in-out duration-200"
            >
              <Squares2X2Icon className="h-6 w-6" />
            </button>
          </div>
          <div>
            <button
              type="button"
              className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:scale-110 transition ease-in-out duration-200"
            >
              <ListBulletIcon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white my-5 p-5 rounded-lg">
        <Table headers={headers} content={data} actions={true} />
      </div>
    </div>
  );
};

export default Ads;
