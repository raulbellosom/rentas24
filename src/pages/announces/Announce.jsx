import React, { useEffect, useMemo, useState } from "react";
import {
  Bath,
  BedDouble,
  CheckCircle2,
  CircleOff,
  Coins,
  MapPin,
  Users,
} from "lucide-react";
import { useParams } from "react-router-dom";
import Loading from "../../utils/Loading";
import { handleGetAnnounce } from "../../app/api";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Carousel, Modal } from "../../shared/ui";

function Announce() {
  const { id } = useParams();
  const { articleTypes } = useSelector((state) => state.types);
  const { recurrencies } = useSelector((state) => state.recurrencies);

  const [article, setArticle] = useState({
    title: "",
    description: "",
    type_id: "",
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
  const [showGallery, setShowGallery] = useState(false);

  const notifyError = (message) => toast.error(message);

  useEffect(() => {
    const getArticle = async () => {
      setLoading(true);
      try {
        const response = await handleGetAnnounce(id);
        if (response.ok) {
          setArticle(response.data.articles);
        } else {
          notifyError(response?.data?.message || response.error);
        }
      } catch (error) {
        notifyError(error.message);
      } finally {
        setLoading(false);
      }
    };
    getArticle();
  }, [id]);

  const recurrencyLabel = useMemo(() => {
    const recurrency = recurrencies.find(
      (item) => item.id === article.announcement.recurrency_id
    );
    return recurrency ? recurrency.name : "Pago único";
  }, [recurrencies, article.announcement.recurrency_id]);

  const typeLabel = useMemo(() => {
    return articleTypes.find((type) => type.id === article.type_id)?.name || "Propiedad";
  }, [articleTypes, article.type_id]);

  const addressLabel = useMemo(() => {
    const a = article.address;
    return [
      `${a.street_1 || ""} ${a.number_ext || ""} ${a.number_int ? `Int ${a.number_int}` : ""}`,
      a.colony,
      a.city,
      a.state,
      a.country,
      a.postal_code ? `CP ${a.postal_code}` : "",
    ]
      .map((part) => String(part || "").trim())
      .filter(Boolean)
      .join(", ");
  }, [article.address]);

  if (loading) return <Loading />;

  return (
    <div className="p-3 md:p-5">
      <div className="grid w-full gap-4 rounded-2xl border border-brand-200 bg-white p-4 lg:grid-cols-2">
        <div className="h-80 lg:h-auto">
          <Carousel>
            {article.photos.map((photo, i) => (
              <img
                key={i}
                className="h-full w-full cursor-zoom-in rounded-2xl object-cover"
                src={photo}
                alt="property"
                onClick={() => setShowGallery(true)}
              />
            ))}
          </Carousel>
        </div>

        <div className="flex flex-col gap-3 pt-2">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1 className="text-2xl font-bold tracking-tight text-brand-950">
              {article.title}
              <span className="text-base font-normal text-brand-600"> - {typeLabel}</span>
            </h1>
            <div
              className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold text-white ${
                article.available ? "bg-emerald-600" : "bg-rose-600"
              }`}
            >
              {article.available ? <CheckCircle2 size={16} /> : <CircleOff size={16} />}
              {article.available ? "Disponible" : "No disponible"}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-brand-700">
            {article.description.split("\n").map((linea, i) => (
              <React.Fragment key={i}>
                {linea}
                <br />
              </React.Fragment>
            ))}
          </p>

          <div>
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-brand-900">
              <MapPin size={17} />
              Ubicación
            </h2>
            <p className="mt-1 text-sm text-brand-700">{addressLabel || "Sin dirección registrada"}</p>
            {article.address.street_2 ? (
              <p className="mt-1 text-xs text-brand-600">Referencia: {article.address.street_2}</p>
            ) : null}
          </div>

          <div>
            <h2 className="text-base font-bold text-brand-900">Características</h2>
            <ul className="mt-2 flex flex-col gap-3 text-sm text-brand-700 md:flex-row md:flex-wrap md:items-center">
              <li className="inline-flex items-center gap-2">
                <BedDouble size={18} className="text-primary-600" />
                {article.characteristics.rooms} habitaciones
              </li>
              <li className="inline-flex items-center gap-2">
                <Bath size={18} className="text-primary-600" />
                {article.characteristics.bathrooms} baños
              </li>
              <li className="inline-flex items-center gap-2">
                <Users size={18} className="text-primary-600" />
                {article.characteristics.maxPeople} personas
              </li>
            </ul>
          </div>

          <div className="pt-2">
            <h2 className="inline-flex items-center gap-2 text-base font-bold text-brand-900">
              <Coins size={17} />
              Precio
            </h2>
            <p className="mt-1 text-2xl font-bold text-brand-950">
              $
              {Number(article.announcement.price || 0).toLocaleString("es-MX", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {article.announcement.currency}
            </p>
            <p className="text-sm text-brand-600">/{recurrencyLabel}</p>
            {article.announcement.isAdvance ? (
              <p className="mt-1 text-sm text-brand-700">
                Anticipo: $
                {Number(article.announcement.advanceAmount || 0).toLocaleString("es-MX", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {article.announcement.currency}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-brand-200 bg-white p-4">
        <h5 className="py-2 text-lg font-bold tracking-tight text-brand-900">Servicios</h5>
        {article.characteristics.services.length > 0 ? (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {article.characteristics.services.map((service, i) => (
              <p
                key={i}
                className="flex items-center justify-between rounded-xl border border-brand-200 p-2 text-sm text-brand-700"
              >
                {service.label}
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-brand-600">Sin servicios registrados.</p>
        )}
      </div>

      <Modal show={showGallery} onClose={() => setShowGallery(false)} size="4xl">
        <Modal.Header>
          {typeLabel} - {article.title}
        </Modal.Header>
        <Modal.Body className="bg-black/10">
          <div className="h-[64dvh] min-h-[280px] sm:min-h-[360px]">
            <Carousel>
              {article.photos.map((photo, i) => (
                <img
                  key={i}
                  className="h-full w-full rounded-xl object-contain"
                  src={photo}
                  alt="property"
                />
              ))}
            </Carousel>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Announce;
