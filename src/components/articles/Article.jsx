import React from "react";
import { MdBed } from "react-icons/md";
import { BsFillPersonFill } from "react-icons/bs";
import { FaBath } from "react-icons/fa";
import { Link } from "react-router-dom";
import Carousel from "../../utils/Carouse";

function Article({ item }) {
  return (
    <div className="p-2">
      <div className="md:grid md:grid-cols-2 w-full bg-white rounded-lg p-4">
        <div className="h-72">
          <Carousel images={images} />
        </div>
        <div className=" p-5 flex flex-col gap-3">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Acogedora casa de 3 habitaciones en el corazón de la ciudad
          </h1>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            Esta hermosa casa de 3 habitaciones se encuentra en una ubicación
            privilegiada en el centro de la ciudad. La casa es acogedora y
            perfecta para una familia que busca vivir en una zona tranquila,
            pero con acceso fácil a todas las comodidades que ofrece la ciudad.
          </p>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
              Características
            </h2>
            <ul className="py-2 flex flex-col md:flex-row md:flex-wrap md:items-center gap-6">
              <li className="flex items-center gap-3">
                <MdBed size={32} className="text-primary" /> 3 habitaciones
              </li>
              <li className="flex items-center gap-3">
                <FaBath size={32} className="text-primary" />2 baños
              </li>
              <li className="flex items-center gap-3">
                <BsFillPersonFill size={32} className="text-primary" /> 200
                metros cuadrados
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                $ 1,200
              </h2>
              <span className="text-gray-500">/ mes</span>
            </div>
            <button className="bg-primary text-white px-4 py-2 rounded-lg">
              Contactar
            </button>
          </div>
        </div>
      </div>
      {/* content related */}
      <div className="w-full h-full bg-white rounded-lg p-4 mt-4">
        <h5 className="py-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          Artículos relacionados
        </h5>
        <div className="grid md:grid-cols-4 gap-5 w-full ">
          <div className="max-w-sm rounded-lg bg-white border-b-2 border-gray-200">
            <div className="flex flex-col justify-items-center">
              <img
                src="https://flowbite.com/docs/images/blog/image-1.jpg"
                className="object-cover rounded-t-lg h-32"
              />
              <div className="p-4">
                <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
                  Acogedora casa de 3 habitaciones en el corazón de la ciudad
                </h5>
                <Link to="/article" className="text-primary">
                  Ver más
                </Link>
              </div>
            </div>
          </div>
          <div className="max-w-sm rounded-lg bg-white border-b-2 border-gray-200">
            <div className="flex flex-col justify-items-center">
              <img
                src="https://flowbite.com/docs/images/blog/image-3.jpg"
                className="object-cover rounded-t-lg h-32"
              />
              <div className="p-4">
                <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
                  Acogedora casa de 3 habitaciones en el corazón de la ciudad
                </h5>
                <Link to="/article" className="text-primary">
                  Ver más
                </Link>
              </div>
            </div>
          </div>
          <div className="max-w-sm rounded-lg bg-white border-b-2 border-gray-200">
            <div className="flex flex-col justify-items-center">
              <img
                src="https://flowbite.com/docs/images/blog/image-2.jpg"
                className="object-cover rounded-t-lg h-32"
              />
              <div className="p-4">
                <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
                  Acogedora casa de 3 habitaciones en el corazón de la ciudad
                </h5>
                <Link to="/article" className="text-primary">
                  Ver más
                </Link>
              </div>
            </div>
          </div>
          <div className="max-w-sm rounded-lg bg-white border-b-2 border-gray-200">
            <div className="flex flex-col justify-items-center">
              <img
                src="https://flowbite.com/docs/images/blog/image-1.jpg"
                className="object-cover rounded-t-lg h-32"
              />
              <div className="p-4">
                <h5 className="text-md font-bold tracking-tight text-gray-900 dark:text-white">
                  Acogedora casa de 3 habitaciones en el corazón de la ciudad
                </h5>
                <Link to="/article" className="text-primary">
                  Ver más
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;

const images = [
  "https://flowbite.com/docs/images/blog/image-2.jpg",
  "https://flowbite.com/docs/images/blog/image-1.jpg",
  "https://flowbite.com/docs/images/blog/image-3.jpg",
];
