import React, { useState, useEffect } from "react";
import { BsPlusCircleFill, BsTrash, BsX } from "react-icons/bs";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";
import Table from "../../components/tables/Table";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Modal from "../../components/modal/Modal";
import { toast } from "react-hot-toast";
import { handleDeleteArticle, handleGetArticlesByUserId } from "../../app/api";
import Loading from "../../utils/Loading";

const Articles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const { articleTypes } = useSelector((state) => state.types);
  const { token, user } = useSelector((state) => state.auth);
  const [data, setData] = useState([]);
  const [active, setActive] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [loading, setLoading] = useState(false);

  const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const toggle = () => {
    setActive(!active);
  };

  useEffect(() => {
    const getArticlesData = async () => {
      setLoading(true);
      try {
        const response = await handleGetArticlesByUserId(token, user.id);
        if (response.status === 200) {
          setArticles(response.data.articles);
        }
      } catch (error) {
        notifyError(error);
      } finally {
        setLoading(false);
      }
    };
    getArticlesData();
  }, [token, user.id]);

  useEffect(() => {
    setData(handleArticles());
  }, [articles]);

  const handleArticles = () => {
    return articles.map((article) => {
      return {
        id: article.id,
        name: article.title,
        description:
          article.description.length > 99
            ? article.description.substring(0, 99) + "..."
            : article.description,
        image: article.photos[0],
        category:
          articleTypes?.find((type) => type.id === article.type_id).name || "",
        status: article.status ? "Activo" : "Inactivo",
        updatedAt: new Date(article.updatedAt).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };
    });
  };

  const onDeleteArticle = (id) => {
    setActive(true);
    setItemSelected(id);
  };

  const deleteArticle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await handleDeleteArticle(token, itemSelected);
    setLoading(false);
    if (response.status === 201) {
      notify("Articulo eliminado con exitó.");
      const newArticles = articles.filter(
        (article) => article.id !== itemSelected
      );
      setArticles(newArticles);
      setActive(false);
    } else {
      notifyError("Error al eliminar el articulo");
    }
  };

  const onShowArticle = (id) => {
    navigate(`/ver-articulo/${id}`);
  };

  const onUpdateArticle = (id) => {
    navigate(`/editar-articulo/${id}`);
  };

  return (
    <div className="p-5 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-lg">
        <h2 className="text-2xl font-bold text-blue-500">Mis articulos</h2>
        <div className="text-blue-500 flex gap-3">
          <div className="flex justify-end text-blue-500">
            <Link
              to={"/crear-articulo"}
              className="flex items-center gap-2 bg-white p-2 rounded-full hover:scale-110 hover:bg-blue-600 hover:text-white transition ease-in-out duration-200"
            >
              <span>
                <BsPlusCircleFill className="w-6 h-6" />
              </span>
              <span className="font-bold whitespace-nowrap">
                Crear articulo
              </span>
            </Link>
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
        <Table
          headers={headers}
          content={data}
          actions={true}
          onDelete={onDeleteArticle}
          onShow={onShowArticle}
          onEdit={onUpdateArticle}
        />
      </div>
      {active && (
        <Modal active={active} toggle={toggle}>
          <form
            onSubmit={deleteArticle}
            className="flex flex-col items-center justify-center gap-10"
          >
            <div>
              <h2 className="text-2xl font-bold text-blue-500">
                ¿Estas seguro de eliminar este articulo?
              </h2>
              <p className="text-sm text-gray-500">
                Esta accion no se puede deshacer, este articulo se eliminara de
                forma permanente.
              </p>
            </div>
            <div className="flex gap-8 items-center">
              <div
                className="flex items-center px-8 justify-center gap-3 bg-white hover:bg-gray-300 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm p-2 text-center dark:bg-gray-500 dark:hover:bg-gray-700 dark:focus:gray-red-800 hover:scale-110 transition ease-in-out duration-200 cursor-pointer border border-gray-300"
                onClick={toggle}
              >
                <BsX className="w-6 h-6" />
                Cancelar
              </div>
              <button
                type="submit"
                className="text-white px-8 flex items-center justify-center gap-3 bg-red-500 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm p-2 text-center dark:bg-red-500 dark:hover:bg-red-700 dark:focus:ring-red-800 hover:scale-110 transition ease-in-out duration-200"
              >
                <BsTrash className="w-6 h-6" />
                Confirmar
              </button>
            </div>
          </form>
        </Modal>
      )}
      {loading && <Loading />}
    </div>
  );
};

export default Articles;

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
    name: "Ultima actualizacion",
    selector: "updatedAt",
    sortable: true,
  },
  {
    name: "Acciones",
    selector: "actions",
    sortable: false,
  },
];
