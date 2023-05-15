import React from "react";
import { BsPlusCircleFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import Cards from "../../components/cards/Cards";
import Megafono from "../../resources/img/announce_megafono.png";
import { useSelector } from "react-redux";
function Home() {
  const { articles } = useSelector((state) => state.articles);

  return (
    <div className="p-2">
      <div className="flex flex-col-reverse xl:flex-row gap-4 md:gap-10">
        <div className="flex flex-col justify-center px-5 md:px-3">
          <h2 className="text-xl font-bold pt-4 text-primary-600">
            Bienvenido
          </h2>
          <h2 className="whitespace-nowrap">Todos los articulos</h2>
        </div>
        <div className="flex flex-col md:flex-row items-center p-5 gap-2 md:gap-20 text-white bg-gradient-to-r from-primary-400 to-primary-600 min-h-full w-full rounded-lg">
          <img
            src={Megafono}
            alt="megafono"
            className="h-40 w-40 p-2 bg-white/10 rounded-full"
          />
          <div className="flex flex-col gap-5 md:gap-3">
            <div className="max-w-lg">
              <h3 className="text-2xl pb-2 md:pb-1 font-bold">
                Crea tu anuncio <br />
              </h3>
              <p className="text-sm">
                Publica tu anuncio en Rentas24 <br />
                La forma más fácil de rentar tu propiedad. Da click en el botón
                para crear tu anuncio en un minuto.
              </p>
            </div>
            <Link to="/mis-articulos">
              <div className="w-full flex items-center justify-center text-primary-500">
                <button className="flex items-center gap-2 bg-white p-2 rounded-full hover:scale-110 transition ease-in-out duration-200">
                  <span>
                    <BsPlusCircleFill className="w-6 h-6" />
                  </span>
                  <span className="font-bold whitespace-nowrap">
                    Crear anuncio
                  </span>
                </button>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 justify-items-center lg:grid-cols-3 xl:grid-cols-4 gap-4 p-2 pt-4">
        {articles.map((article) => (
          <Cards key={article.id} article={article} />
        ))}
      </div>
    </div>
  );
}

export default Home;
