import React, { useState, useEffect } from "react";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { v4 as uuidv4 } from "uuid";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const SelectCountryInput = ({ selectedCountry = {}, getPhoneCode }) => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [filterCountry, setFilterCountry] = useState("");

  useEffect(() => {
    if (filterCountry.length > 0) {
      const filteredCountries = countries.filter((country) =>
        country.name.toLowerCase().includes(filterCountry.toLowerCase())
      );
      setCountries(filteredCountries);
    } else {
      setIsLoading(true);
      axios
        .get("https://restcountries.com/v2/all")
        .then((res) => {
          setIsLoading(false);
          res.data = res.data.map((country) => {
            return {
              name: country.name,
              flag: country.flags["png"],
              phone_code: country.callingCodes[0],
              id: uuidv4(),
            };
          });
          res.data.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            return 0;
          });
          setCountries(res.data);
        })
        .catch((err) => {
          setIsLoading(false);
          console.log(err);
        });
    }
  }, [filterCountry]);

  const handleValueChange = (country) => {
    getPhoneCode(country);
    setShowMenu(false);
  };

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="flex relative cursor-pointer">
          <div
            onClick={() => setShowMenu(!showMenu)}
            className={`bg-white appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:text-primary-500 focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm ${
              Object.keys(selectedCountry).length > 0
                ? "invalid:border-red-500 invalid:border-2"
                : "invalid:border-gray-300"
            }`}
          >
            {Object.keys(selectedCountry).length > 0 ? (
              <div className="flex items-center gap-4 px-2">
                <img
                  className="h-4"
                  src={selectedCountry.flag}
                  alt={selectedCountry.name}
                />
                + {selectedCountry.phone_code}
              </div>
            ) : (
              <p className="text-gray-500 flex justify-between items-center">
                Seleccionar <ChevronDownIcon className="h-5 w-5" />
              </p>
            )}
          </div>
          {showMenu && (
            <div className="absolute z-10 top-11 left-0 w-[90vw] max-w-[450px] h-[30vh]">
              <div className="w-full h-full overflow-y-auto">
                <div className="bg-white">
                  <input
                    className="w-full px-5 py-2"
                    type="text"
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                  />
                  {countries.map((country) => (
                    <div
                      key={country.id}
                      className={`${
                        country.phone_code === selectedCountry.phone_code
                          ? "bg-primary-300"
                          : "bg-white"
                      } w-full flex items-center justify-between gap-2 py-2 px-5 cursor-pointer border-b border-gray-200`}
                      onClick={() => handleValueChange(country)}
                    >
                      <div className="flex items-center gap-4 w-full">
                        <img
                          className="w-6 h-6"
                          src={country.flag}
                          alt={country.name}
                        />
                        {country.name}
                      </div>
                      <p className="whitespace-nowrap">
                        + {country.phone_code}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectCountryInput;
