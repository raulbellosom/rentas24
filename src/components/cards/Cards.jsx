import { Carousel } from "flowbite-react";
import { BsArrowRightShort } from "react-icons/bs";
import { FaBed, FaToilet } from "react-icons/fa";
import { MdPeopleAlt } from "react-icons/md";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function Cards({
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
  },
}) {
  const { articleTypes } = useSelector((state) => state.types);

  return (
    <div className="max-w-sm rounded-lg bg-white flex flex-col justify-between">
      <div>
        <div className="h-56">
          <Carousel>
            {article.photos.map((photo, i) => {
              return (
                <img
                  className="object-cover w-full h-full"
                  src={photo}
                  alt="image"
                  key={i}
                />
              );
            })}
          </Carousel>
        </div>
        <div className="p-4">
          <Link to={`/anuncio/${article.id}`}>
            <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-500 delay-100 ease-in-out">
              {article.title.length > 40
                ? article.title?.substring(0, 20) + "..."
                : article.title}
            </h5>
          </Link>
          <p className="text-sm text-gray-700 dark:text-gray-400 font-semibold">
            {articleTypes[article.type_id - 1]?.name} - {article.address.city}
          </p>
          <p className="font-normal text-gray-700 dark:text-gray-400 text-justify">
            {article.description.length > 99
              ? article.description.substring(0, 99) + "..."
              : article.description}
          </p>
          <div className="flex items-center justify-around gap-2 mt-4">
            <div className="flex gap-2">
              <FaBed className="w-5 h-5 text-primary-600" />
              <span className=" text-sm text-primary-600">
                {article.characteristics.rooms}
              </span>
            </div>
            <div className="flex gap-2">
              <MdPeopleAlt className="w-5 h-5 text-primary-600" />
              <span className=" text-sm text-primary-600">
                {article.characteristics.maxPeople}
              </span>
            </div>
            <div className="flex gap-2">
              <FaToilet className="w-5 h-5 text-primary-600" />
              <span className=" text-sm text-primary-600">
                {article.characteristics.bathrooms}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 p-4">
        <span className="text-lg font-bold text-primary-400 dark:text-white">
          <span className="text-sm font-normal text-gray-900">
            {article.announcement.currency}
          </span>
          <br />$
          {parseFloat(article.announcement.price).toFixed(2) ===
          article.announcement.price
            ? article.announcement.price.replace(/\d(?=(\d{3})+\.)/g, "$&,")
            : parseFloat(article.announcement.price)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
        </span>
        <Link
          to={`/anuncio/${article.id}`}
          className="flex items-center gap-2 border border-none text-primary-600 bg-white p-2 rounded-full hover:scale-110 hover:bg-primary-600 hover:text-white transition ease-in-out duration-200"
        >
          Ver más
          <span>
            <BsArrowRightShort className="w-5 h-5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Cards;
