import React, { useState, useEffect } from "react";
import { HiArrowLeft, HiArrowRight, HiSave } from "react-icons/hi";
import { useSelector } from "react-redux";
import Dropzone from "../../utils/Dropzone";
import House from "./characteristics/House";
import { handleCreateArticle, handleGetArticleById } from "../../app/api";
import { uploadArticleImages } from "../../utils/firebase";
import { v4 as uuidv4 } from "uuid";
import Loading from "../../utils/Loading";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import ArticleAddress from "./characteristics/ArticleAddress";
import { options } from "../../utils/Services";
import { Progress } from "flowbite-react";
import Announcement from "./characteristics/Announcement";

const CreateArticle = () => {
  const { articleTypes } = useSelector((state) => state.types);
  const { recurrencies } = useSelector((state) => state.recurrencies);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const notify = (message) => toast.success(message);
  const notifyError = (message) => toast.error(message);

  const [loading, setLoading] = useState(false);
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

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const idArticle = uuidv4();
    const arrayImages = await handleUploadImages(files, idArticle);

    const body = {
      id: idArticle,
      title: article.title,
      description: article.description,
      address,
      type_id: article.type_id,
      status: article.status,
      characteristics,
      announcement,
      available,
      photos: arrayImages,
      user_id: user.id,
    };

    const res = await handleCreateArticle(token, body);
    setLoading(false);

    if (res.status !== 200) {
      setLoading(false);
      notifyError(res.message);
      return;
    }
    if (res.status === 200) {
      notify("Articulo creado correctamente");
      setLoading(false);
      navigate("/ver-articulo/" + idArticle);
    }
    setLoading(false);
  };

  const handleUploadImages = async (images, idArticle) => {
    const uploads = await Promise.all(
      images.map(async (image) => {
        const res = await uploadArticleImages(image, user.id, idArticle);
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

  const [step, setStep] = useState(1);
  const [fade, setFade] = useState("fade");

  const handlePrevious = () => {
    setFade("fade-reverse");
    setStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    setFade("fade");
    setStep((prevStep) => prevStep + 1);
  };

  const handleStep = () => {
    switch (step) {
      case 1:
        if (
          article.title === "" ||
          article.status === "" ||
          article.type_id === ""
        ) {
          notifyError("Debes llenar todos los campos");
          return;
        }
        break;
      case 2:
        if (article.description === "") {
          notifyError("Debes agregar una descripción");
          return;
        }
        break;
      case 3:
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
          return;
        }
        break;
      case 4:
        if (files.length === 0) {
          notifyError("Debes agregar al menos una imagen");
          return;
        }
        break;
      case 5:
        if (
          characteristics.rooms === "" ||
          characteristics.bathrooms === "" ||
          characteristics.maxPeople === "" ||
          characteristics.services.length === 0
        ) {
          notifyError("Debes llenar todos los campos");
          return;
        }
        break;
      default:
        break;
    }
    handleNext();
  };

  const categories = articleTypes.map((type) => {
    return (
      <option key={type.id} value={type.id}>
        {type.name}
      </option>
    );
  });

  return (
    <>
      <div className="p-5 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-lg">
          <h2 className="text-2xl font-bold text-blue-500">Crear articulo</h2>
        </div>
        <div className="bg-white my-5 p-5 rounded-lg">
          <div className="pb-4">
            <Progress
              progress={step === 1 ? 10 : step * 15}
              size="lg"
              color="indigo"
            />
          </div>
          <form
            onSubmit={onSubmit}
            className="flex flex-col gap-4 overflow-hidden"
          >
            <div
              className={`flex flex-col gap-4 transition-opacity duration-500 opacity-100 ${fade} ${
                step === 1 ? "block" : "hidden"
              }`}
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-700">
                  Información general
                </h3>
                <p className="text-gray-500">
                  Escribe un nombre atractivo y breve para tu articulo y agrega
                  una categoria para que los usuarios puedan encontrarlo
                  facilmente.
                </p>
              </div>
              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="title">
                  Titulo
                </label>
                <input
                  className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  type="text"
                  name="title"
                  id="title"
                  placeholder="Titulo del articulo"
                  value={article.title}
                  onChange={(e) =>
                    setArticle({ ...article, title: e.target.value })
                  }
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="font-bold" htmlFor="category">
                  Categoria
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
                    Selecciona una categoria
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
            <div
              className={`flex flex-col gap-4 transition-opacity duration-500 opacity-100 ${fade} ${
                step === 2 ? "block" : "hidden"
              }`}
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-700">
                  Descripción del articulo
                </h3>
                <p className="text-gray-500">
                  Describe tu articulo de la mejor manera posible para que los
                  usuarios puedan conocerlo. Se lo más detallado posible y
                  agrega los aspectos más importantes de tu articulo.
                </p>
              </div>
              <div className="flex flex-col">
                <label className="font-bold" htmlFor="description">
                  Descripcion
                </label>
                <textarea
                  className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
                  name="description"
                  id="description"
                  placeholder="Descripcion del articulo"
                  value={article.description}
                  maxLength={2000}
                  onChange={(e) =>
                    setArticle({ ...article, description: e.target.value })
                  }
                  rows={8}
                ></textarea>
              </div>
            </div>
            <div
              className={`flex flex-col transition-opacity duration-500 opacity-100 ${fade} ${
                step === 3 ? "block" : "hidden"
              }`}
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-700">
                  Dirección del articulo
                </h3>
                <p className="text-gray-500">
                  Agrega la dirección para que los usuarios puedan saber donde
                  se encuentra tu articulo y aparezcas en los resultados de
                  busqueda por ubicación.
                </p>
              </div>
              <ArticleAddress address={address} setAddress={setAddress} />
            </div>
            <div
              className={`flex flex-col gap-4 transition-opacity duration-500 opacity-100 ${fade} ${
                step === 4 ? "block" : "hidden"
              }`}
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-700">
                  Imagenes del articulo
                </h3>
                <p className="text-gray-500">
                  Agrega imagenes de tu articulo para que los usuarios puedan
                  verlo y sepan como es. Trata de que las imagenes esten en
                  buena calidad e iluminación para que des una buena imagen.
                  Hasta un maximo de 5 imagenes.
                </p>
              </div>
              <label className="font-bold" htmlFor="image">
                Imagen
                <span className="text-xs text-gray-400">
                  {" "}
                  (JPG, PNG, JPEG, WEBP)
                </span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 min-h-max gap-4">
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
            <div
              className={`flex flex-col transition-opacity duration-500 opacity-100 ${fade} ${
                step === 5 ? "block" : "hidden"
              }`}
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-700">
                  Caracteristicas del articulo
                </h3>
                <p className="text-gray-500">
                  Agrega las caracteristicas y los servicios de tu articulo para
                  que los usuarios puedan saber como es y sepan si es lo que
                  buscan. Se lo más detallado posible.
                </p>
              </div>
              <House
                characteristics={characteristics}
                setCharacteristics={setCharacteristics}
                options={options}
              />
            </div>
            <div
              className={`flex flex-col transition-opacity duration-500 opacity-100 ${fade} ${
                step === 6 ? "block" : "hidden"
              }`}
            >
              <div className="flex flex-col">
                <h3 className="text-xl font-bold text-gray-700">
                  Datos de la publicación
                </h3>
                <p className="text-gray-500">
                  Establece el precio de tu articulo y la fecha de inicio y
                  expiración de tu publicación, asi como el tipo de recurrencia
                  de la misma.
                </p>
              </div>
              <Announcement
                setAnnouncement={setAnnouncement}
                announcement={announcement}
                recurrencies={recurrencies}
                setAvailable={setAvailable}
                available={available}
              />
            </div>
            <div
              className={`flex ${
                step === 1 ? "justify-end" : "justify-between"
              } items-center`}
            >
              {step > 1 && (
                <div
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 mt-1 flex justify-center items-center gap-2"
                  onClick={handlePrevious}
                >
                  <HiArrowLeft className="w-6 h-6" />
                  Anterior
                </div>
              )}
              {step < 6 ? (
                <div
                  className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 mt-1 flex justify-center items-center gap-2"
                  onClick={handleStep}
                >
                  Siguiente
                  <HiArrowRight className="w-6 h-6" />
                </div>
              ) : (
                <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-3 py-2 mt-1 flex justify-center items-center gap-2">
                  <HiSave className="w-6 h-6" />
                  Guardar
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
};

export default CreateArticle;
