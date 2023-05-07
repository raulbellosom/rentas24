import React, { useEffect, useState } from "react";
import Loading from "../../utils/Loading";
import { Link, useParams } from "react-router-dom";
import { handleGetArticleById } from "../../app/api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { ListBulletIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Button, Carousel, Modal } from "flowbite-react";

const ShowArticles = () => {
  const [article, setArticle] = useState({
    title: "",
    description: "",
    type_id: "",
    status: 0,
    photos: [],
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
          <h2 className="text-2xl font-bold text-blue-500">{article.title}</h2>
          <div className="text-blue-500 flex gap-3">
            <Link
              to={`/editar-articulo/${id}`}
              className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800  hover:scale-110 transition ease-in-out duration-200"
            >
              <PencilSquareIcon className="h-6 w-6" />
            </Link>
            <Link
              to={`/articulos`}
              className="text-white bg-blue-500 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm p-2 text-center dark:bg-blue-500 dark:hover:bg-blue-700 dark:focus:ring-blue-800 hover:scale-110 transition ease-in-out duration-200"
            >
              <ListBulletIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
        <div className="bg-white my-5 p-5 rounded-lg">
          <div className="flex flex-col gap-4">
            <p className="font-bold">
              Categoría:{" "}
              <span className="font-normal">
                {articleTypes.find((item) => item.id === article.type_id).name}
              </span>
            </p>
            <p className="font-bold">
              Estado:{" "}
              <span className="font-normal">
                {article.status ? "Activo" : "Inactivo"}
              </span>
            </p>
            <p className="font-bold">
              Descripción: <br />
              <span className="font-normal">{article.description}</span>
            </p>
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
          </div>
        </div>
      </div>
      <Modal show={showModal} onClose={toggleModal} size="4xl">
        <Modal.Header>
          {articleTypes.find((item) => item.id === article.type_id).name} -{" "}
          {article.title}
        </Modal.Header>
        <Modal.Body>
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
