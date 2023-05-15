import { Carousel, Modal } from "flowbite-react";
import React from "react";
import { BsCheck } from "react-icons/bs";
import { FaBed, FaToilet } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { useState } from "react";

const ShowArticleDetails = ({
  article = {
    id: "",
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
  },
  articleTypes = [],
}) => {
  const [showModal, setShowModal] = useState(false);
  const toggleModal = () => {
    setShowModal(!showModal);
  };
  return (
    <>
      <div className="flex flex-col gap-4 whitespace-normal">
        <div className="flex flex-col gap-4">
          {article.address.street_1 && (
            <p className="font-bold">
              Dirección: <br />
              <span className="font-normal">
                {article.address.street_1}{" "}
                {article.address.number_ext && article.address.number_ext}{" "}
                {article.address.number_int &&
                  "Int " + article.address.number_int}
                , {article.address.colony}, {article.address.city},{" "}
                {article.address.state}, {article.address.country}, CP{" "}
                {article.address.postal_code}
              </span>
              <br />
              <span className="font-normal">
                {article.address.street_2 &&
                  "Calle secundaria o referencia: " + article.address.street_2}
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
                  <p className="font-normal">{article.characteristics.rooms}</p>
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
          <p className="font-bold whitespace-normal">
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

export default ShowArticleDetails;
