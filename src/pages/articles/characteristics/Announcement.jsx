import React, { useEffect } from "react";

const Announcement = ({
  available = true,
  setAvailable,
  announcement = {
    price: 0,
    currency: "MXN",
    is_recurrent: false,
    recurrency_id: "",
    isAdvance: false,
    advanceAmount: 0,
    start_date: "",
    end_date: "",
  },
  setAnnouncement,
  recurrencies = [],
}) => {
  useEffect(() => {
    if (!announcement.is_recurrent) {
      setAnnouncement({ ...announcement, recurrency_id: "" });
    }
    if (!announcement.isAdvance) {
      setAnnouncement({ ...announcement, advanceAmount: "" });
    }
  }, [announcement.is_recurrent, announcement.isAdvance]);

  console.log("test");
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 justify-center items-center">
      <div className="flex flex-col w-full justify-between col-span-2">
        <label className="font-bold" htmlFor="is_available">
          ¿Esta disponible actualmente?
        </label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
          name="is_available"
          id="is_available"
          value={available}
          onChange={(e) => setAvailable(e.target.value)}
        >
          <option value={true}>Si</option>
          <option value={false}>No</option>
        </select>
      </div>
      <div className="flex flex-col w-full justify-between col-span-2 md:col-span-1">
        <label className="font-bold" htmlFor="start_date">
          ¿Cuándo se comenzará a mostrar?
        </label>
        <input
          className={`border ${announcement.start_date !== "" ? 'border-gray-300' : 'border-red-600'} rounded-lg px-3 py-2 mt-1`}
          type="date"
          name="start_date"
          id="start_date"
          value={announcement.start_date}
          onChange={(e) =>
            setAnnouncement({
              ...announcement,
              [e.target.name]: e.target.value,
            })
          }
        />
      </div>
      <div className="flex flex-col w-full justify-between col-span-2 md:col-span-1">
        <label className="font-bold" htmlFor="end_date">
          ¿Cuándo se dejará de mostrar?
        </label>
        <input
          className={`border ${announcement.end_date !== "" ? 'border-gray-300' : 'border-red-600'} rounded-lg px-3 py-2 mt-1`}
          type="date"
          name="end_date"
          id="end_date"
          value={announcement.end_date}
          onChange={(e) =>
            setAnnouncement({
              ...announcement,
              [e.target.name]: e.target.value,
            })
          }
        />
      </div>
      <div className="flex flex-col w-full justify-between col-span-2 md:col-span-1">
        <label className="font-bold" htmlFor="price">
          Precio
        </label>
        <input
          className={`border ${announcement.price !== 0 ? 'border-gray-300' : 'border-red-600'} rounded-lg px-3 py-2 mt-1`}
          type="number"
          name="price"
          id="price"
          value={announcement.price}
          onChange={(e) =>
            setAnnouncement({
              ...announcement,
              [e.target.name]: e.target.value,
            })
          }
        />
      </div>
      <div className="flex flex-col w-full justify-between col-span-2 md:col-span-1">
        <label className="font-bold" htmlFor="currency">
          Moneda
        </label>
        <select
          className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
          name="currency"
          id="currency"
          value={announcement.currency}
          onChange={(e) =>
            setAnnouncement({
              ...announcement,
              [e.target.name]: e.target.value,
            })
          }
        >
          <option value="MXN">MXN</option>
          <option value="USD">USD</option>
        </select>
      </div>
      <div className="flex flex-row w-full justify-start gap-4 items-center col-span-2 md:col-span-1">
        <label className="font-bold" htmlFor="is_recurrent">
          ¿El pago es recurrente?
        </label>
        <input
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          type="checkbox"
          name="is_recurrent"
          checked={announcement.is_recurrent}
          onChange={(e) =>
            setAnnouncement({
              ...announcement,
              [e.target.name]: e.target.checked,
            })
          }
        />
      </div>
      {announcement.is_recurrent && (
        <div className="flex flex-col w-full justify-between">
          <label className="font-bold" htmlFor="recurrency_id">
            Recurrencia
          </label>
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
            name="recurrency_id"
            id="recurrency_id"
            value={announcement.recurrency_id}
            onChange={(e) =>
              setAnnouncement({
                ...announcement,
                [e.target.name]: e.target.value,
              })
            }
          >
            {recurrencies.map((recurrency) => (
              <option key={recurrency.id} value={recurrency.id}>
                {recurrency.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="flex flex-row w-full justify-start gap-4 items-center col-span-2 md:col-span-1">
        <label className="font-bold" htmlFor="isAdvance">
          ¿Requiere de un anticipo?
        </label>
        <input
          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          type="checkbox"
          name="isAdvance"
          checked={announcement.isAdvance}
          onChange={(e) =>
            setAnnouncement({
              ...announcement,
              [e.target.name]: e.target.checked,
            })
          }
        />
      </div>
      {announcement.isAdvance && (
        <div className="flex flex-col w-full justify-between">
          <label className="font-bold" htmlFor="advanceAmount">
            Monto de anticipo
          </label>
          <input
            className="border border-gray-300 rounded-lg px-3 py-2 mt-1"
            type="number"
            name="advanceAmount"
            id="advanceAmount"
            value={announcement.advanceAmount}
            onChange={(e) =>
              setAnnouncement({
                ...announcement,
                [e.target.name]: e.target.value,
              })
            }
          />
        </div>
      )}
    </div>
  );
};

export default Announcement;
