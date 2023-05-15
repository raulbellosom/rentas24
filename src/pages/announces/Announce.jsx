import React, { useEffect, useState } from "react";
import { MdBed, MdDoNotDisturbAlt, MdPeopleAlt } from "react-icons/md";
import { BsCheck, BsFillPersonFill } from "react-icons/bs";
import { FaBath } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";
import Carousel from "../../utils/Carousel";
import Loading from "../../utils/Loading";
import { handleGetAnnounce } from "../../app/api";
import { useSelector } from "react-redux";
import { Carousel as FlowCarousel, Modal } from "flowbite-react";

function Article() {
  const { id } = useParams();
  const { articleTypes } = useSelector((state) => state.types);
  const { user } = useSelector((state) => state.auth);
  const { recurrencies } = useSelector((state) => state.recurrencies);

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
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };

  useEffect(() => {
    const getArticle = async (id) => {
      setLoading(true);
      try {
        const response = await handleGetAnnounce(id);
        setArticle(response.data.articles);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        notifyError(error.response.data.message);
      }
    };
    getArticle(id);
  }, [id]);

  if (loading) return <Loading />;

  return (
    <div className="p-2">
      <div className="flex flex-col items-center justify-between">
        <div className="lg:grid lg:grid-cols-2 gap-4 w-full bg-white rounded-lg p-4">
          <div className="h-full lg:h-auto">
            <Carousel images={article.photos} />
            {/* <FlowCarousel>
              {article.photos.map((photo, i) => (
                <img
                  key={i}
                  className="w-full h-full object-contain rounded-lg"
                  src={photo}
                  alt="article"
                />
              ))}
            </FlowCarousel> */}
          </div>
          <div className="pt-5 flex flex-col gap-2">
            <div className="flex items-center justify-between flex-col md:flex-row gap-4">
              <h1 className="text-2xl font-bold tracking-tight text-primary-400 dark:text-white">
                {article.title}
                <span className="text-md font-normal text-gray-700 dark:text-gray-400">
                  {" "}
                  - {articleTypes[article.type_id - 1].name}
                </span>
              </h1>
              <div
                className={`flex items-center gap-2 ${
                  article.available ? "bg-green-500" : "bg-red-500"
                } text-white p-2 rounded-full`}
              >
                <span className="text-xl font-bold">
                  {article.available ? <BsCheck /> : <MdDoNotDisturbAlt />}
                </span>
                <p>{article.available ? "Disponible" : "No disponible"}</p>
              </div>
            </div>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              {article.description.split("\n").map((linea, i) => {
                return (
                  <React.Fragment key={i}>
                    {linea}
                    <br />
                  </React.Fragment>
                );
              })}
            </p>
            <div className="font-normal text-gray-700 dark:text-gray-400">
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Ubicación
              </h2>
              {article.address.street_1 && (
                <p className="font-normal">
                  <span>
                    {article.address.street_1}{" "}
                    {article.address.number_ext && article.address.number_ext}{" "}
                    {article.address.number_int &&
                      "Int " + article.address.number_int}
                    , {article.address.colony}, {article.address.city},{" "}
                    {article.address.state}, {article.address.country}, CP{" "}
                    {article.address.postal_code}
                  </span>
                  <br />
                  <span>
                    {article.address.street_2 &&
                      "Calle secundaria o referencia: " +
                        article.address.street_2}
                  </span>
                </p>
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                Características
              </h2>
              <ul className="py-2 flex flex-col md:flex-row md:flex-wrap md:items-center gap-6">
                <li className="flex items-center gap-2">
                  <MdBed size={24} className="text-primary-600" />
                  {article.characteristics.rooms} habitaciones
                </li>
                <li className="flex items-center gap-2">
                  <FaBath size={24} className="text-primary-600" />
                  {article.characteristics.bathrooms} baños
                </li>
                <li className="flex items-center gap-2">
                  <MdPeopleAlt size={24} className="text-primary-600" />
                  {article.characteristics.maxPeople} personas
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-between pt-4">
              <div className="flex items-center gap-3">
                <h2 className="text-2xl whitespace-nowrap font-bold tracking-tight text-gray-900 dark:text-white">
                  $
                  {parseFloat(article.announcement.price).toFixed(2) ===
                  article.announcement.price
                    ? article.announcement.price.replace(
                        /\d(?=(\d{3})+\.)/g,
                        "$&,"
                      )
                    : parseFloat(article.announcement.price)
                        .toFixed(2)
                        .replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
                  {article.announcement.currency}
                </h2>
                <span className="text-gray-500 whitespace-nowrap">
                  /{" "}
                  {recurrencies.find(
                    (recurrency) =>
                      recurrency.id == article.announcement.recurrency_id
                  ) ? (
                    recurrencies.find(
                      (recurrency) =>
                        recurrency.id == article.announcement.recurrency_id
                    ).name
                  ) : (
                    <>Pago unico</>
                  )}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-gray-500 whitespace-nowrap">
                  {article.announcement.isAdvance && (
                    <span className="text-gray-500 whitespace-nowrap">
                      Anticipo:{" "}
                      {parseFloat(article.announcement.advanceAmount).toFixed(
                        2
                      ) === article.announcement.advanceAmount
                        ? article.announcement.advanceAmount.replace(
                            /\d(?=(\d{3})+\.)/g,
                            "$&,"
                          )
                        : parseFloat(article.announcement.advanceAmount)
                            .toFixed(2)
                            .replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
                      {article.announcement.currency}
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-full bg-white rounded-lg p-4 pt-0">
          <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white py-2">
            Servicios
          </h5>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
            {article.characteristics.services.map((service, i) => (
              <p
                key={i}
                className="font-normal text-sm border border-gray-400 rounded-lg p-2 flex justify-between items-center hover:scale-105 transition ease-in-out duration-200 cursor-pointer"
              >
                {service.label}
                <span className="text-md font-light bg-primary-400 rounded-full text-white">
                  <BsCheck />
                </span>
              </p>
            ))}
          </div>
        </div>
        <Modal show={showModal} onClose={toggleModal} size="4xl">
          <Modal.Header>
            {articleTypes.find((item) => item.id === article.type_id).name} -{" "}
            {article.title}
          </Modal.Header>
          <Modal.Body className="bg-black/20">
            <div className="min-h-[60vh] h-96 md:min-h-[77vh] md:h-80">
              <FlowCarousel>
                {article.photos.map((photo, i) => (
                  <img
                    key={i}
                    className="w-full h-full object-contain rounded-lg"
                    src={photo}
                    alt="article"
                  />
                ))}
              </FlowCarousel>
            </div>
          </Modal.Body>
        </Modal>
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
                <Link to="/article" className="text-blue-600">
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
                <Link to="/article" className="text-blue-600">
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
                <Link to="/article" className="text-blue-600">
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
                <Link to="/article" className="text-blue-600">
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
