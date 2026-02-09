import { Carousel } from "../../shared/ui";
import { ArrowRight, Bath, BedDouble, Users } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { routes } from "../../router/paths";

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
  const articleTypeName =
    articleTypes.find((type) => type.id === article.type_id)?.name ||
    "Sin categoria";

  return (
    <div className="flex max-w-sm flex-col justify-between rounded-2xl border border-brand-200/70 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div>
        <div className="h-56 overflow-hidden rounded-t-2xl">
          <Carousel>
            {article.photos.map((photo, i) => (
              <img className="h-full w-full object-cover" src={photo} alt="image" key={i} />
            ))}
          </Carousel>
        </div>
        <div className="p-4">
          <Link to={routes.propertyDetail(article.id)}>
            <h5 className="text-lg font-bold tracking-tight text-brand-950 transition hover:text-brand-700">
              {article.title.length > 40
                ? article.title?.substring(0, 20) + "..."
                : article.title}
            </h5>
          </Link>
          <p className="text-sm font-semibold text-brand-700">
            {articleTypeName} - {article.address.city}
          </p>
          <p className="text-justify font-normal text-brand-700">
            {article.description.length > 99
              ? article.description.substring(0, 99) + "..."
              : article.description}
          </p>
          <div className="mt-4 flex items-center justify-around gap-2">
            <div className="flex gap-2">
              <BedDouble className="h-5 w-5 text-primary-600" />
              <span className="text-sm text-primary-600">
                {article.characteristics.rooms}
              </span>
            </div>
            <div className="flex gap-2">
              <Users className="h-5 w-5 text-primary-600" />
              <span className="text-sm text-primary-600">
                {article.characteristics.maxPeople}
              </span>
            </div>
            <div className="flex gap-2">
              <Bath className="h-5 w-5 text-primary-600" />
              <span className="text-sm text-primary-600">
                {article.characteristics.bathrooms}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 p-4">
        <span className="text-lg font-bold text-primary-500">
          <span className="text-sm font-normal text-brand-950">
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
          to={routes.propertyDetail(article.id)}
          className="flex items-center gap-2 rounded-full bg-brand-100 p-2 text-primary-700 transition ease-in-out duration-200 hover:scale-110 hover:bg-primary-600 hover:text-white"
        >
          Ver mas
          <span>
            <ArrowRight className="h-5 w-5" />
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Cards;

