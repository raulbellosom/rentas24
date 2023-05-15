import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ShowAnounceDetails = ({
  article = {
    available,
    id: "",
    announcement: {
      price: 0,
      currency: "MXN",
      is_recurrent: false,
      recurrency_id: 1,
      isAdvance: false,
      advanceAmount: 0,
      start_date: "",
      end_date: "",
    },
  },
}) => {
  const { recurrencies } = useSelector((state) => state.recurrencies);
  const getRecurrency = (id) => {
    const recurrency = recurrencies.find((recurrency) => recurrency.id == id);
    return recurrency ? recurrency.name : "";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <p className="font-bold">
        Fecha de inicio: <br />
        <span className="font-normal">{article.announcement.start_date}</span>
      </p>
      <p className="font-bold">
        Fecha de fin: <br />
        <span className="font-normal">{article.announcement.end_date}</span>
      </p>
      <p className="font-bold">
        Precio: <br />
        <span className="font-normal">
          $
          {parseFloat(article.announcement.price).toFixed(2) ===
          article.announcement.price
            ? article.announcement.price.replace(/\d(?=(\d{3})+\.)/g, "$&,")
            : parseFloat(article.announcement.price)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
          {article.announcement.currency}
        </span>
      </p>
      <p className="font-bold">
        Disponibilidad: <br />
        <span className="font-normal">{article.available ? "Sí" : "No"}</span>
      </p>

      <p className="font-bold">
        ¿El pago es recurrente?: <br />
        <span className="font-normal">
          {article.announcement.is_recurrent ? "Si" : "No"}
        </span>
      </p>
      <p className="font-bold">
        Tipo de recurrencia: <br />
        <span className="font-normal">
          {getRecurrency(article.announcement.recurrency_id)}
        </span>
      </p>
      <p className="font-bold">
        ¿Requiere anticipo? <br />
        <span className="font-normal">
          {article.announcement.isAdvance ? "Si" : "No"}
        </span>
      </p>
      <p className="font-bold">
        Monto del anticipo: <br />
        <span className="font-normal">
          $
          {parseFloat(article.announcement.advanceAmount).toFixed(2) ===
          article.announcement.advanceAmount
            ? article.announcement.advanceAmount.replace(
                /\d(?=(\d{3})+\.)/g,
                "$&,"
              )
            : parseFloat(article.announcement.advanceAmount)
                .toFixed(2)
                .replace(/\d(?=(\d{3})+\.)/g, "$&,")}{" "}
          {article.announcement.currency}
        </span>
      </p>
    </div>
  );
};

export default ShowAnounceDetails;
