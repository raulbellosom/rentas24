import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Dropzone from "../../utils/Dropzone";
import House from "./characteristics/House";
import {
  handleDeleteArticle,
  handleGetArticleById,
  handleUpdateArticle,
} from "../../app/api";
import { uploadArticleImages } from "../../utils/storage";
import Loading from "../../utils/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import ArticleAddress from "./characteristics/ArticleAddress";
import { options } from "../../utils/Services";
import {
  MdArrowBack,
  MdArticle,
  MdClose,
  MdDelete,
  MdSaveAlt,
} from "react-icons/md";
import { Modal, Tabs } from "../../shared/ui";
import Announcement from "./characteristics/Announcement";
import { BsFillMegaphoneFill } from "react-icons/bs";

const UpdateArticle = () => {
  const { articleTypes } = useSelector((state) => state.types);
  const { recurrencies } = useSelector((state) => state.recurrencies);

  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const { id } = useParams();

  const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const [loading, setLoading] = useState(false);
  const [active, setActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [address, setAddress] = useState({
    street_1: "",
    street_2: "",
    number_ext: "",
    number_int: "",
    colony: "",
    city: "",
    state: "",
    country: "",
    postal_code: "",
  });
  const [article, setArticle] = useState({
    title: "",
    description: "",
    type_id: "",
    status: 1,
  });

  const [characteristics, setCharacteristics] = useState({
    rooms: "",
    bathrooms: "",
    maxPeople: 1,
    services: [],
  });

  const [announcement, setAnnouncement] = useState({
    price: 0,
    currency: "MXN",
    is_recurrent: false,
    recurrency_id: "",
    isAdvance: false,
    advanceAmount: 0,
    start_date: "",
    end_date: "",
  });

  const [available, setAvailable] = useState(true);

  const categories = articleTypes.map((type) => {
    return (
      <option key={type.id} value={type.id}>
        {type.name}
      </option>
    );
  });

  useEffect(() => {
    if (id) {
      const getArticle = async () => {
        setLoading(true);
        try {
          const response = await handleGetArticleById(token, id);
          if (response.ok) {
            const article = response.data.article;
            setArticle({
              title: article.title,
              description: article.description,
              type_id: article.type_id,
              status: article.status,
            });
            setAddress({
              street_1: article.address.street_1,
              street_2: article.address.street_2,
              number_ext: article.address.number_ext,
              number_int: article.address.number_int,
              colony: article.address.colony,
              city: article.address.city,
              state: article.address.state,
              country: article.address.country,
              postal_code: article.address.postal_code,
            });
            setCharacteristics({
              rooms: article.characteristics.rooms,
              bathrooms: article.characteristics.bathrooms,
              maxPeople: article.characteristics.maxPeople,
              services: article.characteristics.services,
            });
            setFiles(article.photos);
            setAvailable(article.status === 1 ? true : false);
            setAnnouncement({
              price: article.announcement.price,
              currency: article.announcement.currency,
              is_recurrent: article.announcement.is_recurrent,
              recurrency_id: article.announcement.recurrency_id,
              isAdvance: article.announcement.isAdvance,
              advanceAmount: article.announcement.advanceAmount,
              start_date: article.announcement.start_date,
              end_date: article.announcement.end_date,
            });
          }
        } catch (error) {
          console.log(error);
        }
        setLoading(false);
      };
      getArticle();
    }
  }, [id, token]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (files.length === 0) {
      notifyError("Debes agregar al menos una imagen");
      setLoading(false);
      return;
    }
    if (article.title === "") {
      notifyError("Debes agregar un Título");
      setLoading(false);
      return;
    }
    if (article.description === "") {
      notifyError("Debes agregar una descripción");
      setLoading(false);
      return;
    }
    if (article.type_id === "") {
      notifyError("Debes seleccionar una categoría");
      setLoading(false);
      return;
    }
    if (
      address.street_1 === "" ||
      address.number_ext === "" ||
      address.colony === "" ||
      address.city === "" ||
      address.state === "" ||
      address.country === "" ||
      address.postal_code === ""
    ) {
      notifyError(
        "Debes agregar una dirección, rellenando por lo menos los campos que contienen un *"
      );
      setLoading(false);
      return;
    }

    const arrayImages = await handleUploadImages(files);

    const body = {
      title: article.title,
      description: article.description,
      address,
      type_id: article.type_id,
      status: article.status,
      characteristics,
      photos: arrayImages,
      announcement,
      available,
      user_id: user.id,
    };

    const res = await handleUpdateArticle(token, id, body);

    if (!res.ok) {
      setLoading(false);
      notifyError(res?.data?.message || res.error);
      return;
    }

    notify("Articulo actualizado correctamente");
    navigate("/owner/properties/" + id);
    setLoading(false);
  };

  const handleUploadImages = async (images) => {
    const uploads = await Promise.all(
      images.map(async (image) => {
        const res = await uploadArticleImages(image);
        return res;
      })
    );
    return uploads;
  };

  const handleAddImage = files.map((file, i) => {
    return (
      <div key={i}>
        <Dropzone
          setFiles={setFiles}
          files={files}
          file={file}
          filetype={["image/jpeg", "image/png", "image/jpg", "image/webp"]}
        />
      </div>
    );
  });

  const deleteArticle = async (e) => {
    e.preventDefault();
    setLoading(true);
    const response = await handleDeleteArticle(token, id);
    setLoading(false);
    if (response.ok) {
      notify("Articulo eliminado con exitó.");
      navigate("/owner/properties");
      setActive(false);
    } else {
      notifyError("Error al eliminar el articulo");
    }
  };

  const toggleModal = () => {
    setActive(!active);
  };

  return (
    <>
      <div className="w-full p-3 sm:p-5">
        <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-200 bg-white p-4 sm:p-5 md:flex-row md:items-center">
          <h2 className="text-2xl font-bold text-blue-500">
            Actualizar articulo
          </h2>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:gap-4">
            <button
              onClick={() => setActive(true)}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-white transition duration-300 ease-in-out hover:scale-[1.02] hover:bg-red-600 sm:w-auto"
            >
              <MdDelete className="w-6 h-6" />
              Eliminar articulo
            </button>
            <Modal show={active} onClose={toggleModal} size="xl">
              <Modal.Header>
                ¿Estas seguro de eliminar el articulo?
              </Modal.Header>
              <Modal.Body>
                <div className="flex flex-col gap-4">
                  <p className="text-gray-500">
                    Actualmente tienes seleccionado el articulo:{" "}
                    <span className="font-bold">{article.title}.</span> Si
                    eliminas este articulo los efectos serán irreversibles y no
                    podras recuperarlo despues.
                  </p>
                  <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-white transition duration-300 ease-in-out hover:scale-[1.01] hover:bg-red-600 sm:w-auto"
                      onClick={deleteArticle}
                    >
                      <MdDelete className="w-6 h-6" />
                      Eliminar articulo
                    </button>
                    <button
                      className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-white transition duration-300 ease-in-out hover:scale-[1.01] hover:bg-blue-600 sm:w-auto"
                      onClick={() => setActive(false)}
                    >
                      <MdClose className="w-6 h-6" />
                      Cancelar
                    </button>
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
        <div className="my-4 rounded-2xl border border-brand-200 bg-white p-4 sm:my-5 sm:p-5">
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
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-opacity duration-500 opacity-100">
                  <div className="flex flex-col w-full">
                    <label className="font-bold" htmlFor="title">
                      Título
                    </label>
                    <input
                      className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      type="text"
                      name="title"
                      id="title"
                      placeholder="Título del articulo"
                      value={article.title}
                      onChange={(e) =>
                        setArticle({ ...article, title: e.target.value })
                      }
                    />
                  </div>
                  <div className="flex flex-col w-full">
                    <label className="font-bold" htmlFor="category">
                      Categoría
                    </label>
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      name="category"
                      id="category"
                      value={article.type_id}
                      onChange={(e) =>
                        setArticle({ ...article, type_id: e.target.value })
                      }
                    >
                      <option disabled value="">
                        Selecciona una categoría
                      </option>
                      {categories}
                    </select>
                  </div>
                  <div className="flex flex-col">
                    <label className="font-bold" htmlFor="status">
                      Estado
                    </label>
                    <select
                      className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
                      name="status"
                      id="status"
                      value={article.status}
                      onChange={(e) =>
                        setArticle({ ...article, status: e.target.value })
                      }
                    >
                      <option disabled value="">
                        Selecciona un estado
                      </option>
                      <option value="1">Activo</option>
                      <option value="0">Inactivo</option>
                    </select>
                  </div>
                </div>
                <div className="flex flex-col transition-opacity duration-500 opacity-100">
                  <label className="font-bold" htmlFor="description">
                    descripción
                  </label>
                  <textarea
                    className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
                    name="description"
                    id="description"
                    placeholder="descripción del articulo"
                    value={article.description}
                    maxLength={2000}
                    onChange={(e) =>
                      setArticle({ ...article, description: e.target.value })
                    }
                    rows={8}
                  ></textarea>
                </div>
                <div className="flex flex-col transition-opacity duration-500 opacity-100">
                  <ArticleAddress address={address} setAddress={setAddress} />
                </div>
                <div className="flex flex-col transition-opacity duration-500 opacity-100">
                  <label className="font-bold" htmlFor="image">
                    Imagen
                    <span className="text-xs text-gray-400">
                      {" "}
                      (JPG, PNG, JPEG, WEBP)
                    </span>
                  </label>
                  <div className="grid min-h-max grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {files.length <= 4 && (
                      <Dropzone
                        setFiles={setFiles}
                        files={files}
                        filetype={[
                          "image/jpeg",
                          "image/png",
                          "image/jpg",
                          "image/webp",
                        ]}
                      />
                    )}
                    {handleAddImage}
                  </div>
                </div>
                <div className="flex flex-col transition-opacity duration-500 opacity-100">
                  <House
                    characteristics={characteristics}
                    setCharacteristics={setCharacteristics}
                    options={options}
                  />
                </div>
                <div className="flex flex-col-reverse items-stretch justify-center gap-3 md:flex-row md:items-center md:justify-end md:gap-4">
                  <div
                    onClick={() => navigate("/owner/properties/" + id)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-400 bg-white px-3 py-2 text-red-400 transition duration-300 ease-in-out hover:scale-[1.01] hover:border-red-600 hover:bg-red-600 hover:text-white md:w-auto"
                  >
                    <MdArrowBack className="w-6 h-6" />
                    Cancelar
                  </div>
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-white transition duration-300 ease-in-out hover:scale-[1.01] hover:bg-blue-600 md:w-auto">
                    <MdSaveAlt className="w-6 h-6" />
                    Guardar
                  </button>
                </div>
              </form>
            </Tabs.Item>
            <Tabs.Item title="Detalles del anuncio" icon={BsFillMegaphoneFill}>
              <form onSubmit={onSubmit} className="flex flex-col gap-4">
                <Announcement
                  setAnnouncement={setAnnouncement}
                  announcement={announcement}
                  setAvailable={setAvailable}
                  available={available}
                  recurrencies={recurrencies}
                />
                <div className="flex flex-col-reverse items-stretch justify-center gap-3 md:flex-row md:items-center md:justify-end md:gap-4">
                  <div
                    onClick={() => navigate("/owner/properties/" + id)}
                    className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-red-400 bg-white px-3 py-2 text-red-400 transition duration-300 ease-in-out hover:scale-[1.01] hover:border-red-600 hover:bg-red-600 hover:text-white md:w-auto"
                  >
                    <MdArrowBack className="w-6 h-6" />
                    Cancelar
                  </div>
                  <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-500 px-3 py-2 text-white transition duration-300 ease-in-out hover:scale-[1.01] hover:bg-blue-600 md:w-auto">
                    <MdSaveAlt className="w-6 h-6" />
                    Guardar
                  </button>
                </div>
              </form>
            </Tabs.Item>
          </Tabs.Group>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
};

export default UpdateArticle;

