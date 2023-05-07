import React, { useEffect, useState } from "react";
import { BsPlusCircleFill, BsTrash } from "react-icons/bs";
import { MdOutlineRemoveCircleOutline, MdRemoveCircle } from "react-icons/md";

let options = [
  { label: "Wi-Fi", value: "wifi" },
  { label: "Televisión por cable", value: "tv" },
  { label: "Aire Acondicionado", value: "aac" },
  { label: "Agua potable", value: "water" },
  { label: "Luz", value: "light" },
  { label: "Gas", value: "gas" },
  { label: "Calefacción", value: "heating" },
  { label: "Cocina", value: "kitchen" },
  { label: "Estacionamiento", value: "parking" },
  { label: "Piscina", value: "pool" },
  { label: "Gimnasio", value: "gym" },
  { label: "Mascotas", value: "pets" },
  { label: "Amueblado", value: "furnished" },
  { label: "Lavadora", value: "washer" },
  { label: "Secadora", value: "dryer" },
  { label: "Ascensor", value: "elevator" },
  { label: "Fraccionamiento Privado", value: "private" },
  { label: "Portero", value: "doorman" },
];

const House = ({ characteristics, setCharacteristics }) => {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleSelectOption = (value) => {
    if (options.some((option) => option.label === value.label)) {
      if (services.includes(value)) {
        setServices(services.filter((service) => service !== value));
        return;
      }
      setServices([...services, value]);
    } else {
      options.push(value);
      setServices([...services, value]);
    }
  };

  useEffect(() => {
    setCharacteristics({ ...characteristics, services });
  }, [services]);

  const handleCloseMenu = () => {
    setShowMenu(false);
    setSearch("");
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label className="font-bold" htmlFor="rooms">
            Numero de habitaciones
          </label>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
            type="number"
            name="rooms"
            id="rooms"
            placeholder="Numero de habitaciones"
            value={characteristics.rooms}
            onChange={(e) =>
              setCharacteristics({ ...characteristics, rooms: e.target.value })
            }
          />
        </div>
        <div className="flex flex-col w-full">
          <label className="font-bold" htmlFor="bathrooms">
            Numero de baños
          </label>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
            type="number"
            name="bathrooms"
            id="bathrooms"
            placeholder="Numero de baños"
            value={characteristics.bathrooms}
            onChange={(e) =>
              setCharacteristics({
                ...characteristics,
                bathrooms: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col">
          <label className="font-bold" htmlFor="yard">
            Patio
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
            name="yard"
            id="yard"
            value={characteristics.yard}
            onChange={(e) =>
              setCharacteristics({ ...characteristics, yard: e.target.value })
            }
          >
            <option disabled value="">
              Selecciona un estado
            </option>
            <option value="0">No</option>
            <option value="1">Si</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex flex-col w-full">
          <label className="font-bold" htmlFor="terrace">
            Terraza
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
            name="terrace"
            id="terrace"
            value={characteristics.terrace}
            onChange={(e) =>
              setCharacteristics({
                ...characteristics,
                terrace: e.target.value,
              })
            }
          >
            <option disabled value="">
              Selecciona un estado
            </option>
            <option value="0">No</option>
            <option value="1">Si</option>
          </select>
        </div>
        <div className="flex flex-col w-full">
          <label className="font-bold" htmlFor="washingArea">
            Area de lavado
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
            name="washingArea"
            id="washingArea"
            value={characteristics.washingArea}
            onChange={(e) =>
              setCharacteristics({
                ...characteristics,
                washingArea: e.target.value,
              })
            }
          >
            <option disabled value="">
              Selecciona un estado
            </option>
            <option value="0">No</option>
            <option value="1">Si</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex flex-col w-full">
          <label className="font-bold" htmlFor="services">
            Servicios
          </label>
          <div className="flex flex-col md:flex-row gap-2 items-center pb-3 w-full">
            <input
              onClick={() => setShowMenu(true)}
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1 w-full md:w-1/2 capitalize"
              type="text"
              placeholder="Buscar"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value.charAt(0).toUpperCase().split(" ").join("") +
                    e.target.value.slice(1)
                )
              }
            />
            <div
              onMouseLeave={() => setShowMenu(false)}
              className="relative w-full md:max-w-[350px]"
            >
              {showMenu && (
                <div className="w-full flex flex-col gap-2 absolute md:-top-20 bg-white h-60 overflow-auto p-4 shadow-lg z-40">
                  <div className="flex justify-between gap-2">
                    <p className="font-bold">Resultados</p>
                    <span className="cursor-pointer ">
                      {showMenu && (
                        <MdRemoveCircle
                          className="w-6 h-6 text-red-500"
                          onClick={handleCloseMenu}
                        />
                      )}
                    </span>
                  </div>
                  {options.map((option) => {
                    if (
                      option.label.toLowerCase().includes(search.toLowerCase())
                    ) {
                      return (
                        <div
                          key={option.value}
                          onClick={() => handleSelectOption(option)}
                          className={`md:w-72 flex items-center justify-between gap-2 py-2 px-4 cursor-pointer transition ease-in-out duration-200 hover:scale-105 ${
                            services.includes(option)
                              ? "bg-primary-500 text-white "
                              : "bg-primary-200 "
                          } ${window.innerWidth < 768 ? "w-full" : ""} `}
                        >
                          <p className="text-sm whitespace-nowrap">
                            {option.label}
                          </p>
                          <div className="w-6 h-6">
                            {services.includes(option) ? (
                              <MdOutlineRemoveCircleOutline className="w-full h-full text-primary-200" />
                            ) : (
                              <span className="w-6 h-6">
                                <BsPlusCircleFill className="w-full h-full text-primary-500" />
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    }
                  })}
                  {!options.some((option) => option.label === search) &&
                    showMenu &&
                    search && (
                      <div className="max-w-sm">
                        <p className="w-auto text-sm text-gray-400 py-3">
                          No se encontraron resultados pero puedes agregarlo a
                          la lista de servicios extra.
                        </p>
                        <div
                          onClick={() =>
                            handleSelectOption({ label: search, value: search })
                          }
                          className={`flex items-center justify-between gap-2 py-2 px-4 cursor-pointer transition ease-in-out duration-200 hover:scale-105 ${
                            services.includes(search)
                              ? "bg-primary-500 text-white "
                              : "bg-primary-200 "
                          } ${window.innerWidth < 768 ? "w-full" : ""} `}
                        >
                          <p className="text-sm whitespace-nowrap">{search}</p>
                          <div className="w-6 h-6">
                            {services.includes(search) ? (
                              <MdOutlineRemoveCircleOutline className="w-full h-full text-primary-200" />
                            ) : (
                              <span className="w-6 h-6">
                                <BsPlusCircleFill className="w-full h-full text-primary-500" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {services.map((service) => (
              <div
                key={service.value}
                className="flex items-center justify-between gap-2 py-2 px-4 cursor-pointer transition ease-in-out duration-200 hover:scale-105 bg-primary-500 text-white"
              >
                <p className="text-sm whitespace-nowrap">{service.label}</p>
                <div className="w-6 h-6">
                  <MdOutlineRemoveCircleOutline
                    className="w-full h-full text-primary-200"
                    onClick={() => handleSelectOption(service)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default House;
