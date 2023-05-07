import React, { useState } from "react";
import { HiSave } from "react-icons/hi";
import { useSelector } from "react-redux";
import Dropzone from "../../utils/Dropzone";
import House from "./characteristics/House";
import { handleCreateArticle } from "../../app/api";
import { uploadArticleImages } from "../../utils/firebase";
import { v4 as uuidv4 } from "uuid";
import Loading from "../../utils/Loading";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import ArticleAddress from "./characteristics/ArticleAddress";

const CreateArticle = () => {
  const { articleTypes } = useSelector((state) => state.types);
  const { user, token } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const notify = (message) => toast(message);
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
    yard: "",
    services: "",
  });

  const categories = articleTypes.map((type) => {
    return (
      <option key={type.id} value={type.id}>
        {type.name}
      </option>
    );
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (files.length === 0) {
      notifyError("Debes agregar al menos una imagen");
      setLoading(false);
      return;
    }
    if (article.title === "") {
      notifyError("Debes agregar un titulo");
      setLoading(false);
      return;
    }
    if (article.description === "") {
      notifyError("Debes agregar una descripcion");
      setLoading(false);
      return;
    }
    if (article.type_id === "") {
      notifyError("Debes seleccionar una categoria");
      setLoading(false);
      return;
    }
    if (
      (address.street_1 || address.number_ext === "" || address.colony === "",
      address.city === "",
      address.state === "",
      address.country === "",
      address.postal_code === "")
    ) {
      notifyError(
        "Debes agregar una dirección, rellenando por lo menos los campos que contienen un *"
      );
      setLoading(false);
      return;
    }

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
      photos: arrayImages,
      user_id: user.id,
    };

    const res = await handleCreateArticle(token, body);
    console.log(res);
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

  return (
    <>
      <div className="p-5 w-full">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-5 rounded-lg">
          <h2 className="text-2xl font-bold text-blue-500">Crear articulo</h2>
        </div>
        <div className="bg-white my-5 p-5 rounded-lg">
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-4">
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
                rows={5}
              ></textarea>
            </div>
            <ArticleAddress address={address} setAddress={setAddress} />
            <div className="flex flex-col">
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

            <div className="flex flex-col">
              <House
                characteristics={characteristics}
                setCharacteristics={setCharacteristics}
              />
            </div>

            <div className="py-4">
              <button className="bg-blue-500 w-full md:w-1/2 lg:w-1/3 hover:bg-blue-600 text-white rounded-lg px-3 py-2 mt-1 flex justify-center items-center gap-2">
                <HiSave className="w-6 h-6" />
                Guardar
              </button>
            </div>
          </form>
        </div>
      </div>
      {loading && <Loading />}
    </>
  );
};

export default CreateArticle;