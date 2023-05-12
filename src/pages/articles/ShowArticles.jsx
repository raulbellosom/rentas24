import React, { useEffect, useState } from "react";
import Loading from "../../utils/Loading";
import { Link, useParams } from "react-router-dom";
import { handleGetArticleById } from "../../app/api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { ListBulletIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Carousel, Modal } from "flowbite-react";
import { BsCheck } from "react-icons/bs";
import { FaBed, FaToilet } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";

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

  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => {
    setShowModal(!showModal);
  };

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
              to={`/articulos`}
              className="text-white flex gap-2 items-center bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:scale-110 transition ease-in-out duration-200"
            >
              <ListBulletIcon className="h-6 w-6" />
              Ir al listado
            </Link>
          </div>
        </div>
        <div className="bg-white my-5 p-5 rounded-lg">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              {article.address.street_1 && (
                <p className="font-bold">
                  Dirección: <br />
                  <span className="font-normal">
                    {article.address.street_1}{" "}
                    {article.address.street_2 && article.address.street_2}{" "}
                    {article.address.number_ext}{" "}
                    {article.address.number_int && article.address.number_int}{" "}
                    {article.address.colony} {article.address.city}{" "}
                    {article.address.state} {article.address.country}{" "}
                    {article.address.postal_code}
                  </span>
                </p>
              )}
              <div className="flex flex-col">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <div className="flex flex-col justify-between gap-2">
                    <p className="font-bold">Habitaciones disponibles:</p>
                    <div className="flex flex-row gap-2 items-center">
                      <span className="text-md">
                        <FaBed className="text-primary-500 text-2xl" />
                      </span>
                      <p className="font-normal">
                        {article.characteristics.rooms}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-2">
                    <p className="font-bold">Baños disponibles:</p>
                    <div className="flex flex-row gap-2 items-center">
                      <span className="text-md">
                        <FaToilet className="text-primary-500 text-2xl" />
                      </span>
                      <p className="font-normal">
                        {article.characteristics.bathrooms}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col justify-between gap-2">
                    <p className="font-bold">Personas permitidas:</p>
                    <div className="flex flex-row gap-2 items-center">
                      <span>
                        <MdPeopleAlt className="text-primary-500 text-2xl" />
                      </span>
                      <p className="font-normal">
                        {article.characteristics.maxPeople}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <p className="font-bold">
                Descripción: <br />
                <span className="font-normal">
                  {article.description.split("\n").map((linea, i) => {
                    return (
                      <React.Fragment key={i}>
                        {linea}
                        <br />
                      </React.Fragment>
                    );
                  })}
                </span>
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold">Servicios:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {article.characteristics.services.map((service, i) => (
                  <p
                    key={i}
                    className="font-normal border border-gray-400 rounded-lg p-2 flex justify-between items-center hover:scale-105 transition ease-in-out duration-200 cursor-pointer"
                  >
                    {service.label}
                    <span className="text-md font-light bg-primary-400 rounded-full text-white">
                      <BsCheck />
                    </span>
                  </p>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-bold">Imagenes:</p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                {article.photos.map((photo, i) => (
                  <img
                    onClick={toggleModal}
                    key={i}
                    className="h-44 w-44 object-cover rounded-lg cursor-pointer"
                    src={photo}
                    alt="article"
                  />
                ))}
              </div>
            </div>
            {}
            <div className="flex gap-4 py-4">
              <p className="font-bold">
                Fecha de creación: <br />
                <span className="font-normal">
                  {new Date(article.createdAt).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </p>
              <p className="font-bold">
                Fecha de actualización: <br />
                <span className="font-normal">
                  {new Date(article.updatedAt).toLocaleDateString("es-MX", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  })}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Modal show={showModal} onClose={toggleModal} size="4xl">
        <Modal.Header>
          {articleTypes.find((item) => item.id === article.type_id).name} -{" "}
          {article.title}
        </Modal.Header>
        <Modal.Body className="bg-black/20">
          <div className="min-h-[60vh] h-96 md:min-h-[77vh] md:h-80">
            <Carousel>
              {article.photos.map((photo, i) => (
                <img
                  key={i}
                  className="w-full h-full object-contain rounded-lg"
                  src={photo}
                  alt="article"
                />
              ))}
            </Carousel>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ShowArticles;
