import React, { useEffect, useState } from "react";
import {
  BsCheck,
  BsPlug,
  BsPlus,
  BsPlusCircle,
  BsPlusCircleFill,
} from "react-icons/bs";
import { MdOutlineRemoveCircleOutline, MdRemoveCircle } from "react-icons/md";

const House = ({
  characteristics = {
    rooms: "",
    bathrooms: "",
    maxPeople: 1,
    services: [],
  },
  setCharacteristics,
  options = [],
}) => {
  const [search, setSearch] = useState("");
  const [showMenu, setShowMenu] = useState(false);

  const handleSelectOption = (value) => {
    if (options.some((option) => option.label === value.label)) {
      if (characteristics.services.find((item) => item.label === value.label)) {
        setCharacteristics({
          ...characteristics,
          services: characteristics.services.filter(
            (service) => service.label !== value.label
          ),
        });
        return;
      }
      setCharacteristics({
        ...characteristics,
        services: [...characteristics.services, value],
      });
    } else {
      options.push(value);
      setCharacteristics({
        ...characteristics,
        services: [...characteristics.services, value],
      });
    }
  };

  const handleCloseMenu = () => {
    setShowMenu(false);
    setSearch("");
  };

  options = options.sort((a, b) => {
    if (a.label > b.label) {
      return 1;
    }
    if (a.label < b.label) {
      return -1;
    }
    return 0;
  });

  return (
    <div className="flex flex-col gap-4 min-h-[40vh]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="flex flex-col w-full justify-between">
          <label className="font-bold" htmlFor="type">
            Habitantes permitidos
          </label>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
            type="number"
            name="maxPeople"
            id="maxPeople"
            value={characteristics.maxPeople}
            onChange={(e) =>
              setCharacteristics({
                ...characteristics,
                maxPeople: e.target.value,
              })
            }
          />
        </div>
        <div className="flex flex-col w-full justify-between">
          <label className="font-bold" htmlFor="rooms">
            Numero de habitaciones
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
            name="rooms"
            id="rooms"
            value={characteristics.rooms}
            onChange={(e) =>
              setCharacteristics({ ...characteristics, rooms: e.target.value })
            }
          >
            <option disabled value="">
              Selecciona número de habitaciones
            </option>
            <option value="1">1</option>
            <option value="1 &#189;">1 &#189;</option>
            <option value="2">2</option>
            <option value="2 &#189;">2 &#189;</option>
            <option value="3">3</option>
            <option value="3 &#189;">3 &#189;</option>
            <option value="4">4</option>
            <option value="4 &#189;">4 &#189;</option>
            <option value="5">5</option>
            <option value="5 &#189;">5 &#189;</option>
            <option value="6">6</option>
            <option value="6 &#189;">6 &#189;</option>
            <option value="7">7</option>
            <option value="7 &#189;">7 &#189;</option>
            <option value="8">8</option>
            <option value="8 &#189;">8 &#189;</option>
            <option value="9">9</option>
            <option value="9 &#189;">9 &#189;</option>
            <option value="10">10</option>
            <option value="10 &#189;">10 &#189;</option>
            <option value="11">11</option>
            <option value="11 &#189;">11 &#189;</option>
            <option value="12">12</option>
            <option value="12 &#189;">12 &#189;</option>
          </select>
        </div>
        <div className="flex flex-col w-full justify-between">
          <label className="font-bold" htmlFor="bathrooms">
            Numero de baños
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
            name="bathrooms"
            id="bathrooms"
            value={characteristics.bathrooms}
            onChange={(e) =>
              setCharacteristics({
                ...characteristics,
                bathrooms: e.target.value,
              })
            }
          >
            <option disabled value="">
              Selecciona número de habitaciones
            </option>
            <option value="1">1</option>
            <option value="1 &#189;">1 &#189;</option>
            <option value="2">2</option>
            <option value="2 &#189;">2 &#189;</option>
            <option value="3">3</option>
            <option value="3 &#189;">3 &#189;</option>
            <option value="4">4</option>
            <option value="4 &#189;">4 &#189;</option>
            <option value="5">5</option>
            <option value="5 &#189;">5 &#189;</option>
            <option value="6">6</option>
            <option value="6 &#189;">6 &#189;</option>
            <option value="7">7</option>
            <option value="7 &#189;">7 &#189;</option>
            <option value="8">8</option>
            <option value="8 &#189;">8 &#189;</option>
            <option value="9">9</option>
            <option value="9 &#189;">9 &#189;</option>
            <option value="10">10</option>
            <option value="10 &#189;">10 &#189;</option>
            <option value="11">11</option>
            <option value="11 &#189;">11 &#189;</option>
            <option value="12">12</option>
            <option value="12 &#189;">12 &#189;</option>
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
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1 w-full md:w-&#189; capitalize"
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
                <div className="w-full flex flex-col gap-2 absolute md:-top-20 bg-white h-72 overflow-auto p-4 shadow-lg z-40">
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
                          className={`w-full font-normal border border-gray-200 rounded-lg p-2 flex justify-between items-center hover:scale-105 transition ease-in-out duration-200 cursor-pointer 
                          ${
                            characteristics.services.find(
                              (item) => item.label === option.label
                            )
                              ? "bg-gradient-to-r from-white to-primary-100"
                              : "bg-white"
                          }`}
                        >
                          <p className="text-sm whitespace-nowrap">
                            {option.label}
                          </p>
                          <div>
                            {characteristics.services.find(
                              (item) => item.label === option.label
                            ) ? (
                              <BsCheck className="text-lg font-light bg-green-400 rounded-full text-white" />
                            ) : (
                              <span>
                                <BsPlus className="text-lg font-light bg-primary-400 rounded-full text-white" />
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
                          className={`w-full font-normal border border-gray-200 rounded-lg p-2 flex justify-between items-center hover:scale-105 transition ease-in-out duration-200 cursor-pointer  ${
                            characteristics.services.find(
                              (item) => item.label === search
                            )
                              ? " bg-gradient-to-r from-white to-primary-100"
                              : "bg-white"
                          }`}
                        >
                          <p className="text-sm whitespace-nowrap">{search}</p>
                          <div className="w-6 h-6">
                            {characteristics.services.find(
                              (item) => item.label === search
                            ) ? (
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
            {characteristics.services.map((service, i) => (
              <p
                key={i}
                onClick={() => handleSelectOption(service)}
                className="font-normal border border-gray-200 rounded-lg p-2 flex justify-between items-center hover:scale-105 transition ease-in-out duration-200 cursor-pointer bg-gradient-to-r from-white to-primary-100"
              >
                {service.label}
                <span className="text-md font-light bg-green-400 rounded-full text-white">
                  <BsCheck />
                </span>
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default House;
