import React from "react";
import { BsEye, BsPencilSquare, BsTrash } from "react-icons/bs";

const ArticleCards = ({
  article = {
    id,
    name,
    description,
    image,
    category,
    status,
    updatedAt,
  },
  onEdit,
  onDelete,
  onShow,
}) => {
  return (
    <div className="flex flex-col justify-between items-left hover:bg-slate-50 p-5 rounded-lg border border-gray-200 hover:scale-105 transition ease-in-out duration-200 hover:shadow-lg ">
      <div className="flex flex-col gap-2">
        <img
          src={article.image}
          alt={article.name}
          className="w-full h-40 object-cover rounded-lg"
        />
        <div>
          <h2 className="text-xl text-center font-bold text-blue-500">
            {article.name.length > 40
              ? article.name?.substring(0, 20) + "..."
              : article.name}
          </h2>
          <p className="text-sm text-gray-500 text-center">
            {article.category} - {article.status}
          </p>
        </div>
        <p className="text-sm text-gray-500">{article.description}</p>
        <p className="text-xs text-right text-gray-500">
          Actualizado el: {article.updatedAt}
        </p>
      </div>
      <div className="flex justify-center pt-4 gap-4">
        <button
          onClick={() => onShow(article.id)}
          className="flex items-center gap-2 text-gray-500 hover:text-white hover:bg-blue-500 p-2 rounded-lg hover:scale-110 transition ease-in-out duration-200"
        >
          <span>
            <BsEye className="w-6 h-6" />
          </span>
        </button>
        <button
          onClick={() => onEdit(article.id)}
          className="flex items-center gap-2 text-gray-500 hover:text-white hover:bg-green-500 p-2 rounded-lg hover:scale-110 transition ease-in-out duration-200"
        >
          <span>
            <BsPencilSquare className="w-6 h-6" />
          </span>
        </button>
        <button
          onClick={() => onDelete(article.id)}
          className="flex items-center gap-2 text-gray-500 hover:text-white hover:bg-red-500 p-2 rounded-lg hover:scale-110 transition ease-in-out duration-200"
        >
          <span>
            <BsTrash className="w-6 h-6 " />
          </span>
        </button>
      </div>
    </div>
  );
};

export default ArticleCards;
