import React, { useEffect, useMemo, useState } from "react";
import { Grid2X2, List, PlusCircle, Trash2, X } from "lucide-react";
import Table from "../../components/tables/Table";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { handleDeleteArticle, handleGetArticlesByUserId } from "../../app/api";
import Loading from "../../utils/Loading";
import ArticleCards from "../../components/cards/ArticleCards";
import { EmptyState, Modal } from "../../shared/ui";

const Articles = () => {
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const { articleTypes } = useSelector((state) => state.types);
  const { token, user } = useSelector((state) => state.auth);
  const [active, setActive] = useState(false);
  const [itemSelected, setItemSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [viewType, setViewType] = useState(false);

  const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    const getArticlesData = async () => {
      setLoading(true);
      try {
        const response = await handleGetArticlesByUserId(token, user.id);
        if (response.ok) {
          setArticles(response.data.articles);
        }
      } catch (error) {
        notifyError(error?.message || "No se pudieron cargar las propiedades");
      } finally {
        setLoading(false);
      }
    };
    getArticlesData();
  }, [token, user.id]);

  const data = useMemo(() => {
    return articles.map((article) => ({
      id: article.id,
      name: article.title,
      description:
        article.description.length > 99
          ? `${article.description.substring(0, 99)}...`
          : article.description,
      image: article.photos[0],
      category: articleTypes?.find((type) => type.id === article.type_id)?.name || "",
      status: article.status ? "Activo" : "Inactivo",
      updatedAt: new Date(article.updatedAt).toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    }));
  }, [articles, articleTypes]);

  const onDeleteArticle = (id) => {
    setActive(true);
    setItemSelected(id);
  };

  const deleteArticle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await handleDeleteArticle(token, itemSelected);
    setLoading(false);
    if (response.ok) {
      notify("Propiedad eliminada correctamente");
      const newArticles = articles.filter((article) => article.id !== itemSelected);
      setArticles(newArticles);
      setActive(false);
    } else {
      notifyError("Error al eliminar la propiedad");
    }
  };

  const onShowArticle = (id) => {
    navigate(`/owner/properties/${id}`);
  };

  const onUpdateArticle = (id) => {
    navigate(`/owner/properties/${id}/edit`);
  };

  const changeViewType = () => {
    const next = !viewType;
    setViewType(next);
    localStorage.setItem("viewType", String(next));
  };

  useEffect(() => {
    const viewTypeStorage = localStorage.getItem("viewType");
    if (viewTypeStorage) {
      setViewType(viewTypeStorage === "true");
    }
  }, []);

  return (
    <div className="w-full p-3 sm:p-5">
      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-200 bg-white p-4 sm:p-5 md:flex-row md:items-center">
        <h2 className="text-2xl font-bold text-brand-950">Mis propiedades</h2>
        <div className="flex w-full items-center gap-3 text-brand-700 sm:w-auto">
          <Link
            to="/owner/properties/new"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-2 font-semibold transition hover:scale-[1.01] hover:bg-brand-950 hover:text-white sm:flex-none"
          >
            <PlusCircle className="h-5 w-5" />
            Crear propiedad
          </Link>
          <button
            type="button"
            onClick={changeViewType}
            className="rounded-xl bg-brand-950 p-2 text-white transition hover:bg-brand-800"
          >
            {viewType ? <List className="h-5 w-5" /> : <Grid2X2 className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {articles.length <= 0 ? (
        <div className="my-5">
          <EmptyState
            title="Aún no tienes propiedades"
            message="Comienza publicando tu primera propiedad para aparecer en el catálogo público."
            action={
              <Link
                to="/owner/properties/new"
                className="inline-flex items-center gap-2 rounded-full bg-brand-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800"
              >
                <PlusCircle className="h-4 w-4" />
                Crear propiedad
              </Link>
            }
          />
        </div>
      ) : (
        <div className="my-5 rounded-2xl border border-brand-200 bg-white p-4 sm:p-5">
          {viewType ? (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {data.map((article) => (
                <ArticleCards
                  key={article.id}
                  article={article}
                  onDelete={onDeleteArticle}
                  onShow={onShowArticle}
                  onEdit={onUpdateArticle}
                />
              ))}
            </div>
          ) : (
            <Table
              headers={headers}
              content={data}
              actions={true}
              onDelete={onDeleteArticle}
              onShow={onShowArticle}
              onEdit={onUpdateArticle}
            />
          )}
        </div>
      )}

      <Modal show={active} onClose={() => setActive(false)} size="lg">
        <Modal.Header>¿Seguro que deseas eliminar esta propiedad?</Modal.Header>
        <Modal.Body>
          <form onSubmit={deleteArticle} className="flex flex-col items-center gap-6">
            <p className="text-sm text-brand-700">
              Esta acción no se puede deshacer y la propiedad se eliminará permanentemente.
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setActive(false)}
                className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-100"
              >
                <X className="h-4 w-4" />
                Cancelar
              </button>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-700"
              >
                <Trash2 className="h-4 w-4" />
                Confirmar
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

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
    name: "Descripción",
    selector: "description",
    sortable: true,
  },
  {
    name: "Categoría",
    selector: "category",
    sortable: true,
  },
  {
    name: "Estado",
    selector: "status",
    sortable: true,
  },
  {
    name: "Última actualización",
    selector: "updatedAt",
    sortable: true,
  },
  {
    name: "Acciones",
    selector: "actions",
    sortable: false,
  },
];
