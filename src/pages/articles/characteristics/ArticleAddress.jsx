import React from "react";

const ArticleAddress = ({
  address = {
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
  setAddress,
}) => {
  return (
    <div className="flex flex-col">
      <label className="font-bold pt-4" htmlFor="address">
        Dirección
      </label>
      <div className="flex flex-col gap-4">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="flex flex-col justify-between">
            <label className="text-sm text-gray-500" htmlFor="street_1">
              * Calle principal
            </label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1 w-full"
              type="text"
              name="street_1"
              id="street_1"
              placeholder="Calle principal"
              value={address.street_1}
              onChange={(e) =>
                setAddress({ ...address, street_1: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col justify-between">
            <label className="text-sm text-gray-500" htmlFor="street_2">
              Calle secundaria
            </label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1 w-full"
              type="text"
              name="street_2"
              id="street_2"
              placeholder="Calle secundaria"
              value={address.street_2}
              onChange={(e) =>
                setAddress({ ...address, street_2: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col justify-between">
              <label className="text-sm text-gray-500" htmlFor="number_ext">
                * Numero exterior
              </label>
              <input
                className="border border-gray-300 rounded-lg px-3 py-2 mt-1 w-full"
                type="text"
                name="number_ext"
                id="number_ext"
                placeholder="Numero exterior"
                value={address.number_ext}
                onChange={(e) =>
                  setAddress({ ...address, number_ext: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col justify-between">
              <label className="text-sm text-gray-500" htmlFor="number_int">
                Numero interior
              </label>
              <input
                className="border border-gray-300 rounded-lg px-3 py-2 mt-1 w-full"
                type="text"
                name="number_int"
                id="number_int"
                placeholder="Numero interior"
                value={address.number_int}
                onChange={(e) =>
                  setAddress({ ...address, number_int: e.target.value })
                }
              />
            </div>
          </div>
          <div className="flex flex-col justify-between">
            <label className="text-sm text-gray-500" htmlFor="colony">
              * Colonia
            </label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
              type="text"
              name="colony"
              id="colony"
              placeholder="Colonia"
              value={address.colony}
              onChange={(e) =>
                setAddress({ ...address, colony: e.target.value })
              }
            />
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col justify-between">
            <label className="text-sm text-gray-500" htmlFor="city">
              * Ciudad
            </label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
              type="text"
              name="city"
              id="city"
              placeholder="Ciudad"
              value={address.city}
              onChange={(e) => setAddress({ ...address, city: e.target.value })}
            />
          </div>
          <div className="flex flex-col justify-between">
            <label className="text-sm text-gray-500" htmlFor="state">
              * Estado
            </label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
              type="text"
              name="state"
              id="state"
              placeholder="Estado"
              value={address.state}
              onChange={(e) =>
                setAddress({ ...address, state: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col justify-between">
            <label className="text-sm text-gray-500" htmlFor="country">
              * País
            </label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
              type="text"
              name="country"
              id="country"
              placeholder="País"
              value={address.country}
              onChange={(e) =>
                setAddress({ ...address, country: e.target.value })
              }
            />
          </div>
          <div className="flex flex-col justify-between">
            <label className="text-sm text-gray-500" htmlFor="postal_code">
              * CP
            </label>
            <input
              className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
              type="text"
              name="postal_code"
              id="postal_code"
              placeholder="Codigo postal"
              value={address.postal_code}
              onChange={(e) =>
                setAddress({ ...address, postal_code: e.target.value })
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleAddress;
