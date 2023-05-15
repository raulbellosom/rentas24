import React, { useEffect, useState } from "react";
import Loading from "../../utils/Loading";
import { Link, useParams } from "react-router-dom";
import { handleGetArticleById } from "../../app/api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Tabs } from "flowbite-react";
import { BsFillMegaphoneFill } from "react-icons/bs";
import { MdArticle } from "react-icons/md";
import ShowArticleDetails from "./show/ShowArticleDetails";
import { ListBulletIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import ShowAnounceDetails from "./show/ShowAnnounceDetails";

const ShowArticles = () => {
  const [article, setArticle] = useState({
    title: "",
    description: "",
    type_id: "",
    status: 0,
    photos: [],
    characteristics: {
      rooms: "",
      bathrooms: "",
      maxPeople: 1,
      services: [],
    },
    address: {
      street_1: "",
      street_2: "",
      number_ext: "",
      number_int: "",
      colony: "",
      city: "",
      state: "",
      country: "",
      postal_code: "",
    },
    announcement: {
      price: 0,
      currency: "MXN",
      is_recurrent: false,
      recurrency_id: "",
      isAdvance: false,
      advanceAmount: 0,
      start_date: "",
      end_date: "",
    },
    available: true,
  });
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const { articleTypes } = useSelector((state) => state.types);
  const notifyError = (message) => toast.error(message);
  const { id } = useParams();

  useEffect(() => {
    const getArticle = async (id) => {
      setLoading(true);
      try {
        const response = await handleGetArticleById(token, id);
        if (response.error) {
          notifyError(response.error);
        } else {
          setArticle(response.data.article);
        }
      } catch (error) {
        notifyError(error);
      } finally {
        setLoading(false);
      }
    };
    getArticle(id);
  }, [id, token]);

  if (loading) return <Loading />;
  return (
    <>
      <div className="p-5 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-lg">
          <h2 className="text-2xl font-bold text-blue-500 text-center md:text-left">
            {article.title}
            <p className="text-sm font-normal text-gray-500 text-center md:text-left">
              {articleTypes.find((type) => type.id === article.type_id).name}{" "}
              {" - "} {article.status ? "Activo" : "Inactivo"}
            </p>
          </h2>
          <div className="text-blue-500 flex gap-3">
            <Link
              to={`/editar-articulo/${id}`}
              className="text-white bg-blue-500 flex gap-2 items-center hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800  hover:scale-110 transition ease-in-out duration-200"
            >
              <PencilSquareIcon className="h-6 w-6" />
              Editar artículo
            </Link>
            <Link
              to={`/mis-articulos`}
              className="text-white flex gap-2 items-center bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:scale-110 transition ease-in-out duration-200"
            >
              <ListBulletIcon className="h-6 w-6" />
              Ir al listado
            </Link>
          </div>
        </div>
        <div className="bg-white my-5 p-5 rounded-lg">
          <Tabs.Group
            aria-label="Tabs with icons"
            style="underline"
            className="whitespace-nowrap overflow-x-auto flex flex-nowrap"
          >
            <Tabs.Item
              active={true}
              title="Información del artículo"
              icon={MdArticle}
            >
              <ShowArticleDetails
                article={article}
                articleTypes={articleTypes}
              />
            </Tabs.Item>
            <Tabs.Item title="Detalles del anuncio" icon={BsFillMegaphoneFill}>
              <ShowAnounceDetails article={article} />
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
    </>
  );
};

export default ShowArticles;
