import { Link } from "react-router-dom";
import Carousel from "../../utils/Carouse";

function Cards({ cards = [] }) {
  return items.map((item, index) => (
    <div className="max-w-sm rounded-lg bg-white" key={index}>
      <div className="flex flex-col justify-items-center">
        {/* <img src={item.imgSrc} className="object-cover rounded-t-lg h-52" /> */}
        <div className="h-52">
          <Carousel images={item.imgSrc} />
        </div>
        <div className="p-4">
          <Link to="/article">
            <h5 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-500 delay-100 ease-in-out">
              {item.title}
            </h5>
          </Link>
          <p className="font-normal text-gray-700 dark:text-gray-400">
            {item.description?.substring(0, 100).concat("...")}

            <Link
              to="/article"
              className="text-secondary hover:text-blue-600 delay-100 ease-in-out"
            >
              Ver más
            </Link>
          </p>
        </div>
      </div>
    </div>
  ));
}

export default Cards;

const items = [
  {
    title: "Acogedora casa de 3 habitaciones en el corazón de la ciudad",
    description:
      "Esta hermosa casa de 3 habitaciones se encuentra en una ubicación privilegiada en el centro de la ciudad. La casa es acogedora y perfecta para una familia que busca vivir en una zona tranquila, pero con acceso fácil a todas las comodidades que ofrece la ciudad.",
    imgSrc: [
      "https://flowbite.com/docs/images/blog/image-2.jpg",
      "https://flowbite.com/docs/images/blog/image-1.jpg",
      "https://flowbite.com/docs/images/blog/image-3.jpg",
    ],
    imgAlt: "",
  },
  {
    title: "Moderna casa de 2 pisos en un barrio exclusivo",
    description:
      "Esta moderna casa de 2 pisos cuenta con acabados de alta calidad y está ubicada en un barrio exclusivo de la ciudad. Con amplios espacios y una excelente distribución, esta casa es perfecta para una familia que busca vivir con estilo y comodidad.",
    imgSrc: [
      "https://flowbite.com/docs/images/blog/image-3.jpg",
      "https://flowbite.com/docs/images/blog/image-1.jpg",
      "https://flowbite.com/docs/images/blog/image-2.jpg",
    ],
    imgAlt: "",
  },
  {
    title: "Encantadora casa estilo colonial con hermoso jardín",
    description:
      "Esta casa recién remodelada cuenta con 3 habitaciones, 2 baños y amplios espacios comunes. Está ubicada en una zona segura y tranquila, a solo unos minutos de los principales atractivos de la ciudad.",
    imgSrc: [
      "https://flowbite.com/docs/images/blog/image-2.jpg",
      "https://flowbite.com/docs/images/blog/image-1.jpg",
      "https://flowbite.com/docs/images/blog/image-3.jpg",
    ],
    imgAlt:
      "Esta hermosa casa de estilo colonial cuenta con un amplio jardín que es perfecto para disfrutar del aire libre y pasar tiempo en familia. La casa está ubicada en una zona tranquila y cuenta con amplios espacios interiores que ofrecen un ambiente acogedor y cálido.",
  },
  {
    title: "Casa de lujo con impresionantes vistas al mar",
    description:
      "Esta casa de lujo cuenta con impresionantes vistas al mar y está ubicada en una de las zonas más exclusivas de la ciudad. La casa cuenta con amplios espacios interiores y exteriores, lo que la hace perfecta para aquellos que buscan vivir en una casa amplia y con estilo.",
    imgSrc: [
      "https://flowbite.com/docs/images/blog/image-3.jpg",
      "https://flowbite.com/docs/images/blog/image-1.jpg",
      "https://flowbite.com/docs/images/blog/image-2.jpg",
    ],
    imgAlt: "",
  },
  {
    title: "Casa amueblada en renta, lista para habitar",
    description:
      "No pierdas tiempo y empieza a disfrutar de tu nuevo hogar desde el primer día. Esta casa completamente amueblada cuenta con 2 habitaciones, 1 baño, sala, comedor y cocina equipada. Además, incluye servicios de agua, luz y gas.",
    imgSrc: [
      "https://flowbite.com/docs/images/blog/image-1.jpg",
      "https://flowbite.com/docs/images/blog/image-2.jpg",
      "https://flowbite.com/docs/images/blog/image-3.jpg",
    ],
    imgAlt: "",
  },
  {
    title: "Casa en renta en zona exclusiva de la ciudad",
    description:
      "Vive rodeado de lujo y comodidad en esta casa ubicada en una de las zonas más exclusivas de la ciudad. Cuenta con 3 habitaciones, 2 baños, jardín y estacionamiento para 2 autos. Además, está cerca de los mejores restaurantes, tiendas y centros comerciales.",
    imgSrc: [
      "https://flowbite.com/docs/images/blog/image-2.jpg",
      "https://flowbite.com/docs/images/blog/image-3.jpg",
      "https://flowbite.com/docs/images/blog/image-1.jpg",
    ],
    imgAlt: "",
  },
  {
    title: "Casa en renta con amplio jardín y terraza",
    description:
      "Si eres amante de la naturaleza y de los espacios al aire libre, esta casa es para ti. Cuenta con un amplio jardín y terraza perfectos para disfrutar de la tranquilidad y el clima agradable de la zona. La casa tiene 4 habitaciones, 3 baños y estacionamiento para 2 autos.",
    imgSrc: [
      "https://flowbite.com/docs/images/blog/image-2.jpg",
      "https://flowbite.com/docs/images/blog/image-1.jpg",
      "https://flowbite.com/docs/images/blog/image-3.jpg",
    ],
    imgAlt: "",
  },
  {
    title: "Casa en renta con alberca privada",
    description:
      "Vive como un rey en esta casa con alberca privada. Ideal para los días de calor, la casa cuenta con 3 habitaciones, 2 baños, sala, comedor y cocina equipada. Además, está ubicada en una zona segura y tranquila, a solo unos minutos de la playa.",
    imgSrc: [
      "https://flowbite.com/docs/images/blog/image-3.jpg",
      "https://flowbite.com/docs/images/blog/image-1.jpg",
      "https://flowbite.com/docs/images/blog/image-2.jpg",
    ],
    imgAlt: "",
  },
  {
    title: "Casa en renta en conjunto cerrado con vigilancia",
    description:
      "Si buscas seguridad y privacidad, esta casa en conjunto cerrado es para ti. Cuenta con 2 habitaciones, 1 baño, estacionamiento para 1 auto y vigilancia las 24 horas del día. Además, está cerca de los principales centros comerciales y tiendas de la zona.",
    imgSrc: [
      "https://flowbite.com/docs/images/blog/image-1.jpg",
      "https://flowbite.com/docs/images/blog/image-2.jpg",
      "https://flowbite.com/docs/images/blog/image-3.jpg",
    ],
    imgAlt: "",
  },
  {
    title: "Casa en renta con amplios espacios y acabados de lujo",
    description:
      "Esta casa de estilo contemporáneo cuenta con amplios espacios y acabados de lujo. Tiene 4 habitaciones, 3 baños, sala de TV, jardín y estacionamiento para 2 autos. Ideal para familias que buscan comodidad y elegancia en un mismo lugar.",
    imgSrc: [
      "https://flowbite.com/docs/images/blog/image-1.jpg",
      "https://flowbite.com/docs/images/blog/image-3.jpg",
      "https://flowbite.com/docs/images/blog/image-2.jpg",
    ],
    imgAlt: "",
  },
  {
    title: "Casa en renta con vista a la montaña",
    description:
      "Descripción: Disfruta de la tranquilidad y la naturaleza en esta casa con vista a la montaña. Cuenta con 3 habitaciones, 2 baños, sala y comedor.",
    imgSrc: [
      "https://flowbite.com/docs/images/blog/image-2.jpg",
      "https://flowbite.com/docs/images/blog/image-1.jpg",
      "https://flowbite.com/docs/images/blog/image-3.jpg",
    ],
    imgAlt: "",
  },
];
